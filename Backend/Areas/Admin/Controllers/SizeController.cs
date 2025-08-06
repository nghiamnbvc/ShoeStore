using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class SizeController : Controller
    {
        private readonly ShoeStoreDbContext _context;

        public SizeController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _context.Sizes.ToListAsync());
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Size size)
        {
            if (ModelState.IsValid)
            {
                _context.Add(size);
                await _context.SaveChangesAsync();
                TempData["success"] = "Size created successfully";
                return RedirectToAction(nameof(Index));
            }
            return View(size);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size == null) return NotFound();
            return View(size);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Size size)
        {
            if (id != size.Id) return NotFound();

            if (ModelState.IsValid)
            {
                _context.Update(size);
                await _context.SaveChangesAsync();
                TempData["success"] = "Size updated successfully";
                return RedirectToAction(nameof(Index));
            }
            return View(size);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size == null) return NotFound();
            return View(size);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size != null)
            {
                _context.Sizes.Remove(size);
                await _context.SaveChangesAsync();
                TempData["success"] = "Size deleted successfully";
            }
            return RedirectToAction(nameof(Index));
        }

    }
}
