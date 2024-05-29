namespace EntenderAPI.DTOs
{
    public class AddToCartDto
    {
        public Guid UserId { get; set; }
        public Guid ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }
}
