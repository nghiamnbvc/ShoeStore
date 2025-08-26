using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class EditProductVariantViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Please select a product.")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Please select a color.")]
        public int ColorId { get; set; }

        [Required(ErrorMessage = "Please select a size.")]
        public int SizeId { get; set; }

        [Required(ErrorMessage = "Quantity is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0.")]
        public int Quantity { get; set; }
    }
}
