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
            url: '/logout',
            templateUrl: 'templates/landing.html',
            controller: 'LogoutController'
        })
        .state('dashboard.sell', {
            url: '/sell',
            templateUrl: 'templates/sell.html',
            controller: 'SellController'
        })
    $urlRouterProvider.otherwise('/landing/register');
});
