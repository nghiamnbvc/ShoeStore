using Backend.Models;

public interface IJwtService
{
    string GenerateToken(Account account);
}
