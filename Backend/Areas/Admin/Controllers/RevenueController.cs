using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using System.IO;

using Backend.Models;

namespace WebShoeStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class RevenueController : Controller
    {
        private readonly ShoeStoreDbContext _context;

        public RevenueController(ShoeStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(DateTime? fromDate, DateTime? toDate)
        {

            var orders = await _context.Orders
        .Include(o => o.Account)
        .Where(o => o.OrderDate >= fromDate && o.OrderDate <= toDate)
        .ToListAsync();

            var completed = orders.Where(o => o.Status == "Pending").ToList();
            var cancelled = orders.Where(o => o.Status == "Hủy").ToList();

            ViewBag.TongDonHang = orders.Count;
            ViewBag.Hoanthanh = completed.Count;
            ViewBag.DonHuy = cancelled.Count;
            ViewBag.TongTien = completed.Sum(o => o.TotalAmount);

            //  Chuẩn bị dữ liệu biểu đồ doanh thu theo ngày
            var revenueByDate = completed
                .Where(o => o.OrderDate.HasValue)
                .GroupBy(o => o.OrderDate.HasValue ? o.OrderDate.Value.Date : DateTime.MinValue)
                .OrderBy(g => g.Key)
                .Select(g => new
                {
                    Date = g.Key.ToString("dd/MM/yyyy"),
                    TotalRevenue = g.Sum(x => x.TotalAmount)
                }).ToList();

            ViewBag.ChartLabels = revenueByDate.Select(x => x.Date).ToList();
            ViewBag.ChartData = revenueByDate.Select(x => x.TotalRevenue).ToList();

            return View(orders);
        }
        public async Task<IActionResult> ExportExcel()
        {
            var orders = await _context.Orders
                .Include(o => o.Account)
                .ToListAsync();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Doanh thu");

                // Tiêu đề
                worksheet.Cell(1, 1).Value = "Khách hàng";
                worksheet.Cell(1, 2).Value = "Email";
                worksheet.Cell(1, 3).Value = "SĐT";
                worksheet.Cell(1, 4).Value = "Tổng tiền";
                worksheet.Cell(1, 5).Value = "Ngày đặt";
                worksheet.Cell(1, 6).Value = "Địa chỉ";
                worksheet.Cell(1, 7).Value = "Trạng thái";

                // Dữ liệu
                int row = 2;
                foreach (var o in orders)
                {
                    worksheet.Cell(row, 1).Value = o.Account?.FullName ?? o.CustomerName;
                    worksheet.Cell(row, 2).Value = o.Account?.Email;
                    worksheet.Cell(row, 3).Value = o.Account?.Phone ?? o.CustomerPhone;
                    worksheet.Cell(row, 4).Value = o.TotalAmount;
                    worksheet.Cell(row, 5).Value = o.OrderDate?.ToString("dd/MM/yyyy");
                    worksheet.Cell(row, 6).Value = o.ShippingAddress ?? o.Account?.Address;
                    worksheet.Cell(row, 7).Value = o.Status;
                    row++;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    var fileName = $"DoanhThu_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

    }
}
