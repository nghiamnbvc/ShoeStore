using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ProductVariantController : Controller
    {
        private readonly ShoeStoreDbContext _context;
        public ProductVariantController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        // GET: Admin/ProductVariant?productId=1
        public async Task<IActionResult> Index(int productId)
        {
            var variants = await _context.ProductVariants
                .Include(p => p.Color)
                .Include(p => p.Size)
                .Include(p => p.ProductImages)
                .Where(v => v.ProductId == productId)
                .ToListAsync();

            ViewBag.ProductId = productId;
            return View(variants);
        }
        // GET: Admin/ProductVariant/Create?productId=1
        public IActionResult Create(int productId)
        {
            ViewBag.ColorId = new SelectList(_context.Colors, "Id", "Name");
            ViewBag.SizeId = new SelectList(_context.Sizes, "Id", "Name");
            ViewBag.ProductId = productId;

            var variant = new ProductVariant { ProductId = productId };
            return View(variant);
        }

        // POST: Admin/ProductVariant/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ProductVariant variant)
        {
            if (ModelState.IsValid)
            {
                _context.ProductVariants.Add(variant);
                await _context.SaveChangesAsync();
                TempData["success"] = "Product variants create successfully";
                return RedirectToAction("Index", new { productId = variant.ProductId });
            }

            ViewBag.ColorId = new SelectList(_context.Colors, "Id", "Name", variant.ColorId);
            ViewBag.SizeId = new SelectList(_context.Sizes, "Id", "Name", variant.SizeId);
            ViewBag.ProductId = variant.ProductId;

            return View(variant);
        }

        public async Task<IActionResult> Edit(int id)
        {
            if (id == null) return NotFound();
            var variant = await _context.ProductVariants.FindAsync(id);

            if (variant == null) return NotFound();

            ViewBag.ColorId = new SelectList(_context.Colors, "Id", "Name", variant.ColorId);
            ViewBag.SizeId = new SelectList(_context.Sizes, "Id", "Name", variant.SizeId);
            ViewBag.ProductId = variant.ProductId;

            return View(variant);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ProductVariant variant)
        {
            if (id != variant.Id)
                return NotFound();
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(variant);
                    await _context.SaveChangesAsync();
                    TempData["success"] = "Product variant updated successfully";
                    return RedirectToAction("Index", new { productId = variant.ProductId });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.ProductVariants.Any(e => e.Id == variant.Id))
                        return NotFound();
                    else
                        throw;
                }
            }

            ViewBag.ColorId = new SelectList(_context.Colors, "Id", "Name", variant.ColorId);
            ViewBag.SizeId = new SelectList(_context.Sizes, "Id", "Name", variant.SizeId);
            ViewBag.ProductId = variant.ProductId;

            return View(variant);
        }

        // GET: Admin/ProductVariant/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var variant = await _context.ProductVariants
                .Include(v => v.Color)
                .Include(v => v.Size)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (variant == null) return NotFound();

            return View(variant);
        }

        // POST: Admin/ProductVariant/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var variant = await _context.ProductVariants
                .Include(v => v.ProductImages) // 👈 Load danh sách ảnh
                .FirstOrDefaultAsync(v => v.Id == id);

            if (variant != null)
            {
                // Xoá ảnh trước
                if (variant.ProductImages != null)
                {
                    _context.ProductImages.RemoveRange(variant.ProductImages);
                }

                // Xoá biến thể
                _context.ProductVariants.Remove(variant);
                await _context.SaveChangesAsync();

                TempData["success"] = "Product variant and its images deleted successfully";
                return RedirectToAction("Index", new { productId = variant.ProductId });
            }

            return NotFound();
        }


    }
}
