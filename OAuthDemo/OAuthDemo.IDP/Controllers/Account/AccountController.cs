using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Events;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OAuthDemo.IDP.Models;
using OAuthDemo.IDP.Repository;
using OAuthDemo.IDP.ViewModels;

namespace OAuthDemo.IDP.Controllers.Account
{
    public class AccountController : Controller
    {
        private readonly IIdentityServerInteractionService _interaction;
        private readonly IClientStore _clientStore;
        private readonly IAuthenticationSchemeProvider _schemeProvider;
        private readonly IEventService _events;
        private IUserRepository _userRepository;
        //private readonly EmailCommunicator _emailCommunicator;

        public AccountController(IIdentityServerInteractionService interaction,
            IClientStore clientStore,
            IAuthenticationSchemeProvider schemeProvider,
            IEventService events,
            IUserRepository userRepository)
        {
            _interaction = interaction;
            _clientStore = clientStore;
            _schemeProvider = schemeProvider;
            _events = events;
            _userRepository = userRepository;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Login(string returnUrl)
        {
            // build a model so we know what to show on the login page
            //var redirect_Url = Request.QueryString.ToString();
            var vm = await BuildLoginViewModelAsync(returnUrl);

            if (vm.IsExternalLoginOnly)
            {
                // we only have one option for logging in and it's an external provider
                return RedirectToAction("Challenge", "External", new { provider = vm.ExternalLoginScheme, returnUrl });
            }
            //TempData["Url"]= "login" + redirect_Url;
            //TempData.Keep("Url");
            return View(vm);
        }

        /// <summary>
        /// Handle postback from username/password login
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginInputModel model)
        {
            var context = await _interaction.GetAuthorizationContextAsync(model.ReturnUrl);
            if (ModelState.IsValid)
            {
                // validate username/password against in-memory store
                //if (_users.ValidateCredentials(model.Username, model.Password))
                var user = await _userRepository.ValidateUser(model.Username, model.Password);
                if (user != null)
                {
                    AuthenticationProperties props = null;

                    await _events.RaiseAsync(new UserLoginSuccessEvent(user.Email, user.Id.ToString(), user.Name));

                    // issue authentication cookie with subject ID and username
                    await HttpContext.SignInAsync(user.Id.ToString(), user.Email, props); //SubjectId

                    // request for a local page
                    if (Url.IsLocalUrl(model.ReturnUrl))
                    {
                        return Redirect(model.ReturnUrl);
                    }
                    else if (string.IsNullOrEmpty(model.ReturnUrl))
                    {
                        return Redirect("~/");
                    }
                    else
                    {
                        // user might have clicked on a malicious link - should be logged
                        throw new Exception("invalid return URL");
                    }
                }

            }

            return View(model);

        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(string returnUrl)
        {
            var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
            if (context?.IdP != null)
            {
                // this is meant to short circuit the UI and only trigger the one external IdP
                return new LoginViewModel
                {
                    EnableLocalLogin = false,
                    ReturnUrl = returnUrl,
                    Username = context?.LoginHint,
                    ExternalProviders = new List<ExternalProvider>() { new ExternalProvider { AuthenticationScheme = context.IdP } }
                };
            }

            var schemes = await _schemeProvider.GetAllSchemesAsync();

            var providers = schemes
                .Where(x => x.DisplayName != null ||
                            (x.Name.Equals(AccountOptions.WindowsAuthenticationSchemeName, StringComparison.OrdinalIgnoreCase))
                )
                .Select(x => new ExternalProvider
                {
                    DisplayName = x.DisplayName,
                    AuthenticationScheme = x.Name
                }).ToList();

            var allowLocal = true;
            if (context?.ClientId != null)
            {
                var client = await _clientStore.FindEnabledClientByIdAsync(context.ClientId);
                if (client != null)
                {
                    allowLocal = client.EnableLocalLogin;

                    if (client.IdentityProviderRestrictions != null && client.IdentityProviderRestrictions.Any())
                    {
                        providers = providers.Where(provider => client.IdentityProviderRestrictions.Contains(provider.AuthenticationScheme)).ToList();
                    }
                }
            }

            return new LoginViewModel
            {
                AllowRememberLogin = AccountOptions.AllowRememberLogin,
                EnableLocalLogin = allowLocal && AccountOptions.AllowLocalLogin,
                ReturnUrl = returnUrl,
                Username = context?.LoginHint,
                ExternalProviders = providers.ToArray()
            };
        }

        private async Task<LoginViewModel> BuildLoginViewModelAsync(LoginInputModel model)
        {
            var vm = await BuildLoginViewModelAsync(model.ReturnUrl);
            vm.Username = model.Username;
            return vm;
        }
    }
}