using EntenderAPI.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EntenderAPI.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(p => p.ProductId);
            builder.Property(p => p.ProductName).IsRequired().HasMaxLength(100);
            builder.Property(p => p.Category).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Description).HasMaxLength(500);
            builder.Property(p => p.Color).HasMaxLength(30);
            builder.Property(p => p.Price).IsRequired().HasColumnType("decimal(18,2)");

            builder.HasMany(p => p.ProductVariants)
                   .WithOne(pv => pv.Product)
                   .HasForeignKey(pv => pv.ProductId);

            builder.HasMany(p => p.Images)
                   .WithOne(i => i.Product)
                   .HasForeignKey(i => i.ProductId);
        }
    }
}
