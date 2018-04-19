/**
 * @Filename : app.js
 * @Description :
 * @Author : 
 * @Date : Jan 02, 2016 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *
 */

angular.module("bookTickets", [
    "ui.router",
    "ui.bootstrap",
    "logger",
    "helpers"
]).config([
    "$stateProvider", "$urlRouterProvider", "$locationProvider", "$controllerProvider", "$provide", "$httpProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider, $provide, $httpProvider) {
        "use strict";
        //To set the environment prod/dev
        // var env = "prod";
        var env = "dev";


        $urlRouterProvider.otherwise("/l/dashboard");
        angular.module("bookTickets").registerCtrl = $controllerProvider.register;

        function loadScript(path) {
            var result = $.Deferred(),
                script = document.createElement("script");
            script.async = "async";
            script.type = "text/javascript";
            if (env == "prod")
                path = path + "-min.js";
            else
                path = path + ".js";
            script.src = path;
            script.onload = script.onreadystatechange = function (_, isAbort) {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    if (isAbort)
                        result.reject();
                    else
                        result.resolve();
                }
            };
            script.onerror = function () {
                result.reject();
            };
            document.querySelector("head").appendChild(script);
            return result.promise();
        }

        function loader(arrayName) {
            return {
                load: function ($q) {
                    var deferred = $q.defer(),
                        map = arrayName.map(function (name) {
                            return loadScript(name);
                        });

                    $q.all(map).then(function (r) {
                        deferred.resolve();
                    });

                    return deferred.promise;
                }
            };
        }

        /*
         * State provider for this application.
         */
        $stateProvider
            .state("layout", {
                url: "/l",
                templateUrl: "app/components/layout/layout.html",
                resolve: loader(["scripts/components/layout/layoutController", "scripts/components/distributed/popupModalController"]),
                controller: "layoutController"
            })
            .state("layout.dashboard", {
                url: "/dashboard",
                templateUrl: "app/components/dashboard/dashboard.html",
                resolve: loader(["scripts/components/dashboard/dashboardController"]),
                controller: "dashboardCtrl"
            }).state("layout.tickets", {
                url: "/tickets",
                templateUrl: "app/components/tickets/tickets.html",
                resolve: loader(["scripts/components/tickets/ticketsController"]),
                controller: "ticketCtrl"
            }).state("layout.seats", {
                url: "/seats",
                templateUrl: "app/components/seats/seats.html",
                resolve: loader(["scripts/components/seats/seatsController"]),
                controller: "seatsCtrl"
            });

    }
]).run(config).filter('slice', function () {
    return function (arr, start, end) {
        return (arr || []).slice(start, end);
    };

});

function config($rootScope, $state, $window, $http) {
    "use strict";


    $rootScope.appConfig = {
        "appName": "bookTickets",
        "appVersion": "1.0"
    };

    $http.get('config/config.json')
        .then(function (data, status, headers, config) {
            $rootScope.appConfig = data.data;

        }, function (data, status, headers, config) {

        });


    //scroll page to top if route change
    $rootScope.$on('$viewContentLoaded', function () {
        $(window).scrollTop(0);
    });

    $rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
        $state.previous = fromState;
        $state.previousParams = fromParams;
    });

    // $rootScope.appConfig = appConfig;
}

angular.module("bookTickets").filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            if (input)
                return input.slice(start);
        }
    })
    .config(['$httpProvider', function ($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        $httpProvider.defaults.headers.get['If-Modified-Since'] = 0;
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);