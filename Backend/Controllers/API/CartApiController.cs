using System.Security.Claims;
using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Api
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class CartApiController : ControllerBase
    {
        private readonly ShoeStoreDbContext _context;
        public CartApiController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                var allClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                return Unauthorized(new { message = "UserId không hợp lệ", claims = allClaims });
            }

            if (!int.TryParse(userId, out var accountId))
            {
                return BadRequest("User ID không đúng định dạng số nguyên.");
            }

            var cartItems = await _context.CartItems
     .Where(ci => ci.AccountId == accountId)
     .Include(ci => ci.ProductVariant)
         .ThenInclude(pv => pv.Product)
     .Include(ci => ci.ProductVariant.Color)
     .Include(ci => ci.ProductVariant.Size)
     .Include(ci => ci.ProductVariant.ProductImages)
     .Select(ci => new CartItemResponseDto
     {
         Id = ci.Id,
         Quantity = ci.Quantity,
         ProductVariant = new ProductVariantDto
         {
             Id = ci.ProductVariant.Id,
             ProductId = ci.ProductVariant.ProductId,
             Price = ci.ProductVariant.Product.Price,
             Gender = ci.ProductVariant.Product.Gender,
             Category = ci.ProductVariant.Product.Category.Name,
             ProductName = ci.ProductVariant.Product.Name,
             ColorName = ci.ProductVariant.Color.Name,
             SizeName = ci.ProductVariant.Size.Name,
             DiscountPercent = ci.ProductVariant.Product.DiscountPercent,
             ImageUrl = ci.ProductVariant.Product.ProductImages
                    .Where(img => img.IsMain == true)
                    .Select(img => img.ImageUrl)
                    .FirstOrDefault()

         }
     })
     .ToListAsync();


            return Ok(cartItems);
        }



        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDto model)
        {
            // ✅ Lấy accountId từ token (JWT)
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            // Nếu accountId trong DB là dạng int
            if (!int.TryParse(userId, out var accountId))
            {
                return BadRequest("Invalid user ID");
            }

            // Giả sử bạn có hàm kiểm tra sản phẩm và thêm vào giỏ
            var existingCart = await _context.CartItems
                .FirstOrDefaultAsync(c => c.AccountId == accountId && c.ProductVariantId == model.ProductVariantId);

            if (existingCart != null)
            {
                existingCart.Quantity += model.Quantity;
            }
            else
            {
                var newItem = new CartItem
                {
                    AccountId = accountId,
                    ProductVariantId = model.ProductVariantId,
                    Quantity = model.Quantity
                };
                _context.CartItems.Add(newItem);
            }

            await _context.SaveChangesAsync();

            return Ok("Đã thêm vào giỏ hàng");
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            // Lấy userId từ token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out var accountId))
            {
                return Unauthorized("Không thể xác định người dùng.");
            }

            // Tìm cart item và đảm bảo item đó thuộc về user hiện tại
            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.Id == id && c.AccountId == accountId);

            if (item == null)
            {
                return NotFound("Không tìm thấy mục trong giỏ hàng hoặc bạn không có quyền xóa.");
            }

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok("Xóa sản phẩm khỏi giỏ hàng thành công.");
        }

    }
}