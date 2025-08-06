using System.Security.Claims;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Api
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistApiController : ControllerBase
    {
        private readonly ShoeStoreDbContext _context;

        public WishlistApiController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetWishlist()
        {
            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(accountIdClaim) || !int.TryParse(accountIdClaim, out var accountId))
            {
                return Unauthorized(new { message = "Unauthorized access" });
            }

            var wishlist = await _context.Wishlists
                .Where(w => w.AccountId == accountId)
                .Include(w => w.Product)
                .ThenInclude(w => w.ProductImages)
                .Select(w => new
                {
                    w.Product.Id,
                    w.Product.Name,
                    w.Product.Price,
                    w.Product.DiscountPercent,
                    ImageUrl = w.Product.ProductImages
                                   .Where(p => p.IsMain == true)
                                   .Select(p => p.ImageUrl)
                                   .FirstOrDefault()
                }).ToListAsync();

            return Ok(wishlist);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddToWishlist([FromBody] Wishlist favourite)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Lấy AccountId từ JWT claims
            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(accountIdClaim) || !int.TryParse(accountIdClaim, out var accountId))
            {
                return Unauthorized(new { message = "Unauthorized access" });
            }

            // Cập nhật AccountId từ JWT vào đối tượng Wishlist
            favourite.AccountId = accountId;

            // Kiểm tra xem sản phẩm đã có trong wishlist chưa
            var exists = await _context.Wishlists
                .AnyAsync(w => w.AccountId == favourite.AccountId && w.ProductId == favourite.ProductId);

            if (exists)
                return Ok(new { message = "Product already in wishlist" });

            favourite.AddedDate = DateTime.UtcNow;

            _context.Wishlists.Add(favourite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Added to wishlist" });
        }

        [HttpDelete("{productId}")]
        [Authorize]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(accountIdClaim) || !int.TryParse(accountIdClaim, out var accountId))
            {
                return Unauthorized(new { message = "Unauthorized access" });
            }

            var item = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.AccountId == accountId && w.ProductId == productId);

            if (item == null)
                return NotFound(new { message = "Item not found in wishlist" });

            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Removed from wishlist" });
        }
    }
}
