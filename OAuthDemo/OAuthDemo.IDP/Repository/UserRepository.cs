using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using OAuthDemo.IDP.Connection;
using OAuthDemo.IDP.Models;

namespace OAuthDemo.IDP.Repository
{
    public class UserRepository : IUserRepository
    {
        MongoConnection _mongoConnection;
        public UserRepository(MongoConnection mongoConnection)
        {
            _mongoConnection = mongoConnection;
        }

        public async Task<User> GetUser(string username)
        {
            var user = await _mongoConnection.Users
                    .Find(u => u.Email == username)
                    .FirstOrDefaultAsync();

            return user;
        }

        public async Task<User> ValidateUser(string username, string password)
        {
            User user = await _mongoConnection.Users
                    .Find(u => u.Email == username)
                    .FirstOrDefaultAsync();
            
            //TODO : Validate password;

            return user;
        }
    }
}
