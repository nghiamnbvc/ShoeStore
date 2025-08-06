using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthApiController : ControllerBase
    {
        private readonly ShoeStoreDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthApiController(ShoeStoreDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                // Lấy tất cả lỗi model validation
                var errors = ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(x => x.ErrorMessage).ToArray()
                    );

                return BadRequest(new { message = "Invalid data", errors });
            }

            if (await _context.Accounts.AnyAsync(a => a.Email == registerDto.Email))
            {
                return BadRequest(new
                {
                    message = "Registration failed",
                    errors = new { email = new[] { "Email already exists" } }
                });
            }

            var account = new Account
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                FullName = registerDto.FullName,
                Phone = registerDto.Phone,
                Address = registerDto.Address,
                RoleId = 1,
                IsActive = true,
                CreatedDate = DateTime.Now
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Register successfully!" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return BadRequest(new { message = "Invalid login data", errors });
            }

            var account = await _context.Accounts
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.Email == loginDto.Email);

            if (account == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, account.Password))
            {
                return Unauthorized(new
                {
                    message = "Login failed",
                    errors = new { general = new[] { "Email or password is incorrect" } }
                });
            }

            if (!account.IsActive)
            {
                return BadRequest(new
                {
                    message = "Account inactive",
                    errors = new { general = new[] { "Account has been banned" } }
                });
            }
            var token = _jwtService.GenerateToken(account);

            return Ok(new
            {
                message = "Login successful",
                token,
                data = new
                {
                    account.Id,
                    account.Email,
                    account.UserName,
                    account.FullName,
                    Role = account.Role.Name
                }
            });
        }

    }
}