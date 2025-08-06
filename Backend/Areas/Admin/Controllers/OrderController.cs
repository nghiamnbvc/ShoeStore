using Backend.Models;
using Backend.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class OrderController : Controller
    {
        private readonly ShoeStoreDbContext _context;

        public OrderController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        // GET: Admin/Order
        public async Task<IActionResult> Index()
        {
            var orders = await _context.Orders
                .Include(o => o.Account)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return View(orders);
        }

        // GET: Admin/Order/Details/5
        [HttpGet]
        public async Task<IActionResult> Details(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Payments)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.ProductVariant)
                .ThenInclude(pv => pv.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            var viewModel = new OrderDetailViewModel
            {
                OrderId = order.Id,
                CustomerName = order.CustomerName,
                CustomerPhone = order.CustomerPhone,
                ShippingAddress = order.ShippingAddress,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                PaymentMethod = order.Payments.FirstOrDefault()?.PaymentMethod ?? "N/A",

                Status = order.Status,
                Items = order.OrderDetails.Select(item => new OrderItemViewModel
                {
                    ProductName = item.ProductName,
                    Color = item.ColorName,
                    Size = item.SizeName,
                    Quantity = item.Quantity,
                    Price = item.UnitPrice
                }).ToList()
            };

            return View(viewModel); // ✅ Truyền đúng kiểu ViewModel
        }


        // GET: Admin/Order/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            return View(order);
        }

        // POST: Admin/Order/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Order order)
        {
            if (id != order.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(order);
                    await _context.SaveChangesAsync();
                    TempData["success"] = "Cập nhật đơn hàng thành công";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Orders.Any(o => o.Id == id))
                        return NotFound();
                    else
                        throw;
                }

                return RedirectToAction(nameof(Index));
            }

            return View(order);
        }

        // GET: Admin/Order/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Account)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            return View(order);
        }

        // POST: Admin/Order/DeleteConfirmed/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order != null)
            {
                _context.OrderDetails.RemoveRange(order.OrderDetails);
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                TempData["success"] = "Xóa đơn hàng thành công";
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
