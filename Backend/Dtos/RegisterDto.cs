using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string UserName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; } = null!;

        public string? FullName { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }
    }
}
