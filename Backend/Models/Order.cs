using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Order
{
    public int Id { get; set; }

    public string OrderCode { get; set; } = null!;

    public int AccountId { get; set; }

    public string CustomerName { get; set; } = null!;

    public string CustomerPhone { get; set; } = null!;

    public string ShippingAddress { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public decimal? DiscountAmount { get; set; }

    public int? DiscountId { get; set; }

    public string? Status { get; set; }

    public DateTime? OrderDate { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Discount? Discount { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<ShippingStatusLog> ShippingStatusLogs { get; set; } = new List<ShippingStatusLog>();
}
