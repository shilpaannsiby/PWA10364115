/**
 * @Filename : layoutController.js
 * @Description : 
 * @Author : Alexis Toby
 * @Date : July 03, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0      03-Jul-17     Alexis Toby   File Created         
 */

/**
 * @ngdoc controller
 * @name layoutController
 * @description
 * 
 */

+ function (window, angular) {
    'use strict';
    angular
        .module("bookTickets")
        .registerCtrl('layoutController', layoutController);
    layoutController.$inject = ["$scope", "$rootScope", "$commons", "$logger", "bookTicketsService", "$window", "$state"];


    function layoutController($scope, $rootScope, $commons, $logger, bookTicketsService, $window, $state) {

        var logger = $logger.getInstance("layoutController");



      

    }
}(window, angular);