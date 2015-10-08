'use strict';

angular.module('fish.collapse', [])

  .provider('$collapse', function() {

    var defaults = this.defaults = {
      animation: 'fs-collapse',
      disallowToggle: false,
      activeClass: 'in',
      startCollapsed: false,
      allowMultiple: false
    };

    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;

      // Attributes options
      self.$options = angular.copy(defaults);
      angular.forEach(['animation', 'disallowToggle', 'activeClass', 'startCollapsed', 'allowMultiple'], function (key) {
        if(angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });

      // use string regex match boolean attr falsy values, leave truthy values be
      var falseValueRegExp = /^(false|0|)$/i;
      angular.forEach(['disallowToggle', 'startCollapsed', 'allowMultiple'], function(key) {
        if(angular.isDefined($attrs[key]) && falseValueRegExp.test($attrs[key])) {
          self.$options[key] = false;
        }
      });

      self.$toggles = [];
      self.$targets = [];

      self.$viewChangeListeners = [];

      self.$registerToggle = function(element) {
        self.$toggles.push(element);
      };
      self.$registerTarget = function(element) {
        self.$targets.push(element);
      };

      self.$unregisterToggle = function(element) {
        var index = self.$toggles.indexOf(element);
        // remove toggle from $toggles array
        self.$toggles.splice(index, 1);
      };
      self.$unregisterTarget = function(element) {
        var index = self.$targets.indexOf(element);

        // remove element from $targets array
        self.$targets.splice(index, 1);

        if (self.$options.allowMultiple) {
          // remove target index from $active array values
          deactivateItem(element);
        }

        // fix active item indexes
        fixActiveItemIndexes(index);

        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };

      // use array to store all the currently open panels
      self.$targets.$active = !self.$options.startCollapsed ? [0] : [];
      self.$setActive = $scope.$setActive = function(value) {
        if(angular.isArray(value)) {
          self.$targets.$active = value;
        }
        else if(!self.$options.disallowToggle) {
          // toogle element active status
          isActive(value) ? deactivateItem(value) : activateItem(value);
        } else {
          activateItem(value);
        }

        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };

      self.$activeIndexes = function() {
        return self.$options.allowMultiple ? self.$targets.$active :
          self.$targets.$active.length === 1 ? self.$targets.$active[0] : -1;
      };

      function fixActiveItemIndexes(index) {
        // item with index was removed, so we
        // need to adjust other items index values
        var activeIndexes = self.$targets.$active;
        for(var i = 0; i < activeIndexes.length; i++) {
          if (index < activeIndexes[i]) {
            activeIndexes[i] = activeIndexes[i] - 1;
          }

          // the last item is active, so we need to
          // adjust its index
          if (activeIndexes[i] === self.$targets.length) {
            activeIndexes[i] = self.$targets.length - 1;
          }
        }
      }

      function isActive(value) {
        var activeItems = self.$targets.$active;
        return activeItems.indexOf(value) === -1 ? false : true;
      }

      function deactivateItem(value) {
        var index = self.$targets.$active.indexOf(value);
        if (index !== -1) {
          self.$targets.$active.splice(index, 1);
        }
      }

      function activateItem(value) {
        if (!self.$options.allowMultiple) {
          // remove current selected item
          self.$targets.$active.splice(0, 1);
        }

        if (self.$targets.$active.indexOf(value) === -1) {
          self.$targets.$active.push(value);
        }
      }

    };

    this.$get = function() {
      var $collapse = {};
      $collapse.defaults = defaults;
      $collapse.controller = controller;
      return $collapse;
    };

  })

  .directive('fsCollapse', function($window, $animate, $collapse) {

    var defaults = $collapse.defaults;

    return {
      require: ['?ngModel', 'fsCollapse'],
      controller: ['$scope', '$element', '$attrs', $collapse.controller],
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var fsCollapseCtrl = controllers[1];

        if(ngModelCtrl) {

          // Update the modelValue following
          fsCollapseCtrl.$viewChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(fsCollapseCtrl.$activeIndexes());
          });

          // modelValue -> $formatters -> viewValue
          ngModelCtrl.$formatters.push(function(modelValue) {
            // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
            if (angular.isArray(modelValue)) {
              // model value is an array, so just replace
              // the active items directly
              fsCollapseCtrl.$setActive(modelValue);
            }
            else {
              var activeIndexes = fsCollapseCtrl.$activeIndexes();

              if (angular.isArray(activeIndexes)) {
                // we have an array of selected indexes
                if (activeIndexes.indexOf(modelValue * 1) === -1) {
                  // item with modelValue index is not active
                  fsCollapseCtrl.$setActive(modelValue * 1);
                }
              }
              else if (activeIndexes !== modelValue * 1) {
                fsCollapseCtrl.$setActive(modelValue * 1);
              }
            }
            return modelValue;
          });

        }

      }
    };

  })

  .directive('fsCollapseToggle', function() {

    return {
      require: ['^?ngModel', '^fsCollapse'],
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var fsCollapseCtrl = controllers[1];

        // Add base attr
        element.attr('data-toggle', 'collapse');

        // Push pane to parent fsCollapse controller
        fsCollapseCtrl.$registerToggle(element);

        // remove toggle from collapse controller when toggle is destroyed
        scope.$on('$destroy', function() {
          fsCollapseCtrl.$unregisterToggle(element);
        });

        element.on('click', function() {
          var index = attrs.fsCollapseToggle && attrs.fsCollapseToggle !== 'fs-collapse-toggle' ? attrs.fsCollapseToggle : fsCollapseCtrl.$toggles.indexOf(element);
          fsCollapseCtrl.$setActive(index * 1);
          scope.$apply();
        });

      }
    };

  })

  .directive('fsCollapseTarget', function($animate) {

    return {
      require: ['^?ngModel', '^fsCollapse'],
      // scope: true,
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var fsCollapseCtrl = controllers[1];

        // Add base class
        element.addClass('collapse');

        // Add animation class
        if(fsCollapseCtrl.$options.animation) {
          element.addClass(fsCollapseCtrl.$options.animation);
        }

        // Push pane to parent fsCollapse controller
        fsCollapseCtrl.$registerTarget(element);

        // remove pane target from collapse controller when target is destroyed
        scope.$on('$destroy', function() {
          fsCollapseCtrl.$unregisterTarget(element);
        });

        function render() {
          var index = fsCollapseCtrl.$targets.indexOf(element);
          var active = fsCollapseCtrl.$activeIndexes();
          var action = 'removeClass';
          if (angular.isArray(active)) {
            if (active.indexOf(index) !== -1) {
              action = 'addClass';
            }
          }
          else if (index === active) {
            action = 'addClass';
          }

          $animate[action](element, fsCollapseCtrl.$options.activeClass);
        }

        fsCollapseCtrl.$viewChangeListeners.push(function() {
          render();
        });
        render();

      }
    };

  });
