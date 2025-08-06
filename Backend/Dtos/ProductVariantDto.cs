namespace Backend.Dtos
{
    public class ProductVariantDto
    {
        public int Id { get; set; }
        public decimal? Price { get; set; }
        public int ProductId { get; set; }
        public string? Gender { get; set; }
        public string ProductName { get; set; }

        public string Category { get; set; }
        public string? ColorName { get; set; }
        public string? SizeName { get; set; }
        public double? DiscountPercent { get; set; }

        public string ImageUrl { get; set; } = null!;
    }
}
