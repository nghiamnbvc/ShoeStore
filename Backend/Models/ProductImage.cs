using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public partial class ProductImage
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public bool? IsMain { get; set; }

    public int? ProductVariantId { get; set; }

    public virtual Product? Product { get; set; } = null!;

    [NotMapped]
    [FileExtension]
    public IFormFile? ImageFile { get; set; }
}
