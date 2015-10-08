'use strict';
angular.module('fish.demo')
    .value('Schools',[{"name": "福建广播电视中等专业学校", "code": "fj"},
        {"name": "陕西广播电视大学成人教育学院", "code": "sx"},
        {"name": "陕西广播电视中等专业学校", "code": "sx"},
        {"name": "西安广播电视中等专业学校", "code": "xa"}])
    .controller('FormCtrl', function ($scope, Schools) {

        $scope.natives = [
            '中华人民共和国',
            '美国',
            '日本',
            '加拿大'
        ];
        $scope.schools = Schools;
        $scope.qqRegex = /^[1-9][0-9]{4,9}$/;
        $scope.fakeUsernames = ['angular', 'username', 'user', 'john', 'eric', 'noob', 'ng'];
        $scope.fakeEmails = [
            'email@email.com',
            'email@gmail.com',
            'email@website.com',
            'jon@gmail.com',
            'fake@gmail.com',
            'fake@email.com'
        ];
        $scope.submitted = false;
        $scope.submit = function () {
            console.log($scope.my_form);
            $scope.submitted = true;
        };
        $scope.interacted = function (field) {
            return $scope.submitted || field.$dirty;
        };
    })
    .factory('fakeQueryService', function ($timeout, $q) {
        var FAKE_TIMEOUT = 2000;
        return function (username, fakeInvalidData) {
            var defer = $q.defer();
            $timeout(function () {
                fakeInvalidData.indexOf(username) == -1
                    ? defer.resolve()
                    : defer.reject();
            }, FAKE_TIMEOUT);
            return defer.promise;
        }
    })
    .directive('fakeRemoteRecordValidator', ['$timeout', 'fakeQueryService', function ($timeout, fakeQueryService) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var seedData = scope.$eval(attrs.fakeRemoteRecordValidator);
                ngModel.$parsers.push(function (value) {
                    valid(false);
                    loading(true);
                    fakeQueryService(value, seedData).then(
                        function () {
                            valid(true);
                            loading(false);
                        },
                        function () {
                            valid(false);
                            loading(false);
                        }
                    );
                    return value;
                });

                function valid(bool) {
                    ngModel.$setValidity('record-taken', bool);
                }

                function loading(bool) {
                    ngModel.$setValidity('record-loading', !bool);
                }
            }
        }
    }])
    .directive('passwordCharactersValidator', function () {
        var PASSWORD_FORMATS = [
            /[^\w\s]+/, //special characters
            /[A-Z]+/, //uppercase letters
            /\w+/, //other letters
            /\d+/ //numbers
        ];

        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    var status = true;
                    angular.forEach(PASSWORD_FORMATS, function (regex) {
                        status = status && regex.test(value);
                    });
                    ngModel.$setValidity('password-characters', status);
                    return value;
                });
            }
        }
    });