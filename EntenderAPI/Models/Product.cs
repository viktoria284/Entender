using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations;

namespace EntenderAPI.Models
{
    public class Product
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public decimal Price { get; set; }
        public byte[]? Image { get; set; }
        public ICollection<ProductVariant> ProductVariants { get; set; }
        public ICollection<Image> Images { get; set; }
    }
}
