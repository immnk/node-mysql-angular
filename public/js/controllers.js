var app = angular.module('eBayApp');

app.controller("LandingController", function($scope) {

});

app.controller("RegisterController", function($scope, $http, $state) {
    $scope.already_registered = true;
    $scope.unexpected_error = true;
    $scope.registerUser = function() {
        $http({
            method: "POST",
            url: '/registerUser',
            // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                "firstname": $scope.firstname,
                "lastname": $scope.lastname,
                "email": $scope.email,
                "password": $scope.password
            }
        }).success(function(data){
            if(data.statusCode == 200)
            {
                $state.go('dashboard.sell');
            }
            else if(data.statusCode == 401)
            {
                $scope.already_registered = false;
                $scope.unexpected_error = true;
            }
            else
            {
                $scope.already_registered = true;
                $scope.unexpected_error = false;
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
                    $state.go('dashboard.sell');
            }
        }).error(function(data) {
            $scope.invalid_login = true;
            $scope.unexpected_error = false;
        });
    }
});

app.controller("LogoutController", function($scope, $http) {
    console.log("inside LogoutController");
    $http({
        method: "POST",
        url: "/logout"
    }).success(function(data) {
        if (data.statusCode == 200){
            console.log("its a 200");
            window.location.assign("/");
        }
        else {
            console.log("its a 401");
        }
    }).error(function(data) {
        console.log("unexpected error");
    })
});

app.controller('DashController', function($scope, $state,$http) {
    $scope.displayTime = true;
    $http({
        method: "GET",
        url: '/getLastLoggedInTime'
    }).success(function (data) {
        $scope.displayTime = false;
        $scope.last_time = data;
    }).error(function (data) {
        $scope.displayTime = true;
    })
});

app.controller('SellController', function($scope, $http, $state) {

    $scope.addItemToSell = function() {
        $http({
            method: "POST",
            url: '/addItemToDB',
            data: {
                "itemName": $scope.itemName,
                "itemPrice": $scope.itemPrice,
                "itemDesc": $scope.itemDesc
            }
        }).success(function(data) {
            if(data.statusCode == 200)
            {
                console.log('successfully saved ad');
            }
            else
            {
                console.log('unsuccessful save');
            }
        }).error(function(data) {
            console.log('unexpected error while saving ad');

        })
    }
});

app.controller('BuyController',function($scope,$http) {
    $http({
        method: 'GET',
        url: '/getItemsForSale'
    }).success(function (data) {
        $scope.buyItems = data;
    }).error(function (data) {
        if (data.statusCode == 401) {
            console.log('error in getting buyItems');
        }
    })

    $scope.addItemToCart = function(name,seller,qty){
        $http({
            method: "POST",
            url: "/addItemToCartDB",
            data:{
                "itemName": name,
                "itemPostedBy":seller,
                "itemQuantity": qty
            }
        }).success(function (data) {
            if(data.statusCode == 200)
            {
                console.log("data posted");
            }
        }).error(function (data) {
            if(data.statusCode==401){
                console.log("Error while retrieving cart info");
            }
        })
    }
});

app.controller('CartController',function($scope,$state,$http){
    $http({
        method: 'GET',
        url: '/displayItemsFromCart'
    }).success(function (data) {
        $scope.cartedItems = data;
    }).error(function (data) {
        if (data.statusCode == 401) {
            console.log('error in getting buyItems');
        }
    })

    $scope.removeItemFromCart = function (name) {
        $http({
            method: "POST",
            url: "/removeItemFromCartDB",
            data:{
                "itemName": name
            }
        }).success(function (data) {
            if(data.statusCode == 200){
                $state.reload('dashboard.cart');
            }
        }).error(function (data) {
            console.log("error while deleting item from cart");
        })
    }

    $scope.continueShopping= function () {
        $state.go('dashboard.buy');
    }
    $scope.proceedToCheckout = function(){
        $state.go('^.checkout');
    }
});

app.controller("checkoutController",function ($scope,$http) {

});

app.controller("cartLandingController", function($scope) {

});
