var app = angular.module('eBayApp', ['ui.router', 'ui.bootstrap',
    'ui.bootstrap.collapse'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    console.log('in config function');

    $stateProvider
        .state('landing', {
            url: '/landing',
            templateUrl: 'templates/landing.html',
            controller: 'LandingController'
        })
        .state('landing.register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'RegisterController'
        })
        .state('landing.login', {
            url: '/login',
            templateUrl: 'templates/loginpage.html',
            controller: 'LoginController'
        })
        .state('dashboard', {
            url: '/dashboard',
            abstract:true,
            templateUrl: 'templates/dashboard.html',
            controller: 'DashController'
        })
       .state('dashboard.logout', {
            controller: 'LogoutController'
        })
        .state('dashboard.sell', {
            url: '/sell',
            templateUrl: 'templates/sell.html',
            controller: 'SellController',
        }).state('dashboard.buy',{
            url:'/buy',
            templateUrl: 'templates/buy.html',
            controller: 'BuyController'
        }).state('dashboard.cartLanding',{
            url:'/cartLanding',
            templateUrl:'templates/cartLanding.html',
            controller: 'cartLandingController'
        }).state('dashboard.cartLanding.viewcart',{
            url: '/viewcart',
            templateUrl: 'templates/cart.html',
            controller: 'CartController'
        })
        .state('dashboard.cartLanding.checkout', {
            url: '/checkout',
            templateUrl: 'templates/successfulSell.html',
            controller: 'checkoutController'
        })
    $urlRouterProvider.otherwise('/landing/register');
});
