using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class ShippingStatusLog
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public string? Note { get; set; }

    public virtual Order Order { get; set; } = null!;
}
