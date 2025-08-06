using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class ProductVariant
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int ColorId { get; set; }

    public int SizeId { get; set; }

    public int Quantity { get; set; }

    public string? Sku { get; set; }

    public decimal? Price { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual Color? Color { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual Product? Product { get; set; } = null!;

    public virtual Size? Size { get; set; } = null!;
}
