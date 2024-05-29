using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EntenderAPI.Models
{
    public class Image
    {
        public Guid ImageId { get; set; }
        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public byte[] Data { get; set; }
    }
}
