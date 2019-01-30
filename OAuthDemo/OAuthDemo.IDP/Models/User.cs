using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OAuthDemo.IDP.Models
{
    public class User
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("role")]
        public string Role { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("picture")]
        public string Picture { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        [BsonElement("keywords")]
        public string[] Keywords { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }

        [BsonElement("__v")]
        public Int32 V { get; set; }

    }
}
