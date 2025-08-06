using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class CartItem
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public int ProductVariantId { get; set; }

    public int Quantity { get; set; }

    public DateTime? AddedDate { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ProductVariant ProductVariant { get; set; } = null!;
}
