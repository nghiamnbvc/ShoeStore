using System.Security.Claims;
using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Api
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class OrderApiController : ControllerBase
    {
        private readonly ShoeStoreDbContext _context;

        public OrderApiController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userId, out var accountId))
                return Unauthorized();

            var orderCode = "ORD" + DateTime.Now.Ticks;

            var order = new Order
            {
                AccountId = accountId,
                OrderCode = orderCode,
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                ShippingAddress = dto.ShippingAddress,
                TotalAmount = dto.TotalAmount,
                DiscountAmount = dto.DiscountAmount,
                DiscountId = dto.DiscountId,
                Status = "Pending",
                OrderDate = DateTime.Now,
                OrderDetails = dto.Items.Select(item => new OrderDetail
                {
                    ProductVariantId = item.ProductVariantId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Price,
                    TotalPrice = item.Price * item.Quantity,
                    ProductName = item.ProductName,
                    ColorName = item.ColorName,
                    SizeName = item.SizeName
                }).ToList(),
                Payments = new List<Payment>
                {
                    new Payment
                    {
                        PaymentMethod = dto.PaymentMethod,

                    }
                }


            };

            // Lưu đơn hàng
            _context.Orders.Add(order);

            // Xoá giỏ hàng
            var cartItems = _context.CartItems.Where(c => c.AccountId == accountId);
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order placed successfully", orderId = order.Id });
        }
    }
}
