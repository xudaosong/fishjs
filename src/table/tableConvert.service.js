(function () {
    'use strict';

    angular
        .module('fish.table')
        .factory('FsTableConvert', FsTableConvert);

    FsTableConvert.$inject = ['FsTableParams', 'fsTableEventsChannel'];

    /* @ngInject */
    function FsTableConvert(FsTableParams, fsTableEventsChannel) {
        var defaultConfig = {
        };
        return factory;

        ///////////////////////////

        function factory(config) {
            var vm = this, hasSelected = false, initParams = {};

            var setting = angular.copy(defaultConfig),
                element = null,
                $scope = null;

            if (config.getData) {
                setting.getData = config.getData;
            }
            if (config.data) {
                setting.dataset = config.data;
            }
            if (config.currentPage) {
                initParams.page = config.currentPage;
            }
            if (config.pageSize) {
                initParams.count = config.pageSize;
            }
            vm.cols = convertCol(config.cols);
            vm.tableParams = new FsTableParams(initParams, setting);
            vm.activate = activate;
            vm.setCount = setCount;
            vm.reload = reload;
            return vm;

            //////////////////////////

            function activate(scope, ele) {
                if (hasSelected) {
                    element = ele;
                    $scope = scope;
                    fsTableEventsChannel.onAfterReloadData(initSelector, $scope);
                }
            }

            function setCount(newCount) {
                vm.tableParams.total(newCount);
            }

            function reload() {
                vm.tableParams.reload();
            }

            function initSelector() {
                vm.checkboxes = $scope.checkboxes = {
                    checked: false,
                    items: {}
                };
                $scope.$watch(function () {
                    return vm.checkboxes.checked;
                }, function (value) {
                    angular.forEach($scope.tableParams.data, function (item) {
                        vm.checkboxes.items[item.courseid] = value;
                    });
                });
                $scope.$watch(function () {
                    return vm.checkboxes.items;
                }, function () {
                    if (!element) {
                        return;
                    }
                    var checked = 0, unchecked = 0, total = vm.tableParams.data.length;
                    angular.forEach(vm.tableParams.data, function (item) {
                        checked += (vm.checkboxes.items[item.courseid]) || 0;
                        unchecked += (!vm.checkboxes.items[item.courseid]) || 0;
                    });
                    if ((unchecked === 0) || (checked === 0)) {
                        vm.checkboxes.checked = (checked === total);
                    }
                    angular.element(element[0].getElementsByClassName('select-all')).prop('indeterminate', (checked !== 0 && unchecked !== 0));
                }, true);
            }

            function convertCol(cols) {
                var newCols = [];
                angular.forEach(cols, function (row) {
                    var newRow = {};
                    angular.forEach(row, function (value, key) {
                        switch (key) {
                            case 'name':
                                newRow['field'] = value;
                                if (value === 'selector') {
                                    newRow['headerTemplateURL'] = 'table/table-checkbox.tpl.html';
                                    hasSelected = true;
                                }
                                break;
                            case 'css':
                                newRow['class'] = value;
                                break;
                            case 'formatter':
                                newRow['getValue'] = formatter;
                                newRow['valueFormatter'] = value;
                                break;
                            default:
                                newRow[key] = value;
                                break;
                        }
                    });
                    newRow['originalRow'] = row;
                    newCols.push(newRow);
                });
                return newCols;
            }

            function formatter($scope, row) {
                return $scope.$eval('row.' + this.field + ' | ' + this.valueFormatter, {
                    row: row
                });
            }
        }
    }
})();