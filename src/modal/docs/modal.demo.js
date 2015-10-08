'use strict';

angular.module('fish.demo')
    .value("AnimationValues", [{
        "name": "fs-collapse"
    }, {
        "name": "fs-fade"
    }, {
        "name": "fs-fade-left"
    }, {
        "name": "fs-fade-right"
    }, {
        "name": "fs-fade-up"
    }, {
        "name": "fs-fade-down"
    }, {
        "name": "fs-fade-left-big"
    }, {
        "name": "fs-fade-right-big"
    }, {
        "name": "fs-fade-up-big"
    }, {
        "name": "fs-fade-down-big"
    }, {
        "name": "fs-bounce"
    }, {
        "name": "fs-bounce-left"
    }, {
        "name": "fs-bounce-right"
    }, {
        "name": "fs-bounce-up"
    }, {
        "name": "fs-bounce-down"
    }, {
        "name": "fs-flip-x"
    }, {
        "name": "fs-flip-y"
    }, {
        "name": "fs-light-speed"
    }, {
        "name": "fs-rotate"
    }, {
        "name": "fs-rotate-down-left"
    }, {
        "name": "fs-rotate-down-right"
    }, {
        "name": "fs-rotate-up-left"
    }, {
        "name": "fs-rotate-up-right"
    }, {
        "name": "fs-slide-up"
    }, {
        "name": "fs-slide-down"
    }, {
        "name": "fs-slide-left"
    }, {
        "name": "fs-slide-right"
    }, {
        "name": "fs-zoom"
    }, {
        "name": "fs-zoom-down"
    }, {
        "name": "fs-zoom-left"
    }, {
        "name": "fs-zoom-right"
    }, {
        "name": "fs-zoom-up"
    }, {
        "name": "fs-roll"
    }]
)
    .config(function ($modalProvider) {
        angular.extend($modalProvider.defaults, {
            html: true
        });
    })

    .controller('ModalDemoCtrl', function ($scope, $modal, AnimationValues) {
        $scope.animation = 'fs-fade';
        $scope.animations = AnimationValues;
        $scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};

        // Controller usage example
        //
        function MyModalController($scope) {
            $scope.title = 'Some Title';
            $scope.content = 'Hello Modal<br />This is a multiline message from a controller!';
        }

        MyModalController.$inject = ['$scope'];
        var myModal;
        $scope.showModal = function () {
            myModal = $modal({
                controller: MyModalController,
                templateUrl: 'modal.demo.tpl.html',
                show: false,
                animation: $scope.animation
            });
            myModal.$promise.then(myModal.show);
        };
        $scope.hideModal = function () {
            myModal.$promise.then(myModal.hide);
        };

    });