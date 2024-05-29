namespace EntenderAPI.Models
{
    public class User
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public ICollection<CartItem> CartItems { get; set; }
    }
}
