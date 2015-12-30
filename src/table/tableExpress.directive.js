(function () {
    'use strict';

    angular
        .module('fish.table')
        .directive('fsTableExpress', fsTableExpress);

    fsTableExpress.$inject = [];
	
    function fsTableExpress() {
        var directive = {
            link: link,
            scope: {
                tableConvert: '='
            },
            restrict: 'EA',
            templateUrl: function (element, attrs) {
                return attrs['templateUrl'] ? attrs['templateUrl'] : 'table/table.tpl.html';
            }
        };
        return directive;

        function link(scope, element, attrs) {
            var tableConvert = scope.tableConvert;
            scope.tableParams = tableConvert.tableParams;
            scope.cols = tableConvert.cols;
            tableConvert.activate(scope, element);
        }
    }
})();