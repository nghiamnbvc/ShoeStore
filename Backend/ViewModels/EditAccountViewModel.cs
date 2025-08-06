using System.ComponentModel.DataAnnotations;

namespace Backend.ViewModels
{
    public class EditAccountViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "User name is required")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = null!;

        public string? FullName { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public int RoleId { get; set; }

        public bool IsActive { get; set; }
    }
}
