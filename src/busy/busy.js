angular.module('fish.busy',[])
    .directive('fsBusy', function ($parse) {
        return {
            restrict: 'A',
            compile: function (element, attr) {
                var fn = $parse(attr["fsBusy"], null, true),
                    css = attr["busyClass"] || 'fs-busy',
                    prompt = attr["busyText"];
                return function eventHandler(scope, element) {
                    element.on("click", function (event) {
                        if (element.hasClass(css)) {
                            return false;
                        }
                        var orgText;
                        if (!angular.isUndefined(prompt)) {
                            orgText = element.text();
                            element.text(prompt);
                        }
                        element.addClass(css);
                        var callback = function () {
                            fn(scope, {$event: event}).finally(function(){
                                element.removeClass(css);
                                if(!angular.isUndefined(prompt))
                                    element.text(orgText);
                            });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        };
    });