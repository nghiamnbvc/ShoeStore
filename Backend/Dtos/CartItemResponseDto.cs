
namespace Backend.Dtos
{
    public class CartItemResponseDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        public ProductVariantDto ProductVariant { get; set; }
    }

}
