using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{

    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ProductImageController : Controller
    {
        private readonly ShoeStoreDbContext _context;
        private readonly IWebHostEnvironment _environment;
        public ProductImageController(ShoeStoreDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        [HttpGet]
        public IActionResult CreateForProduct(int productId)
        {
            var productImage = new ProductImage
            {
                ProductId = productId,
                IsMain = true
            };

            return View("CreateForProduct", productImage);
        }

        [HttpGet]
        public IActionResult CreateForVariant(int productId, int productVariantId)
        {
            var productImage = new ProductImage
            {
                ProductId = productId,
                ProductVariantId = productVariantId,
                IsMain = false
            };

            return View("CreateForVariant", productImage);
        }


        private async Task HandleImageUpload(ProductImage productImage)
        {
            if (productImage.ImageFile != null && productImage.ImageFile.Length > 0)
            {
                string uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads/products");
                Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + productImage.ImageFile.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productImage.ImageFile.CopyToAsync(stream);
                }

                productImage.ImageUrl = "/uploads/products/" + uniqueFileName;
            }
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateForProduct(ProductImage productImage)
        {
            // Ảnh chính của Product
            productImage.IsMain = true;

            var existingImage = await _context.ProductImages
                .FirstOrDefaultAsync(p => p.ProductId == productImage.ProductId && p.IsMain == true);

            if (existingImage != null)
            {
                ModelState.AddModelError("", "Sản phẩm này đã có ảnh chính.");
                return View("Create", productImage);
            }

            await HandleImageUpload(productImage);

            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                _context.ProductImages.Add(productImage);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index", "Product", new { id = productImage.ProductId });
            }

            return View("Create", productImage);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateForVariant(ProductImage productImage)
        {
            // Chỉ cho phép 1 ảnh cho mỗi ProductVariant
            var existingImage = await _context.ProductImages
                .FirstOrDefaultAsync(p => p.ProductVariantId == productImage.ProductVariantId);

            if (existingImage != null)
            {
                // Đã có ảnh → không cho thêm
                ModelState.AddModelError("", "Mỗi biến thể chỉ được phép có một ảnh.");
                return View("Create", productImage);
            }

            productImage.IsMain = false;
            await HandleImageUpload(productImage);
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                _context.ProductImages.Add(productImage);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index", "ProductVariant", new { id = productImage.ProductVariantId });
            }

            return View("Create", productImage);
        }



        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var image = await _context.ProductImages.FindAsync(id);
            if (image != null)
            {
                // Xóa file vật lý
                string filePath = Path.Combine(_environment.WebRootPath, image.ImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                _context.ProductImages.Remove(image);
                await _context.SaveChangesAsync();

                // Điều hướng linh hoạt
                if (image.ProductVariantId != null)
                {
                    return RedirectToAction("Details", "ProductVariant", new { id = image.ProductVariantId });
                }

                return RedirectToAction("Index", "Product", new { id = image.ProductId });
            }

            return NotFound();
        }


    }
}
