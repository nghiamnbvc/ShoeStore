namespace Backend.ViewModels
{
    public class OrderItemViewModel
    {
        public string ProductName { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}