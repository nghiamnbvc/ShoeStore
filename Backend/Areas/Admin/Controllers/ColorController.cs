using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]

    public class ColorController : Controller
    {
        private readonly ShoeStoreDbContext _context;

        public ColorController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _context.Colors.ToListAsync());
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Color color)
        {
            if (ModelState.IsValid)
            {
                _context.Add(color);
                await _context.SaveChangesAsync();
                TempData["success"] = "Color created successfully";
                return RedirectToAction(nameof(Index));
            }
            return View(color);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color == null) return NotFound();
            return View(color);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Color color)
        {
            if (id != color.Id) return NotFound();

            if (ModelState.IsValid)
            {
                _context.Update(color);
                await _context.SaveChangesAsync();
                TempData["success"] = "Color updated successfully";
                return RedirectToAction(nameof(Index));
            }
            return View(color);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color == null) return NotFound();
            return View(color);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var color = await _context.Colors.FindAsync(id);
            if (color != null)
            {
                _context.Colors.Remove(color);
                await _context.SaveChangesAsync();
                TempData["success"] = "Color deleted successfully";
            }
            return RedirectToAction(nameof(Index));
        }

    }
}
