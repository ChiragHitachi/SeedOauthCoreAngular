using Microsoft.Extensions.Options;
using MongoDB.Driver;
using OAuthDemo.IDP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OAuthDemo.IDP.Connection
{
    public class MongoConnection   
    {
        private readonly IMongoDatabase _database = null;

        public MongoConnection(IOptions<ConnectionStrings> settings)
        {
            var client = new MongoClient(string.Format(settings.Value.ConnectionString, settings.Value.DatabaseName));
            if (client != null)
                _database = client.GetDatabase(settings.Value.DatabaseName);
        } 

        public IMongoCollection<User> Users
        {
            get
            {
                return _database.GetCollection<User>("users");
            }
        }
    }
}
