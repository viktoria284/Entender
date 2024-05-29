
namespace EntenderAPI.Models
{
    public class CartItem
    {
        public Guid CartItemId { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid ProductVariantId { get; set; }
        public ProductVariant ProductVariant { get; set; }
        public int Quantity { get; set; }
    }
}
