using System.Security.Cryptography;
using System.Text;

namespace TalentFlow.API.Services;

public static class PasswordHelper
{
    private const int Iterations = 100_000;
    private const int HashSize = 32;
    private const int SaltSize = 16;

    public static string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password), salt, Iterations, HashAlgorithmName.SHA256, HashSize);
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public static bool Verify(string password, string stored)
    {
        var parts = stored.Split('.');
        if (parts.Length != 2) return false;
        try
        {
            var salt = Convert.FromBase64String(parts[0]);
            var expected = Convert.FromBase64String(parts[1]);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password), salt, Iterations, HashAlgorithmName.SHA256, HashSize);
            return CryptographicOperations.FixedTimeEquals(hash, expected);
        }
        catch
        {
            return false;
        }
    }
}
