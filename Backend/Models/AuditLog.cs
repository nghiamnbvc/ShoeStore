using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class AuditLog
{
    public int Id { get; set; }

    public int? AccountId { get; set; }

    public string Action { get; set; } = null!;

    public string? TableAffected { get; set; }

    public int? RecordId { get; set; }

    public string? Description { get; set; }

    public DateTime? Timestamp { get; set; }

    public string? Ipaddress { get; set; }

    public virtual Account? Account { get; set; }
}
