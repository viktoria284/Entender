namespace EntenderAPI.DTOs
{
    public class VariantsDto
    {
        public Guid ProductId { get; set; }
        public string[] Sizes { get; set; }
        public int[] StockQuantities { get; set; }
    }
}
