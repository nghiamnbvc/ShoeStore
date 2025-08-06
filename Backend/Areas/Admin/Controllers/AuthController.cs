using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Dtos;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

namespace Backend.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class AuthController : Controller
    {
        private readonly ShoeStoreDbContext _context;

        public AuthController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(AdminLoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return View(dto);
            }

            var admin = _context.Accounts
                .Include(a => a.Role)
                .FirstOrDefault(a => a.UserName == dto.Username && a.Role.Name == "Admin");

            if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.Password))
            {
                ViewBag.Error = "Tài khoản hoặc mật khẩu không đúng";
                return View(dto);
            }


            // Tạo Claims
            var claims = new List<Claim>
             {
                new Claim(ClaimTypes.Name, admin.UserName),
                new Claim(ClaimTypes.Role, "Admin") // Phân quyền theo role
             };

            var identity = new ClaimsIdentity(claims, "MyCookieAuth");
            var principal = new ClaimsPrincipal(identity);

            // Đăng nhập bằng cookie
            await HttpContext.SignInAsync("MyCookieAuth", principal);

            return RedirectToAction("Index", "Product", new { area = "Admin" });
        }


        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("MyCookieAuth");
            return RedirectToAction("Login");
        }
    }
}
