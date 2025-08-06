namespace Backend.Dtos
{
    public class CheckoutDto
    {
        public string CustomerName { get; set; } = null!;
        public string CustomerPhone { get; set; } = null!;
        public string ShippingAddress { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public decimal? DiscountAmount { get; set; }
        public int? DiscountId { get; set; }
        public string PaymentMethod { get; set; } = null!;

        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }
}