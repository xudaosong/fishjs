'use strict';

angular.module('fish.tab', [])

  .provider('$tab', function() {

    var defaults = this.defaults = {
      animation: 'fs-fade',
      template: 'tab/tab.tpl.html',
      navClass: 'nav-tabs',
      activeClass: 'active'
    };

    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;

      // Attributes options
      self.$options = angular.copy(defaults);
      angular.forEach(['animation', 'navClass', 'activeClass'], function(key) {
        if(angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });

      // Publish options on scope
      $scope.$navClass = self.$options.navClass;
      $scope.$activeClass = self.$options.activeClass;

      self.$panes = $scope.$panes = [];

      // Please use $activePaneChangeListeners if you use `fsActivePane`
      // Because we removed `ngModel` as default, we rename viewChangeListeners to
      // activePaneChangeListeners to make more sense.
      self.$activePaneChangeListeners = self.$viewChangeListeners = [];

      self.$push = function(pane) {
        if(angular.isUndefined(self.$panes.$active)) {
          $scope.$setActive(pane.name || 0);
        }
        self.$panes.push(pane);
      };

      self.$remove = function(pane) {
        var index = self.$panes.indexOf(pane);
        var active = self.$panes.$active;
        var activeIndex;
        if(angular.isString(active)) {
          activeIndex = self.$panes.map(function(pane) {
            return pane.name;
          }).indexOf(active);
        } else {
          activeIndex = self.$panes.$active;
        }

        // remove pane from $panes array
        self.$panes.splice(index, 1);

        if (index < activeIndex) {
          // we removed a pane before the active pane, so we need to
          // decrement the active pane index
          activeIndex--;
        }
        else if (index === activeIndex && activeIndex === self.$panes.length) {
          // we remove the active pane and it was the one at the end,
          // so select the previous one
          activeIndex--;
        }
        if(activeIndex >= 0 && activeIndex < self.$panes.length) {
          self.$setActive(self.$panes[activeIndex].name || activeIndex);
        } else {
          self.$setActive();
        }
      };

      self.$setActive = $scope.$setActive = function(value) {
        self.$panes.$active = value;
        self.$activePaneChangeListeners.forEach(function(fn) {
          fn();
        });
      };

      self.$isActive = $scope.$isActive = function($pane, $index) {
        return self.$panes.$active === $pane.name || self.$panes.$active === $index;
      };

    };

    this.$get = function() {
      var $tab = {};
      $tab.defaults = defaults;
      $tab.controller = controller;
      return $tab;
    };

  })

  .directive('fsTabs', function($window, $animate, $tab, $parse) {

    var defaults = $tab.defaults;

    return {
      require: ['?ngModel', 'fsTabs'],
      transclude: true,
      scope: true,
      controller: ['$scope', '$element', '$attrs', $tab.controller],
      templateUrl: function(element, attr) {
        return attr.template || defaults.template;
      },
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var fsTabsCtrl = controllers[1];

        // 'ngModel' does interfere with form validation
        // and status, use `fsActivePane` instead to avoid it
        if(ngModelCtrl) {

          // Update the modelValue following
          fsTabsCtrl.$activePaneChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(fsTabsCtrl.$panes.$active);
          });

          // modelValue -> $formatters -> viewValue
          ngModelCtrl.$formatters.push(function(modelValue) {
            // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
            fsTabsCtrl.$setActive(modelValue);
            return modelValue;
          });

        }

        if (attrs.fsActivePane) {
          // adapted from angularjs ngModelController bindings
          // https://github.com/angular/angular.js/blob/v1.3.1/src%2Fng%2Fdirective%2Finput.js#L1730
          var parsedFsActivePane = $parse(attrs.fsActivePane);

          // Update fsActivePane value with change
          fsTabsCtrl.$activePaneChangeListeners.push(function() {
            parsedFsActivePane.assign(scope, fsTabsCtrl.$panes.$active);
          });

          // watch fsActivePane for value changes
          scope.$watch(attrs.fsActivePane, function(newValue, oldValue) {
            fsTabsCtrl.$setActive(newValue);
          }, true);
        }
      }
    };

  })

  .directive('fsPane', function($window, $animate, $sce) {

    return {
      require: ['^?ngModel', '^fsTabs'],
      scope: true,
      link: function postLink(scope, element, attrs, controllers) {

        var ngModelCtrl = controllers[0];
        var fsTabsCtrl = controllers[1];

        // Add base class
        element.addClass('tab-pane');

        // Observe title attribute for change
        attrs.$observe('title', function(newValue, oldValue) {
          scope.title = $sce.trustAsHtml(newValue);
        });

        // Save tab name into scope
        scope.name = attrs.name;

        // Add animation class
        if(fsTabsCtrl.$options.animation) {
          element.addClass(fsTabsCtrl.$options.animation);
        }

        attrs.$observe('disabled', function(newValue, oldValue) {
          scope.disabled = scope.$eval(newValue);
        });

        // Push pane to parent fsTabs controller
        fsTabsCtrl.$push(scope);

        // remove pane from tab controller when pane is destroyed
        scope.$on('$destroy', function() {
          fsTabsCtrl.$remove(scope);
        });

        function render() {
          var index = fsTabsCtrl.$panes.indexOf(scope);
          $animate[fsTabsCtrl.$isActive(scope, index) ? 'addClass' : 'removeClass'](element, fsTabsCtrl.$options.activeClass);
        }

        fsTabsCtrl.$activePaneChangeListeners.push(function() {
          render();
        });
        render();

      }
    };

  });
