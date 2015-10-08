angular.module('fish.demo')
    .controller('BusyDemoCtrl', function ($scope,$q,$timeout,$log) {
        $scope.count =0;
        $scope.fetch = function() {
            $scope.count++;
            var defer = $q.defer();
            $timeout(function () {
                defer.resolve();
            },3000);
            return defer.promise;
        };
    });

