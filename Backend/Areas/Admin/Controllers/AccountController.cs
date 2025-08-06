using Backend.Models;
using Backend.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Backend.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class AccountController : Controller
    {
        private readonly ShoeStoreDbContext _context;
        public AccountController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var accounts = await _context.Accounts
                .Include(a => a.Role)
                .ToListAsync();

            return View(accounts);
        }

        public IActionResult Create()
        {
            ViewBag.Roles = new SelectList(_context.Roles, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Account account)
        {
            if (ModelState.IsValid)
            {
                _context.Add(account);
                await _context.SaveChangesAsync();
                TempData["success"] = "Account created successfully";
                return RedirectToAction(nameof(Index));
            }
            ViewBag.Roles = new SelectList(_context.Roles, "Id", "Name", account.RoleId);
            return View(account);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
                return NotFound();

            var account = await _context.Accounts
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (account == null)
                return NotFound();

            if (account.Role?.Name == "Admin")
                return Forbid();

            var viewModel = new EditAccountViewModel
            {
                Id = account.Id,
                UserName = account.UserName,
                FullName = account.FullName,
                Email = account.Email,
                Phone = account.Phone,
                RoleId = account.RoleId,
                IsActive = account.IsActive
            };

            var roles = await _context.Roles
                .Where(r => r.Name != "Admin") // Lọc bỏ Admin
                .Select(r => new SelectListItem
                {
                    Value = r.Id.ToString(),
                    Text = r.Name
                }).ToListAsync();

            ViewBag.Roles = roles;
            return View(viewModel);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, EditAccountViewModel viewModel)
        {
            if (id != viewModel.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var account = await _context.Accounts.FindAsync(id);
                    if (account == null) return NotFound();

                    account.FullName = viewModel.FullName;
                    account.UserName = viewModel.UserName;
                    account.Email = viewModel.Email;
                    account.Phone = viewModel.Phone;
                    account.RoleId = viewModel.RoleId;
                    account.IsActive = viewModel.IsActive;

                    _context.Update(account);
                    await _context.SaveChangesAsync();

                    TempData["success"] = "Account updated successfully";
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AccountExists(viewModel.Id)) return NotFound();
                    else throw;
                }
            }

            ViewBag.Roles = new SelectList(_context.Roles, "Id", "Name", viewModel.RoleId);
            return View(viewModel);
        }


        public async Task<IActionResult> Delete(int? id)
        {
            var account = await _context.Accounts
                .Include(a => a.Role)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (account == null || account.Role?.Name == "Admin")
            {
                return NotFound();
            }

            return View(account);
        }


        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var account = await _context.Accounts.FindAsync(id);

            if (account != null)
            {
                // Xóa các wishlist liên quan trước
                var wishlists = _context.Wishlists.Where(w => w.AccountId == account.Id);
                _context.Wishlists.RemoveRange(wishlists);

                _context.Accounts.Remove(account);
                await _context.SaveChangesAsync();
            }
            TempData["success"] = "Account deleted successfully";
            return RedirectToAction(nameof(Index));
        }

        private bool AccountExists(int id)
        {
            return _context.Accounts.Any(e => e.Id == id);
        }
    }

}



