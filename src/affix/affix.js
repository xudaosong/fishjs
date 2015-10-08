// 2015-9-2 from: https://github.com/bigspotteddog/ScrollToFixed/tree/1.0.6
'use strict';

angular.module('fish.affix', ['fish.helpers'])
    .provider('$affix', function () {
        var defaults = this.defaults = {
            marginTop: 0,
            limit: false,
            bottom: -1,
            zIndex: 1000,
            baseClassName: 'fs-affix'
        };
        this.$get = function ($window, debounce, dimensions) {
            //var bodyEl = angular.element($window.document.body);
            var windowEl = angular.element($window);

            function AffixFactory(element, config) {
                var $affix = {};
                // 通用的变量
                var options = angular.extend({}, defaults, config);

                // 私有的变量
                var isReset = false, offsetTop = 0, offsetLeft = 0, originalOffsetLeft = -1, lastOffsetLeft = -1, spacer = null;
                var position, originalPosition, originalFloat, originalOffsetTop, originalZIndex, spacerClass, className;

                element.data('affix', this);

                $affix.isAffix = function () {
                    return !!element.data('affix');
                };
                $affix.resetScroll = function () {
                    // Set the element to it original positioning.
                    //element.triggerHandler('preUnfixed');
                    this.setUnfixed();
                    //element.triggerHandler('unfixed');

                    // Reset the last offset used to determine if the page has moved
                    // horizontally.
                    lastOffsetLeft = -1;
                    var offset = dimensions.offset(element[0]);
                    // Capture the offset top of the target element.
                    offsetTop = offset.top;

                    // Capture the offset left of the target element.
                    offsetLeft = offset.left;

                    // If the offsets option is on, alter the left offset.
                    if (options.offsets) {
                        offsetLeft += (offset.left - dimensions.position(element[0]).left);
                    }

                    if (originalOffsetLeft == -1) {
                        originalOffsetLeft = offsetLeft;
                    }

                    position = element.css('position');

                    // Set that this has been called at least once.
                    isReset = true;

                    if (options.bottom != -1) {
                        //element.triggerHandler('preFixed');
                        this.setFixed();
                        //element.triggerHandler('fixed');
                    }
                };
                $affix.getLimit = function () {
                    var limit = options.limit;
                    if (!limit) return 0;
                    //if (!this._elementHeight)
                    //    this._elementHeight = dimensions.height(element[0], true);
                    var offset = dimensions.offset(angular.element(limit)[0]);
                    return offset.height + offset.top - dimensions.height(element[0], true);
                };
                $affix.isFixed = function () {
                    return position === 'fixed';
                };
                $affix.isAbsolute = function () {
                    return position === 'absolute';
                };
                $affix.isUnfixed = function () {
                    return !(this.isFixed() || this.isAbsolute());
                };
                $affix.setFixed = function () {
                    if (!this.isFixed()) {
                        var offset = dimensions.offset(element[0]);
                        spacer.css({
                            'display': element.css('display'),
                            'width': offset.width + 'px',
                            'height': offset.height + 'px',
                            'float': element.css('float')
                        });
                        var cssOptions = {
                            'z-index': options.zIndex,
                            'position': 'fixed',
                            'top': options.bottom == -1 ? this.getMarginTop() + 'px' : '',
                            'bottom': options.bottom == -1 ? '' : options.bottom + 'px',
                            'margin-left': '0px'
                        }
                        if (!options.dontSetWidth) {
                            cssOptions['width'] = element.css('width');
                        }
                        element.css(cssOptions).addClass(options.baseClassName);
                        if (options.className) {
                            element.addClass(options.className);
                        }
                        position = 'fixed';
                    }
                };
                $affix.setAbsolute = function () {
                    var top = this.getLimit();
                    var left = offsetLeft;
                    if (options.removeOffsets) {
                        left = '';
                        top = top - offsetTop;
                    }

                    var cssOptions = {
                        'position': 'absolute',
                        'top': top + 'px',
                        'left': left + 'px',
                        'margin-left': '0px',
                        'bottom': ''
                    };
                    if (!options.dontSetWidth) {
                        cssOptions['width'] = element.css('width');
                    }

                    element.css(cssOptions);

                    position = 'absolute';
                };
                $affix.setUnfixed = function () {
                    if (!this.isUnfixed()) {
                        lastOffsetLeft = -1;
                        spacer.css('display', 'none');
                        element.css({
                            'z-index': originalZIndex,
                            'width': '',
                            'position': originalPosition,
                            'left': '',
                            'top': originalOffsetTop,
                            'margin-left': ''
                        });
                        element.removeClass(options.baseClassName);
                        if (options.className) {
                            element.removeClass(options.className);
                        }
                        position = null;
                    }
                };
                $affix.setLeft = function (x) {
                    // Only if the scroll is not what it was last time we did this.
                    if (x != lastOffsetLeft) {
                        // Move the target element horizontally relative to its original
                        // horizontal position.
                        element.css('left', offsetLeft - x);

                        // Hold the last horizontal position set.
                        lastOffsetLeft = x;
                    }
                };
                $affix.getMarginTop = function () {
                    var marginTop = options.marginTop;
                    if (!marginTop) return 0;

                    if (typeof(marginTop) === 'function') {
                        return marginTop.apply(element[0]);
                    }
                    return marginTop;
                };
                $affix.checkScroll = function () {
                    if (!$affix.isAffix(element)) return;
                    var wasReset = isReset;
                    //var wasUnfixed = $affix.isUnfixed();

                    // If resetScroll has not yet been called, call it. This only
                    // happens once.
                    if (!isReset) {
                        $affix.resetScroll();
                    } else if ($affix.isUnfixed()) {
                        // if the offset has changed since the last scroll,
                        // we need to get it again.

                        var offset = dimensions.offset(element[0]);
                        // Capture the offset top of the target element.
                        offsetTop = offset.top;

                        // Capture the offset left of the target element.
                        offsetLeft = offset.left;
                    }

                    // Grab the current horizontal scroll position.
                    var x = windowEl.scrollLeft();

                    // Grab the current vertical scroll position.
                    var y = windowEl.scrollTop();

                    // Get the limit, if there is one.
                    var limit = $affix.getLimit();

                    // If the vertical scroll position, plus the optional margin, would
                    // put the target element at the specified limit, set the target
                    // element to absolute.
                    if (options.minWidth && windowEl.width() < options.minWidth) {
                        if (!$affix.isUnfixed() || !wasReset) {
                            $affix.postPosition();
                            //element.triggerHandler('preUnfixed');
                            $affix.setUnfixed();
                            //element.triggerHandler('unfixed');
                        }
                    } else if (options.maxWidth && windowEl.width() > options.maxWidth) {
                        if (!$affix.isUnfixed() || !wasReset) {
                            $affix.postPosition();
                            //element.triggerHandler('preUnfixed');
                            $affix.setUnfixed();
                            //element.triggerHandler('unfixed');
                        }
                    } else if (options.bottom == -1) {
                        // If the vertical scroll position, plus the optional margin, would
                        // put the target element at the specified limit, set the target
                        // element to absolute.
                        if (limit > 0 && y >= limit - $affix.getMarginTop()) {
                            if (!$affix.isAbsolute() || !wasReset) {
                                $affix.postPosition();
                                //element.triggerHandler('preAbsolute');
                                $affix.setAbsolute();
                                //element.triggerHandler('unfixed');
                            }
                            // If the vertical scroll position, plus the optional margin, would
                            // put the target element above the top of the page, set the targ
                            // element to fixed.
                        } else if (y >= offsetTop - $affix.getMarginTop()) {
                            if (!$affix.isFixed() || !wasReset) {
                                $affix.postPosition();
                                //element.triggerHandler('preFixed');

                                // Set the target element to fixed.
                                $affix.setFixed();

                                // Reset the last offset left because we just went fixed.
                                lastOffsetLeft = -1;

                                //element.triggerHandler('fixed');
                            }
                            // If the page has been scrolled horizontally as well, move the
                            // target element accordingly.
                            $affix.setLeft(x);
                        } else {
                            // Set the target element to unfixed, placing it where it was
                            // before.
                            if (!$affix.isUnfixed() || !wasReset) {
                                $affix.postPosition();
                                //element.triggerHandler('preUnfixed');
                                $affix.setUnfixed();
                                //element.triggerHandler('unfixed');
                            }
                        }
                    } else {
                        if (limit > 0) {
                            if (y + windowEl.height() - dimensions.height(element[0], true) >= limit - ($affix.getMarginTop() || -$affix.getBottom())) {
                                if ($affix.isFixed()) {
                                    $affix.postPosition();
                                    //element.triggerHandler('preUnfixed');

                                    if (originalPosition === 'absolute') {
                                        $affix.setAbsolute();
                                    } else {
                                        $affix.setUnfixed();
                                    }

                                    //element.triggerHandler('unfixed');
                                }
                            } else {
                                if (!$affix.isFixed()) {
                                    $affix.postPosition();
                                    //element.triggerHandler('preFixed');
                                    $affix.setFixed();
                                }
                                $affix.setLeft(x);
                                //element.triggerHandler('fixed');
                            }
                        } else {
                            $affix.setLeft(x);
                        }
                    }
                };
                $affix.getBottom = function () {
                    if (!options.bottom) return 0;
                    return options.bottom;
                };
                $affix.postPosition = function () {
                    var position = element.css('position');

                    if (position == 'absolute') {
                        //element.triggerHandler('postAbsolute');
                    } else if (position == 'fixed') {
                        //element.triggerHandler('postFixed');
                    } else {
                        //element.triggerHandler('postUnfixed');
                    }
                };
                $affix.windowResize = function () {
                    if (element.is(':visible')) {
                        isReset = false;
                        $affix.checkScroll();
                    } else {
                        // Ensure the spacer is hidden
                        $affix.setUnfixed();
                    }
                };
                $affix.windowScroll = function () {
                    // window.requestAnimationFrame()这个方法是用来在页面重绘之前，通知浏览器调用一个指定的函数，以满足开发者操作动画的需求。
                    // 这个方法接受一个函数为参，该函数会在重绘前调用。
                    (!!$window.requestAnimationFrame) ? $window.requestAnimationFrame($affix.checkScroll) : $affix.checkScroll();
                };
                $affix.init = function () {
                    originalZIndex = element.css('z-index')
                    element.css('z-index', options.zIndex);
                    spacer = angular.element('<div />');
                    position = element.css('position');
                    originalPosition = element.css('position');
                    originalFloat = element.css('float');
                    originalOffsetTop = element.css('top');
                    if (this.isUnfixed()) element.after(spacer);

                    windowEl.on('resize', this.windowResize);
                    windowEl.on('scroll', this.checkScroll);

                    //if ('ontouchmove' in $window) {
                    //    windowEl.on('touchmove', checkScroll);
                    //}
                    //if (options.preFixed) {
                    //    element.on('preFixed', options.preFixed);
                    //}
                    //if (options.postFixed) {
                    //    element.on('postFixed', options.postFixed);
                    //}
                    //if (options.preUnfixed) {
                    //    element.on('preUnfixed', options.preUnfixed);
                    //}
                    //if (options.postUnfixed) {
                    //    element.on('postUnfixed', options.postUnfixed);
                    //}
                    //if (options.preAbsolute) {
                    //    element.on('preAbsolute', options.preAbsolute);
                    //}
                    //if (options.postAbsolute) {
                    //    element.on('postAbsolute', options.postAbsolute);
                    //}
                    //if (options.fixed) {
                    //    element.on('fixed', options.fixed);
                    //}
                    //if (options.unfixed) {
                    //    element.on('unfixed', options.unfixed);
                    //}

                    if (options.spacerClass) {
                        spacer.addClass(options.spacerClass);
                    }

                    element.on('resize', function () {
                        spacer.height(element.height());
                    });

                    element.on('scroll', function () {
                        //element.triggerHandler('preUnfixed');
                        this.setUnfixed();
                        //element.triggerHandler('unfixed');
                        this.checkScroll();
                    });

                    //element.on('detach', function (ev) {
                    //    preventDefault(ev);
                    //
                    //    element.triggerHandler('preUnfixed');
                    //    this.setUnfixed();
                    //    //element.triggerHandler('unfixed');
                    //
                    //    windowEl.off('resize', this.windowResize);
                    //    windowEl.off('scroll', this.windowScroll);
                    //
                    //    element.off('');
                    //
                    //    //remove spacer from dom
                    //    spacer.remove();
                    //
                    //    element.removeData('affix');
                    //});

                    this.windowResize();
                };
                $affix.destroy = function () {
                    //element.triggerHandler('preUnfixed');
                    this.setUnfixed();
                    //element.triggerHandler('unfixed');

                    windowEl.off('resize', this.windowResize);
                    windowEl.off('scroll', this.windowScroll);

                    //element.off('');

                    //remove spacer from dom
                    spacer.remove();

                    element.removeData('affix');
                };
                // 私有方法
                //var preventDefault = function (e) {
                //    e = e || $window.event;
                //    if (e.preventDefault) {
                //        e.preventDefault();
                //    }
                //    e.returnValue = false;
                //};

                $affix.init();
                return $affix;
            }

            return AffixFactory;
        };
    })
    .directive('fsAffix', function ($affix) {
        return {
            restrict: 'EAC', // this directive can only be used as an attribute.
            link: function linkFn(scope, element, attr) {
                var options = {scope: scope};
                angular.forEach(['marginTop', 'limit', 'bottom', 'zIndex', 'spacerClass', 'offsets ', 'minWidth', 'maxWidth', 'dontSetWidth', 'removeOffsets'], function (key) {
                    if (angular.isDefined(attr[key])) {
                        var option = attr[key];
                        if (/true/i.test(option)) option = true;
                        if (/false/i.test(option)) option = false;
                        options[key] = option;
                    }
                });
                var affix = $affix(element, options);
                scope.$on('$destroy', function () {
                    affix && affix.destroy();
                    options = null;
                    affix = null;
                });
            }
        };
    }
);
