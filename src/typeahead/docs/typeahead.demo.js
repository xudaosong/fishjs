
'use strict';

angular.module('fish.demo')

    .controller('TypeaheadDemoCtrl', function($scope, $templateCache, $http) {

        $scope.selectedState = '';
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

        $scope.selectedIcon = '';
        $scope.icons = [
            {value: 'Heart', label: '<i class="glyphicon glyphicon-heart"></i> Heart'},
            {value: 'Star', label: '<i class="glyphicon glyphicon-star"></i> Star'},
            {value: 'Home', label: '<i class="glyphicon glyphicon-home"></i> Home'},
            {value: 'Camera', label: '<i class="glyphicon glyphicon-camera"></i> Camera'}
        ];

        $scope.selectedAddress = '';
        $scope.getAddress = function(viewValue) {
            var params = {address: viewValue, sensor: false};
            return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {params: params})
                .then(function(res) {
                    return res.data.results;
                });
        };

    });