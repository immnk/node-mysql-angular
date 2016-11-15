var utils = angular.module('utils', []);
utils.provider('utils', Core);
Core.$inject = [];

function Core() {

    var provider = {};
    provider.$get = Factory;
    return provider;

    Factory.$inject = ['$q'];

    function Factory($q) {
        var service = {};

        service.init = init;
        service.showSpinner = showSpinner;
        service.hideSpinner = hideSpinner;

        function init() {
            Logger.debug("utils - init: start");

            Logger.debug("utils - init: end");
        }

        function showSpinner() {
            // $ionicLoading.show();
        }

        function hideSpinner() {
            // $ionicLoading.hide();
        }

        return service;
    }
}
