using EntenderAPI.DTOs;
using EntenderAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntenderAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<Product>> SearchProducts(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Query parameter is required.");
            }

            var products = _context.Products
                .Where(p => EF.Functions.Like(p.ProductName.ToLower(), "%" + query.ToLower() + "%"))
                .ToList();

            return Ok(products);
        }

        // GET: api/products/5
        [HttpGet("{productId}")]
        public async Task<ActionResult<ProductVariantDto>> GetProduct(Guid productId)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.ProductVariants)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
                return NotFound();

            var variantDto = new ProductVariantDto
            {
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                //Category = product.Category,
                Description = product.Description,
                Color = product.Color,
                Price = product.Price,
                MainImage = product.Image,
                Images = product.Images.Select(i => i.Data).ToList(),
                Variants = product.ProductVariants.Select(v => new ProductVariantInfo
                {
                    ProductVariantId = v.ProductVariantId,
                    Size = v.Size,
                    StockQuantity = v.StockQuantity
                }).ToList()
            };

            return Ok(variantDto);
        }

        // GET: api/products/forCard
        [HttpGet("forCard")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsWithImage()
        {
            var productsWithImage = await _context.Products
                .Select(product => new ProductDto
                {
                    ProductId = product.ProductId,
                    ProductName = product.ProductName,
                    Category = product.Category,
                    Description = product.Description,
                    Color = product.Color,
                    Price = product.Price,
                    Image = product.Image
                })
               .OrderBy(p => p.ProductName == "Phys Ed Graphic T-Shirt" ? 1 :
                   p.ProductName == "Phys Ed Hoodie" ? 2 :
                   p.ProductName == "Training Oversized Fleece Sweatshirt" ? 3 :
                   p.ProductName == "Balance V3 Seamless Zip Jacket" ? 4 :
                   p.ProductName == "Balance V3 Seamless Crop Top" ? 5 :
                   p.ProductName == "Balance V3 Seamless Shorts" ? 6 :
                   p.ProductName == "Balance V3 Seamless Leggings" ? 7 :
                   p.ProductName == "GFX Crew Socks 7PK" ? 8 :
                   9)
                .ToListAsync();

            return Ok(productsWithImage);
        }



        [HttpPost("uploadImage")]
        public async Task<IActionResult> UploadImage(Guid productId, bool isMain, IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("No image provided");
            }

            byte[] imageData;
            using (var memoryStream = new MemoryStream())
            {
                await imageFile.CopyToAsync(memoryStream);
                imageData = memoryStream.ToArray();
            }

            if (isMain)
            {
                var product = await _context.Products.FindAsync(productId);
                if (product != null)
                {
                    product.Image = imageData;
                    _context.Products.Update(product);
                    await _context.SaveChangesAsync();
                    return Ok("Image uploaded successfully to Products");
                }
                else
                {
                    return NotFound("Product not found");
                }
            }
            else
            {
                var image = new Image
                {
                    ImageId = Guid.NewGuid(),
                    ProductId = productId,
                    Data = imageData
                };
                _context.Images.Add(image);
                await _context.SaveChangesAsync();
                return Ok("Image uploaded successfully to Images");
            }
        }

        [HttpPost("addVariant")]
        public async Task<IActionResult> AddProductVariants([FromBody] VariantsDto productVariantsDto)
        {
            //var sizes = new[] { "XXS", "XS", "S", "M", "L", "XL", "XXL" };
            //var stockQuantities = new[] { 10, 20, 30, 40, 30, 20, 10 };

            if (productVariantsDto.Sizes == null || productVariantsDto.StockQuantities == null)
            {
                return BadRequest("Sizes and stock quantities cannot be null");
            }

            if (productVariantsDto.Sizes.Length != productVariantsDto.StockQuantities.Length)
            {
                return BadRequest("Sizes and stock quantities arrays must have the same length");
            }

            var product = await _context.Products.FindAsync(productVariantsDto.ProductId);
            if (product == null)
            {
                return NotFound($"Product with ID {productVariantsDto.ProductId} not found");
            }

            for (int i = 0; i < productVariantsDto.Sizes.Length; i++)
            {
                var productVariant = new ProductVariant
                {
                    ProductVariantId = Guid.NewGuid(),
                    ProductId = productVariantsDto.ProductId,
                    Size = productVariantsDto.Sizes[i],
                    StockQuantity = productVariantsDto.StockQuantities[i],
                };

                _context.ProductVariants.Add(productVariant);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromForm] ProductWithImageDto productDto)
        {
            var product = new Product
            {
                ProductId = Guid.NewGuid(),
                ProductName = productDto.ProductName,
                Category = productDto.Category,
                Description = productDto.Description,
                Color = productDto.Color,
                Price = productDto.Price,
                Image = null
            };

            if (productDto.ImageFile != null && productDto.ImageFile.Length > 0)
            {
                byte[] imageData;
                using (var memoryStream = new MemoryStream())
                {
                    await productDto.ImageFile.CopyToAsync(memoryStream);
                    imageData = memoryStream.ToArray();
                }
                product.Image = imageData;
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.ProductId }, product);
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(Guid id, Product product)
        {
            if (id != product.ProductId)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }


        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(Guid id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }

    }
}
