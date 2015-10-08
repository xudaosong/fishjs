'use strict';

angular.module('fish.demo')
    .controller('FileUploadDemoCtrl', function ($scope, Upload, $timeout) {
        $scope.$watch('files', function () {
            $scope.uploadFiles($scope.files);
        });
        $scope.uploadFiles = function (files) {
            angular.forEach(files, function (file) {
                if (!file.$error) {
                    file.upload = Upload.upload({
                        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                        file: file
                    });
                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                        });
                    }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    });
                    file.upload.progress(function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            });
            //if (files && files.length) {
            //    for (var i = 0; i < files.length; i++) {
            //        var file = files[i];
            //    }
            //}
        };
        /*$scope.uploadFiles = function (file) {
            $scope.f = file;
            if (file && !file.$error) {
                file.upload = Upload.upload({
                    url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                    file: file
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                });

                file.upload.progress(function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
                });
            }
        }*/
    });
