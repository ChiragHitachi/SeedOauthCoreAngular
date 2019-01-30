using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace OAuthDemo.IDP.ViewModels
{
    public class LoginInputModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public string ReturnUrl { get; set; }
    }
}
