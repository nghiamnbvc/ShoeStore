using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Size
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
}
