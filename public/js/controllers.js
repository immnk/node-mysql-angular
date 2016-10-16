var app = angular.module('eBayApp');

app.controller("LandingController", function($scope) {

});

app.controller("RegisterController", function($scope, $http, $state) {

    $scope.inputType = 'password';

    // Hide & show password function
    $scope.hideShowPassword = function(){
        if ($scope.inputType == 'password')
            $scope.inputType = 'text';
        else
            $scope.inputType = 'password';
    };

    //Registration functions
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
            } else{
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
                "itemDesc": $scope.itemDesc,
                "isBid": $scope.isBid
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
    $scope.total = 0;
    $http({
        method: 'GET',
        url: '/displayItemsFromCart'
    }).success(function (data) {
        if(data.length>0){
            $scope.cartedItems = data;
            for(var i=0;i<data.length;i++)
            {
                $scope.total = $scope.total + data[i].itemPrice*data[i].itemQuantity;
            }
            $scope.qty = data.length;
        }
        else {
            console.log("Sorry your cart is empty!");
        }
    }).error(function (data) {
        if (data.statusCode == 401) {
            console.log('error in getting buyItems');
        }
    })

    $scope.removeItemFromCart = function (name,seller) {
        $http({
            method: "POST",
            url: "/removeItemFromCartDB",
            data:{
                "itemName": name,
                "itemPostedBy": seller
            }
        }).success(function (data) {
            if(data.statusCode == 200){
                $state.reload();
            }
        }).error(function (data) {
            console.log("error while deleting item from cart");
        })
    }
    $scope.continueShopping= function () {
        $state.go('dashboard.buy');
    }
    $scope.proceedToCheckout = function(){
        $http({
            method:'GET',
            url:'/updateCheckoutInfo'
        }).success(function (data) {
            if(data.statusCode == 200)
            {
                $state.go('^.checkout');
            }
        }).error(function (data) {
            if(data.statusCode == 401)
            {
                console.log('error while updating checkout info');
            }
        })
    }
});

app.controller("checkoutController",function ($scope,$http) {
    $scope.invalid_details=true;
        $scope.checkCreditCardValidity = function () {
        $http({
            method:"POST",
            url: "/checkCardValidity",
            data:{
                "card_num": $scope.card_num,
                "cvv":$scope.cvv,
                "exp_date": $scope.exp_date
            }
        }).success(function (data) {
            if(data.statusCode ==200){
                $scope.invalid_details = true;
            }
            else
            {
                $scope.invalid_details = false;
            }
        }).error(function (data) {

        })
    }
});

app.controller("cartLandingController", function($scope) {

});

app.controller('myebayController',function ($scope,$http) {

});

app.controller('orderHistoryController',function ($scope,$http) {
    $http({
        method: "GET",
        url: "/getCheckoutInfo"
    }).success(function (data) {
        if(data.length>0){
            $scope.orderHist = data;
        }
    }).error(function(data){
        if(data.statusCode==401){
            console.log("error while getting order history");
        }
    })
});

app.controller('soldHistoryController',function ($scope,$http) {
    $http({
        method: "GET",
        url: "/getSoldInfo"
    }).success(function (data) {
        if(data.length>0){
            $scope.soldHist = data;
        }
    }).error(function(data){
        if(data.statusCode==401){
            console.log("error while getting order history");
        }
    })
});

app.controller('BidController',function ($scope,$http) {
    $http({
        method: 'GET',
        url: '/getBidItemsForSale'
    }).success(function (data) {
        $scope.bidItems = data;
        /*for(var i=0;i<data.length;i++)
        {
            $scope.minBid = data[i].maxBid;
        }*/
    }).error(function (data) {
        if (data.statusCode == 401) {
            console.log('error in getting buyItems');
        }
    })

    $scope.updateUserBid = function (userBid,itemName,itemPostedBy) {
        $http({
            method:"POST",
            url:"/updateMaxBid",
            data:{
                "bidValue": userBid,
                "itemName": itemName,
                "itemPostedBy": itemPostedBy
            }
        }).success(function (data) {

        }).error(function (data) {

        })
    }
});

app.controller('bidHistoryController',function ($scope,$http) {

    $http({
        method: "GET",
        url: "/getBidHistory"
    }).success(function (data) {
        $scope.bidHist = data;
    }).error(function (data) {
        console.log('error while getting bid history');
    })
})