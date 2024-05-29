using EntenderAPI.DTOs;
using EntenderAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntenderAPI.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/cart/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCartItems(Guid userId)
        {
            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userId)
                .Include(c => c.ProductVariant)
                    .ThenInclude(pv => pv.Product)
                .Select(c => new CartItemDto
                {
                    CartItemId = c.CartItemId,
                    ProductVariantId = c.ProductVariantId,
                    ProductId = c.ProductVariant.Product.ProductId,
                    ProductName = c.ProductVariant.Product.ProductName,
                    Image = c.ProductVariant.Product.Image,
                    Size = c.ProductVariant.Size,
                    Quantity = c.Quantity,
                    Price = c.ProductVariant.Product.Price
                })
                .ToListAsync();

            if (cartItems == null || !cartItems.Any())
            {
                return NotFound(new { message = "The user's cart is empty or the user was not found." });
            }

            return Ok(cartItems);
        }

        [HttpGet("checkItem")]
        public async Task<ActionResult<bool>> CheckCartItem(Guid userId, Guid productVariantId)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductVariantId == productVariantId);

            return Ok(cartItem != null);
        }

        // GET: api/cart/productVariant/{productVariantId}
        [HttpGet("productVariant/{productVariantId}")]
        public async Task<IActionResult> GetProductVariant(Guid productVariantId)
        {
            var productVariant = await _context.ProductVariants.FindAsync(productVariantId);
            if (productVariant == null)
            {
                return NotFound("Product variant not found");
            }

            return Ok(new { stockQuantity = productVariant.StockQuantity });
        }


        [HttpPut("updateCartItem")]
        public async Task<ActionResult> UpdateCartItemInProductPage(AddToCartDto addToCartDto)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == addToCartDto.UserId && c.ProductVariantId == addToCartDto.ProductVariantId);

            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            cartItem.Quantity += addToCartDto.Quantity;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/cart/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{cartItemId}")]
        public async Task<IActionResult> UpdateCartItemInCart(AddToCartDto addToCartDto)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == addToCartDto.UserId && c.ProductVariantId == addToCartDto.ProductVariantId);

            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            cartItem.Quantity = addToCartDto.Quantity;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // POST: api/cart/toCart
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("toCart")]
        public async Task<ActionResult<CartItem>> PostCartItem(AddToCartDto addToCartDto)
        {
            if (addToCartDto == null || addToCartDto.Quantity <= 0 || addToCartDto.UserId == Guid.Empty)
            {
                return BadRequest(new { message = "Invalid cart item data." });
            }

            var productVariant = await _context.ProductVariants.FindAsync(addToCartDto.ProductVariantId);
            if (productVariant == null)
            {
                return NotFound(new { message = "Product variant not found." });
            }

            if (productVariant.StockQuantity < addToCartDto.Quantity)
            {
                return BadRequest(new { message = "Not enough stock available." });
            }

            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == addToCartDto.UserId && c.ProductVariantId == addToCartDto.ProductVariantId);

            CartItem cartItem;

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += addToCartDto.Quantity;
                cartItem = existingCartItem;
            }
            else
            {
                cartItem = new CartItem
                {
                    CartItemId = Guid.NewGuid(),
                    UserId = addToCartDto.UserId,
                    ProductVariantId = addToCartDto.ProductVariantId,
                    Quantity = addToCartDto.Quantity
                };

                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            return Ok(cartItem);
        }


        // DELETE: api/cart/5
        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> DeleteCartItem(Guid cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            var productVariant = await _context.ProductVariants.FindAsync(cartItem.ProductVariantId);
            if (productVariant == null)
            {
                return NotFound(new { message = "Product variant not found." });
            }

            //productVariant.StockQuantity += cartItem.Quantity;

            _context.CartItems.Remove(cartItem);

            //_context.ProductVariants.Update(productVariant);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart item successfully deleted." });
        }


    }
}
