using EntenderAPI.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EntenderAPI.Configurations
{
    public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
    {
        public void Configure(EntityTypeBuilder<ProductVariant> builder)
        {
            builder.HasKey(pv => pv.ProductVariantId);
            builder.Property(pv => pv.Size).HasMaxLength(10);
            builder.Property(pv => pv.StockQuantity).IsRequired();
        }
    }
}
