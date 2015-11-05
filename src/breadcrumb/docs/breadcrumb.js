angular.module('fish.demo')
    .config(function($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            prefixStateName: 'home',
            template: 'bootstrap2'
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                fsBreadcrumb: {
                    label: 'Home'
                }
            })
            .state('sample', {
                url: '/sample',
                templateUrl: 'views/sample.html',
                fsBreadcrumb: {
                    label: 'Sample'
                }
            })
            .state('booking', {
                url: '/booking',
                templateUrl: 'views/booking_list.html',
                controller: 'BookingListCtrl',
                fsBreadcrumb: {
                    label: 'Reservations',
                    parent: 'sample'
                }
            })
            .state('booking.day', {
                url: '/:year-:month-:day',
                templateUrl: 'views/booking_day.html',
                controller: 'BookingDayCtrl',
                onExit: function($rootScope) {
                    $rootScope.reservationDate = undefined;
                },
                fsBreadcrumb: {
                    label: 'Reservations for {{reservationDate | date:\'mediumDate\'}}'
                }
            })
            .state('booking.day.detail', {
                url: '/{reservationId}',
                onEnter: function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: "views/booking_detail.html",
                        controller: 'BookingDetailCtrl'
                    }).result.then(function(result) {
                            return $state.go("^");
                        }, function(result) {
                            return $state.go("^");
                        });
                },
                fsBreadcrumb: {
                    skip: true
                }
            })
            .state('room', {
                url: '/room',
                templateUrl: 'views/room_list.html',
                controller: 'RoomListCtrl',
                fsBreadcrumb: {
                    label: 'Rooms',
                    parent: 'sample'
                }
            })
            .state('room.new', {
                url: '/new',
                views: {
                    "@" : {
                        templateUrl: 'views/room_form.html',
                        controller: 'RoomDetailCtrl'
                    }
                },
                fsBreadcrumb: {
                    label: 'New room'
                }
            })
            .state('room.detail', {
                url: '/{roomId}?from',
                views: {
                    "@" : {
                        templateUrl: 'views/room_detail.html',
                        controller: 'RoomDetailCtrl'
                    }
                },
                fsBreadcrumb: {
                    label: 'Room {{room.roomNumber}}',
                    parent: function ($scope) {
                        return $scope.from || 'room';
                    }
                }
            })
            .state('room.detail.edit', {
                url: '/edit',
                views: {
                    "@" : {
                        templateUrl: 'views/room_form.html',
                        controller: 'RoomDetailCtrl'
                    }
                },
                fsBreadcrumb: {
                    label: 'Editing'
                }
            });

        $urlRouterProvider.otherwise('/home');

    })

    .value('rooms', [
        {roomId: 1, roomNumber: 101, type: 'Double'},
        {roomId: 2, roomNumber: 102, type: 'Double'},
        {roomId: 3, roomNumber: 103, type: 'Single'},
        {roomId: 4, roomNumber: 104, type: 'Double'}
    ])
    .factory('reservations', function(dateUtils) {
        return [
            {reservationId: 1, guestName: 'Robert Smith', roomId: '2', from: dateUtils.addDays(-1), nights: 3},
            {reservationId: 2, guestName: 'John Doe', roomId: '3', from: dateUtils.addDays(-8), nights: 5},
            {reservationId: 3, guestName: 'William Gordon', roomId: '1', from: dateUtils.addDays(3), nights: 6},
            {reservationId: 4, guestName: 'Michael Robinson', roomId: '2', from: dateUtils.addDays(6), nights: 2},
            {reservationId: 5, guestName: 'Tracy Marschall', roomId: '3', from: dateUtils.addDays(12), nights: 1}
        ];
    })
    .factory('dateUtils', function() {
        return {
            addDays: function(days, date) {
                if(!date) {
                    var todayTime = new Date();
                    todayTime.setHours(0,0,0,0);
                    date = new Date(todayTime);
                }

                var newDate = new Date(date);
                newDate.setDate(date.getDate() + days);
                return newDate;
            }
        }
    })
    .controller('BreadcrumbDemoCtrl', function ($scope,$state) {
        $scope.isActive = function(stateName) {
            return $state.includes(stateName);
        }
    })
    .controller('BookingDayCtrl', function($scope, $rootScope, $state, $stateParams, rooms) {
        $rootScope.reservationDate = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day);

        if(!$scope.between($rootScope.reservationDate).length) {
            $state.go('^');
        }

        $scope.getRoom = function(id) {
            return rooms[0];
        }
    })
    .controller('BookingDetailCtrl', function($scope, $stateParams, dateUtils, reservations, rooms) {
        $scope.addDays = dateUtils.addDays;
        $scope.reservation = reservations[0];
        $scope.room = rooms[0];
        $scope.dismiss = function() {
            $scope.$dismiss();
        };
    })
    .controller('BookingListCtrl', function($scope, $rootScope, $state, dateUtils, reservations) {

        // Some hardcoded data ;
        $scope.reservations = reservations;

        $scope.$watch('reservationDate', function(newValue, oldValue) {
            $scope.dpModel = $rootScope.reservationDate;
        });


        $scope.$watch('dpModel', function(newValue, oldValue) {
            if(newValue && !angular.equals(newValue, oldValue)) {
                $state.go('booking.day', {year: newValue.getFullYear(), month: newValue.getMonth() + 1, day: newValue.getDate()});
            }
        });

        $scope.between = function(date) {
            return $scope.reservations[0];
        };

    })
    .controller('RoomDetailCtrl', function($scope, $state, $stateParams, rooms) {
        $scope.rooms = rooms;
        if($stateParams.from) {
            $scope.from = $stateParams.from.split('|')[0];
            $scope.reservationDate = new Date(parseInt($stateParams.from.split('|')[1]));
        }

        if($stateParams.roomId) {
            $scope.room = rooms[0];
            if($scope.room) {
                $scope.model = angular.copy($scope.room);
            } else {
                $state.go('^');
            }
        }

        $scope.save = function() {
            if($scope.model.roomId) {
                angular.extend($scope.room, $scope.model);
            } else {
            }
            $state.go('^');
        }

    })
    .controller('RoomListCtrl', function($scope, rooms) {
        $scope.rooms = rooms;
    });

