(function () {
    "use strict";

    angular.module("fish.demo").controller("TableDemoCtrl", TableDemoCtrl);
    TableDemoCtrl.$inject = ["FsTableParams"];

    function TableDemoCtrl(FsTableParams) {
        var vm = this;
        var data =  [{name: "Moroni", age: 50, money: -10, country: 'China'},
            {name: "Tiancum", age: 43,money: 120, country: 'USA'},
            {name: "Jacob", age: 27, money: 5.5, country: 'Japan'},
            {name: "Nephi", age: 29,money: -54, country: 'China'},
            {name: "Enos", age: 34,money: 110, country: 'China'},
            {name: "Tiancum", age: 43, money: 1000, country: 'China'},
            {name: "Jacob", age: 27,money: -201, country: 'USA'},
            {name: "Tiancum", age: 43, money: 52.1, country: 'USA'},
            {name: "Jacob", age: 27, money: 110, country: 'China'},
            {name: "Nephi", age: 29, money: 100, country: 'USA'},
            {name: "Enos", age: 34, money: -52.5, country: 'Japan'},
            {name: "Nephi", age: 29, money: -55, country: 'USA'},
            {name: "Enos", age: 34, money: 551, country: 'USA'},
            {name: "Tiancum", age: 43, money: -1410, country: 'Japan'},
            {name: "Jacob", age: 27, money: 410, country: 'Japan'},
            {name: "Nephi", age: 29, money: 100, country: 'China'},
            {name: "Enos", age: 34, money: -100, country: 'Japan'}];
        vm.cols = [
            {field: "name", title: "姓名", sortable: "name", show: true},
            {field: "age", title: "年龄", sortable: "age", show: true},
            {field: "money", title: "钱钱", sortable: "money", show: true},
            {field: "country", title: "国籍", sortable: "country", show: false}
        ];
        vm.tableParams = new FsTableParams({},{dataset: data});
        vm.groupCols = [
            {field: "name", title: "姓名", sortable: "name", show: true, groupable: "name"},
            {field: "age", title: "年龄", sortable: "age", show: true, groupable: "age"},
            {field: "money", title: "钱钱", sortable: "money", show: true},
            {field: "country", title: "国籍", sortable: "country", show: false, groupable: "country"}
        ];
        vm.groupTableParams = new FsTableParams( {
            group: {
                country: 'desc'
            }
        },{
            dataset: data
        });
    }
})();