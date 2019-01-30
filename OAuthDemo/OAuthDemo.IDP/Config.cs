using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OAuthDemo.IDP
{
    public class Config
    {
        public static List<TestUser> GetUsers()
        {
            return new List<TestUser>
            {
                 new TestUser{SubjectId = "17348", Username = "chirag.gupta", Password = "welcome123$",
                Claims =
                {
                    new Claim(JwtClaimTypes.Role, "admin"),
                    new Claim(JwtClaimTypes.Name, "Chirag Gupta"),
                    new Claim(JwtClaimTypes.GivenName, "Chirag"),
                    new Claim(JwtClaimTypes.FamilyName, "Gupta"),
                    new Claim(JwtClaimTypes.Email, "Chirag.Gupta@synechron.com"), //temperary
                    new Claim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                    new Claim(JwtClaimTypes.WebSite, "http://www.synechron.com"),
                }
                 },
                new TestUser
                {
                    SubjectId = "1",
                    Username = "john",
                    Password = "welcome",

                    Claims = new List<Claim>
                    {
                       new Claim(JwtClaimTypes.Role, "dev"),
                       new Claim(JwtClaimTypes.Name, "John"),
                    }
                }
            };
        }

        // scopes define the resources in your system
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            //Custom user profile details i.e. 
            /*
             *      public string RoleName           
                    public string RoleId
                    public string UnderwritingTeam
                    public string UnderwritingTeamId
                    public string PersonId
             */

            var customUserProfile = new IdentityResource(
                name: "trucker.profile",
                displayName: "Trucker Profile",
                claimTypes: new[] { "RoleName", "RoleId", "UserType" });

            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                customUserProfile
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("rcargaapi1", "RCarga API")
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            // client credentials client
            return new List<Client>
            {
                  
                // OpenID Connect hybrid (MVC)
                new Client
                {
                    ClientId = "mvc",
                    ClientName = "MVC Client",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    //RedirectUris = { "http://localhost:5002/signin-oidc" },
                    //PostLogoutRedirectUris = { "http://localhost:5002" },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "rcargaapi1"
                    },
                    AllowOfflineAccess = true
                },

                 // Angular Client
                new Client
                {
                    ClientId = "angular-trucker",
                    ClientName = "Angular Trucker",
                    RequireConsent = false,
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = { "http://localhost:4200/signin-oidc" }, //TODO - Set landing page path
                   PostLogoutRedirectUris = { "http://localhost:4200/" },
                    ClientUri =  "http://localhost:63060/" ,
                    //  RedirectUris = { "http://rcargatrucker.azurewebsites.net/signin-oidc" }, //TODO - Set landing page path
                    //  PostLogoutRedirectUris = { "http://rcargatrucker.azurewebsites.net" },
                    //  ClientUri =  "https://rcargatrucker-identity-services.azurewebsites.net/" ,  
                    AllowedCorsOrigins = { "http://localhost:4200",  "http://172.30.0.1:8080", "http://rcargatrucker.azurewebsites.net" },
                    AccessTokenLifetime = 180,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile
                    },
                },
                new Client
                {
                    ClientId = "corda",
                    ClientName = "Corda Client",
                    RequireConsent = false,
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = { "http://localhost:9000/signin-oidc" }, //TODO - Set corda path
                    PostLogoutRedirectUris = { "http://localhost:9000/" },
                    ClientUri =  "http://localhost:62558/" ,
                    AllowedCorsOrigins = { "http://localhost:9000",  "http://172.30.0.1:8080", "http://dev-web.azurewebsites.net/" },

                    AccessTokenLifetime = 180,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "rcargaapi1"
                    },
                }


            };
        }
    }
}
