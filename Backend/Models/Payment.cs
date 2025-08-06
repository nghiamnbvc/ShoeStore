using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Payment
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public decimal Amount { get; set; }

    public string? Status { get; set; }

    public DateTime? PaymentDate { get; set; }

    public virtual Order Order { get; set; } = null!;
}
