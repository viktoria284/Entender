namespace EntenderAPI.DTOs
{
    public class ProductVariantDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public decimal Price { get; set; }
        public byte[] MainImage { get; set; }
        public List<byte[]> Images { get; set; }
        public List<ProductVariantInfo> Variants { get; set; }
    }

    public class ProductVariantInfo
    {
        public Guid ProductVariantId { get; set; }
        public string Size { get; set; }
        public int StockQuantity { get; set; }
    }
}
