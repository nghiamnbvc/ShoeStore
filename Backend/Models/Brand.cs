using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Brand
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Logo { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
