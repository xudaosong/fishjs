'use strict';

angular.module('fish.validation', [])
    .factory('$validation', function () {
        return {
            email: function (value) {
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value)
            },
            // 身份证校验
            idcard: function (value) {
                var arrVerifyCode = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
                var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                if (value.length != 15 && value.length != 18) {
                    return false;
                }

                var Ai = value.length == 18 ? value.substring(0, 17) : value.slice(0, 6) + "19" + value.slice(6, 16);
                if (!/^\d+$/.test(Ai)) {
                    return false;
                }

                var yyyy = Ai.slice(6, 10),
                    mm = Ai.slice(10, 12) - 1,
                    dd = Ai.slice(12, 14);
                var d = new Date(yyyy, mm, dd),
                    now = new Date();
                var year = d.getFullYear(),
                    mon = d.getMonth(),
                    day = d.getDate();
                if (year != yyyy || mon != mm || day != dd || d > now || year < 1800) {
                    return false;
                }
                for (var i = 0, ret = 0; i < 17; i++) {
                    ret += Ai.charAt(i) * Wi[i];
                }
                Ai += arrVerifyCode[ret %= 11];
                return value.length == 18 && value != Ai ? false : true;
            },
            // 真实姓名校，只能输入中英文
            realname: function (value) {
                var ln = value.length;
                for (var i = 0; i < ln; i++) {
                    // 中文、英文
                    if (!/[\u4e00-\u9fa5]|[a-z]|[A-Z]/.test(value.charAt(i))) {
                        return false;
                    }
                }
                return true;
            }
        };
    })
    .directive('fsMatchValidation', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                ngModel.$validators.fsMatchValidation = function (value) {
                    return ngModel.$isEmpty(value) || value == scope.$eval(attrs.fsMatchValidation);
                };
                scope.$watch(attrs.fsMatchValidation, function () {
                    ngModel.$validate();
                });
            }
        }
    })
    .directive('fsEmailValidation', function ($validation) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (cope, element, attrs, ngModel) {
                if (!ngModel) return;
                ngModel.$validators.fsEmailValidation = function (value) {
                    return ngModel.$isEmpty(value) || $validation.email(value);
                };
            }
        }
    })
    .directive('fsRealnameValidation', function ($validation) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (cope, element, attrs, ngModel) {
                if (!ngModel) return;
                ngModel.$validators.fsRealnameValidation = function (value) {
                    return ngModel.$isEmpty(value) || $validation.realname(value);
                };
            }
        }
    })
    .directive('fsMobileValidation', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (cope, element, attrs, ngModel) {
                if (!ngModel) return;
                ngModel.$validators.fsMobileValidation = function (value) {
                    return ngModel.$isEmpty(value) || /(^0?[1][3-9][0-9]{9}$)/.test(value);
                };
            }
        }
    })
    .directive('fsIdcardValidation', function ($validation) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (cope, element, attrs, ngModel) {
                if (!ngModel) return;
                ngModel.$validators.fsIdcardValidation = function (value) {
                    return ngModel.$isEmpty(value) || $validation.idcard(value);
                };
            }
        }
    });