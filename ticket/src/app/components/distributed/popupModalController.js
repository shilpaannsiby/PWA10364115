+ function (window, angular) {
    'use strict';
    angular
        .module('bookTickets')
        .registerCtrl('popupModalCtrl', popupModalCtrl);

    /**
     * @ngdoc controller
     * @name popupModalCtrl
     * @description
     * Modal Instance controller is used for showing alert messages or informations in a popup. Actions are performed based on the user's input.
     */

    popupModalCtrl.$inject = ["$scope", "$commons", "$state", "$rootScope", "$uibModalInstance", "alert_model", "$window"];

    function popupModalCtrl($scope, $commons, $state, $rootScope, $uibModalInstance, alert_model, $window) {

        $scope.alert_header = alert_model.alert_header;
        $scope.alert_message = alert_model.alert_message;
        $scope.pageName = alert_model.pageName;
        $scope.searchValue = alert_model.searchValue;
        $scope.fileName = alert_model.fileName;
        $scope.tableHeaders = alert_model.tableHeaders;
        $scope.currentPageData = alert_model.currentPageData;
        $scope.filteredPageData = alert_model.filteredPageData;
        $scope.allPageData = alert_model.allPageData;
        $scope.exportName = alert_model.exportName;

        $scope.exportType ="current";

        /**
         * @ngdoc method
         * @name cancel
         * @methodOf popupModalCtrl
         * @description
         * It is used for closing the alert popup.
         */
        $scope.cancel = function () {
            $uibModalInstance.close("cancel");
        };
        /**
         * @ngdoc method
         * @name ok
         * @methodOf popupModalCtrl
         * @description
         * This method reloads the current page if delete or remove was handled otherwise it navigates to the page as requested.
         */

        $scope.ok = function () {
            // $uibModalInstance.dismiss("cancel");
            $uibModalInstance.dismiss("ok");
            $(window).scrollTop(0);
        };

        $scope.exportTableData = function () {

        }
    }
}(window, angular);