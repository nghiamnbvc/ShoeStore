using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Wishlist
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public int ProductId { get; set; }

    public DateTime? AddedDate { get; set; }

    public virtual Account? Account { get; set; } = null!;

    public virtual Product? Product { get; set; } = null!;
}
