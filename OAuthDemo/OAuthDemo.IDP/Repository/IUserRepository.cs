using OAuthDemo.IDP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OAuthDemo.IDP.Repository
{
    public interface IUserRepository
    {
        Task<User> ValidateUser(string username, string password);

        Task<User> GetUser(string username);
    }
}
