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
 * @name dashboardCtrl
 * @description
 * 
 */

+ function (window, angular) {
  'use strict';
  angular
    .module("bookTickets")
    .registerCtrl('dashboardCtrl', dashboardCtrl)
  dashboardCtrl.$inject = ["$scope", "$rootScope", "$commons", "$window", "$q", "bookTicketsService", "$filter", "$http"];


  function dashboardCtrl($scope, $rootScope, $commons, $window, $q, bookTicketsService, $filter, $http) {

    /**
     * @ngdoc method
     * @name initFunction
     * @methodOf: dashboardCtrl
     * @description Get the credential from user and process it with API
     * @param 
     * @returns 
     */

    $scope.initFunction = function () {
      try {
        $scope.shiftTime = 'all';
        $scope.allDates = [];
        var tempDate = [];
        $scope.activeDate = 0;
        tempDate.push(new Date());
        $scope.todayDate = tempDate[0].toDateString().split(" ")[0].toLowerCase();

        for (var i = 1; i <= 3; i++) {
          tempDate.push(new Date());
          tempDate[i].setDate(tempDate[i].getDate() + i);
        }

        console.log(tempDate);
        $scope.allDates = tempDate;

        $scope.getMovieList();

      } catch (err) {}
    }

    /**
     * @ngdoc method
     * @name getActivityTypes
     * @methodOf: dashboardCtrl
     * @description Get the credential from user and process it with API
     * @param 
     * @returns 
     */
    $scope.getMovieList = function () {
      try {
        $rootScope.loaderFlag = true;
        $scope.movieList = [];
        $http.get("https://college-movies.herokuapp.com")
          .then(function (res) {
            if (res.status = 200) {
              $scope.movieList = res.data;
              window.localStorage.movieListBase = JSON.stringify(res.data);
            }
            $rootScope.loaderFlag = false;
          }, function (err, status) {
            $scope.movieList = $rootScope.appConfig.staticMovieList;
            window.localStorage.movieListBase = JSON.stringify($scope.movieList);
            $rootScope.loaderFlag = false;
          });
      } catch (err) {}
    };

    $scope.filterDay = function (day, index) {
      $scope.activeDate = index;
      var z = 0;
      $scope.todayDate = day.toDateString().split(" ")[0].toLowerCase();
      $scope.movieList = JSON.parse(window.localStorage.movieListBase);
      var tempMovieList = JSON.parse(window.localStorage.movieListBase);
      for (var j = 0; j < $scope.movieList.length; j++) {
        if (!$scope.movieList[j].runningTimes[$scope.todayDate].length > 0) {
          tempMovieList.splice(j - z, 1);
          z++;
        }
      }
      $scope.movieList = tempMovieList;
    };

    $scope.filterTime = function (from, to) {
      var shiftFlag = 0;
      var z = 0;
      $scope.movieList = JSON.parse(window.localStorage.movieListBase);
      if (from != 'all') {
        var tempMovieList = JSON.parse(window.localStorage.movieListBase);
        for (var k = 0; k < $scope.movieList.length; k++) {
          shiftFlag = 0;
          for (var l = 0; l < $scope.movieList[k].runningTimes[$scope.todayDate].length; l++) {
            if (parseInt($scope.movieList[k].runningTimes[$scope.todayDate][l].split(":")[0]) > from &&
              parseInt($scope.movieList[k].runningTimes[$scope.todayDate][l].split(":")[0]) <= to) {
              shiftFlag++;
            }
          }
          if (shiftFlag == 0) {
            tempMovieList.splice(k - z, 1);
            z++;
          }
        }
        $scope.movieList = tempMovieList;
      }
    };

    $scope.filterShiftTime = function (shiftTime) {

      switch ($scope.shiftTime) {
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

    $scope.bookMovie = function (movie, value) {
      movie["shiftTime"] = $scope.shiftTime;
      movie["selectedDate"] = $scope.allDates[$scope.activeDate];
      $commons.navigate("layout.tickets", JSON.stringify(movie),
        false
      );
      $scope.movieList[this.$index].selectedTime = "";;

    }

    $scope.selectedTime = function (value) {
      $(".inactive").removeClass("inactive-overwrite");
      $(".movie-time").removeClass("active");
      var tempRuntime = this.runtime;
      var tempIndex = this.$index;
      setTimeout(function () {
        $scope.movieList[tempIndex].selectedTime = tempRuntime;
      }, 1000)

    };

    $scope.initFunction();
  }
}(window, angular);