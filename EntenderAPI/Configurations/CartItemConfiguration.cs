using EntenderAPI.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EntenderAPI.Configurations
{
    public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> builder)
        {
            builder.HasKey(ci => ci.CartItemId);

            builder.HasOne(ci => ci.User)
                   .WithMany(u => u.CartItems)
                   .HasForeignKey(ci => ci.UserId);

            builder.HasOne(ci => ci.ProductVariant)
                   .WithMany()
                   .HasForeignKey(ci => ci.ProductVariantId);
        }
    }
}
