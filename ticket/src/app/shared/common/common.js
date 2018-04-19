/**
 * @Filename : common.js
 * @Description : 
 * @Author : Alexis Toby
 * @Date : July 04, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0      04-Jul-17     Alexis Toby   File Created         
 */

/**
 * @ngdoc common
 * @name bookTicketscommon
 * @description
 * 
 */


+ function (angular) {

  'use strict';
  angular
    .module('bookTickets')
    .service('$commons', bookTicketsCommonFactory);


  function bookTicketsCommonFactory($logger, $window, $rootScope, $timeout, bookTicketsNavigateService, $state) {

    var fn = {};
    $rootScope.expireCount = 0;
    fn.navigate = function (pageName, params, reloadPage) {
      if (pageName == "layout.dashboard") {
        $window.sessionStorage.menuName = "dashboard";
        reloadPage = true;
      }

      bookTicketsNavigateService.data = params;
      $window.sessionStorage.data = null;
      $window.sessionStorage.data = params;
      $state.go(pageName, {}, {
        reload: reloadPage
      });
    }

    fn.getParams = function () {
      var paramsData = $window.sessionStorage.data || '{}';
      return JSON.parse(paramsData);
    }

    return fn;
  }
}(angular);