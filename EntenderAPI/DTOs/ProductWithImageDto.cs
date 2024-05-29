namespace EntenderAPI.DTOs
{
    public class ProductWithImageDto
    {
        public string ProductName { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public decimal Price { get; set; }
        public IFormFile ImageFile { get; set; }
    }
}
