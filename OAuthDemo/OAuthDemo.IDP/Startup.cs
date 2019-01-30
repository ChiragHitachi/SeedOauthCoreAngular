using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OAuthDemo.IDP.Connection;
using OAuthDemo.IDP.Models;
using OAuthDemo.IDP.Repository;

namespace OAuthDemo.IDP
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            //services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.Configure<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"));

            //services.Configure<EmailAppSettings>(Configuration.GetSection("EmailSettings"));
            //services.AddTransient<IMailTransport, SmtpClient>();
            ////services.AddTransient<IEnumerable<IMessageTransportProvider>>(p=>p.GetServices<SMTPMailTransportProvider>());
            //services.AddTransient<IMessageTransportProvider, SMTPMailTransportProvider>();
            //services.AddTransient<EmailCommunicator>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<MongoConnection>();

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            services.AddIdentityServer()
                 .AddDeveloperSigningCredential()
                 .AddInMemoryIdentityResources(Config.GetIdentityResources())
                 .AddInMemoryApiResources(Config.GetApiResources())
                 .AddInMemoryClients(Config.GetClients())
                 .AddCustomUserStore();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseCors("CorsPolicy");
            app.UseIdentityServer();
            app.UseStaticFiles();
           // app.UseMvcWithDefaultRoute();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Account}/{action=Login}/{id?}");
            });
        }
    }
}
