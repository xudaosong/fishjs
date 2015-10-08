angular.module('fish.demo').controller('CarouselDemoCtrl', function ($scope) {
    $scope.items = [1, 2, 3, 4, 5, 6, 7];
    $scope.add = function () {
        $scope.items.push($scope.items.length + 1);
    }
});