using Microsoft.Extensions.DependencyInjection;
using OAuthDemo.IDP.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OAuthDemo.IDP
{
    public static class IdentityServerBuilderExtension
    {
        public static IIdentityServerBuilder AddCustomUserStore(this IIdentityServerBuilder builder)
        {
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            return builder;
        }
    }
}
