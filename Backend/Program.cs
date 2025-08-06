using System.Text;
using Backend.JWT;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddDbContext<ShoeStoreDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "MyCookieAuth"; // Cho MVC
    options.DefaultChallengeScheme = "MyCookieAuth";
    options.DefaultAuthenticateScheme = "MyCookieAuth";
})
.AddCookie("MyCookieAuth", options =>
{
    options.LoginPath = "/admin/account/login";
    options.AccessDeniedPath = "/admin/account/accessdenied";
})
.AddJwtBearer("Bearer", options =>
{
    var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
        ClockSkew = TimeSpan.Zero
    };
});





builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // React dev server
                   .AllowAnyHeader()
                   .AllowAnyMethod();

        });
});

builder.Services.AddSession();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ShoeStoreDbContext>();

    // Chỉ tạo tài khoản admin nếu chưa có
    if (!context.Accounts.Any(a => a.UserName == "admin"))
    {
        // Lấy Role với Id = 2 (Admin)
        var adminRole = context.Roles.FirstOrDefault(r => r.Id == 2);
        if (adminRole == null)
        {
            throw new Exception("⚠️ Role Admin với Id = 2 không tồn tại trong database.");
        }

        // Hash mật khẩu bằng BCrypt
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword("admin123");

        // Thêm tài khoản admin mới
        context.Accounts.Add(new Account
        {
            UserName = "admin",
            Email = "admin@gmail.com",
            Password = hashedPassword,
            FullName = "Pham Nhan Nghia",
            Phone = "0918253879",
            Address = "Go Vap",
            IsActive = true,
            RoleId = adminRole.Id  // Gán thông qua RoleId nếu bạn dùng FK
        });

        context.SaveChanges();
        Console.WriteLine("✅ Tài khoản admin đã được tạo thành công (username: admin / password: admin123)");
    }
}



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "Areas",
    pattern: "{area:exists}/{controller=Product}/{action=Index}/{id?}"
);

app.MapGet("/", () => Results.Redirect("/admin/auth/login"));


app.Run();
