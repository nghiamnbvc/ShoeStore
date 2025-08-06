namespace Backend.Dtos
{
    public class OrderItemDto
    {
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string ProductName { get; set; } = null!;
        public string ColorName { get; set; } = null!;

        public string SizeName { get; set; } = null!;

    }
}