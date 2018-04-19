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
 * @name seatsCtrl
 * @description
 * 
 */

+ function (window, angular) {
  'use strict';
  angular
    .module("bookTickets")
    .registerCtrl('seatsCtrl', seatsCtrl)
  seatsCtrl.$inject = ["$scope", "$rootScope", "$commons", "$window", "$q", "bookTicketsService", "$filter"];


  function seatsCtrl($scope, $rootScope, $commons, $window, $q, bookTicketsService, $filter) {

    /**
     * @ngdoc method
     * @name initFunction
     * @methodOf: seatsCtrl
     * @description Get the credential from user and process it with API
     * @param 
     * @returns 
     */

    $scope.initFunction = function () {
      try {
        var params = $commons.getParams();
        $scope.selectedMovie = params;
        $scope.seatCount = 0;

        $scope.theaterSeats = $rootScope.appConfig.theaterSeatsLayout;

        var bookedTheaterSeats = JSON.parse(window.localStorage.bookedSeats);

        for (var i = 0; i < bookedTheaterSeats.length; i++) {
          if (bookedTheaterSeats[i].title == $scope.selectedMovie.title && bookedTheaterSeats[i].date.slice(0,10) == $scope.selectedMovie.selectedDate.slice(0,10) && bookedTheaterSeats[i].time == $scope.selectedMovie.selectedTime) {
            for (var j = 0; j < bookedTheaterSeats[i].seats.length; j++) {
              var tempRow = bookedTheaterSeats[i].seats[j].slice(0, 1);
              tempRow = (tempRow == 'J') ? 0 : (tempRow == 'I') ? 1 : (tempRow == 'H') ? 2 : (tempRow == 'G') ? 3 : (tempRow == 'F') ? 4 : (tempRow == 'E') ? 5 : (tempRow == 'D') ? 6 : (tempRow == 'C') ? 7 : (tempRow == 'B') ? 8 : 9;
              var tempCol = parseInt(bookedTheaterSeats[i].seats[j].slice(1, bookedTheaterSeats[i].seats[j].length));
              $scope.theaterSeats[tempRow].seats[tempCol-1].checked = 'booked';
            }
          }
        }

      } catch (err) {}
    }
    $scope.fasleFlag = 0;
    $scope.seatSelect = function (job) {
      var count = 0;
      var selectedSeats = [];

      for (var i = 0; i < $scope.theaterSeats.length; i++) {
        for (var j = 0; j < $scope.theaterSeats[i].seats.length; j++) {

          if (job == 'allFalse') {
            $scope.theaterSeats[i].seats[j].checked != 'empty' && ($scope.theaterSeats[i].seats[j].checked = false);
          } else {
            if ($scope.theaterSeats[i].seats[j].checked == true) {
              count++;
              $scope.seatCount = count;
              var tempSeat = $scope.theaterSeats[i].seatName + $scope.theaterSeats[i].seats[j].no;
              (tempSeat && count) && (selectedSeats[count - 1] = tempSeat);
              $scope.selectedSeats = selectedSeats;
            }
            if (job == 'max') {
              if ($scope.theaterSeats[i].seats[j].checked == false) {
                $scope.theaterSeats[i].seats[j].checked = 'max';
              }
            } else if (job == false) {
              $scope.fasleFlag++;
              if ($scope.theaterSeats[i].seats[j].checked == 'max') {
                $scope.theaterSeats[i].seats[j].checked = false;
              }
            }
          }
        }
      }
      if (job == true && count >= $scope.selectedMovie.totalSeat) {
        $scope.seatSelect('max');
      } else if (job == false && $scope.fasleFlag <= 1) {
        $scope.fasleFlag++;
        $scope.seatSelect(false);
      }
    }

    $scope.selectClass = function (checkedValue) {
      if (checkedValue == false) {
        return 'seat-blue';
      } else if (checkedValue == true) {
        return 'seat-green';
      } else if (checkedValue == 'max') {
        return 'seat-gray';
      } else if (checkedValue == 'booked') {
        return 'seat-red';
      }
    }

    $scope.goto = function (page) {
      $scope.seatSelect('allFalse');
      $scope.paymentFlag = false;
      $commons.navigate("layout." + page, JSON.stringify($scope.selectedMovie),
        false
      );
    }

    $scope.gotoPayment = function () {
      $scope.paymentFlag = true;

      var bookedSeats = JSON.parse(window.localStorage.bookedSeats).length ? JSON.parse(window.localStorage.bookedSeats) : [];

      if (bookedSeats.length == undefined || bookedSeats.length <= 0) {
        bookedSeats.push({
          "title": $scope.selectedMovie.title,
          "date": $scope.selectedMovie.selectedDate,
          "time": $scope.selectedMovie.selectedTime,
          "seats": $scope.selectedSeats
        });
      } else {
        var countFlag = 0;
        for (var i = 0; i < bookedSeats.length; i++) {
          if (bookedSeats[i].title == $scope.selectedMovie.title && bookedSeats[i].date.slice(0,10) == $scope.selectedMovie.selectedDate.slice(0,10) && bookedSeats[i].time == $scope.selectedMovie.selectedTime) {
            countFlag++;
            for (var j = 0; j < $scope.selectedSeats.length; j++) {
              bookedSeats[i].seats.push($scope.selectedSeats[j]);
            }
          }
        }
        if (countFlag == 0) {
          bookedSeats.push({
            "title": $scope.selectedMovie.title,
            "date": $scope.selectedMovie.selectedDate,
            "time": $scope.selectedMovie.selectedTime,
            "seats": $scope.selectedSeats
          });
        }
      }
      window.localStorage.bookedSeats = JSON.stringify(bookedSeats);
    }

    $scope.initFunction();
  }
}(window, angular);