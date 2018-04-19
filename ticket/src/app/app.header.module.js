
+ function (window, angular, undefined) {


    angular.module("bookTickets-grid-header", ["bookTickets-app", "bookTickets"])
        .factory('$headers', kendoGridHeaderFactory);

    function kendoGridHeaderFactory($logger, $rootScope, appConfig) {
        var fn = {};
        return fn;
    }

}(window, window.angular);