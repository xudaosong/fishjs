//http://stackoverflow.com/questions/23386504/run-a-custom-function-on-the-click-of-the-image-insert-button-textangular
angular.module('fish.texteditor', ['textAngular', 'fish.modal', 'fish.fileupload'])
    .config(function ($provide) {
        $provide.decorator('taOptions', function (taRegisterTool, $delegate, $modal, taToolFunctions) {
            taRegisterTool('colourRed', {
                iconclass: "fa fa-square red",
                action: function () {
                    this.$editor().wrapSelection('forecolor', 'red');
                }
            });
            // add the button to the default toolbar definition
            $delegate.toolbar[1].push('colourRed');


            taRegisterTool('fsInsertImage', {
                iconclass: "fa fa-picture-o",
                tooltiptext: '插入图片',
                action: function ($deferred) {
                    var textAngular = this;
                    var savedSelection = rangy.saveSelection();
                    var modalInstance = $modal({
                        templateUrl: 'texteditor/insertImage.tpl.html',
                        show: true,
                        title: '插入图片',
                        animation: 'fs-zoom',
                        controller: function ($scope, Upload, $timeout) {
                            $scope.data = {
                                imageForm: undefined,
                                imageUrl: 'http://',
                                imageFiles: []
                            };
                            $scope.uploadFiles = function (files) {
                                $scope.data.imageFiles = files;
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
                            };
                            $scope.submit = function () {
                                if ($scope.data.imageForm.$valid) {
                                    rangy.restoreSelection(savedSelection);
                                    textAngular.$editor().wrapSelection('insertImage', $scope.data.imageUrl);
                                }
                                angular.forEach($scope.data.imageFiles, function (file) {
                                    rangy.restoreSelection(savedSelection);
                                    textAngular.$editor().wrapSelection('insertImage', file.blobUrl);
                                });

                                $deferred.resolve();
                                modalInstance.hide();
                            };
                        }
                    });
                    return false;
                },
                onElementSelect: {
                    element: 'img',
                    action: taToolFunctions.imgOnSelectAction
                }
            });
            // add the button to the default toolbar definition
            $delegate.toolbar[3].push('fsInsertImage');

            return $delegate;
        });
    });
    /*.directive("fsMathjaxBind", function () {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                $scope.$watch($attrs.fsMathjaxBind, function (value) {
                    var el = angular.element('<div>');
                    var mathExpress = el.html(value).find(".fs-mathjax");
                    angular.forEach(mathExpress,function (item) {
                        var itemEl = angular.element(item);
                        var express = itemEl.text();
                        var $script = angular.element("<script type='math/asciimath'>")
                            .html(express == undefined ? "" : express);
                        itemEl.replaceWith($script)
                    });
                    //var $script = angular.element("<script type='math/asciimath'>")
                    //    .html(value == undefined ? "" : value);
                    //
                    $element.html("");
                    $element.append(el);
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                });
            }]
        };
    });*/