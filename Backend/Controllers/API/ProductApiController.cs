// File: Controllers/Api/ProductApiController.cs
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductApiController : ControllerBase
    {
        private readonly ShoeStoreDbContext _context;

        public ProductApiController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductApi
        //Lấy danh sách sản phẩm 
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Where(p => p.IsActive)
                .Include(p => p.ProductImages) // Load hình ảnh của sản phẩm
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.DiscountPercent,
                    ImageUrl = p.ProductImages
                        .Where(i => i.IsMain == true)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault() ?? string.Empty // Tránh lỗi null nếu không có ảnh chính
                })
                .Take(10)
                .ToListAsync();

            return Ok(products);
        }

        // // GET: api/ProductApi/gender/men
        // [HttpGet("gender/{gender}")]
        // public async Task<IActionResult> GetBy(string gender, [FromQuery] string? category)
        // {
        //     var products = await _context.Products.Where(p => p.IsActive && p.Gender != null && p.Gender.ToLower() == gender.ToLower()).Include(p => p.ProductImages).Select(p => new
        //     {
        //         p.Id,
        //         p.Name,
        //         p.Price,
        //         ImageUrl = p.ProductImages
        //         .Where(i => i.IsMain == true)
        //         .Select(i => i.ImageUrl)
        //         .FirstOrDefault() ?? string.Empty
        //     })
        // .ToListAsync();
        //     return Ok(products);
        // }

        // GET: api/ProductApi/gender/women?category=Slip%20Ons
        //Lấy danh sách sản phẩm theo gender và category
        [HttpGet("gender/{gender}")]
        public async Task<IActionResult> GetBy(string gender, [FromQuery] string? category)
        {
            var query = _context.Products
                .Where(p => p.IsActive && p.Gender != null && p.Gender.ToLower() == gender.ToLower());

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category.Name != null && p.Category.Name.ToLower() == category.ToLower());
            }

            var products = await query
                .Include(p => p.ProductImages)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.DiscountPercent,
                    ImageUrl = p.ProductImages
                        .Where(i => i.IsMain == true)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault() ?? string.Empty
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/ProductApi/5
        //Lấy sản phẩm theo id 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id && p.IsActive)
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.ProductVariants)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.Gender,
                    p.DiscountPercent,
                    Category = p.Category != null ? p.Category.Name : null,
                    ImageUrl = p.ProductImages.OrderByDescending(i => i.IsMain == true) // Ưu tiên ảnh chính
                .Select(i => i.ImageUrl)
                .FirstOrDefault() ?? string.Empty,
                    ProductVariants = p.ProductVariants.Select(v => new
                    {
                        ProductVariantId = v.Id,
                        v.Color,
                        v.Size
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new { Message = "Cannot find images." });
            }

            return Ok(product);
        }


        //Lay san pham moi nhat 
        [HttpGet("{gender}-new-arrivals")]
        public async Task<IActionResult> GetNewProducts(string gender)
        {
            var query = _context.Products
                .Where(p => p.IsActive && p.CreatedDate >= DateTime.Now.AddDays(-7));

            if (!string.IsNullOrEmpty(gender))
            {
                query = query.Where(p => p.Gender != null &&
                    p.Gender.ToLower() == gender.ToLower());
            }

            var products = await query
                .Include(p => p.ProductImages)
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.DiscountPercent,
                    ImageUrl = p.ProductImages
                        .OrderByDescending(i => i.IsMain)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault() ?? string.Empty
                })
                .Take(10)
                .ToListAsync();

            return Ok(products);
        }

        //Lay san pham giam gia 
        // GET: api/ProductApi/men-sales
        [HttpGet("{gender}-sales")]
        public async Task<IActionResult> GetSalesProducts(string gender)
        {
            var query = _context.Products
                .Where(p => p.IsActive
                    && p.DiscountPercent.HasValue
                    && p.DiscountPercent > 0); // ✅ lọc sản phẩm có giảm giá

            if (!string.IsNullOrEmpty(gender))
            {
                query = query.Where(p => p.Gender != null &&
                    p.Gender.ToLower() == gender.ToLower());
            }

            var products = await query
                .Include(p => p.ProductImages)
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.DiscountPercent,
                    ImageUrl = p.ProductImages
                        .OrderByDescending(i => i.IsMain)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault() ?? string.Empty
                })
                .Take(10)
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/ProductApi/search?query=nike
        [HttpGet("search")]
        public async Task<IActionResult> SearchByName([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { Message = "Search query is required." });
            }

            var products = await _context.Products
                .Where(p => p.IsActive && p.Name.ToLower().Contains(query.ToLower()))
                .Include(p => p.ProductImages)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.DiscountPercent,
                    ImageUrl = p.ProductImages
                        .Where(i => i.IsMain == true)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault() ?? string.Empty
                })
                .Take(10)
                .ToListAsync();

            return Ok(products);
        }

    }
}