using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EntenderAPI.Models
{
    public class ProductVariant
    {
        public Guid ProductVariantId { get; set; }
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
        public string Size { get; set; }
        public int StockQuantity { get; set; }
    }
}
