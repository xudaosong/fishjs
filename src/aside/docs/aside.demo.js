'use strict';

angular.module('fish.demo')

    .config(function($asideProvider) {
        angular.extend($asideProvider.defaults, {
            container: 'body',
            html: true
        });
    })

    .controller('AsideDemoCtrl', function($scope) {
        $scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};
    });