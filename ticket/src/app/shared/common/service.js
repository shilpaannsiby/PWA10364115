/**
 * @Filename : bookTicketsService.js
 * @Description : 
 * @Author : Alexis Toby
 * @Date : July 04, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0      04-Jul-17     Alexis Toby   File Created         
 */

/**
 * @ngdoc service
 * @name bookTicketsService
 * @description
 * 
 */

+ function (window, angular) {
  'use strict';
  angular
    .module('bookTickets')
    .service('bookTicketsService', bookTicketsService);

  function bookTicketsService($http, $logger, $rootScope, $q, $state, $window) {
    var logger = $logger.getInstance();

    // using to put api Service (Post Method)
    var put = function (url, model) {
      return $http.put(url, model).then(function (success) {
        return success;
      }, function (error) {
        return error;
      });
    };

    // using to post api Service (Post Method)
    var post = function (url, model) {
      var requestModel = model;
      var deferred = $q.defer();
      var initCall = $http.post(url, model, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      initCall.then(function (response) {
          if ((!$rootScope.newTokenCalled) && (!response || response.data != undefined && response.data == "SESSION_EXPIRED")) {
            $q.all([
              getToken()
            ]).then(function () {
              var reCall = $http.post(url, model);
              reCall.then(function (response) {
                deferred.resolve(response.data);
              });
            });
          } else {

            if (response.data && response.data.message && (response.data.message.toLowerCase() == "invalid authorization" || response.data.message.toLowerCase() == "user has been suspended!")) {
              $window.sessionStorage.sessionOut = response.data.message;
              $window.location = "#/login";
            } else if (response) {
              deferred.resolve(response.data);
            } else {
              deferred.reject();
            }
          }
        },
        function error(response) {
          deferred.reject(response);
          if (response.status == "-1") {
            $window.location.href = "#/login";
          }
        });
      return deferred.promise;
    };

    // using to post empty api Service (Post Method without model )
    var getToken = function () {
      var deferred = $q.defer();
      if ($window.sessionStorage.tokenAPI == 'accessToken') {
        var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.getNewAccessToken;
        var model = {
          "userName": $window.sessionStorage.username || '',
          "refreshToken": $window.sessionStorage.refreshToken || null
        };
        $rootScope.newTokenCalled = true;
      } else {
        var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.getAccessToken;
        var model = {
          "userName": $window.sessionStorage.username || ''
        };
        $window.sessionStorage.tokenAPI = 'accessToken';
      }

      $http.post(url, model).success(function (res) {
        //logger.info("URL: " + url + ", Response Data Length: " + res.data.length);
        if (res.success) {
          $window.sessionStorage.authToken = res.accessToken;
          if (res.refreshToken) {
            $window.sessionStorage.refreshToken = res.refreshToken;
          }
          $rootScope.newTokenCalled = false;
          deferred.resolve();
        } else {
          var params = alertMessage.get('responseErrorAPI');
          var modalInstance = modalFactory.errorModal(params);
          deferred.reject();
        }
      }).error(function (err) {
        if ($window.sessionStorage.tokenAPI == 'newAccessToken') {
          $window.sessionStorage.tokenAPI = null;
          $window.sessionStorage.refreshToken = null;
          $window.sessionStorage.authToken = null;
          $window.location = "#/login";
        }
        deferred.reject();
      }).finally(function () {});
      return deferred.promise;
    };

    // using to post empty api Service (Post Method without model )
    var postEmpty = function (url) {
      var response = $http.post(url);
      return response;
    };

    // using to get api Service (get Method)
    var get = function (url) {

      var response = $http({
        method: "get",
        url: url
      });
      $window.sessionStorage.removeItem("sessionOut");
      response.then(function (res) {
        if (res.data && res.data.message && (res.data.message.toLowerCase() == "invalid authorization" || res.data.message.toLowerCase() == "user has been suspended!")) {
          $window.sessionStorage.sessionOut = res.data.message;
          $window.location = "#/login";
        }
      });
      return response;

    };

    // using to delete api Service(delete Method)
    var deleteApi = function (url) {
      return $http.delete(url).then(function (success) {
        return success;
      }, function (error) {
        return error;
      });
    };


    //using to return all service method to controller
    return {
      put: put,
      post: post,
      get: get,
      postEmpty: postEmpty,
      delete: deleteApi
    };
  }

}(window, angular);

+
function (window, angular) {
  'use strict';
  angular
    .module('bookTickets')
    .service('bookTicketsNavigateService', bookTicketsNavigateService);

  function bookTicketsNavigateService($http, $logger, $window, $state, $rootScope, $filter) {
    var logger = $logger.getInstance();
    var currentParam = [];
    var pageList = [];
    var data = {};

    var setCurrentPage = function (page) {
      pageList = $window.sessionStorage.pageHistory ? JSON.parse($window.sessionStorage.pageHistory) : [];
      var currPage = {
        pageName: page.pageName,
        params: page.params
      }

      var previousState = pageList[pageList.length - 1];

      if (previousState && previousState.pageName == page.pageName && previousState.params == page.params) {} else {
        pageList.push(currPage);
      }

      $window.sessionStorage.pageHistory = null;
      $window.sessionStorage.pageHistory = JSON.stringify(pageList);

    }

    var Cancel = function () {
      pageList = $window.sessionStorage.pageHistory ? JSON.parse($window.sessionStorage.pageHistory) : [];
      var currentPage = pageList[pageList.length - 1];
      pageList.splice(-1, 1);
      var previousPage = pageList[pageList.length - 1];
      $window.sessionStorage.data = previousPage.params || null;
      $window.sessionStorage.pageHistory = null;
      $window.sessionStorage.pageHistory = JSON.stringify(pageList);
      if (currentPage && previousPage && (previousPage.pageName == currentPage.pageName)) {
        $state.go(previousPage.pageName, previousPage.params, {
          reload: true
        });
      } else {
        $state.go(previousPage.pageName, previousPage.params);
      }
    }

    return {
      Cancel: Cancel,
      setCurrentPage: setCurrentPage
    };
  }
}(window, angular);



+
function (window, angular) {
  'use strict';
  angular
    .module('bookTickets')
    .service('anchorSmoothScroll', anchorSmoothScroll);

  function anchorSmoothScroll($http, $logger, $window, $state, $rootScope, $filter) {

    this.scrollTo = function (eID) {

      // This scrolling function 
      // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

      var startY = currentYPosition();
      var stopY = elmYPosition(eID);
      var distance = stopY > startY ? stopY - startY : startY - stopY;
      if (distance < 100) {
        scrollTo(0, stopY);
        return;
      }
      var speed = Math.round(distance / 100);
      if (speed >= 20) speed = 20;
      var step = Math.round(distance / 25);
      var leapY = stopY > startY ? startY + step : startY - step;
      var timer = 0;
      if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
          setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
          leapY += step;
          if (leapY > stopY) leapY = stopY;
          timer++;
        }
        return;
      }
      for (var i = startY; i > stopY; i -= step) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY -= step;
        if (leapY < stopY) leapY = stopY;
        timer++;
      }

      function currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;
        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
          return document.documentElement.scrollTop;
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
      }

      function elmYPosition(eID) {
        var elm = document.getElementById(eID);
        var y = elm.offsetTop;
        var node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
        }
        return y;
      }

    };
  }
}(window, angular);