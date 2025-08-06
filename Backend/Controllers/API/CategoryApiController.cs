using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryApiController : ControllerBase
    {
        private readonly ShoeStoreDbContext _context;

        public CategoryApiController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoryApi
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

    }
}
