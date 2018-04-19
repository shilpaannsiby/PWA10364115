/**
 * @Filename : dashboardController.js
 * @Description : 
 * @Author : Alexis Toby
 * @Date : July 04, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0      04-Jul-17     Alexis Toby   File Created         
 */

/**
 * @ngdoc controller
 * @name ticketCtrl
 * @description
 * 
 */

+ function (window, angular) {
  'use strict';
  angular
    .module("bookTickets")
    .registerCtrl('ticketCtrl', ticketCtrl)
  ticketCtrl.$inject = ["$scope", "$rootScope", "$commons", "$window", "$q", "bookTicketsService", "$filter"];


  function ticketCtrl($scope, $rootScope, $commons, $window, $q, bookTicketsService, $filter) {

    /**
     * @ngdoc method
     * @name initFunction
     * @methodOf: ticketCtrl
     * @description Get the credential from user and process it with API
     * @param 
     * @returns 
     */

    $scope.initFunction = function () {
      try {

        var params = $commons.getParams();
        $scope.selectedMovie = params;

        $scope.totalSeat = 0;
        $scope.totalCost = 0;

        $scope.seatCount = [1, 2, 3, 4, 5];
        $scope.ticketOffers = [{
            "price": 21.45,
            "offer": "Large Sweet Combo Deal + Tickets @ €"
          },
          {
            "price": 20.45,
            "offer": "Medium Sweet Combo Deal + Tickets @ €"
          },
          {
            "price": 18.45,
            "offer": "Medium Combo Deal + Tickets @ €"
          },
          {
            "price": 33.00,
            "offer": "Due Combo Deal + Tickets @ €"
          },
          {
            "price": 12.45,
            "offer": "Kids Control Deal + Tickets @ €"
          },
          {
            "price": 9.95,
            "offer": "Monday Meal Deal - Large Combo + Tickets @ €"
          },
          {
            "price": 11.20,
            "offer": "Adult Tickets @ €"
          },
          {
            "price": 8.50,
            "offer": "Child Tickets @ €8"
          },
          {
            "price": 32.00,
            "offer": "Family X 4 Tickets @ €"
          },
          {
            "price": 9.00,
            "offer": "Student Tickets @ €"
          },
          {
            "price": 9.00,
            "offer": "Senior Tickets @ €"
          }
        ]

      } catch (err) {}
    }

    $scope.filterShiftTime = function (shiftTime) {

      switch ($scope.selectedMovie.shiftTime) {
        case 'all':
          return shiftTime;
          break;
        case 'mor':
          return (parseInt(shiftTime.split(":")[0]) > 0 && parseInt(shiftTime.split(":")[0]) <= 11) ? shiftTime : null;
          break;
        case 'aft':
          return (parseInt(shiftTime.split(":")[0]) > 11 && parseInt(shiftTime.split(":")[0]) <= 15) ? shiftTime : null;
          break;
        case 'eve':
          return (parseInt(shiftTime.split(":")[0]) > 15 && parseInt(shiftTime.split(":")[0]) <= 18) ? shiftTime : null;
          break;
        case 'nig':
          return (parseInt(shiftTime.split(":")[0]) > 18 && parseInt(shiftTime.split(":")[0]) <= 24) ? shiftTime : null;
          break;
        default:
          break;
      }

    };

    $scope.seatCalculation = function () {

      $scope.totalSeat = 0;
      $scope.totalCost = 0;
      for (var i = 0; i < $scope.ticketOffers.length; i++) {
        $scope.totalSeat = $scope.totalSeat + ($scope.ticketOffers[i].count ? $scope.ticketOffers[i].count : 0);
        $scope.totalCost = $scope.totalCost + ($scope.ticketOffers[i].price * ($scope.ticketOffers[i].count ? $scope.ticketOffers[i].count : 0));
      }
    };


    $scope.goto = function (page) {
      $scope.selectedMovie["totalSeat"] = $scope.totalSeat;
      $scope.selectedMovie["totalCost"] = $scope.totalCost;
      $commons.navigate("layout." + page, JSON.stringify($scope.selectedMovie),
        false
      );
    }

    $scope.initFunction();
  }
}(window, angular);