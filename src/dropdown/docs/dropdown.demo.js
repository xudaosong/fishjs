'use strict';

angular.module('fish.demo')

    .config(function ($dropdownProvider) {
        angular.extend($dropdownProvider.defaults, {
            html: true
        });
    })

    .controller('DropdownDemoCtrl', function ($scope, $http) {
        $scope.dropdown = [
            {text: '<i class="glyphicon glyphicon-download"></i>&nbsp;Another action', href: '#anotherAction'},
            {text: '<i class="glyphicon glyphicon-globe"></i>&nbsp;Display an alert', click: '$alert("Holy guacamole!")'},
            {text: '<i class="glyphicon glyphicon-link"></i>&nbsp;External link', href: '//www.baidu.com', target: '_self'},
            {divider: true},
            {text: 'Separated link', href: '#separatedLink'}
        ];

        $scope.$alert = function (title) {
            alert({
                title: title,
                content: 'Best check yo self, you\'re not looking too good.',
                placement: 'top',
                type: 'info',
                keyboard: true,
                show: true
            });
        };
    });