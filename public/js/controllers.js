var app = angular.module('eBayApp');

app.controller("LandingController", function($scope) {

});

app.controller("RegisterController", function($scope, $http, $state) {
    $scope.already_registered = true;
    $scope.unexpected_error = true;
    $scope.blank_fields = true;
    $scope.registerUser = function() {
        $http({
            method: "POST",
            url: '/registerUser',
            data: {
                "firstname": $scope.firstname,
                "lastname": $scope.lastname,
                "email": $scope.email,
                "password": $scope.password
            }
        }).success(function(data) {
            if (data.statusCode == 401) {
                $scope.already_registered = false;
                $scope.unexpected_error = true;
                $scope.blank_fields = true;
            } else if (data.statusCode == 402) {
                $scope.unexpected_error = false;
                $scope.already_registered = true;
                $scope.blank_fields = true;
            } else if (data.statusCode == 403) {
                $scope.already_registered = true;
                $scope.unexpected_error = true;
                $scope.blank_fields = false;
            } else {
                $state.go('dashboard');
            }

        }).error(function(data) {

        });
    }
});

app.controller("LoginController", function($scope, $http, $state) {
    $scope.invalid_login = true;
    $scope.unexpected_error = true;
    $scope.loginToEbay = function() {
        $http({
            method: "POST",
            url: '/checkLogin',
            data: {
                "username": $scope.username,
                "password": $scope.password
            }
        }).success(function(data) {
            if (data.statusCode === 401) {
                $scope.invalid_login = false;
                $scope.unexpected_error = true;
            } else {
                $state.go('dashboard');
            }
        }).error(function(data) {
            $scope.invalid_login = true;
            $scope.unexpected_error = false;
        });
    }
});

app.controller("LogoutController", function($scope, $http) {
    $http({
        method: "POST",
        url: "/logout"
    }).success(function(data) {
        if (data.statusCode == 200)
            $state.go('logout');
        else
            console.log("its a 401");
    }).error(function(data) {
        console.log("unexpected error");
    })
});

app.controller('DashController', function($scope, $state) {

})

app.controller('SellController', function($scope, $http, $state) {

    $scope.addItemToSell = function() {
        $http({
            method: "POST",
            url: '/addItemToSell',
            data: {
                "posting_user": $scope.username,
                "item_name": $scope.item_name,
                "item_price": $scope.item_price,
                "item_description": $scope.item_description
            }
        }).success(function(data) {

        }).error(function(data) {

        })
    }
})
