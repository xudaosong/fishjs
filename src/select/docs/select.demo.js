'use strict';

angular.module('fish.demo')

    .controller('SelectDemoCtrl', function ($scope) {

        $scope.selectedIcon = '';
        $scope.selectedIcons = ['Home', 'Star'];
        $scope.icons = [
            {value: 'Heart', label: '<i class="glyphicon glyphicon-heart"></i> Heart'},
            {value: 'Star', label: '<i class="glyphicon glyphicon-star"></i> Star'},
            {value: 'Home', label: '<i class="glyphicon glyphicon-home"></i> Home'},
            {value: 'Camera', label: '<i class="glyphicon glyphicon-camera"></i> Camera'}
        ];

        $scope.selectedMonth = 0;
        $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    });