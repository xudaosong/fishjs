/*
 * fishjs
 * 
 * Version: 0.0.3 - 2015-12-17
 * License: MIT
 */
angular.module("fish", ["fish.tpls", "fish.helpers","fish.affix","fish.modal","fish.aside","fish.breadcrumb","fish.busy","fish.carousel","fish.collapse","fish.tooltip","fish.datepicker","fish.dropdown","fish.fileupload","fish.pagination","fish.popover","fish.scrollspy","fish.select","fish.tab","fish.table","fish.typeahead","fish.validation"]);
angular.module("fish.tpls", ["modal/modal.tpl.html","aside/aside.tpl.html","tooltip/tooltip.tpl.html","datepicker/datepicker.tpl.html","dropdown/dropdown.tpl.html","pagination/pager.tpl.html","pagination/pagination.tpl.html","popover/popover.tpl.html","select/select.tpl.html","tab/tab.tpl.html","table/filterRow.tpl.html","table/filters/number.tpl.html","table/filters/select-multiple.tpl.html","table/filters/select.tpl.html","table/filters/text.tpl.html","table/header.tpl.html","table/pager.tpl.html","table/sorterRow.tpl.html","typeahead/bootstrap/choices.tpl.html","typeahead/bootstrap/match-multiple.tpl.html","typeahead/bootstrap/match.tpl.html","typeahead/bootstrap/select-multiple.tpl.html","typeahead/bootstrap/select.tpl.html","typeahead/select2/choices.tpl.html","typeahead/select2/match-multiple.tpl.html","typeahead/select2/match.tpl.html","typeahead/select2/select-multiple.tpl.html","typeahead/select2/select.tpl.html"]);
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.5.8
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (i + 1) + '</button>';
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.hidden = 'hidden';
            _.paused = false;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, dataSettings, settings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);
            _.checkResponsive(true);

        }

        return Slick;

    }());

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

        if (_.slideCount > _.options.slidesToShow && _.paused !== true) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator,
                _.options.autoplaySpeed);
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;
        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this;

        if (_.options.infinite === false) {

            if (_.direction === 1) {

                if ((_.currentSlide + 1) === _.slideCount -
                    1) {
                    _.direction = 0;
                }

                _.slideHandler(_.currentSlide + _.options.slidesToScroll);

            } else {

                if ((_.currentSlide - 1 === 0)) {

                    _.direction = 1;

                }

                _.slideHandler(_.currentSlide - _.options.slidesToScroll);

            }

        } else {

            _.slideHandler(_.currentSlide + _.options.slidesToScroll);

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dotString;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            dotString = '<ul class="' + _.options.dotsClass + '">';

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dotString += '<li>' + _.options.customPaging.call(this, _, i) + '</li>';
            }

            dotString += '</ul>';

            _.$dots = $(dotString).appendTo(
                _.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slidesCache = _.$slides;

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div aria-live="polite" class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.html(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.target),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots).off('click.slick', _.changeSlide);

            if (_.options.pauseOnDotsHover === true && _.options.autoplay === true) {

                $('li', _.$dots)
                    .off('mouseenter.slick', $.proxy(_.setPaused, _, true))
                    .off('mouseleave.slick', $.proxy(_.setPaused, _, false));

            }

        }

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.$list.off('mouseenter.slick', $.proxy(_.setPaused, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.setPaused, _, false));

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.html(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }


        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css("display","");

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css("display","");

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }

        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToShow;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToShow;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;

            if (_.options.centerMode === true) {
                if (_.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.on('click.slick', {
                message: 'previous'
            }, _.changeSlide);
            _.$nextArrow.on('click.slick', {
                message: 'next'
            }, _.changeSlide);
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.options.autoplay === true) {
            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.setPaused, _, true))
                .on('mouseleave.slick', $.proxy(_.setPaused, _, false));
        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        _.$list.on('mouseenter.slick', $.proxy(_.setPaused, _, true));
        _.$list.on('mouseleave.slick', $.proxy(_.setPaused, _, false));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

        if (_.options.autoplay === true) {

            _.autoPlay();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: 'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {
            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {
                    image
                        .animate({ opacity: 0 }, 100, function() {
                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy')
                                        .removeClass('slick-loading');
                                });
                        });
                };

                imageToLoad.src = imageSource;

            });
        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = rangeStart + _.options.slidesToShow;
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.paused = false;
        _.autoPlay();

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        _.$slider.trigger('afterChange', [_, index]);

        _.animating = false;

        _.setPosition();

        _.swipeLeft = null;

        if (_.options.autoplay === true && _.paused === false) {
            _.autoPlay();
        }
        if (_.options.accessibility === true) {
            _.initADA();
        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {
        event.preventDefault();
    };

    Slick.prototype.progressiveLazyLoad = function() {

        var _ = this,
            imgCount, targetImage;

        imgCount = $('img[data-lazy]', _.$slider).length;

        if (imgCount > 0) {
            targetImage = $('img[data-lazy]', _.$slider).first();
            targetImage.attr('src', targetImage.attr('data-lazy')).removeClass('slick-loading').load(function() {
                    targetImage.removeAttr('data-lazy');
                    _.progressiveLazyLoad();

                    if (_.options.adaptiveHeight === true) {
                        _.setPosition();
                    }
                })
                .error(function() {
                    targetImage.removeAttr('data-lazy');
                    _.progressiveLazyLoad();
                });
        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this,
            currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === "array" && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;
                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(0);

        _.setPosition();

        _.$slider.trigger('reInit', [_]);

        if (_.options.autoplay === true) {
            _.focusHandler();
        }

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption = Slick.prototype.slickSetOption = function(option, value, refresh) {

        var _ = this, l, item;

        if( option === "responsive" && $.type(value) === "array" ) {
            for ( item in value ) {
                if( $.type( _.options.responsive ) !== "array" ) {
                    _.options.responsive = [ value[item] ];
                } else {
                    l = _.options.responsive.length-1;
                    // loop through the responsive object and splice out duplicates.
                    while( l >= 0 ) {
                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {
                            _.options.responsive.splice(l,1);
                        }
                        l--;
                    }
                    _.options.responsive.push( value[item] );
                }
            }
        } else {
            _.options[option] = value;
        }

        if (refresh === true) {
            _.unload();
            _.reinit();
        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = (_.animType !== null && _.animType !== false);

    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {

                    _.$slides
                        .slice(index - centerOffset, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }

    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.setPaused = function(paused) {

        var _ = this;

        if (_.options.autoplay === true && _.options.pauseOnHover === true) {
            _.paused = paused;
            if (!paused) {
                _.autoPlay();
            } else {
                _.autoPlayClear();
            }
        }
    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.setSlideClasses(index);
            _.asNavFor(index);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay === true) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'left';
            } else {
                return 'right';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount;

        _.dragging = false;

        _.shouldClick = (_.touchObject.swipeLength > 10) ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.edgeHit === true) {
            _.$slider.trigger('edge', [_, _.swipeDirection()]);
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            switch (_.swipeDirection()) {
                case 'left':
                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
                    _.slideHandler(slideCount);
                    _.currentDirection = 0;
                    _.touchObject = {};
                    _.$slider.trigger('swipe', [_, 'left']);
                    break;

                case 'right':
                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
                    _.slideHandler(slideCount);
                    _.currentDirection = 1;
                    _.touchObject = {};
                    _.$slider.trigger('swipe', [_, 'right']);
                    break;
            }
        } else {
            if (_.touchObject.startX !== _.touchObject.curX) {
                _.slideHandler(_.currentSlide);
                _.touchObject = {};
            }
        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = Math.round(Math.sqrt(
                Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
        }

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                .removeClass('slick-active')
                .attr('aria-hidden', 'true');

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active')
                .attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if (document[_.hidden]) {
            _.paused = true;
            _.autoPlayClear();
        } else {
            if (_.options.autoplay === true) {
                _.paused = false;
                _.autoPlay();
            }
        }

    };
    Slick.prototype.initADA = function() {
        var _ = this;
        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
            $(this).attr({
                'role': 'option',
                'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
            });
        });

        if (_.$dots !== null) {
            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                $(this).attr({
                    'role': 'presentation',
                    'aria-selected': 'false',
                    'aria-controls': 'navigation' + _.instanceUid + i + '',
                    'id': 'slick-slide' + _.instanceUid + i + ''
                });
            })
                .first().attr('aria-selected', 'true').end()
                .find('button').attr('role', 'button').end()
                .closest('div').attr('role', 'toolbar');
        }
        _.activateADA();

    };

    Slick.prototype.activateADA = function() {
        var _ = this,
        _isSlideOnFocus =_.$slider.find('*').is(':focus');
        // _isSlideOnFocus = _.$slides.is(':focus') || _.$slides.find('*').is(':focus');

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false',
            'tabindex': '0'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

        (_isSlideOnFocus) &&  _.$slideTrack.find('.slick-active').focus();

    };

    Slick.prototype.focusHandler = function() {
        var _ = this;
        _.$slider.on('focus.slick blur.slick', '*', function(event) {
            event.stopImmediatePropagation();
            var sf = $(this);
            setTimeout(function() {
                if (_.isPlay) {
                    if (sf.is(':focus')) {
                        _.autoPlayClear();
                        _.paused = true;
                    } else {
                        _.paused = false;
                        _.autoPlay();
                    }
                }
            }, 0);
        });
    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i = 0,
            ret;
        for (i; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));

'use strict';

// NOTICE: This file was forked from the angular-material project (github.com/angular/material)
// MIT Licensed - Copyright (c) 2014-2015 Google, Inc. http://angularjs.org

angular.module('fish.helpers', [])
  .service('$fsCompiler', fsCompilerService);

function fsCompilerService($q, $http, $injector, $compile, $controller, $templateCache) {
  /* jshint validthis: true */

  /*
   * @ngdoc service
   * @name $bsCompiler
   * @module material.core
   * @description
   * The $bsCompiler service is an abstraction of angular's compiler, that allows the developer
   * to easily compile an element with a templateUrl, controller, and locals.
   *
   * @usage
   * <hljs lang="js">
   * $bsCompiler.compile({
   *   templateUrl: 'modal.html',
   *   controller: 'ModalCtrl',
   *   locals: {
   *     modal: myModalInstance;
   *   }
   * }).then(function(compileData) {
   *   compileData.element; // modal.html's template in an element
   *   compileData.link(myScope); //attach controller & scope to element
   * });
   * </hljs>
   */

   /*
    * @ngdoc method
    * @name $bsCompiler#compile
    * @description A helper to compile an HTML template/templateUrl with a given controller,
    * locals, and scope.
    * @param {object} options An options object, with the following properties:
    *
    *    - `controller` - `{(string=|function()=}` Controller fn that should be associated with
    *      newly created scope or the name of a registered controller if passed as a string.
    *    - `controllerAs` - `{string=}` A controller alias name. If present the controller will be
    *      published to scope under the `controllerAs` name.
    *    - `template` - `{string=}` An html template as a string.
    *    - `templateUrl` - `{string=}` A path to an html template.
    *    - `transformTemplate` - `{function(template)=}` A function which transforms the template after
    *      it is loaded. It will be given the template string as a parameter, and should
    *      return a a new string representing the transformed template.
    *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
    *      be injected into the controller. If any of these dependencies are promises, the compiler
    *      will wait for them all to be resolved, or if one is rejected before the controller is
    *      instantiated `compile()` will fail..
    *      * `key` - `{string}`: a name of a dependency to be injected into the controller.
    *      * `factory` - `{string|function}`: If `string` then it is an alias for a service.
    *        Otherwise if function, then it is injected and the return value is treated as the
    *        dependency. If the result is a promise, it is resolved before its value is
    *        injected into the controller.
    *
    * @returns {object=} promise A promise, which will be resolved with a `compileData` object.
    * `compileData` has the following properties:
    *
    *   - `element` - `{element}`: an uncompiled element matching the provided template.
    *   - `link` - `{function(scope)}`: A link function, which, when called, will compile
    *     the element and instantiate the provided controller (if given).
    *   - `locals` - `{object}`: The locals which will be passed into the controller once `link` is
    *     called. If `bindToController` is true, they will be coppied to the ctrl instead
    *   - `bindToController` - `bool`: bind the locals to the controller, instead of passing them in.
    */
  this.compile = function(options) {

    if(options.template && /\.html$/.test(options.template)) {
      console.warn('Deprecated use of `template` option to pass a file. Please use the `templateUrl` option instead.');
      options.templateUrl = options.template;
      options.template = '';
    }

    var templateUrl = options.templateUrl;
    var template = options.template || '';
    var controller = options.controller;
    var controllerAs = options.controllerAs;
    var resolve = angular.copy(options.resolve || {});
    var locals = angular.copy(options.locals || {});
    var transformTemplate = options.transformTemplate || angular.identity;
    var bindToController = options.bindToController;

    // Take resolve values and invoke them.
    // Resolves can either be a string (value: 'MyRegisteredAngularConst'),
    // or an invokable 'factory' of sorts: (value: function ValueGetter($dependency) {})
    angular.forEach(resolve, function(value, key) {
      if (angular.isString(value)) {
        resolve[key] = $injector.get(value);
      } else {
        resolve[key] = $injector.invoke(value);
      }
    });
    // Add the locals, which are just straight values to inject
    // eg locals: { three: 3 }, will inject three into the controller
    angular.extend(resolve, locals);

    if (templateUrl) {
      resolve.$template = fetchTemplate(templateUrl);
    } else {
      resolve.$template = $q.when(template);
    }

    if (options.contentTemplate) {
      // TODO(mgcrea): deprecate?
      resolve.$template = $q.all([resolve.$template, fetchTemplate(options.contentTemplate)])
        .then(function(templates) {
          var templateEl = angular.element(templates[0]);
          var contentEl = findElement('[ng-bind="content"]', templateEl[0]).removeAttr('ng-bind').html(templates[1]);
          // Drop the default footer as you probably don't want it if you use a custom contentTemplate
          if(!options.templateUrl) contentEl.next().remove();
          return templateEl[0].outerHTML;
        });
    }

    // Wait for all the resolves to finish if they are promises
    return $q.all(resolve).then(function(locals) {

      var template = transformTemplate(locals.$template);
      if (options.html) {
        template = template.replace(/ng-bind="/ig, 'ng-bind-html="');
      }
      // var element = options.element || angular.element('<div>').html(template.trim()).contents();
      var element = angular.element('<div>').html(template.trim()).contents();
      var linkFn = $compile(element);

      // Return a linking function that can be used later when the element is ready
      return {
        locals: locals,
        element: element,
        link: function link(scope) {
          locals.$scope = scope;

          // Instantiate controller if it exists, because we have scope
          if (controller) {
            var invokeCtrl = $controller(controller, locals, true);
            if (bindToController) {
              angular.extend(invokeCtrl.instance, locals);
            }
            // Support angular@~1.2 invokeCtrl
            var ctrl = angular.isObject(invokeCtrl) ? invokeCtrl : invokeCtrl();
            // See angular-route source for this logic
            element.data('$ngControllerController', ctrl);
            element.children().data('$ngControllerController', ctrl);

            if (controllerAs) {
              scope[controllerAs] = ctrl;
            }
          }

          return linkFn.apply(null, arguments);
        }
      };
    });

  };

  function findElement(query, element) {
    return angular.element((element || document).querySelectorAll(query));
  }

  var fetchPromises = {};
  function fetchTemplate(template) {
    if(fetchPromises[template]) return fetchPromises[template];
    return (fetchPromises[template] = $http.get(template, {cache: $templateCache})
      .then(function(res) {
        return res.data;
      }));
  }

}
fsCompilerService.$inject = ["$q", "$http", "$injector", "$compile", "$controller", "$templateCache"];

'use strict';

angular.module('fish.helpers')

  .service('$dateFormatter', ["$locale", "dateFilter", function($locale, dateFilter) {

    // The unused `lang` arguments are on purpose. The default implementation does not
    // use them and it always uses the locale loaded into the `$locale` service.
    // Custom implementations might use it, thus allowing different directives to
    // have different languages.

    this.getDefaultLocale = function() {
      return $locale.id;
    };

    // Format is either a data format name, e.g. "shortTime" or "fullDate", or a date format
    // Return either the corresponding date format or the given date format.
    this.getDatetimeFormat = function(format, lang) {
      return $locale.DATETIME_FORMATS[format] || format;
    };

    this.weekdaysShort = function(lang) {
      return $locale.DATETIME_FORMATS.SHORTDAY;
    };

    function splitTimeFormat(format) {
      return /(h+)([:\.])?(m+)([:\.])?(s*)[ ]?(a?)/i.exec(format).slice(1);
    }

    // h:mm a => h
    this.hoursFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[0];
    };

    // h:mm a => mm
    this.minutesFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[2];
    };

    // h:mm:ss a => ss
    this.secondsFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[4];
    };

    // h:mm a => :
    this.timeSeparator = function(timeFormat) {
      return splitTimeFormat(timeFormat)[1];
    };

    // h:mm:ss a => true, h:mm a => false
    this.showSeconds = function(timeFormat) {
      return !!splitTimeFormat(timeFormat)[4];
    };

    // h:mm a => true, H.mm => false
    this.showAM = function(timeFormat) {
      return !!splitTimeFormat(timeFormat)[5];
    };

    this.formatDate = function(date, format, lang, timezone){
      return dateFilter(date, format, timezone);
    };

  }]);

'use strict';

angular.module('fish.helpers')

.provider('$dateParser', ["$localeProvider", function($localeProvider) {

  // define a custom ParseDate object to use instead of native Date
  // to avoid date values wrapping when setting date component values
  function ParseDate() {
    this.year = 1970;
    this.month = 0;
    this.day = 1;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
  }

  ParseDate.prototype.setMilliseconds = function(value) { this.milliseconds = value; };
  ParseDate.prototype.setSeconds = function(value) { this.seconds = value; };
  ParseDate.prototype.setMinutes = function(value) { this.minutes = value; };
  ParseDate.prototype.setHours = function(value) { this.hours = value; };
  ParseDate.prototype.getHours = function() { return this.hours; };
  ParseDate.prototype.setDate = function(value) { this.day = value; };
  ParseDate.prototype.setMonth = function(value) { this.month = value; };
  ParseDate.prototype.setFullYear = function(value) { this.year = value; };
  ParseDate.prototype.fromDate = function(value) {
    this.year = value.getFullYear();
    this.month = value.getMonth();
    this.day = value.getDate();
    this.hours = value.getHours();
    this.minutes = value.getMinutes();
    this.seconds = value.getSeconds();
    this.milliseconds = value.getMilliseconds();
    return this;
  };

  ParseDate.prototype.toDate = function() {
    return new Date(this.year, this.month, this.day, this.hours, this.minutes, this.seconds, this.milliseconds);
  };

  var proto = ParseDate.prototype;

  function noop() {
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function indexOfCaseInsensitive(array, value) {
    var len = array.length, str=value.toString().toLowerCase();
    for (var i=0; i<len; i++) {
      if (array[i].toLowerCase() === str) { return i; }
    }
    return -1; // Return -1 per the "Array.indexOf()" method.
  }

  var defaults = this.defaults = {
    format: 'shortDate',
    strict: false
  };

  this.$get = ["$locale", "dateFilter", function($locale, dateFilter) {

    var DateParserFactory = function(config) {

      var options = angular.extend({}, defaults, config);

      var $dateParser = {};

      var regExpMap = {
        'sss'   : '[0-9]{3}',
        'ss'    : '[0-5][0-9]',
        's'     : options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
        'mm'    : '[0-5][0-9]',
        'm'     : options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
        'HH'    : '[01][0-9]|2[0-3]',
        'H'     : options.strict ? '1?[0-9]|2[0-3]' : '[01]?[0-9]|2[0-3]',
        'hh'    : '[0][1-9]|[1][012]',
        'h'     : options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
        'a'     : 'AM|PM',
        'EEEE'  : $locale.DATETIME_FORMATS.DAY.join('|'),
        'EEE'   : $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
        'dd'    : '0[1-9]|[12][0-9]|3[01]',
        'd'     : options.strict ? '[1-9]|[1-2][0-9]|3[01]' : '0?[1-9]|[1-2][0-9]|3[01]',
        'MMMM'  : $locale.DATETIME_FORMATS.MONTH.join('|'),
        'MMM'   : $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
        'MM'    : '0[1-9]|1[012]',
        'M'     : options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
        'yyyy'  : '[1]{1}[0-9]{3}|[2]{1}[0-9]{3}',
        'yy'    : '[0-9]{2}',
        'y'     : options.strict ? '-?(0|[1-9][0-9]{0,3})' : '-?0*[0-9]{1,4}',
      };

      var setFnMap = {
        'sss'   : proto.setMilliseconds,
        'ss'    : proto.setSeconds,
        's'     : proto.setSeconds,
        'mm'    : proto.setMinutes,
        'm'     : proto.setMinutes,
        'HH'    : proto.setHours,
        'H'     : proto.setHours,
        'hh'    : proto.setHours,
        'h'     : proto.setHours,
        'EEEE'  : noop,
        'EEE'   : noop,
        'dd'    : proto.setDate,
        'd'     : proto.setDate,
        'a'     : function(value) { var hours = this.getHours() % 12; return this.setHours(value.match(/pm/i) ? hours + 12 : hours); },
        'MMMM'  : function(value) { return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.MONTH, value)); },
        'MMM'   : function(value) { return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.SHORTMONTH, value)); },
        'MM'    : function(value) { return this.setMonth(1 * value - 1); },
        'M'     : function(value) { return this.setMonth(1 * value - 1); },
        'yyyy'  : proto.setFullYear,
        'yy'    : function(value) { return this.setFullYear(2000 + 1 * value); },
        'y'     : function(value) { return (1 * value <= 50 && value.length === 2) ? this.setFullYear(2000 + 1 * value) : this.setFullYear(1 * value); }
      };

      var regex, setMap;

      $dateParser.init = function() {
        $dateParser.$format = $locale.DATETIME_FORMATS[options.format] || options.format;
        regex = regExpForFormat($dateParser.$format);
        setMap = setMapForFormat($dateParser.$format);
      };

      $dateParser.isValid = function(date) {
        if(angular.isDate(date)) return !isNaN(date.getTime());
        return regex.test(date);
      };

      $dateParser.parse = function(value, baseDate, format, timezone) {
        // check for date format special names
        if(format) format = $locale.DATETIME_FORMATS[format] || format;
        if(angular.isDate(value)) value = dateFilter(value, format || $dateParser.$format, timezone);
        var formatRegex = format ? regExpForFormat(format) : regex;
        var formatSetMap = format ? setMapForFormat(format) : setMap;
        var matches = formatRegex.exec(value);
        if(!matches) return false;
        // use custom ParseDate object to set parsed values
        var date = baseDate && !isNaN(baseDate.getTime()) ? new ParseDate().fromDate(baseDate) : new ParseDate().fromDate(new Date(1970, 0, 1, 0));
        for(var i = 0; i < matches.length - 1; i++) {
          formatSetMap[i] && formatSetMap[i].call(date, matches[i+1]);
        }
        // convert back to native Date object
        var newDate = date.toDate();

        // check new native Date object for day values overflow
        if (parseInt(date.day, 10) !== newDate.getDate()) {
          return false;
        }

        return newDate;
      };

      $dateParser.getDateForAttribute = function(key, value) {
        var date;

        if(value === 'today') {
          var today = new Date();
          date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (key === 'maxDate' ? 1 : 0), 0, 0, 0, (key === 'minDate' ? 0 : -1));
        } else if(angular.isString(value) && value.match(/^".+"$/)) { // Support {{ dateObj }}
          date = new Date(value.substr(1, value.length - 2));
        } else if(isNumeric(value)) {
          date = new Date(parseInt(value, 10));
        } else if (angular.isString(value) && 0 === value.length) { // Reset date
          date = key === 'minDate' ? -Infinity : +Infinity;
        } else {
          date = new Date(value);
        }

        return date;
      };

      $dateParser.getTimeForAttribute = function(key, value) {
        var time;

        if(value === 'now') {
          time = new Date().setFullYear(1970, 0, 1);
        } else if(angular.isString(value) && value.match(/^".+"$/)) {
          time = new Date(value.substr(1, value.length - 2)).setFullYear(1970, 0, 1);
        } else if(isNumeric(value)) {
          time = new Date(parseInt(value, 10)).setFullYear(1970, 0, 1);
        } else if (angular.isString(value) && 0 === value.length) { // Reset time
          time = key === 'minTime' ? -Infinity : +Infinity;
        } else {
          time = $dateParser.parse(value, new Date(1970, 0, 1, 0));
        }

        return time;
      };

      /* Handle switch to/from daylight saving.
      * Hours may be non-zero on daylight saving cut-over:
      * > 12 when midnight changeover, but then cannot generate
      * midnight datetime, so jump to 1AM, otherwise reset.
      * @param  date  (Date) the date to check
      * @return  (Date) the corrected date
      *
      * __ copied from jquery ui datepicker __
      */
      $dateParser.daylightSavingAdjust = function(date) {
        if (!date) {
          return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
      };

      /* Correct the date for timezone offset.
      * @param  date  (Date) the date to adjust
      * @param  timezone  (string) the timezone to adjust for
      * @param  undo  (boolean) to add or subtract timezone offset
      * @return  (Date) the corrected date
      */
      $dateParser.timezoneOffsetAdjust = function(date, timezone, undo) {
        if (!date) {
          return null;
        }
        // Right now, only 'UTC' is supported.
        if (timezone && timezone === 'UTC') {
          date = new Date(date.getTime());
          date.setMinutes(date.getMinutes() + (undo?-1:1)*date.getTimezoneOffset());
        }
        return date;
      };

      // Private functions

      function setMapForFormat(format) {
        var keys = Object.keys(setFnMap), i;
        var map = [], sortedMap = [];
        // Map to setFn
        var clonedFormat = format;
        for(i = 0; i < keys.length; i++) {
          if(format.split(keys[i]).length > 1) {
            var index = clonedFormat.search(keys[i]);
            format = format.split(keys[i]).join('');
            if(setFnMap[keys[i]]) {
              map[index] = setFnMap[keys[i]];
            }
          }
        }
        // Sort result map
        angular.forEach(map, function(v) {
          // conditional required since angular.forEach broke around v1.2.21
          // related pr: https://github.com/angular/angular.js/pull/8525
          if(v) sortedMap.push(v);
        });
        return sortedMap;
      }

      function escapeReservedSymbols(text) {
        return text.replace(/\//g, '[\\/]').replace('/-/g', '[-]').replace(/\./g, '[.]').replace(/\\s/g, '[\\s]');
      }

      function regExpForFormat(format) {
        var keys = Object.keys(regExpMap), i;

        var re = format;
        // Abstract replaces to avoid collisions
        for(i = 0; i < keys.length; i++) {
          re = re.split(keys[i]).join('${' + i + '}');
        }
        // Replace abstracted values
        for(i = 0; i < keys.length; i++) {
          re = re.split('${' + i + '}').join('(' + regExpMap[keys[i]] + ')');
        }
        format = escapeReservedSymbols(format);

        return new RegExp('^' + re + '$', ['i']);
      }

      $dateParser.init();
      return $dateParser;

    };

    return DateParserFactory;

  }];

}]);

'use strict';

angular.module('fish.helpers')

// @source jashkenas/underscore
// @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L693
.factory('debounce', ["$timeout", function($timeout) {
  return function(func, wait, immediate) {
    var timeout = null;
    return function() {
      var context = this,
        args = arguments,
        callNow = immediate && !timeout;
      if(timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function later() {
        timeout = null;
        if(!immediate) {
          func.apply(context, args);
        }
      }, wait, false);
      if(callNow) {
        func.apply(context, args);
      }
      return timeout;
    };
  };
}])


// @source jashkenas/underscore
// @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L661
.factory('throttle', ["$timeout", function($timeout) {
  return function(func, wait, options) {
    var timeout = null;
    options || (options = {});
    return function() {
      var context = this,
        args = arguments;
      if(!timeout) {
        if(options.leading !== false) {
          func.apply(context, args);
        }
        timeout = $timeout(function later() {
          timeout = null;
          if(options.trailing !== false) {
            func.apply(context, args);
          }
        }, wait, false);
      }
    };
  };
}]);


'use strict';

angular.module('fish.helpers')

  .factory('dimensions', ["$document", "$window", function($document, $window) {

    var jqLite = angular.element;
    var fn = {};

    /**
     * Test the element nodeName
     * @param element
     * @param name
     */
    var nodeName = fn.nodeName = function(element, name) {
      return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
    };

    /**
     * Returns the element computed style
     * @param element
     * @param prop
     * @param extra
     */
    fn.css = function(element, prop, extra) {
      var value;
      if (element.currentStyle) { //IE
        value = element.currentStyle[prop];
      } else if (window.getComputedStyle) {
        value = window.getComputedStyle(element)[prop];
      } else {
        value = element.style[prop];
      }
      return extra === true ? parseFloat(value) || 0 : value;
    };

    /**
     * Provides read-only equivalent of jQuery's offset function:
     * @required-by bootstrap-tooltip, bootstrap-affix
     * @url http://api.jquery.com/offset/
     * @param element
     */
    fn.offset = function(element) {
      var boxRect = element.getBoundingClientRect();
      var docElement = element.ownerDocument;
      return {
        width: boxRect.width || element.offsetWidth,
        height: boxRect.height || element.offsetHeight,
        top: boxRect.top + (window.pageYOffset || docElement.documentElement.scrollTop) - (docElement.documentElement.clientTop || 0),
        left: boxRect.left + (window.pageXOffset || docElement.documentElement.scrollLeft) - (docElement.documentElement.clientLeft || 0)
      };
    };
  
    /**
     * Provides set equivalent of jQuery's offset function:
     * @required-by bootstrap-tooltip
     * @url http://api.jquery.com/offset/
     * @param element
     * @param options
     * @param i
     */
    fn.setOffset = function (element, options, i) {
      var curPosition,
          curLeft,
          curCSSTop,
          curTop,
          curOffset,
          curCSSLeft,
          calculatePosition,
          position = fn.css(element, 'position'),
          curElem = angular.element(element),
          props = {};
      
      // Set position first, in-case top/left are set even on static elem
      if (position === 'static') {
        element.style.position = 'relative';
      }
      
      curOffset = fn.offset(element);
      curCSSTop = fn.css(element, 'top');
      curCSSLeft = fn.css(element, 'left');
      calculatePosition = (position === 'absolute' || position === 'fixed') && 
                          (curCSSTop + curCSSLeft).indexOf('auto') > -1;
      
      // Need to be able to calculate position if either
      // top or left is auto and position is either absolute or fixed
      if (calculatePosition) {
        curPosition = fn.position(element);
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      
      if (angular.isFunction(options)) {
        options = options.call(element, i, curOffset);
      }
      
      if (options.top !== null ) {
        props.top = (options.top - curOffset.top) + curTop;
      }
      if ( options.left !== null ) {
        props.left = (options.left - curOffset.left) + curLeft;
      }

      if ('using' in options) {
        options.using.call(curElem, props);
      } else {
        curElem.css({
          top: props.top + 'px',
          left: props.left + 'px'
        });
      }
    };

    /**
     * Provides read-only equivalent of jQuery's position function
     * @required-by bootstrap-tooltip, bootstrap-affix
     * @url http://api.jquery.com/offset/
     * @param element
     */
    fn.position = function(element) {

      var offsetParentRect = {top: 0, left: 0},
          offsetParentElement,
          offset;

      // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
      if (fn.css(element, 'position') === 'fixed') {

        // We assume that getBoundingClientRect is available when computed position is fixed
        offset = element.getBoundingClientRect();

      } else {

        // Get *real* offsetParentElement
        offsetParentElement = offsetParent(element);

        // Get correct offsets
        offset = fn.offset(element);
        if (!nodeName(offsetParentElement, 'html')) {
          offsetParentRect = fn.offset(offsetParentElement);
        }

        // Add offsetParent borders
        offsetParentRect.top += fn.css(offsetParentElement, 'borderTopWidth', true);
        offsetParentRect.left += fn.css(offsetParentElement, 'borderLeftWidth', true);
      }

      // Subtract parent offsets and element margins
      return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        top: offset.top - offsetParentRect.top - fn.css(element, 'marginTop', true),
        left: offset.left - offsetParentRect.left - fn.css(element, 'marginLeft', true)
      };

    };

    /**
     * Returns the closest, non-statically positioned offsetParent of a given element
     * @required-by fn.position
     * @param element
     */
    var offsetParent = function offsetParentElement(element) {
      var docElement = element.ownerDocument;
      var offsetParent = element.offsetParent || docElement;
      if(nodeName(offsetParent, '#document')) return docElement.documentElement;
      while(offsetParent && !nodeName(offsetParent, 'html') && fn.css(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docElement.documentElement;
    };

    /**
     * Provides equivalent of jQuery's height function
     * @required-by bootstrap-affix
     * @url http://api.jquery.com/height/
     * @param element
     * @param outer
     */
    fn.height = function(element, outer) {
      var value = element.offsetHeight;
      if(outer) {
        value += fn.css(element, 'marginTop', true) + fn.css(element, 'marginBottom', true);
      } else {
        value -= fn.css(element, 'paddingTop', true) + fn.css(element, 'paddingBottom', true) + fn.css(element, 'borderTopWidth', true) + fn.css(element, 'borderBottomWidth', true);
      }
      return value;
    };

    /**
     * Provides equivalent of jQuery's width function
     * @required-by bootstrap-affix
     * @url http://api.jquery.com/width/
     * @param element
     * @param outer
     */
    fn.width = function(element, outer) {
      var value = element.offsetWidth;
      if(outer) {
        value += fn.css(element, 'marginLeft', true) + fn.css(element, 'marginRight', true);
      } else {
        value -= fn.css(element, 'paddingLeft', true) + fn.css(element, 'paddingRight', true) + fn.css(element, 'borderLeftWidth', true) + fn.css(element, 'borderRightWidth', true);
      }
      return value;
    };

    return fn;

  }]);

'use strict';

angular.module('fish.helpers')

  .provider('$parseOptions', function() {

    var defaults = this.defaults = {
      regexp: /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/
    };

    this.$get = ["$parse", "$q", function($parse, $q) {

      function ParseOptionsFactory(attr, config) {

        var $parseOptions = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        $parseOptions.$values = [];

        // Private vars
        var match, displayFn, valueName, keyName, groupByFn, valueFn, valuesFn;

        $parseOptions.init = function() {
          $parseOptions.$match = match = attr.match(options.regexp);
          displayFn = $parse(match[2] || match[1]),
          valueName = match[4] || match[6],
          keyName = match[5],
          groupByFn = $parse(match[3] || ''),
          valueFn = $parse(match[2] ? match[1] : valueName),
          valuesFn = $parse(match[7]);
        };

        $parseOptions.valuesFn = function(scope, controller) {
          return $q.when(valuesFn(scope, controller))
          .then(function(values) {
            if(!angular.isArray(values)) {
              values = [];
            }
            $parseOptions.$values = values.length ? parseValues(values, scope) : [];
            return $parseOptions.$values;
          });
        };

        $parseOptions.displayValue = function(modelValue) {
          var scope = {};
          scope[valueName] = modelValue;
          return displayFn(scope);
        };

        // Private functions

        function parseValues(values, scope) {
          return values.map(function(match, index) {
            var locals = {}, label, value;
            locals[valueName] = match;
            label = displayFn(scope, locals);
            value = valueFn(scope, locals);
            return {label: label, value: value, index: index};
          });
        }

        $parseOptions.init();
        return $parseOptions;

      }

      return ParseOptionsFactory;

    }];

  });

'use strict';

(angular.version.minor < 3 && angular.version.dot < 14) && angular.module('ng')

.factory('$$rAF', ["$window", "$timeout", function($window, $timeout) {

  var requestAnimationFrame = $window.requestAnimationFrame ||
                              $window.webkitRequestAnimationFrame ||
                              $window.mozRequestAnimationFrame;

  var cancelAnimationFrame = $window.cancelAnimationFrame ||
                             $window.webkitCancelAnimationFrame ||
                             $window.mozCancelAnimationFrame ||
                             $window.webkitCancelRequestAnimationFrame;

  var rafSupported = !!requestAnimationFrame;
  var raf = rafSupported ?
    function(fn) {
      var id = requestAnimationFrame(fn);
      return function() {
        cancelAnimationFrame(id);
      };
    } :
    function(fn) {
      var timer = $timeout(fn, 16.66, false); // 1000 / 60 = 16.666
      return function() {
        $timeout.cancel(timer);
      };
    };

  raf.supported = rafSupported;

  return raf;

}]);

// .factory('$$animateReflow', function($$rAF, $document) {

//   var bodyEl = $document[0].body;

//   return function(fn) {
//     //the returned function acts as the cancellation function
//     return $$rAF(function() {
//       //the line below will force the browser to perform a repaint
//       //so that all the animated elements within the animation frame
//       //will be properly updated and drawn on screen. This is
//       //required to perform multi-class CSS based animations with
//       //Firefox. DO NOT REMOVE THIS LINE.
//       var a = bodyEl.offsetWidth + 1;
//       fn();
//     });
//   };

// });

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
        this.$get = ["$window", "debounce", "dimensions", function ($window, debounce, dimensions) {
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
        }];
    })
    .directive('fsAffix', ["$affix", function ($affix) {
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
    }]
);

'use strict';

angular.module('fish.modal', ['fish.helpers'])

    .provider('$modal', function() {

      var defaults = this.defaults = {
        animation: 'fs-fade',
        backdropAnimation: 'fs-fade',
        prefixClass: 'modal',
        prefixEvent: 'modal',
        placement: 'top',
        templateUrl: 'modal/modal.tpl.html',
        template: '',
        contentTemplate: false,
        container: false,
        element: null,
        backdrop: true,
        keyboard: true,
        html: false,
        show: true
      };

      this.$get = ["$window", "$rootScope", "$fsCompiler", "$animate", "$timeout", "$sce", "dimensions", function($window, $rootScope, $fsCompiler, $animate, $timeout, $sce, dimensions) {

        var forEach = angular.forEach;
        var trim = String.prototype.trim;
        var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
        var bodyElement = angular.element($window.document.body);

        function ModalFactory(config) {

          var $modal = {};

          // Common vars
          var options = $modal.$options = angular.extend({}, defaults, config);
          var promise = $modal.$promise = $fsCompiler.compile(options);
          var scope = $modal.$scope = options.scope && options.scope.$new() || $rootScope.$new();

          if(!options.element && !options.container) {
            options.container = 'body';
          }

          // Store $id to identify the triggering element in events
          // give priority to options.id, otherwise, try to use
          // element id if defined
          $modal.$id = options.id || options.element && options.element.attr('id') || '';

          // Support scope as string options
          forEach(['title', 'content'], function(key) {
            if(options[key]) scope[key] = $sce.trustAsHtml(options[key]);
          });

          // Provide scope helpers
          scope.$hide = function() {
            scope.$$postDigest(function() {
              $modal.hide();
            });
          };
          scope.$show = function() {
            scope.$$postDigest(function() {
              $modal.show();
            });
          };
          scope.$toggle = function() {
            scope.$$postDigest(function() {
              $modal.toggle();
            });
          };
          // Publish isShown as a protected var on scope
          $modal.$isShown = scope.$isShown = false;

          // Fetch, compile then initialize modal
          var compileData, modalElement, modalScope;
          var backdropElement = angular.element('<div class="' + options.prefixClass + '-backdrop"/>');
          backdropElement.css({position:'fixed', top:'0px', left:'0px', bottom:'0px', right:'0px', 'z-index': 1038});
          promise.then(function(data) {
            compileData = data;
            $modal.init();
          });

          $modal.init = function() {

            // Options: show
            if(options.show) {
              scope.$$postDigest(function() {
                $modal.show();
              });
            }

          };

          $modal.destroy = function() {

            // Remove element
            destroyModalElement();

            // remove backdrop element
            if(backdropElement) {
              backdropElement.remove();
              backdropElement = null;
            }

            // Destroy scope
            scope.$destroy();
          };

          $modal.show = function() {
            if($modal.$isShown) return;

            var parent, after;
            if(angular.isElement(options.container)) {
              parent = options.container;
              after = options.container[0].lastChild ? angular.element(options.container[0].lastChild) : null;
            } else {
              if (options.container) {
                parent = findElement(options.container);
                after = parent[0] && parent[0].lastChild ? angular.element(parent[0].lastChild) : null;
              } else {
                parent = null;
                after = options.element;
              }
            }

            // destroy any existing modal elements
            if(modalElement) destroyModalElement();

            // create a new scope, so we can destroy it and all child scopes
            // when destroying the modal element
            modalScope = $modal.$scope.$new();
            // Fetch a cloned element linked from template (noop callback is required)
            modalElement = $modal.$element = compileData.link(modalScope, function(clonedElement, scope) {});

            if(scope.$emit(options.prefixEvent + '.show.before', $modal).defaultPrevented) {
              return;
            }

            // Set the initial positioning.
            modalElement.css({display: 'block'}).addClass(options.placement);

            // Options: animation
            if(options.animation) {
              if(options.backdrop) {
                backdropElement.addClass(options.backdropAnimation);
              }
              modalElement.addClass(options.animation);
            }

            if(options.backdrop) {
              $animate.enter(backdropElement, bodyElement, null);
            }

            // Support v1.2+ $animate
            // https://github.com/angular/angular.js/issues/11713
            if(angular.version.minor <= 2) {
              $animate.enter(modalElement, parent, after, enterAnimateCallback);
            } else {
              $animate.enter(modalElement, parent, after).then(enterAnimateCallback);
            }

            $modal.$isShown = scope.$isShown = true;
            safeDigest(scope);
            // Focus once the enter-animation has started
            // Weird PhantomJS bug hack
            var el = modalElement[0];
            requestAnimationFrame(function() {
              el.focus();
            });

            bodyElement.addClass(options.prefixClass + '-open');
            if(options.animation) {
              bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
            }

            // Bind events
            bindBackdropEvents();
            bindKeyboardEvents();
          };

          function enterAnimateCallback() {
            scope.$emit(options.prefixEvent + '.show', $modal);
          }

          $modal.hide = function() {
            if(!$modal.$isShown) return;

            if(scope.$emit(options.prefixEvent + '.hide.before', $modal).defaultPrevented) {
              return;
            }

            // Support v1.2+ $animate
            // https://github.com/angular/angular.js/issues/11713
            if(angular.version.minor <= 2) {
              $animate.leave(modalElement, leaveAnimateCallback);
            } else {
              $animate.leave(modalElement).then(leaveAnimateCallback);
            }

            if(options.backdrop) {
              $animate.leave(backdropElement);
            }
            $modal.$isShown = scope.$isShown = false;
            safeDigest(scope);

            // Unbind events
            unbindBackdropEvents();
            unbindKeyboardEvents();
          };

          function leaveAnimateCallback() {
            scope.$emit(options.prefixEvent + '.hide', $modal);
            bodyElement.removeClass(options.prefixClass + '-open');
            if(options.animation) {
              bodyElement.removeClass(options.prefixClass + '-with-' + options.animation);
            }
          }

          $modal.toggle = function() {

            $modal.$isShown ? $modal.hide() : $modal.show();

          };

          $modal.focus = function() {
            modalElement[0].focus();
          };

          // Protected methods

          $modal.$onKeyUp = function(evt) {

            if (evt.which === 27 && $modal.$isShown) {
              $modal.hide();
              evt.stopPropagation();
            }

          };

          function bindBackdropEvents() {
            if(options.backdrop) {
              modalElement.on('click', hideOnBackdropClick);
              backdropElement.on('click', hideOnBackdropClick);
              backdropElement.on('wheel', preventEventDefault);
            }
          }

          function unbindBackdropEvents() {
            if(options.backdrop) {
              modalElement.off('click', hideOnBackdropClick);
              backdropElement.off('click', hideOnBackdropClick);
              backdropElement.off('wheel', preventEventDefault);
            }
          }

          function bindKeyboardEvents() {
            if(options.keyboard) {
              modalElement.on('keyup', $modal.$onKeyUp);
            }
          }

          function unbindKeyboardEvents() {
            if(options.keyboard) {
              modalElement.off('keyup', $modal.$onKeyUp);
            }
          }

          // Private methods

          function hideOnBackdropClick(evt) {
            if(evt.target !== evt.currentTarget) return;
            options.backdrop === 'static' ? $modal.focus() : $modal.hide();
          }

          function preventEventDefault(evt) {
            evt.preventDefault();
          }

          function destroyModalElement() {
            if($modal.$isShown && modalElement !== null) {
              // un-bind events
              unbindBackdropEvents();
              unbindKeyboardEvents();
            }

            if(modalScope) {
              modalScope.$destroy();
              modalScope = null;
            }

            if(modalElement) {
              modalElement.remove();
              modalElement = $modal.$element = null;
            }
          }

          return $modal;

        }

        // Helper functions

        function safeDigest(scope) {
          scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
        }

        function findElement(query, element) {
          return angular.element((element || document).querySelectorAll(query));
        }

        return ModalFactory;

      }];

    })

    .directive('fsModal', ["$window", "$sce", "$modal", function($window, $sce, $modal) {

      return {
        restrict: 'EAC',
        scope: true,
        link: function postLink(scope, element, attr, transclusion) {

          // Directive options
          var options = {scope: scope, element: element, show: false};
          angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation', 'id', 'prefixEvent', 'prefixClass'], function(key) {
            if(angular.isDefined(attr[key])) options[key] = attr[key];
          });

          // use string regex match boolean attr falsy values, leave truthy values be
          var falseValueRegExp = /^(false|0|)$/i;
          angular.forEach(['backdrop', 'keyboard', 'html', 'container'], function(key) {
            if(angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
              options[key] = false;
          });

          // Support scope as data-attrs
          angular.forEach(['title', 'content'], function(key) {
            attr[key] && attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          });

          // Support scope as an object
          attr.fsModal && scope.$watch(attr.fsModal, function(newValue, oldValue) {
            if(angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);

          // Initialize modal
          var modal = $modal(options);

          // Trigger
          element.on(attr.trigger || 'click', modal.toggle);

          // Garbage collection
          scope.$on('$destroy', function() {
            if (modal) modal.destroy();
            options = null;
            modal = null;
          });

        }
      };

    }]);
'use strict';

angular.module('fish.aside', ['fish.modal'])

  .provider('$aside', function() {

    var defaults = this.defaults = {
      animation: 'fs-fade-right',
      prefixClass: 'aside',
      prefixEvent: 'aside',
      placement: 'right',
      templateUrl: 'aside/aside.tpl.html',
      contentTemplate: false,
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true
    };

    this.$get = ["$modal", function($modal) {

      function AsideFactory(config) {

        var $aside = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $aside = $modal(options);

        return $aside;

      }

      return AsideFactory;

    }];

  })

  .directive('fsAside', ["$window", "$sce", "$aside", function($window, $sce, $aside) {

    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        // Directive options
        var options = {scope: scope, element: element, show: false};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['backdrop', 'keyboard', 'html', 'container'], function(key) {
          if(angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
            options[key] = false;
        });

        // Support scope as data-attrs
        angular.forEach(['title', 'content'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = $sce.trustAsHtml(newValue);
          });
        });

        // Support scope as an object
        attr.fsAside && scope.$watch(attr.fsAside, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
        }, true);

        // Initialize aside
        var aside = $aside(options);

        // Trigger
        element.on(attr.trigger || 'click', aside.toggle);

        // Garbage collection
        scope.$on('$destroy', function() {
          if (aside) aside.destroy();
          options = null;
          aside = null;
        });

      }
    };

  }]);


/**
 * 基于ui.router组件
 * 来自：https://github.com/ncuillery/angular-breadcrumb/blob/master/src/angular-breadcrumb.js
 * 获取时间：2015-11-05
 * 更改步骤：
 * 1.替换ncy为fs
 * 2.替换module名称为fish.breadcrumb
 */
(function(angular){
    function isAOlderThanB(scopeA, scopeB) {
        if(angular.equals(scopeA.length, scopeB.length)) {
            return scopeA > scopeB;
        } else {
            return scopeA.length > scopeB.length;
        }
    }

    function parseStateRef(ref) {
        var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
        if (!parsed || parsed.length !== 4) { throw new Error("Invalid state ref '" + ref + "'"); }
        return { state: parsed[1], paramExpr: parsed[3] || null };
    }

    function $Breadcrumb() {

        var $$options = {
            prefixStateName: null,
            template: 'bootstrap3',
            templateUrl: null,
            includeAbstract : false
        };

        this.setOptions = function(options) {
            angular.extend($$options, options);
        };

        this.$get = ['$state', '$stateParams', '$rootScope', function($state, $stateParams, $rootScope) {

            var $lastViewScope = $rootScope;

            // Early catch of $viewContentLoaded event
            $rootScope.$on('$viewContentLoaded', function (event) {
                // With nested views, the event occur several times, in "wrong" order
                if(!event.targetScope.fsBreadcrumbIgnore &&
                    isAOlderThanB(event.targetScope.$id, $lastViewScope.$id)) {
                    $lastViewScope = event.targetScope;
                }
            });

            // Get the parent state
            var $$parentState = function(state) {
                // Check if state has explicit parent OR we try guess parent from its name
                var parent = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
                var isObjectParent = typeof parent === "object";
                // if parent is a object reference, then extract the name
                return isObjectParent ? parent.name : parent;
            };

            // Add the state in the chain if not already in and if not abstract
            var $$addStateInChain = function(chain, stateRef) {
                var conf,
                    parentParams,
                    ref = parseStateRef(stateRef),
                    force = false,
                    skip = false;

                for(var i=0, l=chain.length; i<l; i+=1) {
                    if (chain[i].name === ref.state) {
                        return;
                    }
                }

                conf = $state.get(ref.state);
                // Get breadcrumb options
                if(conf.fsBreadcrumb) {
                    if(conf.fsBreadcrumb.force){ force = true; }
                    if(conf.fsBreadcrumb.skip){ skip = true; }
                }
                if((!conf.abstract || $$options.includeAbstract || force) && !skip) {
                    if(ref.paramExpr) {
                        parentParams = $lastViewScope.$eval(ref.paramExpr);
                    }

                    conf.fsBreadcrumbLink = $state.href(ref.state, parentParams || $stateParams || {});
                    chain.unshift(conf);
                }
            };

            // Get the state for the parent step in the breadcrumb
            var $$breadcrumbParentState = function(stateRef) {
                var ref = parseStateRef(stateRef),
                    conf = $state.get(ref.state);

                if(conf.fsBreadcrumb && conf.fsBreadcrumb.parent) {
                    // Handle the "parent" property of the breadcrumb, override the parent/child relation of the state
                    var isFunction = typeof conf.fsBreadcrumb.parent === 'function';
                    var parentStateRef = isFunction ? conf.fsBreadcrumb.parent($lastViewScope) : conf.fsBreadcrumb.parent;
                    if(parentStateRef) {
                        return parentStateRef;
                    }
                }

                return $$parentState(conf);
            };

            return {

                getTemplate: function(templates) {
                    if($$options.templateUrl) {
                        // templateUrl takes precedence over template
                        return null;
                    } else if(templates[$$options.template]) {
                        // Predefined templates (bootstrap, ...)
                        return templates[$$options.template];
                    } else {
                        return $$options.template;
                    }
                },

                getTemplateUrl: function() {
                    return $$options.templateUrl;
                },

                getStatesChain: function(exitOnFirst) { // Deliberately undocumented param, see getLastStep
                    var chain = [];

                    // From current state to the root
                    for(var stateRef = $state.$current.self.name; stateRef; stateRef=$$breadcrumbParentState(stateRef)) {
                        $$addStateInChain(chain, stateRef);
                        if(exitOnFirst && chain.length) {
                            return chain;
                        }
                    }

                    // Prefix state treatment
                    if($$options.prefixStateName) {
                        $$addStateInChain(chain, $$options.prefixStateName);
                    }

                    return chain;
                },

                getLastStep: function() {
                    var chain = this.getStatesChain(true);
                    return chain.length ? chain[0] : undefined;
                },

                $getLastViewScope: function() {
                    return $lastViewScope;
                }
            };
        }];
    }

    var getExpression = function(interpolationFunction) {
        if(interpolationFunction.expressions) {
            return interpolationFunction.expressions;
        } else {
            var expressions = [];
            angular.forEach(interpolationFunction.parts, function(part) {
                if(angular.isFunction(part)) {
                    expressions.push(part.exp);
                }
            });
            return expressions;
        }
    };

    var registerWatchers = function(labelWatcherArray, interpolationFunction, viewScope, step) {
        angular.forEach(getExpression(interpolationFunction), function(expression) {
            var watcher = viewScope.$watch(expression, function() {
                step.fsBreadcrumbLabel = interpolationFunction(viewScope);
            });
            labelWatcherArray.push(watcher);
        });

    };

    var deregisterWatchers = function(labelWatcherArray) {
        angular.forEach(labelWatcherArray, function(deregisterWatch) {
            deregisterWatch();
        });
    };

    function BreadcrumbDirective($interpolate, $breadcrumb, $rootScope) {
        var $$templates = {
            bootstrap2: '<ul class="breadcrumb">' +
            '<li ng-repeat="step in steps" ng-switch="$last || !!step.abstract" ng-class="{active: $last}">' +
            '<a ng-switch-when="false" href="{{step.fsBreadcrumbLink}}">{{step.fsBreadcrumbLabel}}</a>' +
            '<span ng-switch-when="true">{{step.fsBreadcrumbLabel}}</span>' +
            '<span class="divider" ng-hide="$last">/</span>' +
            '</li>' +
            '</ul>',
            bootstrap3: '<ol class="breadcrumb">' +
            '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
            '<a ng-switch-when="false" href="{{step.fsBreadcrumbLink}}">{{step.fsBreadcrumbLabel}}</a>' +
            '<span ng-switch-when="true">{{step.fsBreadcrumbLabel}}</span>' +
            '</li>' +
            '</ol>'
        };

        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            template: $breadcrumb.getTemplate($$templates),
            templateUrl: $breadcrumb.getTemplateUrl(),
            link: {
                post: function postLink(scope) {
                    var labelWatchers = [];

                    var renderBreadcrumb = function() {
                        deregisterWatchers(labelWatchers);
                        labelWatchers = [];

                        var viewScope = $breadcrumb.$getLastViewScope();
                        scope.steps = $breadcrumb.getStatesChain();
                        angular.forEach(scope.steps, function (step) {
                            if (step.fsBreadcrumb && step.fsBreadcrumb.label) {
                                var parseLabel = $interpolate(step.fsBreadcrumb.label);
                                step.fsBreadcrumbLabel = parseLabel(viewScope);
                                // Watcher for further viewScope updates
                                registerWatchers(labelWatchers, parseLabel, viewScope, step);
                            } else {
                                step.fsBreadcrumbLabel = step.name;
                            }
                        });
                    };

                    $rootScope.$on('$viewContentLoaded', function (event) {
                        if(!event.targetScope.fsBreadcrumbIgnore) {
                            renderBreadcrumb();
                        }
                    });

                    // View(s) may be already loaded while the directive's linking
                    renderBreadcrumb();
                }
            }
        };
    }
    BreadcrumbDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope'];

    function BreadcrumbLastDirective($interpolate, $breadcrumb, $rootScope) {

        return {
            restrict: 'A',
            scope: {},
            template: '{{fsBreadcrumbLabel}}',
            compile: function(cElement, cAttrs) {

                // Override the default template if fsBreadcrumbLast has a value
                var template = cElement.attr(cAttrs.$attr.fsBreadcrumbLast);
                if(template) {
                    cElement.html(template);
                }

                return {
                    post: function postLink(scope) {
                        var labelWatchers = [];

                        var renderLabel = function() {
                            deregisterWatchers(labelWatchers);
                            labelWatchers = [];

                            var viewScope = $breadcrumb.$getLastViewScope();
                            var lastStep = $breadcrumb.getLastStep();
                            if(lastStep) {
                                scope.fsBreadcrumbLink = lastStep.fsBreadcrumbLink;
                                if (lastStep.fsBreadcrumb && lastStep.fsBreadcrumb.label) {
                                    var parseLabel = $interpolate(lastStep.fsBreadcrumb.label);
                                    scope.fsBreadcrumbLabel = parseLabel(viewScope);
                                    // Watcher for further viewScope updates
                                    // Tricky last arg: the last step is the entire scope of the directive !
                                    registerWatchers(labelWatchers, parseLabel, viewScope, scope);
                                } else {
                                    scope.fsBreadcrumbLabel = lastStep.name;
                                }
                            }
                        };

                        $rootScope.$on('$viewContentLoaded', function (event) {
                            if(!event.targetScope.fsBreadcrumbIgnore) {
                                renderLabel();
                            }
                        });

                        // View(s) may be already loaded while the directive's linking
                        renderLabel();
                    }
                };

            }
        };
    }
    BreadcrumbLastDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope'];

    function BreadcrumbTextDirective($interpolate, $breadcrumb, $rootScope) {

        return {
            restrict: 'A',
            scope: {},
            template: '{{fsBreadcrumbChain}}',

            compile: function(cElement, cAttrs) {
                // Override the default template if fsBreadcrumbText has a value
                var template = cElement.attr(cAttrs.$attr.fsBreadcrumbText);
                if(template) {
                    cElement.html(template);
                }

                var separator = cElement.attr(cAttrs.$attr.fsBreadcrumbTextSeparator) || ' / ';

                return {
                    post: function postLink(scope) {
                        var labelWatchers = [];

                        var registerWatchersText = function(labelWatcherArray, interpolationFunction, viewScope) {
                            angular.forEach(getExpression(interpolationFunction), function(expression) {
                                var watcher = viewScope.$watch(expression, function(newValue, oldValue) {
                                    if (newValue !== oldValue) {
                                        renderLabel();
                                    }
                                });
                                labelWatcherArray.push(watcher);
                            });
                        };

                        var renderLabel = function() {
                            deregisterWatchers(labelWatchers);
                            labelWatchers = [];

                            var viewScope = $breadcrumb.$getLastViewScope();
                            var steps = $breadcrumb.getStatesChain();
                            var combinedLabels = [];
                            angular.forEach(steps, function (step) {
                                if (step.fsBreadcrumb && step.fsBreadcrumb.label) {
                                    var parseLabel = $interpolate(step.fsBreadcrumb.label);
                                    combinedLabels.push(parseLabel(viewScope));
                                    // Watcher for further viewScope updates
                                    registerWatchersText(labelWatchers, parseLabel, viewScope);
                                } else {
                                    combinedLabels.push(step.name);
                                }
                            });

                            scope.fsBreadcrumbChain = combinedLabels.join(separator);
                        };

                        $rootScope.$on('$viewContentLoaded', function (event) {
                            if(!event.targetScope.fsBreadcrumbIgnore) {
                                renderLabel();
                            }
                        });

                        // View(s) may be already loaded while the directive's linking
                        renderLabel();
                    }
                };

            }
        };
    }
    BreadcrumbTextDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope'];


    angular.module('fish.breadcrumb', ['ui.router.state'])
        .provider('$breadcrumb', $Breadcrumb)
        .directive('fsBreadcrumb', BreadcrumbDirective)
        .directive('fsBreadcrumbLast', BreadcrumbLastDirective)
        .directive('fsBreadcrumbText', BreadcrumbTextDirective);

})(angular);
angular.module('fish.busy',[])
    .directive('fsBusy', ["$parse", function ($parse) {
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
    }]);
angular.module('fish.carousel',[])
    //global config
    .constant('fsCarouselConfig', {
        method: {},
        event: {}
    })
    .directive('fsCarousel', [
        '$timeout', 'fsCarouselConfig', function ($timeout, fsCarouselConfig) {
            var slickMethodList, slickEventList;
            slickMethodList = ['slickGoTo', 'slickNext', 'slickPrev', 'slickPause', 'slickPlay', 'slickAdd', 'slickRemove', 'slickFilter', 'slickUnfilter', 'unslick'];
            slickEventList = ['afterChange', 'beforeChange', 'breakpoint', 'destroy', 'edge', 'init', 'reInit', 'setPosition', 'swipe'];

            return {
                scope: {
                    settings: '=',
                    data: '=',
                    accessibility: '@',
                    adaptiveHeight: '@',
                    autoplay: '@',
                    autoplaySpeed: '@',
                    arrows: '@',
                    asNavFor: '@',
                    appendArrows: '@',
                    prevArrow: '@',
                    nextArrow: '@',
                    centerMode: '@',
                    centerPadding: '@',
                    cssEase: '@',
                    customPaging: '&',
                    dots: '@',
                    draggable: '@',
                    fade: '@',
                    focusOnSelect: '@',
                    easing: '@',
                    edgeFriction: '@',
                    infinite: '@',
                    initialSlide: '@',
                    lazyLoad: '@',
                    mobileFirst: '@',
                    pauseOnHover: '@',
                    pauseOnDotsHover: '@',
                    respondTo: '@',
                    responsive: '=?',
                    rows: '@',
                    slide: '@',
                    slidesPerRow: '@',
                    slidesToShow: '@',
                    slidesToScroll: '@',
                    speed: '@',
                    swipe: '@',
                    swipeToSlide: '@',
                    touchMove: '@',
                    touchThreshold: '@',
                    useCSS: '@',
                    variableWidth: '@',
                    vertical: '@',
                    verticalSwiping: '@',
                    rtl: '@'
                },
                restrict: 'AE',
                link: function (scope, element, attr) {
                    var options, initOptions, destroy, init, destroyAndInit, currentIndex = 0;

                    initOptions = function () {
                        options = angular.extend(angular.copy(fsCarouselConfig), {
                            accessibility: scope.accessibility !== 'false',
                            adaptiveHeight: scope.adaptiveHeight === 'true',
                            autoplay: scope.autoplay === 'true',
                            autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
                            arrows: scope.arrows !== 'false',
                            asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
                            appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
                            prevArrow: scope.prevArrow ? $(scope.prevArrow) : void 0,
                            nextArrow: scope.nextArrow ? $(scope.nextArrow) : void 0,
                            centerMode: scope.centerMode === 'true',
                            centerPadding: scope.centerPadding || '50px',
                            cssEase: scope.cssEase || 'ease',
                            customPaging: attr.customPaging ? customPaging : void 0,
                            dots: scope.dots === 'true',
                            draggable: scope.draggable !== 'false',
                            fade: scope.fade === 'true',
                            focusOnSelect: scope.focusOnSelect === 'true',
                            easing: scope.easing || 'linear',
                            edgeFriction: scope.edgeFriction || 0.15,
                            infinite: scope.infinite !== 'false',
                            initialSlide: scope.initialSlide || 0,
                            lazyLoad: scope.lazyLoad || 'ondemand',
                            mobileFirst: scope.mobileFirst === 'true',
                            pauseOnHover: scope.pauseOnHover !== 'false',
                            pauseOnDotsHover: scope.pauseOnDotsHover === "true",
                            respondTo: scope.respondTo != null ? scope.respondTo : 'window',
                            responsive: scope.responsive || void 0,
                            rows: scope.rows != null ? parseInt(scope.rows, 10) : 1,
                            slide: scope.slide || 'div',
                            slidesPerRow: scope.slidesPerRow != null ? parseInt(scope.slidesPerRow, 10) : 1,
                            slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
                            slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
                            speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
                            swipe: scope.swipe !== 'false',
                            swipeToSlide: scope.swipeToSlide === 'true',
                            touchMove: scope.touchMove !== 'false',
                            touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
                            useCSS: scope.useCSS !== 'false',
                            variableWidth: scope.variableWidth === 'true',
                            vertical: scope.vertical === 'true',
                            verticalSwiping: scope.verticalSwiping === 'true',
                            rtl: scope.rtl === 'true'
                        }, scope.settings);

                    };

                    destroy = function () {
                        var slickness = angular.element(element);
                        slickness.remove('slick-list');
                        slickness.slick('unslick');
                        return slickness;
                    };

                    init = function () {
                        return $timeout(function () {
                            initOptions();
                            var slickness = angular.element(element);

                            if (angular.element(element).hasClass('slick-initialized')) {
                                return slickness.slick('getSlick');
                            } else {

                                // Event
                                slickness.on('init', function (event, slick) {
                                    if (typeof options.event.init !== 'undefined') {
                                        options.event.init(event, slick);
                                    }
                                    if (currentIndex != null) {
                                        return slick.slideHandler(currentIndex);
                                    }
                                });

                                slickness.slick(options);
                            }
                            scope.internalControl = options.method || {};

                            // Method
                            slickMethodList.forEach(function (value) {
                                scope.internalControl[value] = function () {
                                    var args;
                                    args = Array.prototype.slice.call(arguments);
                                    args.unshift(value);
                                    slickness.slick.apply(element, args);
                                };
                            });

                            // Event
                            slickness.on('afterChange', function (event, slick, currentSlide, nextSlide) {
                                currentIndex = currentSlide;
                                if (typeof options.event.afterChange !== 'undefined') {
                                    options.event.afterChange(event, slick, currentSlide, nextSlide);
                                }
                            });

                            slickness.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                                if (typeof options.event.beforeChange !== 'undefined') {
                                    options.event.beforeChange(event, slick, currentSlide, nextSlide);
                                }
                            });

                            slickness.on('reInit', function (event, slick) {
                                if (typeof options.event.reInit !== 'undefined') {
                                    options.event.reInit(event, slick);
                                }
                            });

                            if (typeof options.event.breakpoint !== 'undefined') {
                                slickness.on('breakpoint', function (event, slick, breakpoint) {
                                    options.event.breakpoint(event, slick, breakpoint);
                                });
                            }
                            if (typeof options.event.destroy !== 'undefined') {
                                slickness.on('destroy', function (event, slick) {
                                    options.event.destroy(event, slick);
                                });
                            }
                            if (typeof options.event.edge !== 'undefined') {
                                slickness.on('edge', function (event, slick, direction) {
                                    options.event.edge(event, slick, direction);
                                });
                            }

                            if (typeof options.event.setPosition !== 'undefined') {
                                slickness.on('setPosition', function (event, slick) {
                                    options.event.setPosition(event, slick);
                                });
                            }
                            if (typeof options.event.swipe !== 'undefined') {
                                slickness.on('swipe', function (event, slick, direction) {
                                    options.event.swipe(event, slick, direction);
                                });
                            }

                        });
                    };

                    destroyAndInit = function () {
                        if (angular.element(element).hasClass('slick-initialized')) {
                            destroy();
                        }
                        $timeout(function () {
                            init();
                        }, 1);
                    };

                    element.one('$destroy', function () {
                        destroy();
                    });

                    scope.$watch('settings', function (newVal, oldVal) {
                        if (newVal !== null) {
                            return destroyAndInit();
                        }
                    }, true);

                    return scope.$watch('data', function (newVal, oldVal) {
                        if (newVal != null) {
                            return destroyAndInit();
                        }
                    }, true);


                }
            };
        }
    ]);
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

  .directive('fsCollapse', ["$window", "$animate", "$collapse", function($window, $animate, $collapse) {

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

  }])

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

  .directive('fsCollapseTarget', ["$animate", function($animate) {

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

  }]);

'use strict';

angular.module('fish.tooltip', ['fish.helpers'])

  .provider('$tooltip', function() {

    var defaults = this.defaults = {
      animation: 'fs-fade',
      customClass: '',
      prefixClass: 'tooltip',
      prefixEvent: 'tooltip',
      container: false,
      target: false,
      placement: 'top',
      templateUrl: 'tooltip/tooltip.tpl.html',
      template: '',
      contentTemplate: false,
      trigger: 'hover focus',
      keyboard: false,
      html: false,
      show: false,
      title: '',
      type: '',
      delay: 0,
      autoClose: false,
      fsEnabled: true,
      viewport: {
       selector: 'body',
       padding: 0
      }
    };

    this.$get = ["$window", "$rootScope", "$fsCompiler", "$q", "$templateCache", "$http", "$animate", "$sce", "dimensions", "$$rAF", "$timeout", function($window, $rootScope, $fsCompiler, $q, $templateCache, $http, $animate, $sce, dimensions, $$rAF, $timeout) {

      var trim = String.prototype.trim;
      var isTouch = 'createTouch' in $window.document;
      var htmlReplaceRegExp = /ng-bind="/ig;
      var $body = angular.element($window.document);

      function TooltipFactory(element, config) {

        var $tooltip = {};

        // Common vars
        var options = $tooltip.$options = angular.extend({}, defaults, config);
        var promise = $tooltip.$promise = $fsCompiler.compile(options);
        var scope = $tooltip.$scope = options.scope && options.scope.$new() || $rootScope.$new();

        var nodeName = element[0].nodeName.toLowerCase();
        if(options.delay && angular.isString(options.delay)) {
          var split = options.delay.split(',').map(parseFloat);
          options.delay = split.length > 1 ? {show: split[0], hide: split[1]} : split[0];
        }

        // Store $id to identify the triggering element in events
        // give priority to options.id, otherwise, try to use
        // element id if defined
        $tooltip.$id = options.id || element.attr('id') || '';

        // Support scope as string options
        if(options.title) {
          scope.title = $sce.trustAsHtml(options.title);
        }

        // Provide scope helpers
        scope.$setEnabled = function(isEnabled) {
          scope.$$postDigest(function() {
            $tooltip.setEnabled(isEnabled);
          });
        };
        scope.$hide = function() {
          scope.$$postDigest(function() {
            $tooltip.hide();
          });
        };
        scope.$show = function() {
          scope.$$postDigest(function() {
            $tooltip.show();
          });
        };
        scope.$toggle = function() {
          scope.$$postDigest(function() {
            $tooltip.toggle();
          });
        };
        // Publish isShown as a protected var on scope
        $tooltip.$isShown = scope.$isShown = false;

        // Private vars
        var timeout, hoverState;

        // Fetch, compile then initialize tooltip
        var compileData, tipElement, tipContainer, tipScope;
        promise.then(function(data) {
          compileData = data;
          $tooltip.init();
        });

        $tooltip.init = function() {

          // Options: delay
          if (options.delay && angular.isNumber(options.delay)) {
            options.delay = {
              show: options.delay,
              hide: options.delay
            };
          }

          // Replace trigger on touch devices ?
          // if(isTouch && options.trigger === defaults.trigger) {
          //   options.trigger.replace(/hover/g, 'click');
          // }

          // Options : container
          if(options.container === 'self') {
            tipContainer = element;
          } else if(angular.isElement(options.container)) {
            tipContainer = options.container;
          } else if(options.container) {
            tipContainer = findElement(options.container);
          }

          // Options: trigger
          bindTriggerEvents();

          // Options: target
          if(options.target) {
            options.target = angular.isElement(options.target) ? options.target : findElement(options.target);
          }

          // Options: show
          if(options.show) {
            scope.$$postDigest(function() {
              options.trigger === 'focus' ? element[0].focus() : $tooltip.show();
            });
          }

        };

        $tooltip.destroy = function() {

          // Unbind events
          unbindTriggerEvents();

          // Remove element
          destroyTipElement();

          // Destroy scope
          scope.$destroy();

        };

        $tooltip.enter = function() {

          clearTimeout(timeout);
          hoverState = 'in';
          if (!options.delay || !options.delay.show) {
            return $tooltip.show();
          }

          timeout = setTimeout(function() {
            if (hoverState ==='in') $tooltip.show();
          }, options.delay.show);

        };

        $tooltip.show = function() {
          if (!options.fsEnabled || $tooltip.$isShown) return;

          scope.$emit(options.prefixEvent + '.show.before', $tooltip);
          var parent, after;
          if (options.container) {
            parent = tipContainer;
            if (tipContainer[0].lastChild) {
              after = angular.element(tipContainer[0].lastChild);
            } else {
              after = null;
            }
          } else {
            parent = null;
            after = element;
          }


          // Hide any existing tipElement
          if(tipElement) destroyTipElement();
          // Fetch a cloned element linked from template
          tipScope = $tooltip.$scope.$new();
          tipElement = $tooltip.$element = compileData.link(tipScope, function(clonedElement, scope) {});

          // Set the initial positioning.  Make the tooltip invisible
          // so IE doesn't try to focus on it off screen.
          tipElement.css({top: '-9999px', left: '-9999px', right: 'auto', display: 'block', visibility: 'hidden'});

          // Options: animation
          if(options.animation) tipElement.addClass(options.animation);
          // Options: type
          if(options.type) tipElement.addClass(options.prefixClass + '-' + options.type);
          // Options: custom classes
          if(options.customClass) tipElement.addClass(options.customClass);

          // Append the element, without any animations.  If we append
          // using $animate.enter, some of the animations cause the placement
          // to be off due to the transforms.
          after ? after.after(tipElement) : parent.prepend(tipElement);

          $tooltip.$isShown = scope.$isShown = true;
          safeDigest(scope);

          // Now, apply placement
          $tooltip.$applyPlacement();

          // Once placed, animate it.
          // Support v1.2+ $animate
          // https://github.com/angular/angular.js/issues/11713
          if(angular.version.minor <= 2) {
            $animate.enter(tipElement, parent, after, enterAnimateCallback);
          } else {
            $animate.enter(tipElement, parent, after).then(enterAnimateCallback);
          }
          safeDigest(scope);

          $$rAF(function () {
            // Once the tooltip is placed and the animation starts, make the tooltip visible
            if(tipElement) tipElement.css({visibility: 'visible'});
          });

          // Bind events
          if(options.keyboard) {
            if(options.trigger !== 'focus') {
              $tooltip.focus();
            }
            bindKeyboardEvents();
          }

          if(options.autoClose) {
            bindAutoCloseEvents();
          }

        };

        function enterAnimateCallback() {
          scope.$emit(options.prefixEvent + '.show', $tooltip);
        }

        $tooltip.leave = function() {

          clearTimeout(timeout);
          hoverState = 'out';
          if (!options.delay || !options.delay.hide) {
            return $tooltip.hide();
          }
          timeout = setTimeout(function () {
            if (hoverState === 'out') {
              $tooltip.hide();
            }
          }, options.delay.hide);

        };

        var _blur;
        var _tipToHide;
        $tooltip.hide = function(blur) {

          if(!$tooltip.$isShown) return;
          scope.$emit(options.prefixEvent + '.hide.before', $tooltip);

          // store blur value for leaveAnimateCallback to use
          _blur = blur;

          // store current tipElement reference to use
          // in leaveAnimateCallback
          _tipToHide = tipElement;

          // Support v1.2+ $animate
          // https://github.com/angular/angular.js/issues/11713
          if(angular.version.minor <= 2) {
            $animate.leave(tipElement, leaveAnimateCallback);
          } else {
            $animate.leave(tipElement).then(leaveAnimateCallback);
          }

          $tooltip.$isShown = scope.$isShown = false;
          safeDigest(scope);

          // Unbind events
          if(options.keyboard && tipElement !== null) {
            unbindKeyboardEvents();
          }

          if(options.autoClose && tipElement !== null) {
            unbindAutoCloseEvents();
          }
        };

        function leaveAnimateCallback() {
          scope.$emit(options.prefixEvent + '.hide', $tooltip);

          // check if current tipElement still references
          // the same element when hide was called
          if (tipElement === _tipToHide) {
            // Allow to blur the input when hidden, like when pressing enter key
            if(_blur && options.trigger === 'focus') {
              return element[0].blur();
            }

            // clean up child scopes
            destroyTipElement();
          }
        }

        $tooltip.toggle = function() {
          $tooltip.$isShown ? $tooltip.leave() : $tooltip.enter();
        };

        $tooltip.focus = function() {
          tipElement[0].focus();
        };

        $tooltip.setEnabled = function(isEnabled) {
          options.fsEnabled = isEnabled;
        };

        $tooltip.setViewport = function(viewport) {
          options.viewport = viewport;
        };

        // Protected methods

        $tooltip.$applyPlacement = function() {
          if(!tipElement) return;

          // Determine if we're doing an auto or normal placement
          var placement = options.placement,
              autoToken = /\s?auto?\s?/i,
              autoPlace  = autoToken.test(placement);

          if (autoPlace) {
            placement = placement.replace(autoToken, '') || defaults.placement;
          }

          // Need to add the position class before we get
          // the offsets
          tipElement.addClass(options.placement);

          // Get the position of the target element
          // and the height and width of the tooltip so we can center it.
          var elementPosition = getPosition(),
              tipWidth = tipElement.prop('offsetWidth'),
              tipHeight = tipElement.prop('offsetHeight');

          // Refresh viewport position
          $tooltip.$viewport = options.viewport && findElement(options.viewport.selector || options.viewport);

          // If we're auto placing, we need to check the positioning
          if (autoPlace) {
            var originalPlacement = placement;
            var viewportPosition = getPosition($tooltip.$viewport);

            // Determine if the vertical placement
            if (originalPlacement.indexOf('bottom') >= 0 && elementPosition.bottom + tipHeight > viewportPosition.bottom) {
              placement = originalPlacement.replace('bottom', 'top');
            } else if (originalPlacement.indexOf('top') >= 0 && elementPosition.top - tipHeight < viewportPosition.top) {
              placement = originalPlacement.replace('top', 'bottom');
            }

            // Determine the horizontal placement
            // The exotic placements of left and right are opposite of the standard placements.  Their arrows are put on the left/right
            // and flow in the opposite direction of their placement.
            if ((originalPlacement === 'right' || originalPlacement === 'bottom-left' || originalPlacement === 'top-left') &&
                elementPosition.right + tipWidth > viewportPosition.width) {

              placement = originalPlacement === 'right' ? 'left' : placement.replace('left', 'right');
            } else if ((originalPlacement === 'left' || originalPlacement === 'bottom-right' || originalPlacement === 'top-right') &&
                elementPosition.left - tipWidth < viewportPosition.left) {

              placement = originalPlacement === 'left' ? 'right' : placement.replace('right', 'left');
            }

            tipElement.removeClass(originalPlacement).addClass(placement);
          }

          // Get the tooltip's top and left coordinates to center it with this directive.
          var tipPosition = getCalculatedOffset(placement, elementPosition, tipWidth, tipHeight);
          applyPlacement(tipPosition, placement);
        };

        $tooltip.$onKeyUp = function(evt) {
          if (evt.which === 27 && $tooltip.$isShown) {
            $tooltip.hide();
            evt.stopPropagation();
          }
        };

        $tooltip.$onFocusKeyUp = function(evt) {
          if (evt.which === 27) {
            element[0].blur();
            evt.stopPropagation();
          }
        };

        $tooltip.$onFocusElementMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          // Some browsers do not auto-focus buttons (eg. Safari)
          $tooltip.$isShown ? element[0].blur() : element[0].focus();
        };

        // bind/unbind events
        function bindTriggerEvents() {
          var triggers = options.trigger.split(' ');
          angular.forEach(triggers, function(trigger) {
            if(trigger === 'click') {
              element.on('click', $tooltip.toggle);
            } else if(trigger !== 'manual') {
              element.on(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
              element.on(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
              nodeName === 'button' && trigger !== 'hover' && element.on(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
            }
          });
        }

        function unbindTriggerEvents() {
          var triggers = options.trigger.split(' ');
          for (var i = triggers.length; i--;) {
            var trigger = triggers[i];
            if(trigger === 'click') {
              element.off('click', $tooltip.toggle);
            } else if(trigger !== 'manual') {
              element.off(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
              element.off(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
              nodeName === 'button' && trigger !== 'hover' && element.off(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
            }
          }
        }

        function bindKeyboardEvents() {
          if(options.trigger !== 'focus') {
            tipElement.on('keyup', $tooltip.$onKeyUp);
          } else {
            element.on('keyup', $tooltip.$onFocusKeyUp);
          }
        }

        function unbindKeyboardEvents() {
          if(options.trigger !== 'focus') {
            tipElement.off('keyup', $tooltip.$onKeyUp);
          } else {
            element.off('keyup', $tooltip.$onFocusKeyUp);
          }
        }

        var _autoCloseEventsBinded = false;
        function bindAutoCloseEvents() {
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            // Stop propagation when clicking inside tooltip
            tipElement.on('click', stopEventPropagation);

            // Hide when clicking outside tooltip
            $body.on('click', $tooltip.hide);

            _autoCloseEventsBinded = true;
          }, 0, false);
        }

        function unbindAutoCloseEvents() {
          if (_autoCloseEventsBinded) {
            tipElement.off('click', stopEventPropagation);
            $body.off('click', $tooltip.hide);
            _autoCloseEventsBinded = false;
          }
        }

        function stopEventPropagation(event) {
          event.stopPropagation();
        }

        // Private methods

        function getPosition($element) {
          $element = $element || (options.target || element);

          var el = $element[0],
              isBody = el.tagName === 'BODY';

          var elRect = el.getBoundingClientRect();
          var rect = {};

          // IE8 has issues with angular.extend and using elRect directly.
          // By coping the values of elRect into a new object, we can continue to use extend
          for (var p in elRect) {
            // DO NOT use hasOwnProperty when inspecting the return of getBoundingClientRect.
            rect[p] = elRect[p];
          }

          if (rect.width === null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            rect = angular.extend({}, rect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
          }
          var elOffset = isBody ? { top: 0, left: 0 } : dimensions.offset(el),
              scroll = { scroll:  isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.prop('scrollTop') || 0 },
              outerDims = isBody ? { width: document.documentElement.clientWidth, height: $window.innerHeight } : null;

          return angular.extend({}, rect, scroll, outerDims, elOffset);
        }

        function getCalculatedOffset(placement, position, actualWidth, actualHeight) {
          var offset;
          var split = placement.split('-');

          switch (split[0]) {
          case 'right':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left + position.width
            };
            break;
          case 'bottom':
            offset = {
              top: position.top + position.height,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;
          case 'left':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left - actualWidth
            };
            break;
          default:
            offset = {
              top: position.top - actualHeight,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;
          }

          if(!split[1]) {
            return offset;
          }

          // Add support for corners @todo css
          if(split[0] === 'top' || split[0] === 'bottom') {
            switch (split[1]) {
            case 'left':
              offset.left = position.left;
              break;
            case 'right':
              offset.left =  position.left + position.width - actualWidth;
            }
          } else if(split[0] === 'left' || split[0] === 'right') {
            switch (split[1]) {
            case 'top':
              offset.top = position.top - actualHeight;
              break;
            case 'bottom':
              offset.top = position.top + position.height;
            }
          }

          return offset;
        }

        function applyPlacement(offset, placement) {
          var tip = tipElement[0],
              width = tip.offsetWidth,
              height = tip.offsetHeight;

          // manually read margins because getBoundingClientRect includes difference
          var marginTop = parseInt(dimensions.css(tip, 'margin-top'), 10),
              marginLeft = parseInt(dimensions.css(tip, 'margin-left'), 10);

          // we must check for NaN for ie 8/9
          if (isNaN(marginTop)) marginTop  = 0;
          if (isNaN(marginLeft)) marginLeft = 0;

          offset.top  = offset.top + marginTop;
          offset.left = offset.left + marginLeft;

          // dimensions setOffset doesn't round pixel values
          // so we use setOffset directly with our own function
          dimensions.setOffset(tip, angular.extend({
            using: function (props) {
              tipElement.css({
                top: Math.round(props.top) + 'px',
                left: Math.round(props.left) + 'px',
                right: ''
              });
            }
          }, offset), 0);

          // check to see if placing tip in new offset caused the tip to resize itself
          var actualWidth = tip.offsetWidth,
              actualHeight = tip.offsetHeight;

          if (placement === 'top' && actualHeight !== height) {
            offset.top = offset.top + height - actualHeight;
          }

          // If it's an exotic placement, exit now instead of
          // applying a delta and changing the arrow
          if (/top-left|top-right|bottom-left|bottom-right/.test(placement)) return;

          var delta = getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

          if (delta.left) {
            offset.left += delta.left;
          } else {
            offset.top += delta.top;
          }

          dimensions.setOffset(tip, offset);

          if (/top|right|bottom|left/.test(placement)) {
            var isVertical = /top|bottom/.test(placement),
                arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight,
                arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

            replaceArrow(arrowDelta, tip[arrowOffsetPosition], isVertical);
          }
        }

        // @source https://github.com/twbs/bootstrap/blob/v3.3.5/js/tooltip.js#L380
        function getViewportAdjustedDelta(placement, position, actualWidth, actualHeight) {
          var delta = {top: 0, left: 0};
          if (!$tooltip.$viewport) return delta;

          var viewportPadding = options.viewport && options.viewport.padding || 0;
          var viewportDimensions = getPosition($tooltip.$viewport);

          if (/right|left/.test(placement)) {
            var topEdgeOffset = position.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = position.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
              delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
              delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
          } else {
            var leftEdgeOffset = position.left - viewportPadding;
            var rightEdgeOffset = position.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
              delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
              delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
          }

          return delta;
        }

        function replaceArrow(delta, dimension, isHorizontal) {
          var $arrow = findElement('.tooltip-arrow, .arrow', tipElement[0]);

          $arrow.css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
                .css(isHorizontal ? 'top' : 'left', '');
        }

        function destroyTipElement() {
          // Cancel pending callbacks
          clearTimeout(timeout);

          if($tooltip.$isShown && tipElement !== null) {
            if(options.autoClose) {
              unbindAutoCloseEvents();
            }

            if(options.keyboard) {
              unbindKeyboardEvents();
            }
          }

          if(tipScope) {
            tipScope.$destroy();
            tipScope = null;
          }

          if(tipElement) {
            tipElement.remove();
            tipElement = $tooltip.$element = null;
          }
        }

        return $tooltip;

      }

      // Helper functions

      function safeDigest(scope) {
        scope.$$phase || (scope.$root && scope.$root.$$phase) || scope.$digest();
      }

      function findElement(query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }

      var fetchPromises = {};
      function fetchTemplate(template) {
        if(fetchPromises[template]) return fetchPromises[template];
        return (fetchPromises[template] = $http.get(template, {cache: $templateCache}).then(function(res) {
          return res.data;
        }));
      }

      return TooltipFactory;

    }];

  })

  .directive('fsTooltip', ["$window", "$location", "$sce", "$tooltip", "$$rAF", function($window, $location, $sce, $tooltip, $$rAF) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'backdropAnimation', 'type', 'customClass', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['html', 'container'], function(key) {
          if(angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
            options[key] = false;
        });

        // should not parse target attribute (anchor tag), only data-target #1454
        var dataTarget = element.attr('data-target');
        if(angular.isDefined(dataTarget)) {
          if(falseValueRegExp.test(dataTarget))
            options.target = false;
          else
            options.target = dataTarget;
        }

        // overwrite inherited title value when no value specified
        // fix for angular 1.3.1 531a8de72c439d8ddd064874bf364c00cedabb11
        if (!scope.hasOwnProperty('title')){
          scope.title = '';
        }

        // Observe scope attributes for change
        attr.$observe('title', function(newValue) {
          if (angular.isDefined(newValue) || !scope.hasOwnProperty('title')) {
            var oldValue = scope.title;
            scope.title = $sce.trustAsHtml(newValue);
            angular.isDefined(oldValue) && $$rAF(function() {
              tooltip && tooltip.$applyPlacement();
            });
          }
        });

        // Support scope as an object
        attr.fsTooltip && scope.$watch(attr.fsTooltip, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.title = newValue;
          }
          angular.isDefined(oldValue) && $$rAF(function() {
            tooltip && tooltip.$applyPlacement();
          });
        }, true);

        // Visibility binding support
        attr.fsShow && scope.$watch(attr.fsShow, function(newValue, oldValue) {
          if(!tooltip || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(tooltip),?/i);
          newValue === true ? tooltip.show() : tooltip.hide();
        });

        // Enabled binding support
        attr.fsEnabled && scope.$watch(attr.fsEnabled, function(newValue, oldValue) {
          // console.warn('scope.$watch(%s)', attr.fsEnabled, newValue, oldValue);
          if(!tooltip || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|1|,?(tooltip),?/i);
          newValue === false ? tooltip.setEnabled(false) : tooltip.setEnabled(true);
        });

        // Viewport support
        attr.viewport && scope.$watch(attr.viewport, function (newValue) {
          if(!tooltip || !angular.isDefined(newValue)) return;
          tooltip.setViewport(newValue);
        });

        // Initialize popover
        var tooltip = $tooltip(element, options);

        // Garbage collection
        scope.$on('$destroy', function() {
          if(tooltip) tooltip.destroy();
          options = null;
          tooltip = null;
        });

      }
    };

  }]);

'use strict';

angular.module('fish.datepicker', [
  'fish.helpers',
  'fish.tooltip'])

  .provider('$datepicker', function() {

    var defaults = this.defaults = {
      animation: 'fs-fade',
      //uncommenting the following line will break backwards compatability
      // prefixEvent: 'datepicker',
      prefixClass: 'datepicker',
      placement: 'bottom-left',
      templateUrl: 'datepicker/datepicker.tpl.html',
      trigger: 'focus',
      showClearButton:true,
      clearText:'清除',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      // lang: $locale.id,
      useNative: false,
      dateType: 'date',
      dateFormat: 'shortDate',
      timezone: null,
      modelDateFormat: null,
      dayFormat: 'dd',
      monthFormat: 'MMM',
      yearFormat: 'yyyy',
      monthTitleFormat: 'MMMM yyyy',
      yearTitleFormat: 'yyyy',
      strictFormat: false,
      autoclose: false,
      minDate: -Infinity,
      maxDate: +Infinity,
      startView: 0,
      minView: 0,
      startWeek: 0,
      daysOfWeekDisabled: '',
      iconLeft: 'glyphicon glyphicon-chevron-left',
      iconRight: 'glyphicon glyphicon-chevron-right'
    };

    this.$get = ["$window", "$document", "$rootScope", "$sce", "$dateFormatter", "datepickerViews", "$tooltip", "$timeout", function($window, $document, $rootScope, $sce, $dateFormatter, datepickerViews, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
      var isTouch = ('createTouch' in $window.document) && isNative;
      if(!defaults.lang) defaults.lang = $dateFormatter.getDefaultLocale();

      function DatepickerFactory(element, controller, config) {

        var $datepicker = $tooltip(element, angular.extend({}, defaults, config));
        var parentScope = config.scope;
        var options = $datepicker.$options;
        var scope = $datepicker.$scope;
        if(options.startView) options.startView -= options.minView;

        // View vars

        var pickerViews = datepickerViews($datepicker);
        $datepicker.$views = pickerViews.views;
        var viewDate = pickerViews.viewDate;
        scope.$mode = options.startView;
        scope.$iconLeft = options.iconLeft;
        scope.$iconRight = options.iconRight;
        scope.$showClearButton = options.showClearButton;
        scope.$clearText = options.clearText;
        var $picker = $datepicker.$views[scope.$mode];

        // Scope methods

        scope.$select = function(date) {
          $datepicker.select(date);
        };
        scope.$selectPane = function(value) {
          $datepicker.$selectPane(value);
        };
        scope.$toggleMode = function() {
          $datepicker.setMode((scope.$mode + 1) % $datepicker.$views.length);
        };
        scope.$clear = function () {
          controller.$dateValue = null;
          controller.$setViewValue(null);
          controller.$render();

          if(options.autoclose) {
            $timeout(function () {
              $datepicker.hide(true);
            });
          }
        };
        // Public methods

        $datepicker.update = function(date) {
          // console.warn('$datepicker.update() newValue=%o', date);
          if(angular.isDate(date) && !isNaN(date.getTime())) {
            $datepicker.$date = date;
            $picker.update.call($picker, date);
          }
          // Build only if pristine
          $datepicker.$build(true);
        };

        $datepicker.updateDisabledDates = function(dateRanges) {
          options.disabledDateRanges = dateRanges;
          for(var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], $datepicker.$setDisabledEl);
          }
        };

        $datepicker.select = function(date, keep) {
          // console.warn('$datepicker.select', date, scope.$mode);
          if(!angular.isDate(controller.$dateValue)) controller.$dateValue = new Date(date);
          if(!scope.$mode || keep) {
            controller.$setViewValue(angular.copy(date));
            controller.$render();
            if(options.autoclose && !keep) {
              $timeout(function() { $datepicker.hide(true); });
            }
          } else {
            angular.extend(viewDate, {year: date.getFullYear(), month: date.getMonth(), date: date.getDate()});
            $datepicker.setMode(scope.$mode - 1);
            $datepicker.$build();
          }
        };

        $datepicker.setMode = function(mode) {
          // console.warn('$datepicker.setMode', mode);
          scope.$mode = mode;
          $picker = $datepicker.$views[scope.$mode];
          $datepicker.$build();
        };

        // Protected methods

        $datepicker.$build = function(pristine) {
          // console.warn('$datepicker.$build() viewDate=%o', viewDate);
          if(pristine === true && $picker.built) return;
          if(pristine === false && !$picker.built) return;
          $picker.build.call($picker);
        };

        $datepicker.$updateSelected = function() {
          for(var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], updateSelected);
          }
        };

        $datepicker.$isSelected = function(date) {
          return $picker.isSelected(date);
        };

        $datepicker.$setDisabledEl = function(el) {
          el.disabled = $picker.isDisabled(el.date);
        };

        $datepicker.$selectPane = function(value) {
          var steps = $picker.steps;
          // set targetDate to first day of month to avoid problems with
          // date values rollover. This assumes the viewDate does not
          // depend on the day of the month
          var targetDate = new Date(Date.UTC(viewDate.year + ((steps.year || 0) * value), viewDate.month + ((steps.month || 0) * value), 1));
          angular.extend(viewDate, {year: targetDate.getUTCFullYear(), month: targetDate.getUTCMonth(), date: targetDate.getUTCDate()});
          $datepicker.$build();
        };

        $datepicker.$onMouseDown = function(evt) {
          // Prevent blur on mousedown on .dropdown-menu
          evt.preventDefault();
          evt.stopPropagation();
          // Emulate click for mobile devices
          if(isTouch) {
            var targetEl = angular.element(evt.target);
            if(targetEl[0].nodeName.toLowerCase() !== 'button') {
              targetEl = targetEl.parent();
            }
            targetEl.triggerHandler('click');
          }
        };

        $datepicker.$onKeyDown = function(evt) {
          if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
          evt.preventDefault();
          evt.stopPropagation();

          if(evt.keyCode === 13) {
            if(!scope.$mode) {
              return $datepicker.hide(true);
            } else {
              return scope.$apply(function() { $datepicker.setMode(scope.$mode - 1); });
            }
          }

          // Navigate with keyboard
          $picker.onKeyDown(evt);
          parentScope.$digest();
        };

        // Private

        function updateSelected(el) {
          el.selected = $datepicker.$isSelected(el.date);
        }

        function focusElement() {
          element[0].focus();
        }

        // Overrides

        var _init = $datepicker.init;
        $datepicker.init = function() {
          if(isNative && options.useNative) {
            element.prop('type', 'date');
            element.css('-webkit-appearance', 'textfield');
            return;
          } else if(isTouch) {
            element.prop('type', 'text');
            element.attr('readonly', 'true');
            element.on('click', focusElement);
          }
          _init();
        };

        var _destroy = $datepicker.destroy;
        $datepicker.destroy = function() {
          if(isNative && options.useNative) {
            element.off('click', focusElement);
          }
          _destroy();
        };

        var _show = $datepicker.show;
        $datepicker.show = function() {
          if(/*(!isTouch && element.attr('readonly')) ||*/ element.attr('disabled')) return;
          _show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            // if $datepicker is no longer showing, don't setup events
            if(!$datepicker.$isShown) return;
            $datepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $datepicker.$onKeyDown);
            }
          }, 0, false);
        };

        var _hide = $datepicker.hide;
        $datepicker.hide = function(blur) {
          if(!$datepicker.$isShown) return;
          $datepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $datepicker.$onKeyDown);
          }
          _hide(blur);
        };

        return $datepicker;

      }

      DatepickerFactory.defaults = defaults;
      return DatepickerFactory;

    }];

  })

  .directive('fsDatepicker', ["$window", "$parse", "$q", "$dateFormatter", "$dateParser", "$datepicker", function($window, $parse, $q, $dateFormatter, $dateParser, $datepicker) {

    var defaults = $datepicker.defaults;
    var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'autoclose', 'dateType', 'dateFormat', 'timezone', 'modelDateFormat', 'dayFormat', 'strictFormat', 'startWeek', 'startDate', 'useNative', 'lang', 'startView', 'minView', 'iconLeft', 'iconRight', 'daysOfWeekDisabled', 'id', 'prefixClass', 'prefixEvent'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['html', 'container', 'autoclose', 'useNative'], function(key) {
          if(angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
            options[key] = false;
        });

        // Visibility binding support
        attr.fsShow && scope.$watch(attr.fsShow, function(newValue, oldValue) {
          if(!datepicker || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(datepicker),?/i);
          newValue === true ? datepicker.show() : datepicker.hide();
        });

        // Initialize datepicker
        var datepicker = $datepicker(element, controller, options);
        options = datepicker.$options;
        // Set expected iOS format
        if(isNative && options.useNative) options.dateFormat = 'yyyy-MM-dd';

        var lang = options.lang;

        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };

        var dateParser = $dateParser({format: options.dateFormat, lang: lang, strict: options.strictFormat});

        // Observe attributes for changes
        angular.forEach(['minDate', 'maxDate'], function(key) {
          // console.warn('attr.$observe(%s)', key, attr[key]);
          angular.isDefined(attr[key]) && attr.$observe(key, function(newValue) {
            // console.warn('attr.$observe(%s)=%o', key, newValue);
            datepicker.$options[key] = dateParser.getDateForAttribute(key, newValue);
            // Build only if dirty
            !isNaN(datepicker.$options[key]) && datepicker.$build(false);
            validateAgainstMinMaxDate(controller.$dateValue);
          });
        });

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          datepicker.update(controller.$dateValue);
        }, true);

        // Normalize undefined/null/empty array,
        // so that we don't treat changing from undefined->null as a change.
        function normalizeDateRanges(ranges) {
          if (!ranges || !ranges.length) return null;
          return ranges;
        }

        if (angular.isDefined(attr.disabledDates)) {
          scope.$watch(attr.disabledDates, function(disabledRanges, previousValue) {
            disabledRanges = normalizeDateRanges(disabledRanges);
            previousValue = normalizeDateRanges(previousValue);

            if (disabledRanges) {
              datepicker.updateDisabledDates(disabledRanges);
            }
          });
        }

        function validateAgainstMinMaxDate(parsedDate) {
          if (!angular.isDate(parsedDate)) return;
          var isMinValid = isNaN(datepicker.$options.minDate) || parsedDate.getTime() >= datepicker.$options.minDate;
          var isMaxValid = isNaN(datepicker.$options.maxDate) || parsedDate.getTime() <= datepicker.$options.maxDate;
          var isValid = isMinValid && isMaxValid;
          controller.$setValidity('date', isValid);
          controller.$setValidity('min', isMinValid);
          controller.$setValidity('max', isMaxValid);
          // Only update the model when we have a valid date
          if(isValid) controller.$dateValue = parsedDate;
        }

        // viewValue -> $parsers -> modelValue
        controller.$parsers.unshift(function(viewValue) {
          // console.warn('$parser("%s"): viewValue=%o', element.attr('ng-model'), viewValue);
          var date;
          // Null values should correctly reset the model value & validity
          if(!viewValue) {
            controller.$setValidity('date', true);
            // BREAKING CHANGE:
            // return null (not undefined) when input value is empty, so angularjs 1.3
            // ngModelController can go ahead and run validators, like ngRequired
            return null;
          }
          var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
          if(!parsedDate || isNaN(parsedDate.getTime())) {
            controller.$setValidity('date', false);
            // return undefined, causes ngModelController to
            // invalidate model value
            return;
          } else {
            validateAgainstMinMaxDate(parsedDate);
          }

          if(options.dateType === 'string') {
            date = dateParser.timezoneOffsetAdjust(parsedDate, options.timezone, true);
            return formatDate(date, options.modelDateFormat || options.dateFormat);
          }
          date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
          if(options.dateType === 'number') {
            return date.getTime();
          } else if(options.dateType === 'unix') {
            return date.getTime() / 1000;
          } else if(options.dateType === 'iso') {
            return date.toISOString();
          } else {
            return new Date(date);
          }
        });

        // modelValue -> $formatters -> viewValue
        controller.$formatters.push(function(modelValue) {
          // console.warn('$formatter("%s"): modelValue=%o (%o)', element.attr('ng-model'), modelValue, typeof modelValue);
          var date;
          if(angular.isUndefined(modelValue) || modelValue === null) {
            date = NaN;
          } else if(angular.isDate(modelValue)) {
            date = modelValue;
          } else if(options.dateType === 'string') {
            date = dateParser.parse(modelValue, null, options.modelDateFormat);
          } else if(options.dateType === 'unix') {
            date = new Date(modelValue * 1000);
          } else {
            date = new Date(modelValue);
          }
          // Setup default value?
          // if(isNaN(date.getTime())) {
          //   var today = new Date();
          //   date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
          // }
          controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
          return getDateFormattedString();
        });

        // viewValue -> element
        controller.$render = function() {
          // console.warn('$render("%s"): viewValue=%o', element.attr('ng-model'), controller.$viewValue);
          element.val(getDateFormattedString());
        };

        function getDateFormattedString() {
          return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.dateFormat);
        }

        // Garbage collection
        scope.$on('$destroy', function() {
          if(datepicker) datepicker.destroy();
          options = null;
          datepicker = null;
        });

      }
    };

  }])

  .provider('datepickerViews', function() {

    var defaults = this.defaults = {
      dayFormat: 'dd',
      daySplit: 7
    };

    // Split array into smaller arrays
    function split(arr, size) {
      var arrays = [];
      while(arr.length > 0) {
        arrays.push(arr.splice(0, size));
      }
      return arrays;
    }

    // Modulus operator
    function mod(n, m) {
      return ((n % m) + m) % m;
    }

    this.$get = ["$dateFormatter", "$dateParser", "$sce", function($dateFormatter, $dateParser, $sce) {

      return function(picker) {

        var scope = picker.$scope;
        var options = picker.$options;

        var lang = options.lang;
        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };
        var dateParser = $dateParser({format: options.dateFormat, lang: lang, strict: options.strictFormat});

        var weekDaysMin = $dateFormatter.weekdaysShort(lang);
        var weekDaysLabels = weekDaysMin.slice(options.startWeek).concat(weekDaysMin.slice(0, options.startWeek));
        var weekDaysLabelsHtml = $sce.trustAsHtml('<th class="dow text-center">' + weekDaysLabels.join('</th><th class="dow text-center">') + '</th>');

        var startDate = picker.$date || (options.startDate ? dateParser.getDateForAttribute('startDate', options.startDate) : new Date());
        var viewDate = {year: startDate.getFullYear(), month: startDate.getMonth(), date: startDate.getDate()};

        var views = [{
            format: options.dayFormat,
            split: 7,
            steps: { month: 1 },
            update: function(date, force) {
              if(!this.built || force || date.getFullYear() !== viewDate.year || date.getMonth() !== viewDate.month) {
                angular.extend(viewDate, {year: picker.$date.getFullYear(), month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$build();
              } else if(date.getDate() !== viewDate.date || date.getDate() === 1) {
                // chaging picker current month will cause viewDate.date to be set to first day of the month,
                // in $datepicker.$selectPane, so picker would not update selected day display if
                // user picks first day of the new month.
                // As a workaround, we are always forcing update when picked date is first day of month.
                viewDate.date = picker.$date.getDate();
                picker.$updateSelected();
              }
            },
            build: function() {
              var firstDayOfMonth = new Date(viewDate.year, viewDate.month, 1), firstDayOfMonthOffset = firstDayOfMonth.getTimezoneOffset();
              var firstDate = new Date(+firstDayOfMonth - mod(firstDayOfMonth.getDay() - options.startWeek, 7) * 864e5), firstDateOffset = firstDate.getTimezoneOffset();
              var today = dateParser.timezoneOffsetAdjust(new Date(), options.timezone).toDateString();
              // Handle daylight time switch
              if(firstDateOffset !== firstDayOfMonthOffset) firstDate = new Date(+firstDate + (firstDateOffset - firstDayOfMonthOffset) * 60e3);
              var days = [], day;
              for(var i = 0; i < 42; i++) { // < 7 * 6
                day = dateParser.daylightSavingAdjust(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i));
                days.push({date: day, isToday: day.toDateString() === today, label: formatDate(day, this.format), selected: picker.$date && this.isSelected(day), muted: day.getMonth() !== viewDate.month, disabled: this.isDisabled(day)});
              }
              scope.title = formatDate(firstDayOfMonth, options.monthTitleFormat);
              scope.showLabels = true;
              scope.labels = weekDaysLabelsHtml;
              scope.rows = split(days, this.split);
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth() && date.getDate() === picker.$date.getDate();
            },
            isDisabled: function(date) {
              var time = date.getTime();

              // Disabled because of min/max date.
              if (time < options.minDate || time > options.maxDate) return true;

              // Disabled due to being a disabled day of the week
              if (options.daysOfWeekDisabled.indexOf(date.getDay()) !== -1) return true;

              // Disabled because of disabled date range.
              if (options.disabledDateRanges) {
                for (var i = 0; i < options.disabledDateRanges.length; i++) {
                  if (time >= options.disabledDateRanges[i].start && time <= options.disabledDateRanges[i].end) {
                    return true;
                  }
                }
              }

              return false;
            },
            onKeyDown: function(evt) {
              if (!picker.$date) {
                return;
              }
              var actualTime = picker.$date.getTime();
              var newDate;

              if(evt.keyCode === 37) newDate = new Date(actualTime - 1 * 864e5);
              else if(evt.keyCode === 38) newDate = new Date(actualTime - 7 * 864e5);
              else if(evt.keyCode === 39) newDate = new Date(actualTime + 1 * 864e5);
              else if(evt.keyCode === 40) newDate = new Date(actualTime + 7 * 864e5);

              if (!this.isDisabled(newDate)) picker.select(newDate, true);
            }
          }, {
            name: 'month',
            format: options.monthFormat,
            split: 4,
            steps: { year: 1 },
            update: function(date, force) {
              if(!this.built || date.getFullYear() !== viewDate.year) {
                angular.extend(viewDate, {year: picker.$date.getFullYear(), month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$build();
              } else if(date.getMonth() !== viewDate.month) {
                angular.extend(viewDate, {month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$updateSelected();
              }
            },
            build: function() {
              var firstMonth = new Date(viewDate.year, 0, 1);
              var months = [], month;
              for (var i = 0; i < 12; i++) {
                month = new Date(viewDate.year, i, 1);
                months.push({date: month, label: formatDate(month, this.format), selected: picker.$isSelected(month), disabled: this.isDisabled(month)});
              }
              scope.title = formatDate(month, options.yearTitleFormat);
              scope.showLabels = false;
              scope.rows = split(months, this.split);
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth();
            },
            isDisabled: function(date) {
              var lastDate = +new Date(date.getFullYear(), date.getMonth() + 1, 0);
              return lastDate < options.minDate || date.getTime() > options.maxDate;
            },
            onKeyDown: function(evt) {
              if (!picker.$date) {
                return;
              }
              var actualMonth = picker.$date.getMonth();
              var newDate = new Date(picker.$date);

              if(evt.keyCode === 37) newDate.setMonth(actualMonth - 1);
              else if(evt.keyCode === 38) newDate.setMonth(actualMonth - 4);
              else if(evt.keyCode === 39) newDate.setMonth(actualMonth + 1);
              else if(evt.keyCode === 40) newDate.setMonth(actualMonth + 4);

              if (!this.isDisabled(newDate)) picker.select(newDate, true);
            }
          }, {
            name: 'year',
            format: options.yearFormat,
            split: 4,
            steps: { year: 12 },
            update: function(date, force) {
              if(!this.built || force || parseInt(date.getFullYear()/20, 10) !== parseInt(viewDate.year/20, 10)) {
                angular.extend(viewDate, {year: picker.$date.getFullYear(), month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$build();
              } else if(date.getFullYear() !== viewDate.year) {
                angular.extend(viewDate, {year: picker.$date.getFullYear(), month: picker.$date.getMonth(), date: picker.$date.getDate()});
                picker.$updateSelected();
              }
            },
            build: function() {
              var firstYear = viewDate.year - viewDate.year % (this.split * 3);
              var years = [], year;
              for (var i = 0; i < 12; i++) {
                year = new Date(firstYear + i, 0, 1);
                years.push({date: year, label: formatDate(year, this.format), selected: picker.$isSelected(year), disabled: this.isDisabled(year)});
              }
              scope.title = years[0].label + '-' + years[years.length - 1].label;
              scope.showLabels = false;
              scope.rows = split(years, this.split);
              this.built = true;
            },
            isSelected: function(date) {
              return picker.$date && date.getFullYear() === picker.$date.getFullYear();
            },
            isDisabled: function(date) {
              var lastDate = +new Date(date.getFullYear() + 1, 0, 0);
              return lastDate < options.minDate || date.getTime() > options.maxDate;
            },
            onKeyDown: function(evt) {
              if (!picker.$date) {
                return;
              }
              var actualYear = picker.$date.getFullYear(),
                  newDate = new Date(picker.$date);

              if(evt.keyCode === 37) newDate.setYear(actualYear - 1);
              else if(evt.keyCode === 38) newDate.setYear(actualYear - 4);
              else if(evt.keyCode === 39) newDate.setYear(actualYear + 1);
              else if(evt.keyCode === 40) newDate.setYear(actualYear + 4);

              if (!this.isDisabled(newDate)) picker.select(newDate, true);
            }
          }];

        return {
          views: options.minView ? Array.prototype.slice.call(views, options.minView) : views,
          viewDate: viewDate
        };

      };

    }];

  });

'use strict';

angular.module('fish.dropdown', ['fish.tooltip'])

  .provider('$dropdown', function() {

    var defaults = this.defaults = {
      animation: 'fs-fade',
      prefixClass: 'dropdown',
      prefixEvent: 'dropdown',
      placement: 'bottom-left',
      templateUrl: 'dropdown/dropdown.tpl.html',
      trigger: 'click',
      container: false,
      keyboard: true,
      html: false,
      delay: 0
    };

    this.$get = ["$window", "$rootScope", "$tooltip", "$timeout", function($window, $rootScope, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

      function DropdownFactory(element, config) {

        var $dropdown = {};

        // Common vars
        var options = angular.extend({}, defaults, config);
        var scope = $dropdown.$scope = options.scope && options.scope.$new() || $rootScope.$new();

        $dropdown = $tooltip(element, options);
        var parentEl = element.parent();

        // Protected methods

        $dropdown.$onKeyDown = function(evt) {
          if (!/(38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // Retrieve focused index
          var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
          if(!items.length) return;
          var index;
          angular.forEach(items, function(el, i) {
            if(matchesSelector && matchesSelector.call(el, ':focus')) index = i;
          });

          // Navigate with keyboard
          if(evt.keyCode === 38 && index > 0) index--;
          else if(evt.keyCode === 40 && index < items.length - 1) index++;
          else if(angular.isUndefined(index)) index = 0;
          items.eq(index)[0].focus();

        };

        // Overrides

        var show = $dropdown.show;
        $dropdown.show = function() {
          show();
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            options.keyboard && $dropdown.$element && $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
            bodyEl.on('click', onBodyClick);
          }, 0, false);
          parentEl.hasClass('dropdown') && parentEl.addClass('open');
        };

        var hide = $dropdown.hide;
        $dropdown.hide = function() {
          if(!$dropdown.$isShown) return;
          options.keyboard && $dropdown.$element && $dropdown.$element.off('keydown', $dropdown.$onKeyDown);
          bodyEl.off('click', onBodyClick);
          parentEl.hasClass('dropdown') && parentEl.removeClass('open');
          hide();
        };

        var destroy = $dropdown.destroy;
        $dropdown.destroy = function() {
          bodyEl.off('click', onBodyClick);
          destroy();
        };

        // Private functions

        function onBodyClick(evt) {
          if(evt.target === element[0]) return;
          return evt.target !== element[0] && $dropdown.hide();
        }

        return $dropdown;

      }

      return DropdownFactory;

    }];

  })

  .directive('fsDropdown', ["$window", "$sce", "$dropdown", function($window, $sce, $dropdown) {

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'id'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['html', 'container'], function(key) {
          if(angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
            options[key] = false;
        });

        // Support scope as an object
        attr.fsDropdown && scope.$watch(attr.fsDropdown, function(newValue, oldValue) {
          scope.content = newValue;
        }, true);

        // Visibility binding support
        attr.fsShow && scope.$watch(attr.fsShow, function(newValue, oldValue) {
          if(!dropdown || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(dropdown),?/i);
          newValue === true ? dropdown.show() : dropdown.hide();
        });

        // Initialize dropdown
        var dropdown = $dropdown(element, options);

        // Garbage collection
        scope.$on('$destroy', function() {
          if (dropdown) dropdown.destroy();
          options = null;
          dropdown = null;
        });

      }
    };

  }]);

/**!
 * AngularJS file upload/drop directive and service with progress and abort
 * @author  Danial  <danial.farid@gmail.com>
 * @version 7.2.1
 */

if (window.XMLHttpRequest && !(window.FileAPI && FileAPI.shouldLoad)) {
  window.XMLHttpRequest.prototype.setRequestHeader = (function (orig) {
    return function (header, value) {
      if (header === '__setXHR_') {
        var val = value(this);
        // fix for angular < 1.2.0
        if (val instanceof Function) {
          val(this);
        }
      } else {
        orig.apply(this, arguments);
      }
    };
  })(window.XMLHttpRequest.prototype.setRequestHeader);
}

var fsFileUpload = angular.module('fish.fileupload', []);

fsFileUpload.version = '7.2.1';

fsFileUpload.service('UploadBase', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
  function sendHttp(config) {
    config.method = config.method || 'POST';
    config.headers = config.headers || {};

    var deferred = $q.defer();
    var promise = deferred.promise;

    config.headers.__setXHR_ = function () {
      return function (xhr) {
        if (!xhr) return;
        config.__XHR = xhr;
        if (config.xhrFn) config.xhrFn(xhr);
        xhr.upload.addEventListener('progress', function (e) {
          e.config = config;
          if (deferred.notify) {
            deferred.notify(e);
          } else if (promise.progressFunc) {
            $timeout(function () {
              promise.progressFunc(e);
            });
          }
        }, false);
        //fix for firefox not firing upload progress end, also IE8-9
        xhr.upload.addEventListener('load', function (e) {
          if (e.lengthComputable) {
            e.config = config;
            if (deferred.notify) {
              deferred.notify(e);
            } else if (promise.progressFunc) {
              $timeout(function () {
                promise.progressFunc(e);
              });
            }
          }
        }, false);
      };
    };

    $http(config).then(function (r) {
      deferred.resolve(r);
    }, function (e) {
      deferred.reject(e);
    }, function (n) {
      deferred.notify(n);
    });

    promise.success = function (fn) {
      promise.then(function (response) {
        fn(response.data, response.status, response.headers, config);
      });
      return promise;
    };

    promise.error = function (fn) {
      promise.then(null, function (response) {
        fn(response.data, response.status, response.headers, config);
      });
      return promise;
    };

    promise.progress = function (fn) {
      promise.progressFunc = fn;
      promise.then(null, null, function (update) {
        fn(update);
      });
      return promise;
    };
    promise.abort = function () {
      if (config.__XHR) {
        $timeout(function () {
          config.__XHR.abort();
        });
      }
      return promise;
    };
    promise.xhr = function (fn) {
      config.xhrFn = (function (origXhrFn) {
        return function () {
          if (origXhrFn) origXhrFn.apply(promise, arguments);
          fn.apply(promise, arguments);
        };
      })(config.xhrFn);
      return promise;
    };

    return promise;
  }

  this.upload = function (config) {
    function addFieldToFormData(formData, val, key) {
      if (val !== undefined) {
        if (angular.isDate(val)) {
          val = val.toISOString();
        }
        if (angular.isString(val)) {
          formData.append(key, val);
        } else if (config.sendFieldsAs === 'form') {
          if (angular.isObject(val)) {
            for (var k in val) {
              if (val.hasOwnProperty(k)) {
                addFieldToFormData(formData, val[k], key + '[' + k + ']');
              }
            }
          } else {
            formData.append(key, val);
          }
        } else {
          val = angular.isString(val) ? val : angular.toJson(val);
          if (config.sendFieldsAs === 'json-blob') {
            formData.append(key, new Blob([val], {type: 'application/json'}));
          } else {
            formData.append(key, val);
          }
        }
      }
    }

    function isFile(file) {
      return file instanceof Blob || (file.flashId && file.name && file.size);
    }

    function addFileToFormData(formData, file, key) {
      if (isFile(file)) {
        formData.append(key, file, file.fileName || file.name);
      } else if (angular.isObject(file)) {
        for (var k in file) {
          if (file.hasOwnProperty(k)) {
            var split = k.split(',');
            if (split[1]) {
              file[k].fileName = split[1].replace(/^\s+|\s+$/g, '');
            }
            addFileToFormData(formData, file[k], split[0]);
          }
        }
      } else {
        throw 'Expected file object in Upload.upload file option: ' + file.toString();
      }
    }

    config.headers = config.headers || {};
    config.headers['Content-Type'] = undefined;
    config.transformRequest = config.transformRequest ?
      (angular.isArray(config.transformRequest) ?
        config.transformRequest : [config.transformRequest]) : [];
    config.transformRequest.push(function (data) {
      var formData = new FormData(), allFields = {}, key;
      for (key in config.fields) {
        if (config.fields.hasOwnProperty(key)) {
          allFields[key] = config.fields[key];
        }
      }
      if (data) allFields.data = data;
      for (key in allFields) {
        if (allFields.hasOwnProperty(key)) {
          var val = allFields[key];
          if (config.formDataAppender) {
            config.formDataAppender(formData, key, val);
          } else {
            addFieldToFormData(formData, val, key);
          }
        }
      }

      if (config.file != null) {
        if (angular.isArray(config.file)) {
          for (var i = 0; i < config.file.length; i++) {
            addFileToFormData(formData, config.file[i], 'file');
          }
        } else {
          addFileToFormData(formData, config.file, 'file');
        }
      }
      return formData;
    });

    return sendHttp(config);
  };

  this.http = function (config) {
    config.transformRequest = config.transformRequest || function (data) {
        if ((window.ArrayBuffer && data instanceof window.ArrayBuffer) || data instanceof Blob) {
          return data;
        }
        return $http.defaults.transformRequest[0].apply(this, arguments);
      };
    return sendHttp(config);
  };

  this.setDefaults = function (defaults) {
    this.defaults = defaults || {};
  };

  this.defaults = {};
  this.version = fsFileUpload.version;
}

]);

fsFileUpload.service('Upload', ['$parse', '$timeout', '$compile', 'UploadResize', function ($parse, $timeout, $compile, UploadResize) {
  var upload = UploadResize;
  upload.getAttrWithDefaults = function (attr, name) {
    return attr[name] != null ? attr[name] :
      (upload.defaults[name] == null ?
        upload.defaults[name] : upload.defaults[name].toString());
  };

  upload.attrGetter = function (name, attr, scope, params) {
    if (scope) {
      try {
        if (params) {
          return $parse(this.getAttrWithDefaults(attr, name))(scope, params);
        } else {
          return $parse(this.getAttrWithDefaults(attr, name))(scope);
        }
      } catch (e) {
        // hangle string value without single qoute
        if (name.search(/min|max|pattern/i)) {
          return this.getAttrWithDefaults(attr, name);
        } else {
          throw e;
        }
      }
    } else {
      return this.getAttrWithDefaults(attr, name);
    }
  };

  upload.updateModel = function (ngModel, attr, scope, fileChange, files, evt, noDelay) {
    function update() {
      var file = files && files.length ? files[0] : null;
      if (ngModel) {
        var singleModel = !upload.attrGetter('fsfMultiple', attr, scope) && !upload.attrGetter('multiple', attr) && !keep;
        $parse(upload.attrGetter('ngModel', attr)).assign(scope, singleModel ? file : files);
      }
      var fsfModel = upload.attrGetter('fsfModel', attr);
      if (fsfModel) {
        $parse(fsfModel).assign(scope, files);
      }

      if (fileChange) {
        $parse(fileChange)(scope, {
          $files: files,
          $file: file,
          $event: evt
        });
      }
      // scope apply changes
      $timeout(function () {
      });
    }

    var keep = upload.attrGetter('fsfKeep', attr, scope);
    if (keep === true) {
      if (!files || !files.length) {
        return;
      } else {
        var prevFiles = ((ngModel && ngModel.$modelValue) || attr.$$fsfPrevFiles || []).slice(0),
          hasNew = false;
        if (upload.attrGetter('fsfKeepDistinct', attr, scope) === true) {
          var len = prevFiles.length;
          for (var i = 0; i < files.length; i++) {
            for (var j = 0; j < len; j++) {
              if (files[i].name === prevFiles[j].name) break;
            }
            if (j === len) {
              prevFiles.push(files[i]);
              hasNew = true;
            }
          }
          if (!hasNew) return;
          files = prevFiles;
        } else {
          files = prevFiles.concat(files);
        }
      }
    }

    attr.$$fsfPrevFiles = files;

    function resize(files, callback) {
      var param = upload.attrGetter('fsfResize', attr, scope);
      if (!param) return callback();
      var count = files.length;
      var checkCallback = function () {
        count--;
        if (count === 0) callback();
      };
      var success = function (index) {
        return function (resizedFile) {
          files.splice(index, 1, resizedFile);
          checkCallback();
        };
      };
      var error = function (f) {
        return function (e) {
          checkCallback();
          f.$error = 'resize';
          f.$errorParam = (e ? (e.message ? e.message : e) + ': ' : '') + (f && f.name);
        };
      };
      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        if (!f.$error && f.type.indexOf('image') === 0) {
          upload.resize(f, param.width, param.height, param.quality).then(success(i), error(f));
        } else {
          checkCallback();
        }
      }
    }

    if (noDelay) {
      update();
    } else if (upload.validate(files, ngModel, attr, scope, upload.attrGetter('fsfValidateLater', attr), function () {
        resize(files, function () {
          $timeout(function () {
            update();
          });
        });
      }));
  };

  return upload;
}]);

fsFileUpload.directive('fsfSelect', ['$parse', '$timeout', '$compile', 'Upload', function ($parse, $timeout, $compile, Upload) {
  var generatedElems = [];

  function isDelayedClickSupported(ua) {
    // fix for android native browser < 4.4 and safari windows
    var m = ua.match(/Android[^\d]*(\d+)\.(\d+)/);
    if (m && m.length > 2) {
      var v = Upload.defaults.androidFixMinorVersion || 4;
      return parseInt(m[1]) < 4 || (parseInt(m[1]) === v && parseInt(m[2]) < v);
    }

    // safari on windows
    return ua.indexOf('Chrome') === -1 && /.*Windows.*Safari.*/.test(ua);
  }

  function linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile, upload) {
    /** @namespace attr.fsfSelect */
    /** @namespace attr.fsfChange */
    /** @namespace attr.ngModel */
    /** @namespace attr.fsfModel */
    /** @namespace attr.fsfMultiple */
    /** @namespace attr.fsfCapture */
    /** @namespace attr.fsfValidate */
    /** @namespace attr.fsfKeep */
    /** @namespace attr.fsfKeepDistinct */
    var attrGetter = function (name, scope) {
      return upload.attrGetter(name, attr, scope);
    };

    function isInputTypeFile() {
      return elem[0].tagName.toLowerCase() === 'input' && attr.type && attr.type.toLowerCase() === 'file';
    }

    function fileChangeAttr() {
      return attrGetter('fsfChange') || attrGetter('fsfSelect');
    }

    function changeFn(evt) {
      var fileList = evt.__files_ || (evt.target && evt.target.files), files = [];
      for (var i = 0; i < fileList.length; i++) {
        files.push(fileList[i]);
      }
      upload.updateModel(ngModel, attr, scope, fileChangeAttr(), files.length ? files : null, evt);
    }

    var unwatches = [];
    unwatches.push(scope.$watch(attrGetter('fsfMultiple'), function () {
      fileElem.attr('multiple', attrGetter('fsfMultiple', scope));
    }));
    unwatches.push(scope.$watch(attrGetter('fsfCapture'), function () {
      fileElem.attr('capture', attrGetter('fsfCapture', scope));
    }));
    attr.$observe('accept', function () {
      fileElem.attr('accept', attrGetter('accept'));
    });
    unwatches.push(function () {
      if (attr.$$observers) delete attr.$$observers.accept;
    });
    function bindAttrToFileInput(fileElem) {
      if (elem !== fileElem) {
        for (var i = 0; i < elem[0].attributes.length; i++) {
          var attribute = elem[0].attributes[i];
          if (attribute.name !== 'type' && attribute.name !== 'class' &&
            attribute.name !== 'id' && attribute.name !== 'style') {
            if (attribute.value == null || attribute.value === '') {
              if (attribute.name === 'required') attribute.value = 'required';
              if (attribute.name === 'multiple') attribute.value = 'multiple';
            }
            fileElem.attr(attribute.name, attribute.value);
          }
        }
      }
    }

    function createFileInput() {
      if (isInputTypeFile()) {
        return elem;
      }

      var fileElem = angular.element('<input type="file">');
      bindAttrToFileInput(fileElem);

      fileElem.css('visibility', 'hidden').css('position', 'absolute').css('overflow', 'hidden')
        .css('width', '0px').css('height', '0px').css('border', 'none')
        .css('margin', '0px').css('padding', '0px').attr('tabindex', '-1');
      generatedElems.push({el: elem, ref: fileElem});
      document.body.appendChild(fileElem[0]);

      return fileElem;
    }

    var initialTouchStartY = 0;

    function clickHandler(evt) {
      if (elem.attr('disabled') || attrGetter('fsfSelectDisabled', scope)) return false;

      var r = handleTouch(evt);
      if (r != null) return r;

      resetModel(evt);

      if (isDelayedClickSupported(navigator.userAgent)) {
        setTimeout(function () {
          fileElem[0].click();
        }, 0);
      } else {
        fileElem[0].click();
      }

      return false;
    }

    function handleTouch(evt) {
      var touches = evt.changedTouches || (evt.originalEvent && evt.originalEvent.changedTouches);
      if (evt.type === 'touchstart') {
        initialTouchStartY = touches ? touches[0].clientY : 0;
        return true; // don't block event default
      } else {
        evt.stopPropagation();
        evt.preventDefault();

        // prevent scroll from triggering event
        if (evt.type === 'touchend') {
          var currentLocation = touches ? touches[0].clientY : 0;
          if (Math.abs(currentLocation - initialTouchStartY) > 20) return false;
        }
      }
    }

    var fileElem = elem;

    function resetModel(evt) {
      if (fileElem.val()) {
        fileElem.val(null);
        upload.updateModel(ngModel, attr, scope, fileChangeAttr(), null, evt, true);
      }
    }

    if (!isInputTypeFile()) {
      fileElem = createFileInput();
    }
    fileElem.bind('change', changeFn);

    if (!isInputTypeFile()) {
      elem.bind('click touchstart touchend', clickHandler);
    } else {
      elem.bind('click', resetModel);
    }

    upload.registerValidators(ngModel, fileElem, attr, scope);

    function ie10SameFileSelectFix(evt) {
      if (fileElem && !fileElem.attr('__fsf_ie10_Fix_')) {
        if (!fileElem[0].parentNode) {
          fileElem = null;
          return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        fileElem.unbind('click');
        var clone = fileElem.clone();
        fileElem.replaceWith(clone);
        fileElem = clone;
        fileElem.attr('__fsf_ie10_Fix_', 'true');
        fileElem.bind('change', changeFn);
        fileElem.bind('click', ie10SameFileSelectFix);
        fileElem[0].click();
        return false;
      } else {
        fileElem.removeAttr('__fsf_ie10_Fix_');
      }
    }

    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
      fileElem.bind('click', ie10SameFileSelectFix);
    }

    scope.$on('$destroy', function () {
      if (!isInputTypeFile()) fileElem.remove();
      angular.forEach(unwatches, function (unwatch) {
        unwatch();
      });
    });

    $timeout(function () {
      for (var i = 0; i < generatedElems.length; i++) {
        var g = generatedElems[i];
        if (!document.body.contains(g.el[0])) {
          generatedElems.splice(i, 1);
          g.ref.remove();
        }
      }
    });

    if (window.FileAPI && window.FileAPI.fsfFixIE) {
      window.FileAPI.fsfFixIE(elem, fileElem, changeFn);
    }
  }

  return {
    restrict: 'AEC',
    require: '?ngModel',
    link: function (scope, elem, attr, ngModel) {
      linkFileSelect(scope, elem, attr, ngModel, $parse, $timeout, $compile, Upload);
    }
  };
}]);

(function () {

  fsFileUpload.service('UploadDataUrl', ['UploadBase', '$timeout', '$q', function (UploadBase, $timeout, $q) {
    var upload = UploadBase;
    upload.dataUrl = function (file, disallowObjectUrl) {
      if ((disallowObjectUrl && file.dataUrl != null) || (!disallowObjectUrl && file.blobUrl != null)) {
        var d = $q.defer();
        $timeout(function () {
          d.resolve(disallowObjectUrl ? file.dataUrl : file.blobUrl);
        });
        return d.promise;
      }
      var p = disallowObjectUrl ? file.$fsfDataUrlPromise : file.$fsfBlobUrlPromise;
      if (p) return p;

      var deferred = $q.defer();
      $timeout(function () {
        if (window.FileReader && file &&
          (!window.FileAPI || navigator.userAgent.indexOf('MSIE 8') === -1 || file.size < 20000) &&
          (!window.FileAPI || navigator.userAgent.indexOf('MSIE 9') === -1 || file.size < 4000000)) {
          //prefer URL.createObjectURL for handling refrences to files of all sizes
          //since it doesn´t build a large string in memory
          var URL = window.URL || window.webkitURL;
          if (URL && URL.createObjectURL && !disallowObjectUrl) {
            var url;
            try {
              url = URL.createObjectURL(file);
            } catch (e) {
              $timeout(function () {
                file.blobUrl = '';
                deferred.reject();
              });
              return;
            }
            $timeout(function () {
              file.blobUrl = url;
              if (url) deferred.resolve(url);
            });
          } else {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
              $timeout(function () {
                file.dataUrl = e.target.result;
                deferred.resolve(e.target.result);
              });
            };
            fileReader.onerror = function () {
              $timeout(function () {
                file.dataUrl = '';
                deferred.reject();
              });
            };
            fileReader.readAsDataURL(file);
          }
        } else {
          $timeout(function () {
            file[disallowObjectUrl ? 'dataUrl' : 'blobUrl'] = '';
            deferred.reject();
          });
        }
      });

      if (disallowObjectUrl) {
        p = file.$fsfDataUrlPromise = deferred.promise;
      } else {
        p = file.$fsfBlobUrlPromise = deferred.promise;
      }
      p['finally'](function () {
        delete file[disallowObjectUrl ? '$fsfDataUrlPromise' : '$fsfBlobUrlPromise'];
      });
      return p;
    };
    return upload;
  }]);

  function getTagType(el) {
    if (el.tagName.toLowerCase() === 'img') return 'image';
    if (el.tagName.toLowerCase() === 'audio') return 'audio';
    if (el.tagName.toLowerCase() === 'video') return 'video';
    return /\./;
  }

  var style = angular.element('<style>.fsf-hide{display:none !important}</style>');
  document.getElementsByTagName('head')[0].appendChild(style[0]);

  /** @namespace attr.fsfSrc */
  /** @namespace attr.fsfNoObjectUrl */
  fsFileUpload.directive('fsfSrc', ['$compile', '$timeout', 'Upload', function ($compile, $timeout, Upload) {
    return {
      restrict: 'AE',
      link: function (scope, elem, attr) {
        $timeout(function () {
          var unwatch = scope.$watch(attr.fsfSrc, function (file) {
            if (angular.isString(file)) {
              elem.removeClass('fsf-hide');
              return elem.attr('src', file);
            }
            if (file && file.type && file.type.indexOf(getTagType(elem[0])) === 0) {
              var disallowObjectUrl = Upload.attrGetter('fsfNoObjectUrl', attr, scope);
              Upload.dataUrl(file, disallowObjectUrl)['finally'](function () {
                $timeout(function () {
                  if (file.blobUrl || file.dataUrl) {
                    elem.removeClass('fsf-hide');
                    elem.attr('src', (disallowObjectUrl ? file.dataUrl : file.blobUrl) || file.dataUrl);
                  } else {
                    elem.addClass('fsf-hide');
                  }
                });
              });
            } else {
              elem.addClass('fsf-hide');
            }
          });

          scope.$on('$destroy', function () {
            unwatch();
          });
        });
      }
    };
  }]);

  /** @namespace attr.fsfBackground */
  /** @namespace attr.fsfNoObjectUrl */
  fsFileUpload.directive('fsfBackground', ['Upload', '$compile', '$timeout', function (Upload, $compile, $timeout) {
    return {
      restrict: 'AE',
      link: function (scope, elem, attr) {
        $timeout(function () {
          var unwatch = scope.$watch(attr.fsfBackground, function (file) {
            if (angular.isString(file)) return elem.css('background-image', 'url(\'' + file + '\')');
            if (file && file.type && file.type.indexOf('image') === 0) {
              var disallowObjectUrl = Upload.attrGetter('fsfNoObjectUrl', attr, scope);
              Upload.dataUrl(file, disallowObjectUrl)['finally'](function () {
                $timeout(function () {
                  if ((disallowObjectUrl && file.dataUrl) || (!disallowObjectUrl && file.blobUrl)) {
                    elem.css('background-image', 'url(\'' + (disallowObjectUrl ? file.dataUrl : file.blobUrl) + '\')');
                  } else {
                    elem.css('background-image', '');
                  }
                });
              });
            } else {
              elem.css('background-image', '');
            }
          });
          scope.$on('$destroy', function () {
            unwatch();
          });
        });
      }
    };
  }]);

  fsFileUpload.config(['$compileProvider', function ($compileProvider) {
    if ($compileProvider.imgSrcSanitizationWhitelist) $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|local|file|data|blob):/);
    if ($compileProvider.aHrefSanitizationWhitelist) $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|local|file|data|blob):/);
  }]);

  fsFileUpload.filter('fsfDataUrl', ['UploadDataUrl', '$sce', function (UploadDataUrl, $sce) {
    return function (file, disallowObjectUrl) {
      if (angular.isString(file)) {
        return $sce.trustAsResourceUrl(file);
      }
      if (file && !file.dataUrl) {
        if (file.dataUrl === undefined && angular.isObject(file)) {
          file.dataUrl = null;
          UploadDataUrl.dataUrl(file, disallowObjectUrl);
        }
        return '';
      }
      return (file && file.dataUrl ? $sce.trustAsResourceUrl(file.dataUrl) : file) || '';
    };
  }]);

})();

fsFileUpload.service('UploadValidate', ['UploadDataUrl', '$q', '$timeout', function (UploadDataUrl, $q, $timeout) {
  var upload = UploadDataUrl;

  function globStringToRegex(str) {
    if (str.length > 2 && str[0] === '/' && str[str.length - 1] === '/') {
      return str.substring(1, str.length - 1);
    }
    var split = str.split(','), result = '';
    if (split.length > 1) {
      for (var i = 0; i < split.length; i++) {
        result += '(' + globStringToRegex(split[i]) + ')';
        if (i < split.length - 1) {
          result += '|';
        }
      }
    } else {
      if (str.indexOf('.') === 0) {
        str = '*' + str;
      }
      result = '^' + str.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + '-]', 'g'), '\\$&') + '$';
      result = result.replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
    }
    return result;
  }

  function translateScalars(str) {
    if (angular.isString(str)) {
      if (str.search(/kb/i) === str.length - 2) {
        return parseFloat(str.substring(0, str.length - 2) * 1000);
      } else if (str.search(/mb/i) === str.length - 2) {
        return parseFloat(str.substring(0, str.length - 2) * 1000000);
      } else if (str.search(/gb/i) === str.length - 2) {
        return parseFloat(str.substring(0, str.length - 2) * 1000000000);
      } else if (str.search(/b/i) === str.length - 1) {
        return parseFloat(str.substring(0, str.length - 1));
      } else if (str.search(/s/i) === str.length - 1) {
        return parseFloat(str.substring(0, str.length - 1));
      } else if (str.search(/m/i) === str.length - 1) {
        return parseFloat(str.substring(0, str.length - 1) * 60);
      } else if (str.search(/h/i) === str.length - 1) {
        return parseFloat(str.substring(0, str.length - 1) * 3600);
      }
    }
    return str;
  }

  upload.registerValidators = function (ngModel, elem, attr, scope) {
    if (!ngModel) return;

    ngModel.$fsfValidations = [];
    function setValidities(ngModel) {
      angular.forEach(ngModel.$fsfValidations, function (validation) {
        ngModel.$setValidity(validation.name, validation.valid);
      });
    }

    ngModel.$formatters.push(function (val) {
      if (upload.attrGetter('fsfValidateLater', attr, scope) || !ngModel.$$fsfValidated) {
        upload.validate(val, ngModel, attr, scope, false, function () {
          setValidities(ngModel);
          ngModel.$$fsfValidated = false;
        });
        if (val && val.length === 0) {
          val = null;
        }
        if (elem && (val == null || val.length === 0)) {
          if (elem.val()) {
            elem.val(null);
          }
        }
      } else {
        setValidities(ngModel);
        ngModel.$$fsfValidated = false;
      }
      return val;
    });
  };

  upload.validatePattern = function (file, val) {
    if (!val) {
      return true;
    }
    var regexp = new RegExp(globStringToRegex(val), 'gi');
    return (file.type != null && regexp.test(file.type.toLowerCase())) ||
      (file.name != null && regexp.test(file.name.toLowerCase()));
  };

  upload.validate = function (files, ngModel, attr, scope, later, callback) {
    ngModel = ngModel || {};
    ngModel.$fsfValidations = ngModel.$fsfValidations || [];

    angular.forEach(ngModel.$fsfValidations, function (v) {
      v.valid = true;
    });

    var attrGetter = function (name, params) {
      return upload.attrGetter(name, attr, scope, params);
    };

    if (later) {
      callback.call(ngModel);
      return;
    }
    ngModel.$$fsfValidated = true;

    if (files == null || files.length === 0) {
      callback.call(ngModel);
      return;
    }

    files = files.length === undefined ? [files] : files.slice(0);

    function validateSync(name, validatorVal, fn) {
      if (files) {
        var dName = 'fsf' + name[0].toUpperCase() + name.substr(1);
        var i = files.length, valid = null;

        while (i--) {
          var file = files[i];
          var val = attrGetter(dName, {'$file': file});
          if (val == null) {
            val = validatorVal(attrGetter('fsfValidate') || {});
            valid = valid == null ? true : valid;
          }
          if (val != null) {
            if (!fn(file, val)) {
              file.$error = name;
              file.$errorParam = val;
              files.splice(i, 1);
              valid = false;
            }
          }
        }
        if (valid !== null) {
          ngModel.$fsfValidations.push({name: name, valid: valid});
        }
      }
    }

    validateSync('pattern', function (cons) {
      return cons.pattern;
    }, upload.validatePattern);
    validateSync('minSize', function (cons) {
      return cons.size && cons.size.min;
    }, function (file, val) {
      return file.size >= translateScalars(val);
    });
    validateSync('maxSize', function (cons) {
      return cons.size && cons.size.max;
    }, function (file, val) {
      return file.size <= translateScalars(val);
    });

    validateSync('validateFn', function () {
      return null;
    }, function (file, r) {
      return r === true || r === null || r === '';
    });

    if (!files.length) {
      callback.call(ngModel, ngModel.$fsfValidations);
      return;
    }

    var pendings = 0;

    function validateAsync(name, validatorVal, type, asyncFn, fn) {
      if (files) {
        var thisPendings = 0, hasError = false, dName = 'fsf' + name[0].toUpperCase() + name.substr(1);
        files = files.length === undefined ? [files] : files;
        angular.forEach(files, function (file) {
          if (file.type.search(type) !== 0) {
            return true;
          }
          var val = attrGetter(dName, {'$file': file}) || validatorVal(attrGetter('fsfValidate', {'$file': file}) || {});
          if (val) {
            pendings++;
            thisPendings++;
            asyncFn(file, val).then(function (d) {
              if (!fn(d, val)) {
                file.$error = name;
                file.$errorParam = val;
                hasError = true;
              }
            }, function () {
              if (attrGetter('fsfValidateForce', {'$file': file})) {
                file.$error = name;
                file.$errorParam = val;
                hasError = true;
              }
            })['finally'](function () {
              pendings--;
              thisPendings--;
              if (!thisPendings) {
                ngModel.$fsfValidations.push({name: name, valid: !hasError});
              }
              if (!pendings) {
                callback.call(ngModel, ngModel.$fsfValidations);
              }
            });
          }
        });
      }
    }

    validateAsync('maxHeight', function (cons) {
      return cons.height && cons.height.max;
    }, /image/, this.imageDimensions, function (d, val) {
      return d.height <= val;
    });
    validateAsync('minHeight', function (cons) {
      return cons.height && cons.height.min;
    }, /image/, this.imageDimensions, function (d, val) {
      return d.height >= val;
    });
    validateAsync('maxWidth', function (cons) {
      return cons.width && cons.width.max;
    }, /image/, this.imageDimensions, function (d, val) {
      return d.width <= val;
    });
    validateAsync('minWidth', function (cons) {
      return cons.width && cons.width.min;
    }, /image/, this.imageDimensions, function (d, val) {
      return d.width >= val;
    });
    validateAsync('ratio', function (cons) {
      return cons.ratio;
    }, /image/, this.imageDimensions, function (d, val) {
      var split = val.toString().split(','), valid = false;

      for (var i = 0; i < split.length; i++) {
        var r = split[i], xIndex = r.search(/x/i);
        if (xIndex > -1) {
          r = parseFloat(r.substring(0, xIndex)) / parseFloat(r.substring(xIndex + 1));
        } else {
          r = parseFloat(r);
        }
        if (Math.abs((d.width / d.height) - r) < 0.0001) {
          valid = true;
        }
      }
      return valid;
    });
    validateAsync('maxDuration', function (cons) {
      return cons.duration && cons.duration.max;
    }, /audio|video/, this.mediaDuration, function (d, val) {
      return d <= translateScalars(val);
    });
    validateAsync('minDuration', function (cons) {
      return cons.duration && cons.duration.min;
    }, /audio|video/, this.mediaDuration, function (d, val) {
      return d >= translateScalars(val);
    });

    validateAsync('validateAsyncFn', function () {
      return null;
    }, /./, function (file, val) {
      return val;
    }, function (r) {
      return r === true || r === null || r === '';
    });

    if (!pendings) {
      callback.call(ngModel, ngModel.$fsfValidations);
    }
  };

  upload.imageDimensions = function (file) {
    if (file.width && file.height) {
      var d = $q.defer();
      $timeout(function () {
        d.resolve({width: file.width, height: file.height});
      });
      return d.promise;
    }
    if (file.$fsfDimensionPromise) return file.$fsfDimensionPromise;

    var deferred = $q.defer();
    $timeout(function () {
      if (file.type.indexOf('image') !== 0) {
        deferred.reject('not image');
        return;
      }
      upload.dataUrl(file).then(function (dataUrl) {
        var img = angular.element('<img>').attr('src', dataUrl).css('visibility', 'hidden').css('position', 'fixed');

        function success() {
          var width = img[0].clientWidth;
          var height = img[0].clientHeight;
          img.remove();
          file.width = width;
          file.height = height;
          deferred.resolve({width: width, height: height});
        }

        function error() {
          img.remove();
          deferred.reject('load error');
        }

        img.on('load', success);
        img.on('error', error);
        var count = 0;

        function checkLoadError() {
          $timeout(function () {
            if (img[0].parentNode) {
              if (img[0].clientWidth) {
                success();
              } else if (count > 10) {
                error();
              } else {
                checkLoadError();
              }
            }
          }, 1000);
        }

        checkLoadError();

        angular.element(document.getElementsByTagName('body')[0]).append(img);
      }, function () {
        deferred.reject('load error');
      });
    });

    file.$fsfDimensionPromise = deferred.promise;
    file.$fsfDimensionPromise['finally'](function () {
      delete file.$fsfDimensionPromise;
    });
    return file.$fsfDimensionPromise;
  };

  upload.mediaDuration = function (file) {
    if (file.duration) {
      var d = $q.defer();
      $timeout(function () {
        d.resolve(file.duration);
      });
      return d.promise;
    }
    if (file.$fsfDurationPromise) return file.$fsfDurationPromise;

    var deferred = $q.defer();
    $timeout(function () {
      if (file.type.indexOf('audio') !== 0 && file.type.indexOf('video') !== 0) {
        deferred.reject('not media');
        return;
      }
      upload.dataUrl(file).then(function (dataUrl) {
        var el = angular.element(file.type.indexOf('audio') === 0 ? '<audio>' : '<video>')
          .attr('src', dataUrl).css('visibility', 'none').css('position', 'fixed');

        function success() {
          var duration = el[0].duration;
          file.duration = duration;
          el.remove();
          deferred.resolve(duration);
        }

        function error() {
          el.remove();
          deferred.reject('load error');
        }

        el.on('loadedmetadata', success);
        el.on('error', error);
        var count = 0;

        function checkLoadError() {
          $timeout(function () {
            if (el[0].parentNode) {
              if (el[0].duration) {
                success();
              } else if (count > 10) {
                error();
              } else {
                checkLoadError();
              }
            }
          }, 1000);
        }

        checkLoadError();

        angular.element(document.body).append(el);
      }, function () {
        deferred.reject('load error');
      });
    });

    file.$fsfDurationPromise = deferred.promise;
    file.$fsfDurationPromise['finally'](function () {
      delete file.$fsfDurationPromise;
    });
    return file.$fsfDurationPromise;
  };
  return upload;
}
]);

// source: Source: https://github.com/romelgomez/angular-firebase-image-upload/blob/master/app/scripts/fileUpload.js#L89

fsFileUpload.service('UploadResize', ['UploadValidate', '$q', '$timeout', function (UploadValidate, $q, $timeout) {
  var upload = UploadValidate;

  /**
   * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
   * images to fit into a certain area.
   * Source:  http://stackoverflow.com/a/14731922
   *
   * @param {Number} srcWidth Source area width
   * @param {Number} srcHeight Source area height
   * @param {Number} maxWidth Nestable area maximum available width
   * @param {Number} maxHeight Nestable area maximum available height
   * @return {Object} { width, height }
   */
  var calculateAspectRatioFit = function (srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {width: srcWidth * ratio, height: srcHeight * ratio};
  };

  /**
   Reduce imagen size and quality.
   @param {String} imagen is a base64 string
   @param {Number} width
   @param {Number} height
   @param {Number} quality from 0.1 to 1.0
   @return Promise.<String>
   **/
  var resize = function (imagen, width, height, quality, type) {
    var deferred = $q.defer();
    var canvasElement = document.createElement('canvas');
    var imagenElement = document.createElement('img');
    imagenElement.onload = function () {
      try {
        var dimensions = calculateAspectRatioFit(imagenElement.width, imagenElement.height, width, height);
        canvasElement.width = dimensions.width;
        canvasElement.height = dimensions.height;
        var context = canvasElement.getContext('2d');
        context.drawImage(imagenElement, 0, 0, dimensions.width, dimensions.height);
        deferred.resolve(canvasElement.toDataURL(type || 'image/WebP', quality || 1.0));
      } catch(e) {
        deferred.reject(e);
      }
    };
    imagenElement.onerror = function () {
      deferred.reject();
    };
    imagenElement.src = imagen;
    return deferred.promise;
  };

  var dataURLtoBlob = function (dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  };

  upload.resize = function (file, width, height, quality) {
    var deferred = $q.defer();
    if (file.type.indexOf('image') !== 0) {
      $timeout(function() {deferred.resolve('Only images are allowed for resizing!');});
      return deferred.promise;
    }

    upload.dataUrl(file, true).then(function (url) {
      resize(url, width, height, quality, file.type).then(function (dataUrl) {
        var blob= dataURLtoBlob(dataUrl);
        blob.name = file.name;
        deferred.resolve(blob);
      }, function () {
        deferred.reject();
      });
    }, function () {
      deferred.reject();
    });
    return deferred.promise;
  };

  return upload;
}]);

(function () {
  fsFileUpload.directive('fsfDrop', ['$parse', '$timeout', '$location', 'Upload',
    function ($parse, $timeout, $location, Upload) {
      return {
        restrict: 'AEC',
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {
          linkDrop(scope, elem, attr, ngModel, $parse, $timeout, $location, Upload);
        }
      };
    }]);

  fsFileUpload.directive('fsfNoFileDrop', function () {
    return function (scope, elem) {
      if (dropAvailable()) elem.css('display', 'none');
    };
  });

  fsFileUpload.directive('fsfDropAvailable', ['$parse', '$timeout', 'Upload', function ($parse, $timeout, Upload) {
    return function (scope, elem, attr) {
      if (dropAvailable()) {
        var model = $parse(Upload.attrGetter('fsfDropAvailable', attr));
        $timeout(function () {
          model(scope);
          if (model.assign) {
            model.assign(scope, true);
          }
        });
      }
    };
  }]);

  function linkDrop(scope, elem, attr, ngModel, $parse, $timeout, $location, upload) {
    var available = dropAvailable();

    var attrGetter = function (name, scope, params) {
      return upload.attrGetter(name, attr, scope, params);
    };

    if (attrGetter('dropAvailable')) {
      $timeout(function () {
        if (scope[attrGetter('dropAvailable')]) {
          scope[attrGetter('dropAvailable')].value = available;
        } else {
          scope[attrGetter('dropAvailable')] = available;
        }
      });
    }
    if (!available) {
      if (attrGetter('fsfHideOnDropNotAvailable', scope) === true) {
        elem.css('display', 'none');
      }
      return;
    }

    function isDisabled() {
      return elem.attr('disabled') || attrGetter('fsfDropDisabled', scope);
    }

    upload.registerValidators(ngModel, null, attr, scope);

    var leaveTimeout = null;
    var stopPropagation = $parse(attrGetter('fsfStopPropagation'));
    var dragOverDelay = 1;
    var actualDragOverClass;

    elem[0].addEventListener('dragover', function (evt) {
      if (isDisabled()) return;
      evt.preventDefault();
      if (stopPropagation(scope)) evt.stopPropagation();
      // handling dragover events from the Chrome download bar
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        var b = evt.dataTransfer.effectAllowed;
        evt.dataTransfer.dropEffect = ('move' === b || 'linkMove' === b) ? 'move' : 'copy';
      }
      $timeout.cancel(leaveTimeout);
      if (!actualDragOverClass) {
        actualDragOverClass = 'C';
        calculateDragOverClass(scope, attr, evt, function (clazz) {
          actualDragOverClass = clazz;
          elem.addClass(actualDragOverClass);
        });
      }
    }, false);
    elem[0].addEventListener('dragenter', function (evt) {
      if (isDisabled()) return;
      evt.preventDefault();
      if (stopPropagation(scope)) evt.stopPropagation();
    }, false);
    elem[0].addEventListener('dragleave', function () {
      if (isDisabled()) return;
      leaveTimeout = $timeout(function () {
        elem.removeClass(actualDragOverClass);
        actualDragOverClass = null;
      }, dragOverDelay || 1);
    }, false);
    elem[0].addEventListener('drop', function (evt) {
      if (isDisabled()) return;
      evt.preventDefault();
      if (stopPropagation(scope)) evt.stopPropagation();
      elem.removeClass(actualDragOverClass);
      actualDragOverClass = null;
      extractFiles(evt, function (files) {
          upload.updateModel(ngModel, attr, scope, attrGetter('fsfChange') || attrGetter('fsfDrop'), files, evt);
        }, attrGetter('fsfAllowDir', scope) !== false,
        attrGetter('multiple') || attrGetter('fsfMultiple', scope));
    }, false);
    elem[0].addEventListener('paste', function (evt) {
      if (isDisabled()) return;
      var files = [];
      var clipboard = evt.clipboardData || evt.originalEvent.clipboardData;
      if (clipboard && clipboard.items) {
        for (var k = 0; k < clipboard.items.length; k++) {
          if (clipboard.items[k].type.indexOf('image') !== -1) {
            files.push(clipboard.items[k].getAsFile());
          }
        }
        upload.updateModel(ngModel, attr, scope, attrGetter('fsfChange') || attrGetter('fsfDrop'), files, evt);
      }
    }, false);

    function calculateDragOverClass(scope, attr, evt, callback) {
      var clazz = attrGetter('fsfDragOverClass', scope, {$event: evt}),
        dClass = attrGetter('fsfDragOverClass') || 'dragover';
      if (angular.isString(clazz)) {
        callback(clazz);
        return;
      }
      if (clazz) {
        if (clazz.delay) dragOverDelay = clazz.delay;
        if (clazz.accept || clazz.reject) {
          var items = evt.dataTransfer.items;
          if (items != null) {
            var pattern = attrGetter('fsfPattern', scope, {$event: evt});
            for (var i = 0; i < items.length; i++) {
              if (items[i].kind === 'file' || items[i].kind === '') {
                if (!upload.validatePattern(items[i], pattern)) {
                  dClass = clazz.reject;
                  break;
                } else {
                  dClass = clazz.accept;
                }
              }
            }
          }
        }
      }
      callback(dClass);
    }

    function extractFiles(evt, callback, allowDir, multiple) {
      var files = [], processing = 0;

      function traverseFileTree(files, entry, path) {
        if (entry != null) {
          if (entry.isDirectory) {
            var filePath = (path || '') + entry.name;
            files.push({name: entry.name, type: 'directory', path: filePath});
            var dirReader = entry.createReader();
            var entries = [];
            processing++;
            var readEntries = function () {
              dirReader.readEntries(function (results) {
                try {
                  if (!results.length) {
                    for (var i = 0; i < entries.length; i++) {
                      traverseFileTree(files, entries[i], (path ? path : '') + entry.name + '/');
                    }
                    processing--;
                  } else {
                    entries = entries.concat(Array.prototype.slice.call(results || [], 0));
                    readEntries();
                  }
                } catch (e) {
                  processing--;
                  console.error(e);
                }
              }, function () {
                processing--;
              });
            };
            readEntries();
          } else {
            processing++;
            entry.file(function (file) {
              try {
                processing--;
                file.path = (path ? path : '') + file.name;
                files.push(file);
              } catch (e) {
                processing--;
                console.error(e);
              }
            }, function () {
              processing--;
            });
          }
        }
      }

      var items = evt.dataTransfer.items;

      if (items && items.length > 0 && $location.protocol() !== 'file') {
        for (var i = 0; i < items.length; i++) {
          if (items[i].webkitGetAsEntry && items[i].webkitGetAsEntry() && items[i].webkitGetAsEntry().isDirectory) {
            var entry = items[i].webkitGetAsEntry();
            if (entry.isDirectory && !allowDir) {
              continue;
            }
            if (entry != null) {
              traverseFileTree(files, entry);
            }
          } else {
            var f = items[i].getAsFile();
            if (f != null) files.push(f);
          }
          if (!multiple && files.length > 0) break;
        }
      } else {
        var fileList = evt.dataTransfer.files;
        if (fileList != null) {
          for (var j = 0; j < fileList.length; j++) {
            files.push(fileList.item(j));
            if (!multiple && files.length > 0) {
              break;
            }
          }
        }
      }
      var delays = 0;
      (function waitForProcess(delay) {
        $timeout(function () {
          if (!processing) {
            if (!multiple && files.length > 1) {
              i = 0;
              while (files[i].type === 'directory') i++;
              files = [files[i]];
            }
            callback(files);
          } else {
            if (delays++ * 10 < 20 * 1000) {
              waitForProcess(10);
            }
          }
        }, delay || 0);
      })();
    }
  }

  function dropAvailable() {
    var div = document.createElement('div');
    return ('draggable' in div) && ('ondrop' in div) && !/Edge\/12./i.test(navigator.userAgent);
  }

})();

'use strict';
angular.module('fish.pagination', [])
.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }

    $scope.$watch('totalItems', function() {
      $scope.totalPages = self.calculateTotalPages();
    });

    $scope.$watch('totalPages', function(value) {
      setNumPages($scope.$parent, value); // Readonly variable

      if ( $scope.page > value ) {
        $scope.selectPage(value);
      } else {
        ngModelCtrl.$render();
      }
    });
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page, evt) {
    if (evt) {
      evt.preventDefault();
    }

    var clickAllowed = !$scope.ngDisabled || !evt;
    if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      if (evt && evt.target) {
        evt.target.blur();
      }
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function( key ) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };
  $scope.noPrevious = function() {
    return $scope.page === 1;
  };
  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };
}])

.constant('fsPaginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('fsPagination', ['$parse', 'fsPaginationConfig', function($parse, fsPaginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@',
      ngDisabled:'='
    },
    require: ['fsPagination', '?ngModel'],
    controller: 'PaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'pagination/pagination.tpl.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : fsPaginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : fsPaginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : fsPaginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : fsPaginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, fsPaginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

        // recompute if maxSize
        if ( isMaxSized ) {
          if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if ( isMaxSized && ! rotate ) {
          if ( startPage > 1 ) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if ( endPage < totalPages ) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}])

.constant('fsPagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('fsPager', ['fsPagerConfig', function(fsPagerConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@'
    },
    require: ['fsPager', '?ngModel'],
    controller: 'PaginationController',
    templateUrl: 'pagination/pager.tpl.html',
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : fsPagerConfig.align;
      paginationCtrl.init(ngModelCtrl, fsPagerConfig);
    }
  };
}]);

'use strict';

angular.module('fish.popover', ['fish.tooltip'])

  .provider('$popover', function() {

    var defaults = this.defaults = {
      animation: 'fs-fade',
      customClass: '',
      // uncommenting the next two lines will break backwards compatability
      // prefixClass: 'popover',
      // prefixEvent: 'popover',
      container: false,
      target: false,
      placement: 'right',
      templateUrl: 'popover/popover.tpl.html',
      contentTemplate: false,
      trigger: 'click',
      keyboard: true,
      html: false,
      title: '',
      content: '',
      delay: 0,
      autoClose: false
    };

    this.$get = ["$tooltip", function($tooltip) {

      function PopoverFactory(element, config) {

        // Common vars
        var options = angular.extend({}, defaults, config);

        var $popover = $tooltip(element, options);

        // Support scope as string options [/*title, */content]
        if(options.content) {
          $popover.$scope.content = options.content;
        }

        return $popover;

      }

      return PopoverFactory;

    }];

  })

  .directive('fsPopover', ["$window", "$sce", "$popover", function($window, $sce, $popover) {

    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;

    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr) {

        // Directive options
        var options = {scope: scope};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'customClass', 'autoClose', 'id', 'prefixClass', 'prefixEvent'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['html', 'container', 'autoClose'], function(key) {
          if(angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
            options[key] = false;
        });

        // should not parse target attribute (anchor tag), only data-target #1454
        var dataTarget = element.attr('data-target');
        if(angular.isDefined(dataTarget)) {
          if(falseValueRegExp.test(dataTarget))
            options.target = false;
          else
            options.target = dataTarget;
        }

        // Support scope as data-attrs
        angular.forEach(['title', 'content'], function(key) {
          attr[key] && attr.$observe(key, function(newValue, oldValue) {
            scope[key] = $sce.trustAsHtml(newValue);
            angular.isDefined(oldValue) && requestAnimationFrame(function() {
              popover && popover.$applyPlacement();
            });
          });
        });

        // Support scope as an object
        attr.fsPopover && scope.$watch(attr.fsPopover, function(newValue, oldValue) {
          if(angular.isObject(newValue)) {
            angular.extend(scope, newValue);
          } else {
            scope.content = newValue;
          }
          angular.isDefined(oldValue) && requestAnimationFrame(function() {
            popover && popover.$applyPlacement();
          });
        }, true);

        // Visibility binding support
        attr.fsShow && scope.$watch(attr.fsShow, function(newValue, oldValue) {
          if(!popover || !angular.isDefined(newValue)) return;
          if(angular.isString(newValue)) newValue = !!newValue.match(/true|,?(popover),?/i);
          newValue === true ? popover.show() : popover.hide();
        });

        // Viewport support
        attr.viewport && scope.$watch(attr.viewport, function (newValue) {
          if(!popover || !angular.isDefined(newValue)) return;
          popover.setViewport(newValue);
        });

        // Initialize popover
        var popover = $popover(element, options);

        // Garbage collection
        scope.$on('$destroy', function() {
          if (popover) popover.destroy();
          options = null;
          popover = null;
        });

      }
    };

  }]);

// https://github.com/oblador/angular-scroll/tree/v0.7.2

/**
 * x is a value between 0 and 1, indicating where in the animation you are.
 */
var fsScrollDefaultEasing = function (x) {
  'use strict';

  if(x < 0.5) {
    return Math.pow(x*2, 2)/2;
  }
  return 1-Math.pow((1-x)*2, 2)/2;
};

angular.module('fish.scrollspy', [
  'fsScroll.scrollspy',
  'fsScroll.smoothScroll',
  'fsScroll.scrollContainer',
  'fsScroll.spyContext',
  'fsScroll.scrollHelpers'
])
  //Default animation duration for smoothScroll directive
    .value('fsScrollDuration', 350)
  //Scrollspy debounce interval, set to 0 to disable
    .value('fsScrollSpyWait', 100)
  //Wether or not multiple scrollspies can be active at once
    .value('fsScrollGreedy', false)
  //Default offset for smoothScroll directive
    .value('fsScrollOffset', 0)
  //Default easing function for scroll animation
    .value('fsScrollEasing', fsScrollDefaultEasing)
  //Which events on the container (such as body) should cancel scroll animations
    .value('fsScrollCancelOnEvents', 'scroll mousedown mousewheel touchmove keydown')
  //Whether or not to activate the last scrollspy, when page/container bottom is reached
    .value('fsScrollBottomSpy', false)
  //Active class name
    .value('fsScrollActiveClass', 'active');


angular.module('fsScroll.scrollHelpers', ['fsScroll.requestAnimation'])
    .run(["$window", "$q", "cancelAnimation", "requestAnimation", "fsScrollEasing", "fsScrollDuration", "fsScrollOffset", "fsScrollCancelOnEvents", function($window, $q, cancelAnimation, requestAnimation, fsScrollEasing, fsScrollDuration, fsScrollOffset, fsScrollCancelOnEvents) {
      'use strict';

      var proto = {};

      var isDocument = function(el) {
        return (typeof HTMLDocument !== 'undefined' && el instanceof HTMLDocument) || (el.nodeType && el.nodeType === el.DOCUMENT_NODE);
      };

      var isElement = function(el) {
        return (typeof HTMLElement !== 'undefined' && el instanceof HTMLElement) || (el.nodeType && el.nodeType === el.ELEMENT_NODE);
      };

      var unwrap = function(el) {
        return isElement(el) || isDocument(el) ? el : el[0];
      };

      proto.fsScrollTo = function(left, top, duration, easing) {
        var aliasFn;
        if(angular.isElement(left)) {
          aliasFn = this.fsScrollToElement;
        } else if(angular.isDefined(duration)) {
          aliasFn = this.fsScrollToAnimated;
        }
        if(aliasFn) {
          return aliasFn.apply(this, arguments);
        }
        var el = unwrap(this);
        if(isDocument(el)) {
          return $window.scrollTo(left, top);
        }
        el.scrollLeft = left;
        el.scrollTop = top;
      };

      var scrollAnimation, deferred;
      proto.fsScrollToAnimated = function(left, top, duration, easing) {
        if(duration && !easing) {
          easing = fsScrollEasing;
        }
        var startLeft = this.fsScrollLeft(),
            startTop = this.fsScrollTop(),
            deltaLeft = Math.round(left - startLeft),
            deltaTop = Math.round(top - startTop);

        var startTime = null, progress = 0;
        var el = this;

        var cancelScrollAnimation = function($event) {
          if (!$event || (progress && $event.which > 0)) {
            if(fsScrollCancelOnEvents) {
              el.unbind(fsScrollCancelOnEvents, cancelScrollAnimation);
            }
            cancelAnimation(scrollAnimation);
            deferred.reject();
            scrollAnimation = null;
          }
        };

        if(scrollAnimation) {
          cancelScrollAnimation();
        }
        deferred = $q.defer();

        if(duration === 0 || (!deltaLeft && !deltaTop)) {
          if(duration === 0) {
            el.fsScrollTo(left, top);
          }
          deferred.resolve();
          return deferred.promise;
        }

        var animationStep = function(timestamp) {
          if (startTime === null) {
            startTime = timestamp;
          }

          progress = timestamp - startTime;
          var percent = (progress >= duration ? 1 : easing(progress/duration));

          el.scrollTo(
              startLeft + Math.ceil(deltaLeft * percent),
              startTop + Math.ceil(deltaTop * percent)
          );
          if(percent < 1) {
            scrollAnimation = requestAnimation(animationStep);
          } else {
            if(fsScrollCancelOnEvents) {
              el.unbind(fsScrollCancelOnEvents, cancelScrollAnimation);
            }
            scrollAnimation = null;
            deferred.resolve();
          }
        };

        //Fix random mobile safari bug when scrolling to top by hitting status bar
        el.fsScrollTo(startLeft, startTop);

        if(fsScrollCancelOnEvents) {
          el.bind(fsScrollCancelOnEvents, cancelScrollAnimation);
        }

        scrollAnimation = requestAnimation(animationStep);
        return deferred.promise;
      };

      proto.fsScrollToElement = function(target, offset, duration, easing) {
        var el = unwrap(this);
        if(!angular.isNumber(offset) || isNaN(offset)) {
          offset = fsScrollOffset;
        }
        var top = this.fsScrollTop() + unwrap(target).getBoundingClientRect().top - offset;
        if(isElement(el)) {
          top -= el.getBoundingClientRect().top;
        }
        return this.fsScrollTo(0, top, duration, easing);
      };

      proto.fsScrollLeft = function(value, duration, easing) {
        if(angular.isNumber(value)) {
          return this.fsScrollTo(value, this.fsScrollTop(), duration, easing);
        }
        var el = unwrap(this);
        if(isDocument(el)) {
          return $window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
        }
        return el.scrollLeft;
      };
      proto.fsScrollTop = function(value, duration, easing) {
        if(angular.isNumber(value)) {
          return this.fsScrollTo(this.fsScrollLeft(), value, duration, easing);
        }
        var el = unwrap(this);
        if(isDocument(el)) {
          return $window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        }
        return el.scrollTop;
      };

      proto.fsScrollToElementAnimated = function(target, offset, duration, easing) {
        return this.fsScrollToElement(target, offset, duration || fsScrollDuration, easing);
      };

      proto.fsScrollTopAnimated = function(top, duration, easing) {
        return this.fsScrollTop(top, duration || fsScrollDuration, easing);
      };

      proto.fsScrollLeftAnimated = function(left, duration, easing) {
        return this.fsScrollLeft(left, duration || fsScrollDuration, easing);
      };

      angular.forEach(proto, function(fn, key) {
        angular.element.prototype[key] = fn;

        //Remove prefix if not already claimed by jQuery / ui.utils
        var unprefixed = key.replace(/^fsScroll/, 'scroll');
        if(angular.isUndefined(angular.element.prototype[unprefixed])) {
          angular.element.prototype[unprefixed] = fn;
        }
      });

    }]);


//Adapted from https://gist.github.com/paulirish/1579671
angular.module('fsScroll.polyfill', [])
    .factory('polyfill', ["$window", function($window) {
      'use strict';

      var vendors = ['webkit', 'moz', 'o', 'ms'];

      return function(fnName, fallback) {
        if($window[fnName]) {
          return $window[fnName];
        }
        var suffix = fnName.substr(0, 1).toUpperCase() + fnName.substr(1);
        for(var key, i = 0; i < vendors.length; i++) {
          key = vendors[i]+suffix;
          if($window[key]) {
            return $window[key];
          }
        }
        return fallback;
      };
    }]);

angular.module('fsScroll.requestAnimation', ['fsScroll.polyfill'])
    .factory('requestAnimation', ["polyfill", "$timeout", function(polyfill, $timeout) {
      'use strict';

      var lastTime = 0;
      var fallback = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = $timeout(function() { callback(currTime + timeToCall); },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

      return polyfill('requestAnimationFrame', fallback);
    }])
    .factory('cancelAnimation', ["polyfill", "$timeout", function(polyfill, $timeout) {
      'use strict';

      var fallback = function(promise) {
        $timeout.cancel(promise);
      };

      return polyfill('cancelAnimationFrame', fallback);
    }]);


angular.module('fsScroll.spyAPI', ['fsScroll.scrollContainerAPI'])
    .factory('spyAPI', ["$rootScope", "$timeout", "$window", "$document", "scrollContainerAPI", "fsScrollGreedy", "fsScrollSpyWait", "fsScrollBottomSpy", "fsScrollActiveClass", function($rootScope, $timeout, $window, $document, scrollContainerAPI, fsScrollGreedy, fsScrollSpyWait, fsScrollBottomSpy, fsScrollActiveClass) {
      'use strict';

      var createScrollHandler = function(context) {
        var timer = false, queued = false;
        var handler = function() {
          queued = false;
          var container = context.container,
              containerEl = container[0],
              containerOffset = 0,
              bottomReached;

          if (typeof HTMLElement !== 'undefined' && containerEl instanceof HTMLElement || containerEl.nodeType && containerEl.nodeType === containerEl.ELEMENT_NODE) {
            containerOffset = containerEl.getBoundingClientRect().top;
            bottomReached = Math.round(containerEl.scrollTop + containerEl.clientHeight) >= containerEl.scrollHeight;
          } else {
            bottomReached = Math.round($window.pageYOffset + $window.innerHeight) >= $document[0].body.scrollHeight;
          }
          var compareProperty = (fsScrollBottomSpy && bottomReached ? 'bottom' : 'top');

          var i, currentlyActive, toBeActive, spies, spy, pos;
          spies = context.spies;
          currentlyActive = context.currentlyActive;
          toBeActive = undefined;

          for(i = 0; i < spies.length; i++) {
            spy = spies[i];
            pos = spy.getTargetPosition();
            if (!pos) continue;

            if((fsScrollBottomSpy && bottomReached) || (pos.top + spy.offset - containerOffset < 20 && (fsScrollGreedy || pos.top*-1 + containerOffset) < pos.height)) {
              //Find the one closest the viewport top or the page bottom if it's reached
              if(!toBeActive || toBeActive[compareProperty] < pos[compareProperty]) {
                toBeActive = {
                  spy: spy
                };
                toBeActive[compareProperty] = pos[compareProperty];
              }
            }
          }

          if(toBeActive) {
            toBeActive = toBeActive.spy;
          }
          if(currentlyActive === toBeActive || (fsScrollGreedy && !toBeActive)) return;
          if(currentlyActive) {
            currentlyActive.$element.removeClass(fsScrollActiveClass);
            $rootScope.$broadcast('fsScrollspy:becameInactive', currentlyActive.$element);
          }
          if(toBeActive) {
            toBeActive.$element.addClass(fsScrollActiveClass);
            $rootScope.$broadcast('fsScrollspy:becameActive', toBeActive.$element);
          }
          context.currentlyActive = toBeActive;
        };

        if(!fsScrollSpyWait) {
          return handler;
        }

        //Debounce for potential performance savings
        return function() {
          if(!timer) {
            handler();
            timer = $timeout(function() {
              timer = false;
              if(queued) {
                handler();
              }
            }, fsScrollSpyWait, false);
          } else {
            queued = true;
          }
        };
      };

      var contexts = {};

      var createContext = function($scope) {
        var id = $scope.$id;
        var context = {
          spies: []
        };

        context.handler = createScrollHandler(context);
        contexts[id] = context;

        $scope.$on('$destroy', function() {
          destroyContext($scope);
        });

        return id;
      };

      var destroyContext = function($scope) {
        var id = $scope.$id;
        var context = contexts[id], container = context.container;
        if(container) {
          container.off('scroll', context.handler);
        }
        delete contexts[id];
      };

      var defaultContextId = createContext($rootScope);

      var getContextForScope = function(scope) {
        if(contexts[scope.$id]) {
          return contexts[scope.$id];
        }
        if(scope.$parent) {
          return getContextForScope(scope.$parent);
        }
        return contexts[defaultContextId];
      };

      var getContextForSpy = function(spy) {
        var context, contextId, scope = spy.$scope;
        if(scope) {
          return getContextForScope(scope);
        }
        //No scope, most likely destroyed
        for(contextId in contexts) {
          context = contexts[contextId];
          if(context.spies.indexOf(spy) !== -1) {
            return context;
          }
        }
      };

      var isElementInDocument = function(element) {
        while (element.parentNode) {
          element = element.parentNode;
          if (element === document) {
            return true;
          }
        }
        return false;
      };

      var addSpy = function(spy) {
        var context = getContextForSpy(spy);
        if (!context) return;
        context.spies.push(spy);
        if (!context.container || !isElementInDocument(context.container)) {
          if(context.container) {
            context.container.off('scroll', context.handler);
          }
          context.container = scrollContainerAPI.getContainer(spy.$scope);
          context.container.on('scroll', context.handler).triggerHandler('scroll');
        }
      };

      var removeSpy = function(spy) {
        var context = getContextForSpy(spy);
        if(spy === context.currentlyActive) {
          context.currentlyActive = null;
        }
        var i = context.spies.indexOf(spy);
        if(i !== -1) {
          context.spies.splice(i, 1);
        }
        spy.$element = null;
      };

      return {
        addSpy: addSpy,
        removeSpy: removeSpy,
        createContext: createContext,
        destroyContext: destroyContext,
        getContextForScope: getContextForScope
      };
    }]);


angular.module('fsScroll.scrollContainerAPI', [])
    .factory('scrollContainerAPI', ["$document", function($document) {
      'use strict';

      var containers = {};

      var setContainer = function(scope, element) {
        var id = scope.$id;
        containers[id] = element;
        return id;
      };

      var getContainerId = function(scope) {
        if(containers[scope.$id]) {
          return scope.$id;
        }
        if(scope.$parent) {
          return getContainerId(scope.$parent);
        }
        return;
      };

      var getContainer = function(scope) {
        var id = getContainerId(scope);
        return id ? containers[id] : $document;
      };

      var removeContainer = function(scope) {
        var id = getContainerId(scope);
        if(id) {
          delete containers[id];
        }
      };

      return {
        getContainerId:   getContainerId,
        getContainer:     getContainer,
        setContainer:     setContainer,
        removeContainer:  removeContainer
      };
    }]);


angular.module('fsScroll.smoothScroll', ['fsScroll.scrollHelpers', 'fsScroll.scrollContainerAPI'])
    .directive('fsSmoothScroll', ["fsScrollDuration", "fsScrollOffset", "scrollContainerAPI", function(fsScrollDuration, fsScrollOffset, scrollContainerAPI) {
      'use strict';

      return {
        link : function($scope, $element, $attr) {
          $element.on('click', function(e) {
            if((!$attr.href || $attr.href.indexOf('#') === -1) && $attr.fsSmoothScroll === '') return;

            var id = $attr.href ? $attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1) : $attr.fsSmoothScroll;

            var target = document.getElementById(id) || document.getElementsByName(id)[0];
            if(!target || !target.getBoundingClientRect) return;

            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();

            var offset    = $attr.offset ? parseInt($attr.offset, 10) : fsScrollOffset;
            var duration  = $attr.duration ? parseInt($attr.duration, 10) : fsScrollDuration;
            var container = scrollContainerAPI.getContainer($scope);

            container.fsScrollToElement(
                angular.element(target),
                isNaN(offset) ? 0 : offset,
                isNaN(duration) ? 0 : duration
            );
          });
        }
      };
    }]);


angular.module('fsScroll.spyContext', ['fsScroll.spyAPI'])
    .directive('fsSpyContext', ["spyAPI", function(spyAPI) {
      'use strict';

      return {
        restrict: 'A',
        scope: true,
        compile: function compile(tElement, tAttrs, transclude) {
          return {
            pre: function preLink($scope, iElement, iAttrs, controller) {
              spyAPI.createContext($scope);
            }
          };
        }
      };
    }]);


angular.module('fsScroll.scrollContainer', ['fsScroll.scrollContainerAPI'])
    .directive('fsScrollContainer', ["scrollContainerAPI", function(scrollContainerAPI){
      'use strict';

      return {
        restrict: 'A',
        scope: true,
        compile: function compile(tElement, tAttrs, transclude) {
          return {
            pre: function preLink($scope, iElement, iAttrs, controller) {
              iAttrs.$observe('fsScrollContainer', function(element) {
                if(angular.isString(element)) {
                  element = document.getElementById(element);
                }

                element = (angular.isElement(element) ? angular.element(element) : iElement);
                scrollContainerAPI.setContainer($scope, element);
                $scope.$on('$destroy', function() {
                  scrollContainerAPI.removeContainer($scope);
                });
              });
            }
          };
        }
      };
    }]);


angular.module('fsScroll.scrollspy', ['fsScroll.spyAPI'])
    .directive('fsScrollspy', ["spyAPI", "fsScrollOffset", "$timeout", "$rootScope", function(spyAPI, fsScrollOffset, $timeout, $rootScope) {
      'use strict';

      var Spy = function(targetElementOrId, $scope, $element, offset) {
        if(angular.isElement(targetElementOrId)) {
          this.target = targetElementOrId;
        } else if(angular.isString(targetElementOrId)) {
          this.targetId = targetElementOrId;
        }
        this.$scope = $scope;
        this.$element = $element;
        this.offset = offset;
      };

      Spy.prototype.getTargetElement = function() {
        if (!this.target && this.targetId) {
          this.target = document.getElementById(this.targetId) || document.getElementsByName(this.targetId)[0];
        }
        return this.target;
      };

      Spy.prototype.getTargetPosition = function() {
        var target = this.getTargetElement();
        if(target) {
          return target.getBoundingClientRect();
        }
      };

      Spy.prototype.flushTargetCache = function() {
        if(this.targetId) {
          this.target = undefined;
        }
      };

      return {
        link: function ($scope, $element, $attr) {
          var href = $attr.ngHref || $attr.href;
          var targetId;

          if (href && href.indexOf('#') !== -1) {
            targetId = href.replace(/.*(?=#[^\s]+$)/, '').substring(1);
          } else if($attr.fsScrollspy) {
            targetId = $attr.fsScrollspy;
          } else if($attr.fsSmoothScroll) {
            targetId = $attr.fsSmoothScroll;
          }
          if(!targetId) return;

          // Run this in the next execution loop so that the scroll context has a chance
          // to initialize
          $timeout(function() {
            var spy = new Spy(targetId, $scope, $element, -($attr.offset ? parseInt($attr.offset, 10) : fsScrollOffset));
            spyAPI.addSpy(spy);

            $scope.$on('$locationChangeSuccess', spy.flushTargetCache.bind(spy));
            var deregisterOnStateChange = $rootScope.$on('$stateChangeSuccess', spy.flushTargetCache.bind(spy));
            $scope.$on('$destroy', function() {
              spyAPI.removeSpy(spy);
              deregisterOnStateChange();
            });
          }, 0, false);
        }
      };
    }]);
'use strict';

angular.module('fish.select', ['fish.tooltip', 'fish.helpers'])

  .provider('$select', function() {

    var defaults = this.defaults = {
      animation: 'fs-fade',
      prefixClass: 'select',
      prefixEvent: '$select',
      placement: 'bottom-left',
      templateUrl: 'select/select.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      multiple: false,
      allNoneButtons: false,
      sort: true,
      caretHtml: '&nbsp;<span class="caret"></span>',
      placeholder: 'Choose among the following...',
      allText: 'All',
      noneText: 'None',
      maxLength: 3,
      maxLengthHtml: 'selected',
      iconCheckmark: 'glyphicon glyphicon-ok'
    };

    this.$get = ["$window", "$document", "$rootScope", "$tooltip", "$timeout", function($window, $document, $rootScope, $tooltip, $timeout) {

      var bodyEl = angular.element($window.document.body);
      var isNative = /(ip(a|o)d|iphone|android)/ig.test($window.navigator.userAgent);
      var isTouch = ('createTouch' in $window.document) && isNative;

      function SelectFactory(element, controller, config) {

        var $select = {};

        // Common vars
        var options = angular.extend({}, defaults, config);

        $select = $tooltip(element, options);
        var scope = $select.$scope;

        scope.$matches = [];
        if (options.multiple) {
          scope.$activeIndex = [];
        }
        else {
          scope.$activeIndex = -1;
        }
        scope.$isMultiple = options.multiple;
        scope.$showAllNoneButtons = options.allNoneButtons && options.multiple;
        scope.$iconCheckmark = options.iconCheckmark;
        scope.$allText = options.allText;
        scope.$noneText = options.noneText;

        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $select.activate(index);
          });
        };

        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $select.select(index);
          });
        };

        scope.$isVisible = function() {
          return $select.$isVisible();
        };

        scope.$isActive = function(index) {
          return $select.$isActive(index);
        };

        scope.$selectAll = function () {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (!scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };

        scope.$selectNone = function () {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };

        // Public methods

        $select.update = function(matches) {
          scope.$matches = matches;
          $select.$updateActiveIndex();
        };

        $select.activate = function(index) {
          if(options.multiple) {
            $select.$isActive(index) ? scope.$activeIndex.splice(scope.$activeIndex.indexOf(index), 1) : scope.$activeIndex.push(index);
            if(options.sort) scope.$activeIndex.sort(function(a, b) { return a - b; }); // use numeric sort instead of default sort
          } else {
            scope.$activeIndex = index;
          }
          return scope.$activeIndex;
        };

        $select.select = function(index) {
          var value = scope.$matches[index].value;
          scope.$apply(function() {
            $select.activate(index);
            if(options.multiple) {
              controller.$setViewValue(scope.$activeIndex.map(function(index) {
                return scope.$matches[index].value;
              }));
            } else {
              controller.$setViewValue(value);
              // Hide if single select
              $select.hide();
            }
          });
          // Emit event
          scope.$emit(options.prefixEvent + '.select', value, index, $select);
        };

        // Protected methods

        $select.$updateActiveIndex = function() {
          if(controller.$modelValue && scope.$matches.length) {
            if(options.multiple && angular.isArray(controller.$modelValue)) {
              scope.$activeIndex = controller.$modelValue.map(function(value) {
                return $select.$getIndex(value);
              });
            } else {
              scope.$activeIndex = $select.$getIndex(controller.$modelValue);
            }
          } else if(scope.$activeIndex >= scope.$matches.length) {
            scope.$activeIndex = options.multiple ? [] : 0;
          }
        };

        $select.$isVisible = function() {
          if(!options.minLength || !controller) {
            return scope.$matches.length;
          }
          // minLength support
          return scope.$matches.length && controller.$viewValue.length >= options.minLength;
        };

        $select.$isActive = function(index) {
          if(options.multiple) {
            return scope.$activeIndex.indexOf(index) !== -1;
          } else {
            return scope.$activeIndex === index;
          }
        };

        $select.$getIndex = function(value) {
          var l = scope.$matches.length, i = l;
          if(!l) return;
          for(i = l; i--;) {
            if(scope.$matches[i].value === value) break;
          }
          if(i < 0) return;
          return i;
        };

        $select.$onMouseDown = function(evt) {
          // Prevent blur on mousedown on .dropdown-menu
          evt.preventDefault();
          evt.stopPropagation();
          // Emulate click for mobile devices
          if(isTouch) {
            var targetEl = angular.element(evt.target);
            targetEl.triggerHandler('click');
          }
        };

        $select.$onKeyDown = function(evt) {
          if (!/(9|13|38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();

          // release focus on tab
          if (options.multiple && evt.keyCode === 9) {
            return $select.hide();
          }

          // Select with enter
          if(!options.multiple && (evt.keyCode === 13 || evt.keyCode === 9)) {
            return $select.select(scope.$activeIndex);
          }

          if (!options.multiple) {
            // Navigate with keyboard
            if(evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--;
            else if(evt.keyCode === 38 && scope.$activeIndex < 0) scope.$activeIndex = scope.$matches.length - 1;
            else if(evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++;
            else if(angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
            scope.$digest();
          }
        };

        // Overrides

        var _show = $select.show;
        $select.show = function() {
          _show();
          if(options.multiple) {
            $select.$element.addClass('select-multiple');
          }
          // use timeout to hookup the events to prevent
          // event bubbling from being processed imediately.
          $timeout(function() {
            $select.$element.on(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
            if(options.keyboard) {
              element.on('keydown', $select.$onKeyDown);
            }
          }, 0, false);
        };

        var _hide = $select.hide;
        $select.hide = function() {
          if(!options.multiple && !controller.$modelValue) {
            scope.$activeIndex = -1;
          }
          $select.$element.off(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
          if(options.keyboard) {
            element.off('keydown', $select.$onKeyDown);
          }
          _hide(true);
        };

        return $select;

      }

      SelectFactory.defaults = defaults;
      return SelectFactory;

    }];

  })

  .directive('fsSelect', ["$window", "$parse", "$q", "$select", "$parseOptions", function($window, $parse, $q, $select, $parseOptions) {

    var defaults = $select.defaults;

    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {

        // Directive options
        var options = {scope: scope, placeholder: defaults.placeholder};
        angular.forEach(['template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'placeholder', 'allNoneButtons', 'maxLength', 'maxLengthHtml', 'allText', 'noneText', 'iconCheckmark', 'autoClose', 'id', 'sort', 'caretHtml', 'prefixClass', 'prefixEvent'], function(key) {
          if(angular.isDefined(attr[key])) options[key] = attr[key];
        });

        // use string regex match boolean attr falsy values, leave truthy values be
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach(['html', 'container', 'allNoneButtons', 'sort'], function(key) {
          if(angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key]))
            options[key] = false;
        });

        // Only parse data-multiple. Angular sets existence attributes to true (multiple/required/etc), they apply this
        // to data-multiple as well for some reason, so we'll parse this ourselves and disregard multiple
        var dataMultiple = element.attr('data-multiple');
        if(angular.isDefined(dataMultiple)) {
          if(falseValueRegExp.test(dataMultiple))
            options.multiple = false;
          else
            options.multiple = dataMultiple;
        }

        // Add support for select markup
        if(element[0].nodeName.toLowerCase() === 'select') {
          var inputEl = element;
          inputEl.css('display', 'none');
          element = angular.element('<button type="button" class="btn btn-default"></button>');
          inputEl.after(element);
        }

        // Build proper fsOptions
        var parsedOptions = $parseOptions(attr.fsOptions);

        // Initialize select
        var select = $select(element, controller, options);

        // Watch fsOptions values before filtering for changes
        var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').trim();
        scope.$watchCollection(watchedOptions, function(newValue, oldValue) {
          // console.warn('scope.$watch(%s)', watchedOptions, newValue, oldValue);
          parsedOptions.valuesFn(scope, controller)
          .then(function(values) {
            select.update(values);
            controller.$render();
          });
        });

        // Watch model for changes
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          // console.warn('scope.$watch(%s)', attr.ngModel, newValue, oldValue);
          select.$updateActiveIndex();
          controller.$render();
        }, true);

        // Model rendering in view
        controller.$render = function () {
          // console.warn('$render', element.attr('ng-model'), 'controller.$modelValue', typeof controller.$modelValue, controller.$modelValue, 'controller.$viewValue', typeof controller.$viewValue, controller.$viewValue);
          var selected, index;
          if(options.multiple && angular.isArray(controller.$modelValue)) {
            selected = controller.$modelValue.map(function(value) {
              index = select.$getIndex(value);
              return angular.isDefined(index) ? select.$scope.$matches[index].label : false;
            }).filter(angular.isDefined);
            if(selected.length > (options.maxLength || defaults.maxLength)) {
              selected = selected.length + ' ' + (options.maxLengthHtml || defaults.maxLengthHtml);
            } else {
              selected = selected.join(', ');
            }
          } else {
            index = select.$getIndex(controller.$modelValue);
            selected = angular.isDefined(index) ? select.$scope.$matches[index].label : false;
          }
          element.html((selected ? selected : options.placeholder) + (options.caretHtml ? options.caretHtml : defaults.caretHtml));
        };

        if(options.multiple){
          controller.$isEmpty = function(value){
            return !value || value.length === 0;
          };
        }

        // Garbage collection
        scope.$on('$destroy', function() {
          if (select) select.destroy();
          options = null;
          select = null;
        });

      }
    };

  }]);

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

  .directive('fsTabs', ["$window", "$animate", "$tab", "$parse", function($window, $animate, $tab, $parse) {

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

  }])

  .directive('fsPane', ["$window", "$animate", "$sce", function($window, $animate, $sce) {

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

  }]);

(function(angular) {
    'use strict';
/**
 * todo: code form url:https://github.com/esvit/ng-table/tree/v1.0.0-alpha.3
 * 移除Define定义的语法
 * 2. ngTable 替换为 fsTable，要区分大小写
 * 2. ng-table 替换为 fs-table，该替换要包含scss文件
 * 3. 移除源文件的模板，把模板转换为源代码，并在模板和js文件上把ng-table替换为fs-table
 * 4. templateUrl: 'fs-table/ 替换为 templateUrl: 'table/
 *  defaultBaseUrl: 'fs-table/' 替换为 defaultBaseUrl: 'table/'
 *  把不符合规范的.html后缀及命名改为.tpl.html的后缀及命名
 *  angular.module('fsTable') 替换为 angular.module('fish.table')
 */


    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        /**
         * @ngdoc module
         * @name fsTable
         * @description fsTable: Table + Angular JS
         */
        angular.module('fish.table', []);
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function () {
        /**
         * @ngdoc object
         * @name fsTableDefaultParams
         * @module fsTable
         * @description Default Parameters for fsTable
         */
        angular.module('fish.table')
            .value('fsTableDefaults', {
                params: {},
                settings: {}
            });
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .factory('fsTableEventsChannel', fsTableEventsChannel);

        fsTableEventsChannel.$inject = ['$rootScope'];

        /**
         * @ngdoc service
         * @name fsTableEventsChannel
         * @description strongly typed pub/sub for `FsTableParams`
         *
         * Supported events:
         *
         * * afterCreated - raised when a new instance of `FsTableParams` has finished being constructed
         * * afterReloadData - raised when the `reload` event has finished loading new data
         * * datasetChanged - raised when `settings` receives a new data array
         * * pagesChanged - raised when a new pages array has been generated
         */
        function fsTableEventsChannel($rootScope){

            var events = {};
            events = addChangeEvent('afterCreated', events);
            events = addChangeEvent('afterReloadData', events);
            events = addChangeEvent('datasetChanged', events);
            events = addChangeEvent('pagesChanged', events);
            return events;

            //////////

            function addChangeEvent(eventName, target){
                var fnName = eventName.charAt(0).toUpperCase() + eventName.substring(1);
                var event = {};
                event['on' + fnName] = createEventSubscriptionFn(eventName);
                event['publish' + fnName] = createPublishEventFn(eventName);
                return angular.extend(target, event);
            }

            function createEventSubscriptionFn(eventName){

                return function subscription(handler/*[, eventSelector or $scope][, eventSelector]*/){
                    var eventSelector = angular.identity;
                    var scope = $rootScope;

                    if (arguments.length === 2){
                        if (angular.isFunction(arguments[1].$new)) {
                            scope = arguments[1];
                        } else {
                            eventSelector = arguments[1]
                        }
                    } else if (arguments.length > 2){
                        scope = arguments[1];
                        eventSelector = arguments[2];
                    }

                    // shorthand for subscriber to only receive events from a specific publisher instance
                    if (angular.isObject(eventSelector)) {
                        var requiredPublisher = eventSelector;
                        eventSelector = function(publisher){
                            return publisher === requiredPublisher;
                        }
                    }

                    return scope.$on('fsTable:' + eventName, function(event, params/*, ...args*/){
                        // don't send events published by the internal FsTableParams created by fsTableController
                        if (params.isNullInstance) return;

                        var eventArgs = rest(arguments, 2);
                        var fnArgs = [params].concat(eventArgs);
                        if (eventSelector.apply(this, fnArgs)){
                            handler.apply(this, fnArgs);
                        }
                    });
                }
            }

            function createPublishEventFn(eventName){
                return function publish(/*args*/){
                    var fnArgs = ['fsTable:' + eventName].concat(Array.prototype.slice.call(arguments));
                    $rootScope.$broadcast.apply($rootScope, fnArgs);
                }
            }

            function rest(array, n) {
                return Array.prototype.slice.call(array, n == null ? 1 : n);
            }
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .provider('fsTableFilterConfig', fsTableFilterConfigProvider);

        fsTableFilterConfigProvider.$inject = [];

        function fsTableFilterConfigProvider(){
            var config;
            var defaultConfig = {
                defaultBaseUrl: 'table/filters/',
                defaultExt: '.tpl.html',
                aliasUrls: {}
            };

            this.$get = fsTableFilterConfig;
            this.resetConfigs = resetConfigs;
            this.setConfig = setConfig;

            init();

            /////////

            function init(){
                resetConfigs();
            }

            function resetConfigs(){
                config = defaultConfig;
            }

            function setConfig(customConfig){
                var mergeConfig = angular.extend({}, config, customConfig);
                mergeConfig.aliasUrls = angular.extend({}, config.aliasUrls, customConfig.aliasUrls);
                config = mergeConfig;
            }

            /////////

            fsTableFilterConfig.$inject = [];

            function fsTableFilterConfig(){

                var publicConfig;

                var service = {
                    config: publicConfig,
                    getTemplateUrl: getTemplateUrl,
                    getUrlForAlias: getUrlForAlias
                };
                Object.defineProperty(service, "config", {
                    get: function(){
                        return publicConfig = publicConfig || angular.copy(config);
                    },
                    enumerable: true
                });

                return service;

                /////////

                function getTemplateUrl(filterValue, filterKey){
                    if (angular.isObject(filterValue)){
                        filterValue = filterValue.id;
                    }
                    if (filterValue.indexOf('/') !== -1){
                        return filterValue;
                    }

                    return service.getUrlForAlias(filterValue, filterKey);
                }

                function getUrlForAlias(aliasName/*, filterKey*/){
                    return config.aliasUrls[aliasName] || config.defaultBaseUrl + aliasName + config.defaultExt;
                }
            }
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';


        angular.module('fish.table')
            .provider('fsTableDefaultGetData', fsTableDefaultGetDataProvider);

        fsTableDefaultGetDataProvider.$inject = [];

        /**
         * @ngdoc provider
         * @name fsTableDefaultGetDataProvider
         * @description Allows for the configuration of the fsTableDefaultGetData service.
         *
         * Set filterFilterName to the name of a angular filter that knows how to apply the values returned by
         * `FsTableParams.filter()` to restrict an array of data.
         *
         * Set sortingFilterName to the name of a angular filter that knows how to apply the values returned by
         * `FsTableParams.orderBy()` to sort an array of data.
         *
         * Out of the box the `fsTableDefaultGetData` service will be configured to use the angular `filter` and `orderBy`
         * filters respectively
         */
        function fsTableDefaultGetDataProvider(){
            var provider = this;
            provider.$get = fsTableDefaultGetData;
            provider.filterFilterName = 'filter';
            provider.sortingFilterName = 'orderBy';

            ///////////

            fsTableDefaultGetData.$inject = ['$filter'];

            /**
             * @ngdoc service
             * @name fsTableDefaultGetData
             * @description A default implementation of the getData function that will apply the `filter`, `orderBy` and
             * paging values from the `FsTableParams` instance supplied to the data array supplied.
             *
             * The outcome will be to return the resulting array and to assign the total item count after filtering
             * to the `total` of the `FsTableParams` instance supplied
             */
            function fsTableDefaultGetData($filter) {

                var defaultDataOptions = {applyFilter: true, applySort: true, applyPaging: true};

                getData.applyPaging = applyPaging;
                getData.getFilterFn = getFilterFn;
                getData.getOrderByFn = getOrderByFn;

                return getData;

                function getFilterFn(params) {
                    var filterOptions = params.settings().filterOptions;
                    if (angular.isFunction(filterOptions.filterFn)){
                        return filterOptions.filterFn;
                    } else {
                        return $filter(filterOptions.filterFilterName || provider.filterFilterName);
                    }
                }

                function getOrderByFn (/*params*/){
                    return $filter(provider.sortingFilterName);
                }

                function applyFilter(data, params) {
                    if (!params.hasFilter()) {
                        return data;
                    }

                    var filter = params.filter(true);
                    var filterKeys = Object.keys(filter);
                    var parsedFilter = filterKeys.reduce(function(result, key){
                        result = setPath(result, filter[key], key);
                        return result;
                    }, {});
                    var filterFn = getFilterFn(params);
                    return filterFn.call(params, data, parsedFilter, params.settings().filterOptions.filterComparator);
                }

                function applyPaging(data, params) {
                    var pagedData = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    params.total(data.length); // set total for recalc pagination
                    return pagedData;
                }

                function applySort(data, params) {
                    var orderBy = params.orderBy();
                    var orderByFn = getOrderByFn(params);
                    return orderBy.length ? orderByFn(data, orderBy) : data;
                }

                function getData(data, params) {
                    if (data == null){
                        return [];
                    }

                    var options = angular.extend({}, defaultDataOptions, params.settings().dataOptions);

                    var fData = options.applyFilter ? applyFilter(data, params) : data;
                    var orderedData = options.applySort ? applySort(fData, params) : fData;
                    return options.applyPaging ? applyPaging(orderedData, params) : orderedData;
                }

                // Sets the value at any depth in a nested object based on the path
                // note: adapted from: underscore-contrib#setPath
                function setPath(obj, value, path) {
                    var keys     = path.split('.');
                    var ret      = obj;
                    var lastKey  = keys[keys.length -1];
                    var target   = ret;

                    var parentPathKeys = keys.slice(0, keys.length -1);
                    parentPathKeys.forEach(function(key) {
                        if (!target.hasOwnProperty(key)) {
                            target[key] = {};
                        }
                        target = target[key];
                    });

                    target[lastKey] = value;
                    return ret;
                }
            }
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        // todo: remove shim after an acceptable depreciation period

        angular.module('fish.table')
            .factory('fsTableGetDataBcShim', fsTableGetDataBcShim);

        fsTableGetDataBcShim.$inject = ['$q'];

        function fsTableGetDataBcShim($q){

            return createWrapper;

            function createWrapper(getDataFn){
                return function getDataShim(/*args*/){
                    var $defer = $q.defer();
                    var pData = getDataFn.apply(this, [$defer].concat(Array.prototype.slice.call(arguments)));
                    if (!pData) {
                        // If getData resolved the $defer, and didn't promise us data,
                        //   create a promise from the $defer. We need to return a promise.
                        pData = $defer.promise;
                    }
                    return pData;
                }
            }
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function () {
        /**
         * @ngdoc service
         * @name fsTableColumn
         * @module fsTable
         * @description
         * Service to construct a $column definition used by {@link fsTable fsTable} directive
         */
        angular.module('fish.table').factory('fsTableColumn', [function () {

            return {
                buildColumn: buildColumn
            };

            //////////////

            /**
             * @ngdoc method
             * @name fsTableColumn#buildColumn
             * @description Creates a $column for use within a header template
             *
             * @param {Object} column an existing $column or simple column data object
             * @param {Scope} defaultScope the $scope to supply to the $column getter methods when not supplied by caller
             * @param {Array} columns a reference to the columns array to make available on the context supplied to the
             * $column getter methods
             * @returns {Object} a $column object
             */
            function buildColumn(column, defaultScope, columns){
                // note: we're not modifying the original column object. This helps to avoid unintended side affects
                var extendedCol = Object.create(column);
                var defaults = createDefaults();
                for (var prop in defaults) {
                    if (extendedCol[prop] === undefined) {
                        extendedCol[prop] = defaults[prop];
                    }
                    if(!angular.isFunction(extendedCol[prop])){
                        // wrap raw field values with "getter" functions
                        // - this is to ensure consistency with how fsTable.compile builds columns
                        // - note that the original column object is being "proxied"; this is important
                        //   as it ensure that any changes to the original object will be returned by the "getter"
                        (function(prop1){
                            var getterSetter = function getterSetter(/*[value] || [$scope, locals]*/) {
                                if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                                    getterSetter.assign(null, arguments[0]);
                                } else {
                                    return column[prop1];
                                }
                            };
                            getterSetter.assign = function($scope, value){
                                column[prop1] = value;
                            };
                            extendedCol[prop1] = getterSetter;
                        })(prop);
                    }
                    (function(prop1){
                        // satisfy the arguments expected by the function returned by parsedAttribute in the fsTable directive
                        var getterFn = extendedCol[prop1];
                        extendedCol[prop1] = function () {
                            if (arguments.length === 1 && !isScopeLike(arguments[0])){
                                getterFn.assign(null, arguments[0]);
                            } else {
                                var scope = arguments[0] || defaultScope;
                                var context = Object.create(scope);
                                angular.extend(context, {
                                    $column: extendedCol,
                                    $columns: columns
                                });
                                return getterFn.call(column, context);
                            }
                        };
                        if (getterFn.assign){
                            extendedCol[prop1].assign = getterFn.assign;
                        }
                    })(prop);
                }
                return extendedCol;
            }

            function createDefaults(){
                return {
                    'class': createGetterSetter(''),
                    filter: createGetterSetter(false),
                    groupable: createGetterSetter(false),
                    filterData: angular.noop,
                    headerTemplateURL: createGetterSetter(false),
                    headerTitle: createGetterSetter(''),
                    sortable: createGetterSetter(false),
                    show: createGetterSetter(true),
                    title: createGetterSetter(''),
                    titleAlt: createGetterSetter('')
                };
            }

            function createGetterSetter(initialValue){
                var value = initialValue;
                var getterSetter = function getterSetter(/*[value] || [$scope, locals]*/){
                    if (arguments.length === 1 && !isScopeLike(arguments[0])) {
                        getterSetter.assign(null, arguments[0]);
                    } else {
                        return value;
                    }
                };
                getterSetter.assign = function($scope, newValue){
                    value = newValue;
                };
                return getterSetter;
            }

            function isScopeLike(object){
                return object != null && angular.isFunction(object.$new);
            }
        }]);
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        /**
         * @ngdoc service
         * @name FsTableParams
         * @module fsTable
         * @description Parameters manager for fsTable
         */

        angular.module('fish.table').factory('FsTableParams', ['$q', '$log', '$filter', 'fsTableDefaults', 'fsTableGetDataBcShim', 'fsTableDefaultGetData', 'fsTableEventsChannel', function($q, $log, $filter, fsTableDefaults, fsTableGetDataBcShim, fsTableDefaultGetData, fsTableEventsChannel) {
            var isNumber = function(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            };
            var FsTableParams = function(baseParameters, baseSettings) {

                // the fsTableController "needs" to create a dummy/null instance and it's important to know whether an instance
                // is one of these
                if (typeof baseParameters === "boolean"){
                    this.isNullInstance = true;
                }

                var self = this,
                    prevParamsMemento,
                    errParamsMemento,
                    isCommittedDataset = false,
                    initialEvents = [],
                    log = function() {
                        if (settings.debugMode && $log.debug) {
                            $log.debug.apply($log, arguments);
                        }
                    },
                    defaultFilterOptions = {
                        filterComparator: undefined, // look for a substring match in case insensitive way
                        filterDelay: 500,
                        filterDelayThreshold: 10000, // size of dataset array that will trigger the filterDelay being applied
                        filterFilterName: undefined, // when defined overrides fsTableDefaultGetDataProvider.filterFilterName
                        filterFn: undefined, // when defined overrides the filter function that fsTableDefaultGetData uses
                        filterLayout: 'stack' // alternative: 'horizontal'
                    },
                    defaultGroupOptions = {
                        defaultSort: 'asc', // set to 'asc' or 'desc' to apply sorting to groups
                        isExpanded: true
                    },
                    defaultSettingsFns = getDefaultSettingFns();

                this.data = [];

                /**
                 * @ngdoc method
                 * @name FsTableParams#parameters
                 * @description Set new parameters or get current parameters
                 *
                 * @param {string} newParameters      New parameters
                 * @param {string} parseParamsFromUrl Flag if parse parameters like in url
                 * @returns {Object} Current parameters or `this`
                 */
                this.parameters = function(newParameters, parseParamsFromUrl) {
                    parseParamsFromUrl = parseParamsFromUrl || false;
                    if (angular.isDefined(newParameters)) {
                        for (var key in newParameters) {
                            var value = newParameters[key];
                            if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                                var keys = key.split(/\[(.*)\]/).reverse()
                                var lastKey = '';
                                for (var i = 0, len = keys.length; i < len; i++) {
                                    var name = keys[i];
                                    if (name !== '') {
                                        var v = value;
                                        value = {};
                                        value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                                    }
                                }
                                if (lastKey === 'sorting') {
                                    params[lastKey] = {};
                                }
                                params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                            } else {
                                if (key === 'group'){
                                    params[key] = parseGroup(newParameters[key]);
                                } else {
                                    params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                                }
                            }
                        }
                        log('fsTable: set parameters', params);
                        return this;
                    }
                    return params;
                };

                function parseGroup(group){
                    var defaultSort = settings.groupOptions && settings.groupOptions.defaultSort;
                    if (angular.isFunction(group)) {
                        if (group.sortDirection == null){
                            group.sortDirection = defaultSort;
                        }
                        return group;
                    } else if (angular.isString(group)) {
                        var grp = {};
                        grp[group] = defaultSort;
                        return grp;
                    } else if (angular.isObject(group)) {
                        for (var key in group) {
                            if (group[key] == null){
                                group[key] = defaultSort;
                            }
                        }
                        return group;
                    } else {
                        return group;
                    }
                }

                /**
                 * @ngdoc method
                 * @name FsTableParams#settings
                 * @description Set new settings for table
                 *
                 * @param {string} newSettings New settings or undefined
                 * @returns {Object} Current settings or `this`
                 */
                this.settings = function(newSettings) {
                    if (angular.isDefined(newSettings)) {

                        // todo: don't modify newSettings object: this introduces unexpected side effects;
                        // instead take a copy of newSettings

                        if (newSettings.filterOptions){
                            newSettings.filterOptions = angular.extend({}, settings.filterOptions, newSettings.filterOptions);
                        }
                        if (newSettings.groupOptions){
                            newSettings.groupOptions = angular.extend({}, settings.groupOptions, newSettings.groupOptions);
                        }

                        if (angular.isArray(newSettings.dataset)) {
                            //auto-set the total from passed in dataset
                            newSettings.total = newSettings.dataset.length;
                        }

                        // todo: remove the backwards compatibility shim and the following two if blocks
                        if (newSettings.getData && newSettings.getData.length > 1){
                            // support the old getData($defer, params) api
                            newSettings.getDataFnAdaptor = fsTableGetDataBcShim;
                        }
                        if (newSettings.getGroups && newSettings.getGroups.length > 2){
                            // support the old getGroups($defer, params) api
                            newSettings.getGroupsFnAdaptor = fsTableGetDataBcShim;
                        }

                        var originalDataset = settings.dataset;
                        settings = angular.extend(settings, newSettings);

                        if (angular.isArray(newSettings.dataset)) {
                            optimizeFilterDelay();
                        }

                        // note: using != as want null and undefined to be treated the same
                        var hasDatasetChanged = newSettings.hasOwnProperty('dataset') && (newSettings.dataset != originalDataset);
                        if (hasDatasetChanged) {
                            if (isCommittedDataset){
                                this.page(1); // reset page as a new dataset has been supplied
                            }
                            isCommittedDataset = false;

                            var fireEvent = function () {
                                fsTableEventsChannel.publishDatasetChanged(self, newSettings.dataset, originalDataset);
                            };

                            if (initialEvents){
                                initialEvents.push(fireEvent);
                            } else {
                                fireEvent();
                            }
                        }
                        log('fsTable: set settings', settings);
                        return this;
                    }
                    return settings;
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#page
                 * @description If parameter page not set return current page else set current page
                 *
                 * @param {string} page Page number
                 * @returns {Object|Number} Current page or `this`
                 */
                this.page = function(page) {
                    return angular.isDefined(page) ? this.parameters({
                        'page': page
                    }) : params.page;
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#total
                 * @description If parameter total not set return current quantity else set quantity
                 *
                 * @param {string} total Total quantity of items
                 * @returns {Object|Number} Current page or `this`
                 */
                this.total = function(total) {
                    return angular.isDefined(total) ? this.settings({
                        'total': total
                    }) : settings.total;
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#count
                 * @description If parameter count not set return current count per page else set count per page
                 *
                 * @param {string} count Count per number
                 * @returns {Object|Number} Count per page or `this`
                 */
                this.count = function(count) {
                    // reset to first page because can be blank page
                    return angular.isDefined(count) ? this.parameters({
                        'count': count,
                        'page': 1
                    }) : params.count;
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#filter
                 * @description If 'filter' parameter not set return current filter else set current filter
                 *
                 * Note: when assigning a new filter, {@link FsTableParams#page page} will be set to 1
                 *
                 * @param {Object|Boolean} filter 'object': new filter to assign or
                 * 'true': to return the current filter minus any insignificant values (null,  undefined and empty string); or
                 * 'falsey': to return the current filter "as is"
                 * @returns {Object} Current filter or `this`
                 */
                this.filter = function(filter) {
                    if (angular.isDefined(filter) && angular.isObject(filter)) {
                        return this.parameters({
                            'filter': filter,
                            'page': 1
                        });
                    } else if (filter === true){
                        var keys = Object.keys(params.filter);
                        var significantFilter = {};
                        for (var i=0; i < keys.length; i++){
                            var filterValue = params.filter[keys[i]];
                            if (filterValue != null && filterValue !== '') {
                                significantFilter[keys[i]] = filterValue;
                            }
                        }
                        return significantFilter;
                    } else {
                        return params.filter;
                    }
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#group
                 * @description If 'group' parameter is not set, return current grouping. Otherwise set current group.
                 *
                 * @param {string|Function|Object} group New group field
                 * @param {string} sortDirection Optional direction that the list of groups should be sorted
                 * @returns {Object} Current grouping or `this`
                 */
                this.group = function(group, sortDirection) {
                    if (!angular.isDefined(group)){
                        return params.group;
                    }

                    var newParameters = {
                        page: 1
                    };
                    if (angular.isFunction(group) && angular.isDefined(sortDirection)){
                        group.sortDirection = sortDirection;
                        newParameters.group = group;
                    } else if (angular.isDefined(group) && angular.isDefined(sortDirection)) {
                        var groupArray = {};
                        groupArray[group] = sortDirection;
                        newParameters.group = groupArray;
                    } else {
                        newParameters.group = group;
                    }
                    this.parameters(newParameters);
                    return this;
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#sorting
                 * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
                 *
                 * @param {string} sorting New sorting
                 * @returns {Object} Current sorting or `this`
                 */
                this.sorting = function(sorting) {
                    if (arguments.length == 2) {
                        var sortArray = {};
                        sortArray[sorting] = arguments[1];
                        this.parameters({
                            'sorting': sortArray
                        });
                        return this;
                    }
                    return angular.isDefined(sorting) ? this.parameters({
                        'sorting': sorting
                    }) : params.sorting;
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#isSortBy
                 * @description Checks sort field
                 *
                 * @param {string} field     Field name
                 * @param {string} direction Optional direction of sorting ('asc' or 'desc')
                 * @returns {Array} Return true if field sorted by direction
                 */
                this.isSortBy = function(field, direction) {
                    if(direction !== undefined) {
                        return angular.isDefined(params.sorting[field]) && params.sorting[field] == direction;
                    } else {
                        return angular.isDefined(params.sorting[field]);
                    }
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#orderBy
                 * @description Return object of sorting parameters for angular filter
                 *
                 * @returns {Array} Array like: [ '-name', '+age' ]
                 */
                this.orderBy = function() {
                    return convertSortToOrderBy(params.sorting);
                };

                function convertSortToOrderBy(sorting){
                    var result = [];
                    for (var column in sorting) {
                        result.push((sorting[column] === "asc" ? "+" : "-") + column);
                    }
                    return result;
                }

                /**
                 * @ngdoc method
                 * @name FsTableParams#generatePagesArray
                 * @description Generate array of pages
                 *
                 * When no arguments supplied, the current parameter state of this `FsTableParams` instance will be used
                 *
                 * @param {boolean} currentPage which page must be active
                 * @param {boolean} totalItems  Total quantity of items
                 * @param {boolean} pageSize    Quantity of items on page
                 * @param {number} maxBlocks    Quantity of blocks for pagination
                 * @returns {Array} Array of pages
                 */
                this.generatePagesArray = function(currentPage, totalItems, pageSize, maxBlocks) {
                    if (!arguments.length){
                        currentPage = this.page();
                        totalItems = this.total();
                        pageSize = this.count();
                    }

                    var maxPage, maxPivotPages, minPage, numPages, pages;
                    maxBlocks = maxBlocks && maxBlocks < 6 ? 6 : maxBlocks;

                    pages = [];
                    numPages = Math.ceil(totalItems / pageSize);
                    if (numPages > 1) {
                        pages.push({
                            type: 'prev',
                            number: Math.max(1, currentPage - 1),
                            active: currentPage > 1
                        });
                        pages.push({
                            type: 'first',
                            number: 1,
                            active: currentPage > 1,
                            current: currentPage === 1
                        });
                        maxPivotPages = Math.round((settings.paginationMaxBlocks - settings.paginationMinBlocks) / 2);
                        minPage = Math.max(2, currentPage - maxPivotPages);
                        maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                        minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                        var i = minPage;
                        while (i <= maxPage) {
                            if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                                pages.push({
                                    type: 'more',
                                    active: false
                                });
                            } else {
                                pages.push({
                                    type: 'page',
                                    number: i,
                                    active: currentPage !== i,
                                    current: currentPage === i
                                });
                            }
                            i++;
                        }
                        pages.push({
                            type: 'last',
                            number: numPages,
                            active: currentPage !== numPages,
                            current: currentPage === numPages
                        });
                        pages.push({
                            type: 'next',
                            number: Math.min(numPages, currentPage + 1),
                            active: currentPage < numPages
                        });
                    }
                    return pages;
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#isDataReloadRequired
                 * @description Return true when a change to this `FsTableParams` instance should require the reload method
                 * to be run so as to ensure the data presented to the user reflects the `FsTableParams`
                 *
                 * Note that this method will return false when the reload method has run but fails. In this case
                 * `hasErrorState` will return true.
                 */
                this.isDataReloadRequired = function(){
                    // note: using != as want to treat null and undefined the same
                    return !isCommittedDataset || !angular.equals(createComparableParams(), prevParamsMemento)
                        || hasGlobalSearchFieldChanges();
                };

                function createComparableParams(){
                    var result = {params: params};
                    if (angular.isFunction(params.group)){
                        result.groupSortDirection = params.group.sortDirection;
                    }
                    return result
                }
                /**
                 * @ngdoc method
                 * @name FsTableParams#hasFilter
                 * @description Determines if FsTableParams#filter has significant filter value(s)
                 * (any value except null, undefined, or empty string)
                 * @returns {Boolean} true when FsTableParams#filter has at least one significant field value
                 */
                this.hasFilter = function(){
                    return Object.keys(this.filter(true)).length > 0;
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#hasGroup
                 * @description Determines if at least one group has been set
                 * @returns {Boolean}
                 */
                this.hasGroup = function(group, sortDirection){
                    if (group == null) {
                        return angular.isFunction(params.group) || Object.keys(params.group).length > 0
                    }

                    if (angular.isFunction(group)) {
                        if (sortDirection == null) {
                            return params.group === group;
                        } else {
                            return params.group === group && group.sortDirection === sortDirection;
                        }
                    } else {
                        if (sortDirection == null) {
                            return Object.keys(params.group).indexOf(group) !== -1;
                        } else {
                            return params.group[group] === sortDirection;
                        }
                    }
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#hasFilterChanges
                 * @description Return true when a change to `FsTableParams.filters`require the reload method
                 * to be run so as to ensure the data presented to the user reflects these filters
                 */
                this.hasFilterChanges = function(){
                    var previousFilter = (prevParamsMemento && prevParamsMemento.params.filter);
                    return !angular.equals((params.filter), previousFilter) || hasGlobalSearchFieldChanges();
                };

                function hasGlobalSearchFieldChanges(){
                    var currentVal = (params.filter && params.filter.$);
                    var previousVal =
                        (prevParamsMemento && prevParamsMemento.params.filter && prevParamsMemento.params.filter.$);
                    return !angular.equals(currentVal, previousVal);
                }

                /**
                 * @ngdoc method
                 * @name FsTableParams#url
                 * @description Return groups for table grouping
                 *
                 * @param {boolean} asString flag indicates return array of string or object
                 * @returns {Array} If asString = true will be return array of url string parameters else key-value object
                 */
                this.url = function(asString) {
                    asString = asString || false;
                    var pairs = (asString ? [] : {});
                    for (var key in params) {
                        if (params.hasOwnProperty(key)) {
                            var item = params[key],
                                name = encodeURIComponent(key);
                            if (typeof item === "object") {
                                for (var subkey in item) {
                                    if (isSignificantValue(item[subkey], key)) {
                                        var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                        collectValue(item[subkey], pname);
                                    }
                                }
                            } else if (!angular.isFunction(item) && isSignificantValue(item, key)) {
                                collectValue(item, name);
                            }
                        }
                    }
                    return pairs;

                    function collectValue(value, key){
                        if (asString) {
                            pairs.push(key + "=" + encodeURIComponent(value));
                        } else {
                            pairs[key] = encodeURIComponent(value);
                        }
                    }

                    function isSignificantValue(value, key){
                        return key === "group" ? true : angular.isDefined(value) && value !== "";
                    }
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#reload
                 * @description Reload table data
                 */
                this.reload = function() {
                    var self = this,
                        pData = null;

                    settings.$loading = true;

                    prevParamsMemento = angular.copy(createComparableParams());
                    isCommittedDataset = true;

                    if (self.hasGroup()) {
                        pData = runInterceptorPipeline(runGetGroups);
                    } else {
                        pData = runInterceptorPipeline(runGetData);
                    }

                    log('fsTable: reload data');

                    var oldData = self.data;
                    return pData.then(function(data) {
                        settings.$loading = false;
                        errParamsMemento = null;

                        self.data = data;
                        // note: I think it makes sense to publish this event even when data === oldData
                        // subscribers can always set a filter to only receive the event when data !== oldData
                        fsTableEventsChannel.publishAfterReloadData(self, data, oldData);
                        self.reloadPages();

                        // todo: remove after acceptable depreciation period
                        if (settings.$scope) {
                            settings.$scope.$emit('fsTableAfterReloadData');
                        }

                        return data;
                    }).catch(function(reason){
                        errParamsMemento = prevParamsMemento;
                        // "rethrow"
                        return $q.reject(reason);
                    });
                };

                /**
                 * @ngdoc method
                 * @name FsTableParams#hasErrorState
                 * @description Return true when an attempt to `reload` the current `parameter` values have resulted in
                 * a failure
                 *
                 * This method will continue to return true until the reload is successfully called or when the
                 * `parameter` values have changed
                 */
                this.hasErrorState = function(){
                    return !!(errParamsMemento && angular.equals(errParamsMemento, createComparableParams()));
                };

                function optimizeFilterDelay(){
                    // don't debounce by default filter input when working with small synchronous datasets
                    if (settings.filterOptions.filterDelay === defaultFilterOptions.filterDelay &&
                        settings.total <= settings.filterOptions.filterDelayThreshold &&
                        settings.getData === defaultSettingsFns.getData){
                        settings.filterOptions.filterDelay = 0;
                    }
                }

                this.reloadPages = (function() {
                    var currentPages;
                    return function(){
                        var oldPages = currentPages;
                        var newPages = self.generatePagesArray(self.page(), self.total(), self.count());
                        if (!angular.equals(oldPages, newPages)){
                            currentPages = newPages;
                            fsTableEventsChannel.publishPagesChanged(this, newPages, oldPages);
                        }
                    }
                })();

                function runGetData(){
                    var getDataFn = settings.getDataFnAdaptor(settings.getData);
                    return $q.when(getDataFn.call(settings, self));
                }

                function runGetGroups(){
                    var getGroupsFn = settings.getGroupsFnAdaptor(settings.getGroups);
                    return $q.when(getGroupsFn.call(settings, self));
                }

                function runInterceptorPipeline(fetchFn){
                    var interceptors = settings.interceptors || [];

                    return interceptors.reduce(function(result, interceptor){
                        var thenFn = (interceptor.response && interceptor.response.bind(interceptor)) || $q.when;
                        var rejectFn = (interceptor.responseError && interceptor.responseError.bind(interceptor)) || $q.reject;
                        return result.then(function(data){
                            return thenFn(data, self);
                        }, function(reason){
                            return rejectFn(reason, self);
                        });
                    }, fetchFn());
                }

                function getDefaultSettingFns(){

                    return {
                        getDataFnAdaptor: angular.identity,
                        getGroupsFnAdaptor: angular.identity,
                        getData: getData,
                        getGroups: getGroups
                    };

                    /**
                     * @ngdoc method
                     * @name settings#getData
                     * @description Returns the data to display in the table
                     *
                     * Called by `FsTableParams` whenever it considers new data is to be loaded
                     *
                     * @param {Object} params the `FsTableParams` requesting data
                     */
                    function getData(params) {
                        return fsTableDefaultGetData(params.settings().dataset, params);
                    }

                    /**
                     * @ngdoc method
                     * @name settings#getGroups
                     * @description Return groups of data to display in the table
                     *
                     * Called by `FsTableParams` whenever it considers new data is to be loaded
                     * and when a `group` value has been assigned
                     *
                     * @param {Object} params the `FsTableParams` requesting data
                     */
                    function getGroups(params) {

                        var group = params.group();
                        var groupFn;
                        var sortDirection = undefined;
                        if (angular.isFunction(group)) {
                            groupFn = group;
                            sortDirection = group.sortDirection;
                        } else {
                            // currently support for only one group implemented
                            var groupField = Object.keys(group)[0];
                            sortDirection = group[groupField];
                            groupFn = function(item){
                                return getPath(item, groupField);
                            };
                        }

                        var settings = params.settings();
                        var originalDataOptions = settings.dataOptions;
                        settings.dataOptions = { applyPaging: false };
                        var adaptedFn = settings.getDataFnAdaptor(settings.getData);
                        var gotData = $q.when(adaptedFn.call(settings, params));
                        return gotData.then(function(data) {
                            var groups = {};
                            angular.forEach(data, function(item) {
                                var groupName = groupFn(item);
                                groups[groupName] = groups[groupName] || {
                                    data: [],
                                    $hideRows: !settings.groupOptions.isExpanded,
                                    value: groupName
                                };
                                groups[groupName].data.push(item);
                            });
                            var result = [];
                            for (var i in groups) {
                                result.push(groups[i]);
                            }
                            if (sortDirection) {
                                var orderByFn = fsTableDefaultGetData.getOrderByFn();
                                var orderBy = convertSortToOrderBy({
                                    value: sortDirection
                                });
                                result = orderByFn(result, orderBy);
                            }

                            return fsTableDefaultGetData.applyPaging(result, params);
                        }).finally(function(){
                            // restore the real options
                            settings.dataOptions = originalDataOptions;
                        });
                    }

                    function getPath (obj, ks) {
                        // origianl source https://github.com/documentcloud/underscore-contrib

                        if (typeof ks == "string") ks = ks.split(".");

                        // If we have reached an undefined property
                        // then stop executing and return undefined
                        if (obj === undefined) return void 0;

                        // If the path array has no more elements, we've reached
                        // the intended property and return its value
                        if (ks.length === 0) return obj;

                        // If we still have elements in the path array and the current
                        // value is null, stop executing and return undefined
                        if (obj === null) return void 0;

                        return getPath(obj[ks[0]], ks.slice(1));
                    }
                }

                var params = {
                    page: 1,
                    count: 10,
                    filter: {},
                    sorting: {},
                    group: {}
                };
                angular.extend(params, fsTableDefaults.params);

                /**
                 * @ngdoc object
                 * @name settings
                 * @module fsTable
                 * @description configuration settings for `FsTableParams`
                 */
                var settings = {
                    // todo: remove $scope after acceptable depreciation period as no longer required
                    $scope: null, // set by fsTable controller
                    $loading: false,
                    dataset: null, //allows data to be set when table is initialized
                    total: 0,
                    defaultSort: 'desc',
                    filterOptions: angular.copy(defaultFilterOptions),
                    groupOptions: angular.copy(defaultGroupOptions),
                    counts: [10, 25, 50, 100],
                    interceptors: [],
                    paginationMaxBlocks: 11,
                    paginationMinBlocks: 5,
                    sortingIndicator: 'span'
                };

                this.settings(defaultSettingsFns);
                this.settings(fsTableDefaults.settings);
                this.settings(baseSettings);
                this.parameters(baseParameters, true);

                fsTableEventsChannel.publishAfterCreated(this);
                // run events during construction after the initial create event. That way a consumer
                // can subscribe to all events for a table without "dropping" an event
                angular.forEach(initialEvents, function(event){
                    event();
                });
                initialEvents = null;

                return this;
            };
            return FsTableParams;
        }]);

        /**
         * @ngdoc service
         * @name fsTableParams
         * @description Backwards compatible shim for lowercase 'n' in FsTableParams
         */
        angular.module('fish.table').factory('fsTableParams', ['FsTableParams', function(FsTableParams) {
            return FsTableParams;
        }]);
    })();



    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        /**
         * @ngdoc object
         * @name fsTableController
         *
         * @description
         * Each {@link fsTable fsTable} directive creates an instance of `fsTableController`
         */
        angular.module('fish.table').controller('fsTableController', ['$scope', 'FsTableParams', '$timeout', '$parse', '$compile', '$attrs', '$element',
            'fsTableColumn', 'fsTableEventsChannel',
            function($scope, FsTableParams, $timeout, $parse, $compile, $attrs, $element, fsTableColumn, fsTableEventsChannel) {
                var isFirstTimeLoad = true;
                $scope.$filterRow = {};
                $scope.$loading = false;

                // until such times as the directive uses an isolated scope, we need to ensure that the check for
                // the params field only consults the "own properties" of the $scope. This is to avoid seeing the params
                // field on a $scope higher up in the prototype chain
                if (!$scope.hasOwnProperty("params")) {
                    $scope.params = new FsTableParams(true);
                }
                $scope.params.settings().$scope = $scope;

                var delayFilter = (function() {
                    var timer = 0;
                    return function(callback, ms) {
                        $timeout.cancel(timer);
                        timer = $timeout(callback, ms);
                    };
                })();

                function onDataReloadStatusChange (newStatus/*, oldStatus*/) {
                    if (!newStatus || $scope.params.hasErrorState()) {
                        return;
                    }

                    $scope.params.settings().$scope = $scope;

                    var currentParams = $scope.params;
                    var filterOptions = currentParams.settings().filterOptions;

                    if (currentParams.hasFilterChanges()) {
                        var applyFilter = function () {
                            currentParams.page(1);
                            currentParams.reload();
                        };
                        if (filterOptions.filterDelay) {
                            delayFilter(applyFilter, filterOptions.filterDelay);
                        } else {
                            applyFilter();
                        }
                    } else {
                        currentParams.reload();
                    }
                }

                // watch for when a new FsTableParams is bound to the scope
                // CRITICAL: the watch must be for reference and NOT value equality; this is because FsTableParams maintains
                // the current data page as a field. Checking this for value equality would be terrible for performance
                // and potentially cause an error if the items in that array has circular references
                $scope.$watch('params', function(newParams, oldParams){
                    if (newParams === oldParams || !newParams) {
                        return;
                    }

                    newParams.reload();
                }, false);

                $scope.$watch('params.isDataReloadRequired()', onDataReloadStatusChange);

                this.compileDirectiveTemplates = function () {
                    if (!$element.hasClass('fs-table')) {
                        $scope.templates = {
                            header: ($attrs.templateHeader ? $attrs.templateHeader : 'table/header.tpl.html'),
                            pagination: ($attrs.templatePagination ? $attrs.templatePagination : 'table/pager.tpl.html')
                        };
                        $element.addClass('fs-table');
                        var headerTemplate = null;

                        // $element.find('> thead').length === 0 doesn't work on jqlite
                        var theadFound = false;
                        angular.forEach($element.children(), function(e) {
                            if (e.tagName === 'THEAD') {
                                theadFound = true;
                            }
                        });
                        if (!theadFound) {
                            headerTemplate = angular.element(document.createElement('thead')).attr('ng-include', 'templates.header');
                            $element.prepend(headerTemplate);
                        }
                        var paginationTemplate = angular.element(document.createElement('div')).attr({
                            'fs-table-pagination': 'params',
                            'template-url': 'templates.pagination'
                        });
                        $element.after(paginationTemplate);
                        if (headerTemplate) {
                            $compile(headerTemplate)($scope);
                        }
                        $compile(paginationTemplate)($scope);
                    }
                };

                this.loadFilterData = function ($columns) {
                    angular.forEach($columns, function ($column) {
                        var result;
                        result = $column.filterData($scope);
                        if (!result) {
                            delete $column.filterData;
                            return;
                        }

                        // if we're working with a deferred object or a promise, let's wait for the promise
                        /* WARNING: support for returning a $defer is depreciated */
                        if ((angular.isObject(result) && (angular.isObject(result.promise) || angular.isFunction(result.then)))) {
                            var pData = angular.isFunction(result.then) ? result : result.promise;
                            delete $column.filterData;
                            return pData.then(function(data) {
                                // our deferred can eventually return arrays, functions and objects
                                if (!angular.isArray(data) && !angular.isFunction(data) && !angular.isObject(data)) {
                                    // if none of the above was found - we just want an empty array
                                    data = [];
                                }
                                $column.data = data;
                            });
                        }
                        // otherwise, we just return what the user gave us. It could be a function, array, object, whatever
                        else {
                            return $column.data = result;
                        }
                    });
                };

                this.buildColumns = function (columns) {
                    var result = [];
                    (columns || []).forEach(function(col){
                        result.push(fsTableColumn.buildColumn(col, $scope, result));
                    });
                    return result
                };

                this.parseFsTableDynamicExpr = function (attr) {
                    if (!attr || attr.indexOf(" with ") > -1) {
                        var parts = attr.split(/\s+with\s+/);
                        return {
                            tableParams: parts[0],
                            columns: parts[1]
                        };
                    } else {
                        throw new Error('Parse error (expected example: fs-table-dynamic=\'tableParams with cols\')');
                    }
                };

                this.setupBindingsToInternalScope = function(tableParamsExpr){

                    // note: this we're setting up watches to simulate angular's isolated scope bindings

                    // note: is REALLY important to watch for a change to the fsTableParams *reference* rather than
                    // $watch for value equivalence. This is because fsTableParams references the current page of data as
                    // a field and it's important not to watch this
                    var tableParamsGetter = $parse(tableParamsExpr);
                    $scope.$watch(tableParamsGetter, (function (params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        $scope.paramsModel = tableParamsGetter;
                        $scope.params = params;
                    }), false);

                    setupFilterRowBindingsToInternalScope();
                    setupGroupRowBindingsToInternalScope();
                };

                function setupFilterRowBindingsToInternalScope(){
                    if ($attrs.showFilter) {
                        $scope.$parent.$watch($attrs.showFilter, function(value) {
                            $scope.show_filter = value;
                        });
                    } else {
                        $scope.$watch(hasVisibleFilterColumn, function(value){
                            $scope.show_filter = value;
                        })
                    }

                    if ($attrs.disableFilter) {
                        $scope.$parent.$watch($attrs.disableFilter, function(value) {
                            $scope.$filterRow.disabled = value;
                        });
                    }
                }

                function setupGroupRowBindingsToInternalScope(){
                    $scope.$groupRow = {};
                    if ($attrs.showGroup) {
                        var showGroupGetter = $parse($attrs.showGroup);
                        $scope.$parent.$watch(showGroupGetter, function(value) {
                            $scope.$groupRow.show = value;
                        });
                        if (showGroupGetter.assign){
                            // setup two-way databinding thus allowing fsTableGrowRow to assign to the showGroup expression
                            $scope.$watch('$groupRow.show', function(value) {
                                showGroupGetter.assign($scope.$parent, value);
                            });
                        }
                    } else{
                        $scope.$watch('params.hasGroup()', function(newValue) {
                            $scope.$groupRow.show = newValue;
                        });
                    }
                }

                function getVisibleColumns(){
                    return ($scope.$columns || []).filter(function(c){
                        return c.show($scope);
                    });
                }

                function hasVisibleFilterColumn(){
                    if (!$scope.$columns) return false;

                    return some($scope.$columns, function($column){
                        return $column.show($scope) && $column.filter($scope);
                    });
                }

                function some(array, predicate){
                    var found = false;
                    for (var i = 0; i < array.length; i++) {
                        var obj = array[i];
                        if (predicate(obj)){
                            found = true;
                            break;
                        }
                    }
                    return found;
                }

                function commonInit(){
                    fsTableEventsChannel.onAfterReloadData(bindDataToScope, $scope, isMyPublisher);
                    fsTableEventsChannel.onPagesChanged(bindPagesToScope, $scope, isMyPublisher);

                    function bindDataToScope(params, newDatapage){
                        var visibleColumns = getVisibleColumns();
                        if (params.hasGroup()) {
                            $scope.$groups = newDatapage || [];
                            $scope.$groups.visibleColumnCount = visibleColumns.length;
                        } else {
                            $scope.$data = newDatapage || [];
                            $scope.$data.visibleColumnCount = visibleColumns.length;
                        }
                    }

                    function bindPagesToScope(params, newPages){
                        $scope.pages = newPages
                    }

                    function isMyPublisher(publisher){
                        return $scope.params === publisher;
                    }
                }

                commonInit();
            }]);
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        /**
         * @ngdoc directive
         * @name fsTable
         * @module fsTable
         * @restrict A
         *
         * @description
         * Directive that instantiates {@link fsTableController fsTableController}.
         */
        angular.module('fish.table').directive('fsTable', ['$q', '$parse',
            function($q, $parse) {
                'use strict';

                return {
                    restrict: 'A',
                    priority: 1001,
                    scope: true,
                    controller: 'fsTableController',
                    compile: function(element) {
                        var columns = [],
                            i = 0,
                            dataRow,
                            groupRow,
                            rows = [];

                        angular.forEach(element.find('tr'), function(tr) {
                            rows.push(angular.element(tr))
                        });
                        dataRow = rows.filter(function(tr){
                            return !tr.hasClass('fs-table-group');
                        })[0];
                        groupRow = rows.filter(function(tr){
                            return tr.hasClass('fs-table-group');
                        })[0];

                        if (!dataRow) {
                            return;
                        }
                        angular.forEach(dataRow.find('td'), function(item) {
                            var el = angular.element(item);
                            if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                                return;
                            }

                            var getAttrValue = function(attr){
                                return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                            };
                            var setAttrValue = function(attr, value){
                                if (el.attr('x-data-' + attr)){
                                    el.attr('x-data-' + attr, value)
                                } else if (el.attr('data' + attr)){
                                    el.attr('data' + attr, value)
                                } else {
                                    el.attr(attr, value)
                                }
                            };

                            var parsedAttribute = function(attr) {
                                var expr = getAttrValue(attr);
                                if (!expr){
                                    return undefined;
                                }

                                var localValue;
                                var getter = function (context) {
                                    if (localValue !== undefined){
                                        return localValue;
                                    }
                                    return $parse(expr)(context);
                                };
                                getter.assign = function($scope, value){
                                    var parsedExpr = $parse(expr);
                                    if (parsedExpr.assign) {
                                        // we should be writing back to the parent scope as this is where the expression
                                        // came from
                                        parsedExpr.assign($scope.$parent, value);
                                    } else {
                                        localValue = value;
                                    }
                                };
                                return getter;
                            };
                            var titleExpr = getAttrValue('title-alt') || getAttrValue('title');
                            if (titleExpr){
                                el.attr('data-title-text', '{{' + titleExpr + '}}'); // this used in responsive table
                            }
                            // NOTE TO MAINTAINERS: if you add extra fields to a $column be sure to extend fsTableColumn with
                            // a corresponding "safe" default
                            columns.push({
                                id: i++,
                                title: parsedAttribute('title'),
                                titleAlt: parsedAttribute('title-alt'),
                                headerTitle: parsedAttribute('header-title'),
                                sortable: parsedAttribute('sortable'),
                                'class': parsedAttribute('header-class'),
                                filter: parsedAttribute('filter'),
                                groupable: parsedAttribute('groupable'),
                                headerTemplateURL: parsedAttribute('header'),
                                filterData: parsedAttribute('filter-data'),
                                show: el.attr("ng-if") ? parsedAttribute('ng-if') : undefined
                            });

                            if (groupRow || el.attr("ng-if")){
                                // change ng-if to bind to our column definition which we know will be writable
                                // because this will potentially increase the $watch count, only do so if we already have an
                                // ng-if or when we definitely need to change visibility of the columns.
                                // currently only fsTableGroupRow directive needs to change visibility
                                setAttrValue('ng-if', '$columns[' + (columns.length - 1) + '].show(this)');
                            }
                        });
                        return function(scope, element, attrs, controller) {
                            scope.$columns = columns = controller.buildColumns(columns);

                            controller.setupBindingsToInternalScope(attrs.fsTable);
                            controller.loadFilterData(columns);
                            controller.compileDirectiveTemplates();
                        };
                    }
                }
            }
        ]);
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){

        /**
         * @ngdoc directive
         * @name fsTableDynamic
         * @module fsTable
         * @restrict A
         *
         * @description
         * A dynamic version of the {@link fsTable fsTable} directive that accepts a dynamic list of columns
         * definitions to render
         */
        angular.module('fish.table').directive('fsTableDynamic', [function (){

            return {
                restrict: 'A',
                priority: 1001,
                scope: true,
                controller: 'fsTableController',
                compile: function(tElement) {
                    var row;

                    // IE 8 fix :not(.fs-table-group) selector
                    angular.forEach(tElement.find('tr'), function(tr) {
                        tr = angular.element(tr);
                        if (!tr.hasClass('fs-table-group') && !row) {
                            row = tr;
                        }
                    });
                    if (!row) {
                        return;
                    }

                    angular.forEach(row.find('td'), function(item) {
                        var el = angular.element(item);
                        var getAttrValue = function(attr){
                            return el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr);
                        };

                        // this used in responsive table
                        var titleExpr = getAttrValue('title');
                        if (!titleExpr){
                            el.attr('data-title-text', '{{$columns[$index].titleAlt(this) || $columns[$index].title(this)}}');
                        }
                        var showExpr = el.attr('ng-if');
                        if (!showExpr){
                            el.attr('ng-if', '$columns[$index].show(this)');
                        }
                    });
                    return function (scope, element, attrs, controller) {
                        var expr = controller.parseFsTableDynamicExpr(attrs.fsTableDynamic);

                        controller.setupBindingsToInternalScope(expr.tableParams);
                        controller.compileDirectiveTemplates();

                        scope.$watchCollection(expr.columns, function (newCols/*, oldCols*/) {
                            scope.$columns = controller.buildColumns(newCols);
                            controller.loadFilterData(scope.$columns);
                        });
                    };
                }
            };
        }]);
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .directive('fsTableColumnsBinding', fsTableColumnsBinding);

        fsTableColumnsBinding.$inject = ["$parse"];

        /**
         * @ngdoc directive
         * @name fsTableColumnsBinding
         * @description One-way data binds the $columns array generated by fsTable/fsTableDynamic to the specified
         * expression.
         *
         * This allows the $columns array to be accessed outside of the html table markup
         */
        function fsTableColumnsBinding($parse){
            var directive = {
                restrict: 'A',
                require: 'fsTable',
                link: linkFn
            };
            return directive;

            function linkFn($scope, $element, $attrs){
                var setter = $parse($attrs.fsTableColumnsBinding).assign;
                if (setter){
                    $scope.$watch('$columns', function(newColumns){
                        var shallowClone = (newColumns || []).slice(0);
                        setter($scope, shallowClone);
                    });
                }
            }
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        /**
         * @ngdoc directive
         * @name fsTablePagination
         * @module fsTable
         * @restrict A
         */
        angular.module('fish.table').directive('fsTablePagination', ['$compile', 'fsTableEventsChannel',
            function($compile, fsTableEventsChannel) {
                'use strict';

                return {
                    restrict: 'A',
                    scope: {
                        'params': '=fsTablePagination',
                        'templateUrl': '='
                    },
                    replace: false,
                    link: function(scope, element/*, attrs*/) {

                        fsTableEventsChannel.onAfterReloadData(function(pubParams) {
                            scope.pages = pubParams.generatePagesArray();
                        }, scope, function(pubParams){
                            return pubParams === scope.params;
                        });

                        scope.$watch('templateUrl', function(templateUrl) {
                            if (angular.isUndefined(templateUrl)) {
                                return;
                            }
                            var template = angular.element(document.createElement('div'));
                            template.attr({
                                'ng-include': 'templateUrl'
                            });
                            element.append(template);
                            $compile(template)(scope);
                        });
                    }
                };
            }
        ]);

    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .controller('fsTableFilterRowController', fsTableFilterRowController);

        fsTableFilterRowController.$inject = ['$scope', 'fsTableFilterConfig'];

        function fsTableFilterRowController($scope, fsTableFilterConfig){

            $scope.config = fsTableFilterConfig;

            $scope.getFilterCellCss = function (filter, layout){
                if (layout !== 'horizontal') {
                    return 's12';
                }

                var size = Object.keys(filter).length;
                var width = parseInt(12 / size, 10);
                return 's' + width;
            };

            $scope.getFilterPlaceholderValue = function(filterValue/*, filterName*/){
                if (angular.isObject(filterValue)) {
                    return filterValue.placeholder;
                } else {
                    return '';
                }
            };
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .directive('fsTableFilterRow', fsTableFilterRow);

        fsTableFilterRow.$inject = [];

        function fsTableFilterRow(){
            var directive = {
                restrict: 'E',
                replace: true,
                templateUrl: 'table/filterRow.tpl.html',
                scope: true,
                controller: 'fsTableFilterRowController'
            };
            return directive;
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .controller('fsTableGroupRowController', fsTableGroupRowController);

        fsTableGroupRowController.$inject = ['$scope'];

        function fsTableGroupRowController($scope){

            var groupFns = [];

            init();

            function init(){
                $scope.getGroupables = getGroupables;
                $scope.getGroupTitle = getGroupTitle;
                $scope.getVisibleColumns = getVisibleColumns;
                $scope.groupBy = groupBy;
                $scope.isSelectedGroup = isSelectedGroup;
                $scope.toggleDetail = toggleDetail;

                $scope.$watch('params.group()', setGroup, true);
            }

            function changeSortDirection(){
                var newDirection;
                if ($scope.params.hasGroup($scope.$selGroup, 'asc')) {
                    newDirection = 'desc';
                } else if ($scope.params.hasGroup($scope.$selGroup, 'desc')){
                    newDirection = '';
                } else {
                    newDirection = 'asc';
                }
                $scope.params.group($scope.$selGroup, newDirection);
            }

            function findGroupColumn(groupKey) {
                return $scope.$columns.filter(function ($column) {
                    return $column.groupable($scope) === groupKey;
                })[0];
            }

            function getGroupTitle(group){
                return angular.isFunction(group) ? group.title : group.title($scope);
            }

            function getGroupables(){
                var groupableCols = $scope.$columns.filter(function ($column) {
                    return $column.groupable($scope);
                });
                return groupFns.concat(groupableCols);
            }

            function getVisibleColumns(){
                return $scope.$columns.filter(function($column){
                    return $column.show($scope);
                })
            }

            function groupBy(group){
                if (isSelectedGroup(group)){
                    changeSortDirection();
                } else {
                    if (group.groupable){
                        $scope.params.group(group.groupable($scope));
                    } else{
                        $scope.params.group(group);
                    }
                }
            }

            function isSelectedGroup(group){
                if (group.groupable){
                    return group.groupable($scope) === $scope.$selGroup;
                } else {
                    return group === $scope.$selGroup;
                }
            }

            function setGroup(group){
                var existingGroupCol = findGroupColumn($scope.$selGroup);
                if (existingGroupCol && existingGroupCol.show.assign){
                    existingGroupCol.show.assign($scope, true);
                }
                if (angular.isFunction(group)) {
                    groupFns = [group];
                    $scope.$selGroup = group;
                    $scope.$selGroupTitle = group.title;
                } else {
                    // note: currently only one group is implemented
                    var groupKey = Object.keys(group || {})[0];
                    var groupedColumn = findGroupColumn(groupKey);
                    if (groupedColumn) {
                        $scope.$selGroupTitle = groupedColumn.title($scope);
                        $scope.$selGroup = groupKey;
                        if (groupedColumn.show.assign) {
                            groupedColumn.show.assign($scope, false);
                        }
                    }
                }
            }

            function toggleDetail(){
                $scope.params.settings().groupOptions.isExpanded = !$scope.params.settings().groupOptions.isExpanded;
                return $scope.params.reload();
            }
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .directive('fsTableGroupRow', fsTableGroupRow);

        fsTableGroupRow.$inject = [];

        function fsTableGroupRow(){
            var directive = {
                restrict: 'E',
                replace: true,
                templateUrl: 'table/groupRow.tpl.html',
                scope: true,
                controller: 'fsTableGroupRowController',
                controllerAs: 'dctrl'
            };
            return directive;
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .controller('fsTableSorterRowController', fsTableSorterRowController);

        fsTableSorterRowController.$inject = ['$scope'];

        function fsTableSorterRowController($scope){

            $scope.sortBy = sortBy;

            ///////////

            function sortBy($column, event) {
                var parsedSortable = $column.sortable && $column.sortable();
                if (!parsedSortable) {
                    return;
                }
                var defaultSort = $scope.params.settings().defaultSort;
                var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
                var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
                var sortingParams = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
                sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
                $scope.params.parameters({
                    sorting: sortingParams
                });
            }
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        angular.module('fish.table')
            .directive('fsTableSorterRow', fsTableSorterRow);

        fsTableSorterRow.$inject = [];

        function fsTableSorterRow(){
            var directive = {
                restrict: 'E',
                replace: true,
                templateUrl: 'table/sorterRow.tpl.html',
                scope: true,
                controller: 'fsTableSorterRowController'
            };
            return directive;
        }
    })();

    /**
     * fsTable: Table + Angular JS
     *
     * @author Vitalii Savchuk <esvit666@gmail.com>
     * @url https://github.com/esvit/fs-table/
     * @license New BSD License <http://creativecommons.org/licenses/BSD/>
     */

    (function(){
        'use strict';

        /**
         * @ngdoc directive
         * @name fsTableSelectFilterDs
         * @module fsTable
         * @restrict A
         *
         * @description
         * Takes the array returned by $column.filterData and makes it available as `$selectData` on the `$scope`.
         *
         * The resulting `$selectData` array will contain an extra item that is suitable to represent the user
         * "deselecting" an item from a `<select>` tag
         *
         * This directive is is focused on providing a datasource to an `ngOptions` directive
         */
        angular.module('fish.table')
            .directive('fsTableSelectFilterDs', fsTableSelectFilterDs);

        fsTableSelectFilterDs.$inject = [];

        function fsTableSelectFilterDs(){
            // note: not using isolated or child scope "by design"
            // this is to allow this directive to be combined with other directives that do

            var directive = {
                restrict: 'A',
                controller: fsTableSelectFilterDsController
            };
            return directive;
        }

        fsTableSelectFilterDsController.$inject = ['$scope', '$parse', '$attrs', '$q'];
        function fsTableSelectFilterDsController($scope, $parse, $attrs, $q){

            var $column = {};
            init();

            function init(){
                $column = $parse($attrs.fsTableSelectFilterDs)($scope);
                $scope.$watch(function(){
                    return $column.data;
                }, bindDataSource);
            }

            function bindDataSource(){
                getSelectListData($column).then(function(data){
                    if (data && !hasEmptyOption(data)){
                        data.unshift({ id: '', title: ''});
                    }
                    data = data || [];
                    $scope.$selectData = data;
                });
            }

            function hasEmptyOption(data) {
                var isMatch;
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item && item.id === '') {
                        isMatch = true;
                        break;
                    }
                }
                return isMatch;
            }

            function getSelectListData($column) {
                var data = angular.isFunction($column.data) ? $column.data() : $column.data;
                return $q.when(data);
            }
        }
    })();
})(window.angular || null);


/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.13.2 - 2015-10-09T15:34:24.040Z
 * License: MIT
 */
/**
 * todo:
 * 1. ui.select 替换为 fish.typeahead
 * 2. uiSelect 替换为 fsTypeahead
 * 3. 移除源文件的模板，把模板转换为源代码，并在模板和js文件上把ui-select替换为fs-typeahead，把glyphicon替换为fa
 * 4. 为所有指令的templateUrl方法的返回值添加前缀路径'typeahead/'
 */

(function () {
  "use strict";

  var KEY = {

    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46,
    COMMAND: 91,

    MAP: { 91 : "COMMAND", 8 : "BACKSPACE" , 9 : "TAB" , 13 : "ENTER" , 16 : "SHIFT" , 17 : "CTRL" , 18 : "ALT" , 19 : "PAUSEBREAK" , 20 : "CAPSLOCK" , 27 : "ESC" , 32 : "SPACE" , 33 : "PAGE_UP", 34 : "PAGE_DOWN" , 35 : "END" , 36 : "HOME" , 37 : "LEFT" , 38 : "UP" , 39 : "RIGHT" , 40 : "DOWN" , 43 : "+" , 44 : "PRINTSCREEN" , 45 : "INSERT" , 46 : "DELETE", 48 : "0" , 49 : "1" , 50 : "2" , 51 : "3" , 52 : "4" , 53 : "5" , 54 : "6" , 55 : "7" , 56 : "8" , 57 : "9" , 59 : ";", 61 : "=" , 65 : "A" , 66 : "B" , 67 : "C" , 68 : "D" , 69 : "E" , 70 : "F" , 71 : "G" , 72 : "H" , 73 : "I" , 74 : "J" , 75 : "K" , 76 : "L", 77 : "M" , 78 : "N" , 79 : "O" , 80 : "P" , 81 : "Q" , 82 : "R" , 83 : "S" , 84 : "T" , 85 : "U" , 86 : "V" , 87 : "W" , 88 : "X" , 89 : "Y" , 90 : "Z", 96 : "0" , 97 : "1" , 98 : "2" , 99 : "3" , 100 : "4" , 101 : "5" , 102 : "6" , 103 : "7" , 104 : "8" , 105 : "9", 106 : "*" , 107 : "+" , 109 : "-" , 110 : "." , 111 : "/", 112 : "F1" , 113 : "F2" , 114 : "F3" , 115 : "F4" , 116 : "F5" , 117 : "F6" , 118 : "F7" , 119 : "F8" , 120 : "F9" , 121 : "F10" , 122 : "F11" , 123 : "F12", 144 : "NUMLOCK" , 145 : "SCROLLLOCK" , 186 : ";" , 187 : "=" , 188 : "," , 189 : "-" , 190 : "." , 191 : "/" , 192 : "`" , 219 : "[" , 220 : "\\" , 221 : "]" , 222 : "'"
    },

    isControl: function (e) {
      var k = e.which;
      switch (k) {
        case KEY.COMMAND:
        case KEY.SHIFT:
        case KEY.CTRL:
        case KEY.ALT:
          return true;
      }

      if (e.metaKey) return true;

      return false;
    },
    isFunctionKey: function (k) {
      k = k.which ? k.which : k;
      return k >= 112 && k <= 123;
    },
    isVerticalMovement: function (k){
      return ~[KEY.UP, KEY.DOWN].indexOf(k);
    },
    isHorizontalMovement: function (k){
      return ~[KEY.LEFT,KEY.RIGHT,KEY.BACKSPACE,KEY.DELETE].indexOf(k);
    }
  };

  /**
   * Add querySelectorAll() to jqLite.
   *
   * jqLite find() is limited to lookups by tag name.
   * TODO This will change with future versions of AngularJS, to be removed when this happens
   *
   * See jqLite.find - why not use querySelectorAll? https://github.com/angular/angular.js/issues/3586
   * See feat(jqLite): use querySelectorAll instead of getElementsByTagName in jqLite.find https://github.com/angular/angular.js/pull/3598
   */
  if (angular.element.prototype.querySelectorAll === undefined) {
    angular.element.prototype.querySelectorAll = function(selector) {
      return angular.element(this[0].querySelectorAll(selector));
    };
  }

  /**
   * Add closest() to jqLite.
   */
  if (angular.element.prototype.closest === undefined) {
    angular.element.prototype.closest = function( selector) {
      var elem = this[0];
      var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

      while (elem) {
        if (matchesSelector.bind(elem)(selector)) {
          return elem;
        } else {
          elem = elem.parentElement;
        }
      }
      return false;
    };
  }

  var latestId = 0;

  var uis = angular.module('fish.typeahead', [])

      .constant('fsTypeaheadConfig', {
        theme: 'bootstrap',
        searchEnabled: true,
        sortable: false,
        placeholder: '', // Empty by default, like HTML tag <select>
        refreshDelay: 1000, // In milliseconds
        closeOnSelect: true,
        dropdownPosition: 'auto',
        generateId: function() {
          return latestId++;
        },
        appendToBody: false
      })

// See Rename minErr and make it accessible from outside https://github.com/angular/angular.js/issues/6913
      .service('fsTypeaheadMinErr', function() {
        var minErr = angular.$$minErr('fish.typeahead');
        return function() {
          var error = minErr.apply(this, arguments);
          var message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
          return new Error(message);
        };
      })

// Recreates old behavior of ng-transclude. Used internally.
      .directive('uisTranscludeAppend', function () {
        return {
          link: function (scope, element, attrs, ctrl, transclude) {
            transclude(scope, function (clone) {
              element.append(clone);
            });
          }
        };
      })

  /**
   * Highlights text that matches $select.search.
   *
   * Taken from AngularUI Bootstrap Typeahead
   * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
   */
      .filter('highlight', function() {
        function escapeRegexp(queryToEscape) {
          return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        return function(matchItem, query) {
          return query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="fs-typeahead-highlight">$&</span>') : matchItem;
        };
      })

  /**
   * A read-only equivalent of jQuery's offset function: http://api.jquery.com/offset/
   *
   * Taken from AngularUI Bootstrap Position:
   * See https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js#L70
   */
      .factory('uisOffset',
      ['$document', '$window',
        function ($document, $window) {

          return function(element) {
            var boundingClientRect = element[0].getBoundingClientRect();
            return {
              width: boundingClientRect.width || element.prop('offsetWidth'),
              height: boundingClientRect.height || element.prop('offsetHeight'),
              top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
              left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
            };
          };
        }]);

  uis.directive('fsTypeaheadChoices',
      ['fsTypeaheadConfig', 'uisRepeatParser', 'fsTypeaheadMinErr', '$compile',
        function(fsTypeaheadConfig, RepeatParser, fsTypeaheadMinErr, $compile) {

          return {
            restrict: 'EA',
            require: '^fsTypeahead',
            replace: true,
            transclude: true,
            templateUrl: function(tElement) {
              // Gets theme attribute from parent (fs-typeahead)
              var theme = tElement.parent().attr('theme') || fsTypeaheadConfig.theme;
              return 'typeahead/' + theme + '/choices.tpl.html';
            },

            compile: function(tElement, tAttrs) {

              if (!tAttrs.repeat) throw fsTypeaheadMinErr('repeat', "Expected 'repeat' expression.");

              return function link(scope, element, attrs, $select, transcludeFn) {

                // var repeat = RepeatParser.parse(attrs.repeat);
                var groupByExp = attrs.groupBy;
                var groupFilterExp = attrs.groupFilter;

                $select.parseRepeatAttr(attrs.repeat, groupByExp, groupFilterExp); //Result ready at $select.parserResult

                $select.disableChoiceExpression = attrs.uiDisableChoice;
                $select.onHighlightCallback = attrs.onHighlight;

                $select.dropdownPosition = attrs.position ? attrs.position.toLowerCase() : fsTypeaheadConfig.dropdownPosition;

                if(groupByExp) {
                  var groups = element.querySelectorAll('.fs-typeahead-choices-group');
                  if (groups.length !== 1) throw fsTypeaheadMinErr('rows', "Expected 1 .fs-typeahead-choices-group but got '{0}'.", groups.length);
                  groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
                }

                var choices = element.querySelectorAll('.fs-typeahead-choices-row');
                if (choices.length !== 1) {
                  throw fsTypeaheadMinErr('rows', "Expected 1 .fs-typeahead-choices-row but got '{0}'.", choices.length);
                }

                choices.attr('ng-repeat', $select.parserResult.repeatExpression(groupByExp))
                    .attr('ng-if', '$select.open') //Prevent unnecessary watches when dropdown is closed
                    .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');

                var rowsInner = element.querySelectorAll('.fs-typeahead-choices-row-inner');
                if (rowsInner.length !== 1) throw fsTypeaheadMinErr('rows', "Expected 1 .fs-typeahead-choices-row-inner but got '{0}'.", rowsInner.length);
                rowsInner.attr('uis-transclude-append', ''); //Adding uisTranscludeAppend directive to row element after choices element has ngRepeat

                $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from uisTranscludeAppend

                scope.$watch('$select.search', function(newValue) {
                  if(newValue && !$select.open && $select.multiple) $select.activate(false, true);
                  $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
                  $select.refresh(attrs.refresh);
                });

                attrs.$observe('refreshDelay', function() {
                  // $eval() is needed otherwise we get a string instead of a number
                  var refreshDelay = scope.$eval(attrs.refreshDelay);
                  $select.refreshDelay = refreshDelay !== undefined ? refreshDelay : fsTypeaheadConfig.refreshDelay;
                });
              };
            }
          };
        }]);

  /**
   * Contains fs-typeahead "intelligence".
   *
   * The goal is to limit dependency on the DOM whenever possible and
   * put as much logic in the controller (instead of the link functions) as possible so it can be easily tested.
   */
  uis.controller('fsTypeaheadCtrl',
      ['$scope', '$element', '$timeout', '$filter', 'uisRepeatParser', 'fsTypeaheadMinErr', 'fsTypeaheadConfig', '$parse',
        function($scope, $element, $timeout, $filter, RepeatParser, fsTypeaheadMinErr, fsTypeaheadConfig, $parse) {

          var ctrl = this;

          var EMPTY_SEARCH = '';

          ctrl.placeholder = fsTypeaheadConfig.placeholder;
          ctrl.searchEnabled = fsTypeaheadConfig.searchEnabled;
          ctrl.sortable = fsTypeaheadConfig.sortable;
          ctrl.refreshDelay = fsTypeaheadConfig.refreshDelay;

          ctrl.removeSelected = false; //If selected item(s) should be removed from dropdown list
          ctrl.closeOnSelect = true; //Initialized inside fsTypeahead directive link function
          ctrl.search = EMPTY_SEARCH;

          ctrl.activeIndex = 0; //Dropdown of choices
          ctrl.items = []; //All available choices

          ctrl.open = false;
          ctrl.focus = false;
          ctrl.disabled = false;
          ctrl.selected = undefined;

          ctrl.dropdownPosition = 'auto';

          ctrl.focusser = undefined; //Reference to input element used to handle focus events
          ctrl.resetSearchInput = true;
          ctrl.multiple = undefined; // Initialized inside fsTypeahead directive link function
          ctrl.disableChoiceExpression = undefined; // Initialized inside fsTypeaheadChoices directive link function
          ctrl.tagging = {isActivated: false, fct: undefined};
          ctrl.taggingTokens = {isActivated: false, tokens: undefined};
          ctrl.lockChoiceExpression = undefined; // Initialized inside fsTypeaheadMatch directive link function
          ctrl.clickTriggeredSelect = false;
          ctrl.$filter = $filter;

          ctrl.searchInput = $element.querySelectorAll('input.fs-typeahead-search');
          if (ctrl.searchInput.length !== 1) {
            throw fsTypeaheadMinErr('searchInput', "Expected 1 input.fs-typeahead-search but got '{0}'.", ctrl.searchInput.length);
          }

          ctrl.isEmpty = function() {
            return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
          };

          // Most of the time the user does not want to empty the search input when in typeahead mode
          function _resetSearchInput() {
            if (ctrl.resetSearchInput || (ctrl.resetSearchInput === undefined && fsTypeaheadConfig.resetSearchInput)) {
              ctrl.search = EMPTY_SEARCH;
              //reset activeIndex
              if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
                ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
              }
            }
          }

          function _groupsFilter(groups, groupNames) {
            var i, j, result = [];
            for(i = 0; i < groupNames.length ;i++){
              for(j = 0; j < groups.length ;j++){
                if(groups[j].name == [groupNames[i]]){
                  result.push(groups[j]);
                }
              }
            }
            return result;
          }

          // When the user clicks on fs-typeahead, displays the dropdown list
          ctrl.activate = function(initSearchValue, avoidReset) {
            if (!ctrl.disabled  && !ctrl.open) {
              if(!avoidReset) _resetSearchInput();

              $scope.$broadcast('uis:activate');

              ctrl.open = true;

              ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;

              // ensure that the index is set to zero for tagging variants
              // that where first option is auto-selected
              if ( ctrl.activeIndex === -1 && ctrl.taggingLabel !== false ) {
                ctrl.activeIndex = 0;
              }

              // Give it time to appear before focus
              $timeout(function() {
                ctrl.search = initSearchValue || ctrl.search;
                ctrl.searchInput[0].focus();
                if(!ctrl.tagging.isActivated && ctrl.items.length > 1) {
                  _ensureHighlightVisible();
                }
              });
            }
          };

          ctrl.findGroupByName = function(name) {
            return ctrl.groups && ctrl.groups.filter(function(group) {
                  return group.name === name;
                })[0];
          };

          ctrl.parseRepeatAttr = function(repeatAttr, groupByExp, groupFilterExp) {
            function updateGroups(items) {
              var groupFn = $scope.$eval(groupByExp);
              ctrl.groups = [];
              angular.forEach(items, function(item) {
                var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
                var group = ctrl.findGroupByName(groupName);
                if(group) {
                  group.items.push(item);
                }
                else {
                  ctrl.groups.push({name: groupName, items: [item]});
                }
              });
              if(groupFilterExp){
                var groupFilterFn = $scope.$eval(groupFilterExp);
                if( angular.isFunction(groupFilterFn)){
                  ctrl.groups = groupFilterFn(ctrl.groups);
                } else if(angular.isArray(groupFilterFn)){
                  ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
                }
              }
              ctrl.items = [];
              ctrl.groups.forEach(function(group) {
                ctrl.items = ctrl.items.concat(group.items);
              });
            }

            function setPlainItems(items) {
              ctrl.items = items;
            }

            ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;

            ctrl.parserResult = RepeatParser.parse(repeatAttr);

            ctrl.isGrouped = !!groupByExp;
            ctrl.itemProperty = ctrl.parserResult.itemName;

            //If collection is an Object, convert it to Array

            var originalSource = ctrl.parserResult.source;

            //When an object is used as source, we better create an array and use it as 'source'
            var createArrayFromObject = function(){
              var origSrc = originalSource($scope);
              $scope.$uisSource = Object.keys(origSrc).map(function(v){
                var result = {};
                result[ctrl.parserResult.keyName] = v;
                result.value = origSrc[v];
                return result;
              });
            };

            if (ctrl.parserResult.keyName){ // Check for (key,value) syntax
              createArrayFromObject();
              ctrl.parserResult.source = $parse('$uisSource' + ctrl.parserResult.filters);
              $scope.$watch(originalSource, function(newVal, oldVal){
                if (newVal !== oldVal) createArrayFromObject();
              }, true);
            }

            ctrl.refreshItems = function (data){
              data = data || ctrl.parserResult.source($scope);
              var selectedItems = ctrl.selected;
              //TODO should implement for single mode removeSelected
              if (ctrl.isEmpty() || (angular.isArray(selectedItems) && !selectedItems.length) || !ctrl.removeSelected) {
                ctrl.setItemsFn(data);
              }else{
                if ( data !== undefined ) {
                  var filteredItems = data.filter(function(i) {return selectedItems && selectedItems.indexOf(i) < 0;});
                  ctrl.setItemsFn(filteredItems);
                }
              }
              if (ctrl.dropdownPosition === 'auto' || ctrl.dropdownPosition === 'up'){
                $scope.calculateDropdownPos();
              }
            };

            // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
            $scope.$watchCollection(ctrl.parserResult.source, function(items) {
              if (items === undefined || items === null) {
                // If the user specifies undefined or null => reset the collection
                // Special case: items can be undefined if the user did not initialized the collection on the scope
                // i.e $scope.addresses = [] is missing
                ctrl.items = [];
              } else {
                if (!angular.isArray(items)) {
                  throw fsTypeaheadMinErr('items', "Expected an array but got '{0}'.", items);
                } else {
                  //Remove already selected items (ex: while searching)
                  //TODO Should add a test
                  ctrl.refreshItems(items);
                  ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
                }
              }
            });

          };

          var _refreshDelayPromise;

          /**
           * Typeahead mode: lets the user refresh the collection using his own function.
           *
           * See Expose $select.search for external / remote filtering https://github.com/angular-ui/fs-typeahead/pull/31
           */
          ctrl.refresh = function(refreshAttr) {
            if (refreshAttr !== undefined) {

              // Debounce
              // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
              // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
              if (_refreshDelayPromise) {
                $timeout.cancel(_refreshDelayPromise);
              }
              _refreshDelayPromise = $timeout(function() {
                $scope.$eval(refreshAttr);
              }, ctrl.refreshDelay);
            }
          };

          ctrl.isActive = function(itemScope) {
            if ( !ctrl.open ) {
              return false;
            }
            var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
            var isActive =  itemIndex === ctrl.activeIndex;

            if ( !isActive || ( itemIndex < 0 && ctrl.taggingLabel !== false ) ||( itemIndex < 0 && ctrl.taggingLabel === false) ) {
              return false;
            }

            if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
              itemScope.$eval(ctrl.onHighlightCallback);
            }

            return isActive;
          };

          ctrl.isDisabled = function(itemScope) {

            if (!ctrl.open) return;

            var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
            var isDisabled = false;
            var item;

            if (itemIndex >= 0 && !angular.isUndefined(ctrl.disableChoiceExpression)) {
              item = ctrl.items[itemIndex];
              isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression)); // force the boolean value
              item._fsTypeaheadChoiceDisabled = isDisabled; // store this for later reference
            }

            return isDisabled;
          };


          // When the user selects an item with ENTER or clicks the dropdown
          ctrl.select = function(item, skipFocusser, $event) {
            if (item === undefined || !item._fsTypeaheadChoiceDisabled) {

              if ( ! ctrl.items && ! ctrl.search ) return;

              if (!item || !item._fsTypeaheadChoiceDisabled) {
                if(ctrl.tagging.isActivated) {
                  // if taggingLabel is disabled, we pull from ctrl.search val
                  if ( ctrl.taggingLabel === false ) {
                    if ( ctrl.activeIndex < 0 ) {
                      item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
                      if (!item || angular.equals( ctrl.items[0], item ) ) {
                        return;
                      }
                    } else {
                      // keyboard nav happened first, user selected from dropdown
                      item = ctrl.items[ctrl.activeIndex];
                    }
                  } else {
                    // tagging always operates at index zero, taggingLabel === false pushes
                    // the ctrl.search value without having it injected
                    if ( ctrl.activeIndex === 0 ) {
                      // ctrl.tagging pushes items to ctrl.items, so we only have empty val
                      // for `item` if it is a detected duplicate
                      if ( item === undefined ) return;

                      // create new item on the fly if we don't already have one;
                      // use tagging function if we have one
                      if ( ctrl.tagging.fct !== undefined && typeof item === 'string' ) {
                        item = ctrl.tagging.fct(ctrl.search);
                        if (!item) return;
                        // if item type is 'string', apply the tagging label
                      } else if ( typeof item === 'string' ) {
                        // trim the trailing space
                        item = item.replace(ctrl.taggingLabel,'').trim();
                      }
                    }
                  }
                  // search ctrl.selected for dupes potentially caused by tagging and return early if found
                  if ( ctrl.selected && angular.isArray(ctrl.selected) && ctrl.selected.filter( function (selection) { return angular.equals(selection, item); }).length > 0 ) {
                    ctrl.close(skipFocusser);
                    return;
                  }
                }

                $scope.$broadcast('uis:select', item);

                var locals = {};
                locals[ctrl.parserResult.itemName] = item;

                $timeout(function(){
                  ctrl.onSelectCallback($scope, {
                    $item: item,
                    $model: ctrl.parserResult.modelMapper($scope, locals)
                  });
                });

                if (ctrl.closeOnSelect) {
                  ctrl.close(skipFocusser);
                }
                if ($event && $event.type === 'click') {
                  ctrl.clickTriggeredSelect = true;
                }
              }
            }
          };

          // Closes the dropdown
          ctrl.close = function(skipFocusser) {
            if (!ctrl.open) return;
            if (ctrl.ngModel && ctrl.ngModel.$setTouched) ctrl.ngModel.$setTouched();
            _resetSearchInput();
            ctrl.open = false;

            $scope.$broadcast('uis:close', skipFocusser);

          };

          ctrl.setFocus = function(){
            if (!ctrl.focus) ctrl.focusInput[0].focus();
          };

          ctrl.clear = function($event) {
            ctrl.select(undefined);
            $event.stopPropagation();
            $timeout(function() {
              ctrl.focusser[0].focus();
            }, 0, false);
          };

          // Toggle dropdown
          ctrl.toggle = function(e) {
            if (ctrl.open) {
              ctrl.close();
              e.preventDefault();
              e.stopPropagation();
            } else {
              ctrl.activate();
            }
          };

          ctrl.isLocked = function(itemScope, itemIndex) {
            var isLocked, item = ctrl.selected[itemIndex];

            if (item && !angular.isUndefined(ctrl.lockChoiceExpression)) {
              isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression)); // force the boolean value
              item._fsTypeaheadChoiceLocked = isLocked; // store this for later reference
            }

            return isLocked;
          };

          var sizeWatch = null;
          ctrl.sizeSearchInput = function() {

            var input = ctrl.searchInput[0],
                container = ctrl.searchInput.parent().parent()[0],
                calculateContainerWidth = function() {
                  // Return the container width only if the search input is visible
                  return container.clientWidth * !!input.offsetParent;
                },
                updateIfVisible = function(containerWidth) {
                  if (containerWidth === 0) {
                    return false;
                  }
                  var inputWidth = containerWidth - input.offsetLeft - 10;
                  if (inputWidth < 50) inputWidth = containerWidth;
                  ctrl.searchInput.css('width', inputWidth+'px');
                  return true;
                };

            ctrl.searchInput.css('width', '10px');
            $timeout(function() { //Give tags time to render correctly
              if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
                sizeWatch = $scope.$watch(calculateContainerWidth, function(containerWidth) {
                  if (updateIfVisible(containerWidth)) {
                    sizeWatch();
                    sizeWatch = null;
                  }
                });
              }
            });
          };

          function _handleDropDownSelection(key) {
            var processed = true;
            switch (key) {
              case KEY.DOWN:
                if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
                else if (ctrl.activeIndex < ctrl.items.length - 1) { ctrl.activeIndex++; }
                break;
              case KEY.UP:
                if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
                else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1)) { ctrl.activeIndex--; }
                break;
              case KEY.TAB:
                if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
                break;
              case KEY.ENTER:
                if(ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)){
                  ctrl.select(ctrl.items[ctrl.activeIndex]); // Make sure at least one dropdown item is highlighted before adding if not in tagging mode
                } else {
                  ctrl.activate(false, true); //In case its the search input in 'multiple' mode
                }
                break;
              case KEY.ESC:
                ctrl.close();
                break;
              default:
                processed = false;
            }
            return processed;
          }

          // Bind to keyboard shortcuts
          ctrl.searchInput.on('keydown', function(e) {

            var key = e.which;

            // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
            //   //TODO: SEGURO?
            //   ctrl.close();
            // }

            $scope.$apply(function() {

              var tagged = false;

              if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
                _handleDropDownSelection(key);
                if ( ctrl.taggingTokens.isActivated ) {
                  for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
                    if ( ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode] ) {
                      // make sure there is a new value to push via tagging
                      if ( ctrl.search.length > 0 ) {
                        tagged = true;
                      }
                    }
                  }
                  if ( tagged ) {
                    $timeout(function() {
                      ctrl.searchInput.triggerHandler('tagged');
                      var newItem = ctrl.search.replace(KEY.MAP[e.keyCode],'').trim();
                      if ( ctrl.tagging.fct ) {
                        newItem = ctrl.tagging.fct( newItem );
                      }
                      if (newItem) ctrl.select(newItem, true);
                    });
                  }
                }
              }

            });

            if(KEY.isVerticalMovement(key) && ctrl.items.length > 0){
              _ensureHighlightVisible();
            }

            if (key === KEY.ENTER || key === KEY.ESC) {
              e.preventDefault();
              e.stopPropagation();
            }

          });

          // If tagging try to split by tokens and add items
          ctrl.searchInput.on('paste', function (e) {
            var data = e.originalEvent.clipboardData.getData('text/plain');
            if (data && data.length > 0 && ctrl.taggingTokens.isActivated && ctrl.tagging.fct) {
              var items = data.split(ctrl.taggingTokens.tokens[0]); // split by first token only
              if (items && items.length > 0) {
                angular.forEach(items, function (item) {
                  var newItem = ctrl.tagging.fct(item);
                  if (newItem) {
                    ctrl.select(newItem, true);
                  }
                });
                e.preventDefault();
                e.stopPropagation();
              }
            }
          });

          ctrl.searchInput.on('tagged', function() {
            $timeout(function() {
              _resetSearchInput();
            });
          });

          // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
          function _ensureHighlightVisible() {
            var container = $element.querySelectorAll('.fs-typeahead-choices-content');
            var choices = container.querySelectorAll('.fs-typeahead-choices-row');
            if (choices.length < 1) {
              throw fsTypeaheadMinErr('choices', "Expected multiple .fs-typeahead-choices-row but got '{0}'.", choices.length);
            }

            if (ctrl.activeIndex < 0) {
              return;
            }

            var highlighted = choices[ctrl.activeIndex];
            var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
            var height = container[0].offsetHeight;

            if (posY > height) {
              container[0].scrollTop += posY - height;
            } else if (posY < highlighted.clientHeight) {
              if (ctrl.isGrouped && ctrl.activeIndex === 0)
                container[0].scrollTop = 0; //To make group header visible when going all the way up
              else
                container[0].scrollTop -= highlighted.clientHeight - posY;
            }
          }

          $scope.$on('$destroy', function() {
            ctrl.searchInput.off('keyup keydown tagged blur paste');
          });

        }]);

  uis.directive('fsTypeahead',
      ['$document', 'fsTypeaheadConfig', 'fsTypeaheadMinErr', 'uisOffset', '$compile', '$parse', '$timeout',
        function($document, fsTypeaheadConfig, fsTypeaheadMinErr, uisOffset, $compile, $parse, $timeout) {

          return {
            restrict: 'EA',
            templateUrl: function(tElement, tAttrs) {
              var theme = tAttrs.theme || fsTypeaheadConfig.theme;
              return 'typeahead/' + theme + (angular.isDefined(tAttrs.multiple) ? '/select-multiple.tpl.html' : '/select.tpl.html');
            },
            replace: true,
            transclude: true,
            require: ['fsTypeahead', '^ngModel'],
            scope: true,

            controller: 'fsTypeaheadCtrl',
            controllerAs: '$select',
            compile: function(tElement, tAttrs) {

              //Multiple or Single depending if multiple attribute presence
              if (angular.isDefined(tAttrs.multiple))
                tElement.append('<fs-typeahead-multiple/>').removeAttr('multiple');
              else
                tElement.append('<fs-typeahead-single/>');

              if (tAttrs.inputId)
                tElement.querySelectorAll('input.fs-typeahead-search')[0].id = tAttrs.inputId;

              return function(scope, element, attrs, ctrls, transcludeFn) {

                var $select = ctrls[0];
                var ngModel = ctrls[1];

                $select.generatedId = fsTypeaheadConfig.generateId();
                $select.baseTitle = attrs.title || 'Select box';
                $select.focusserTitle = $select.baseTitle + ' focus';
                $select.focusserId = 'focusser-' + $select.generatedId;

                $select.closeOnSelect = function() {
                  if (angular.isDefined(attrs.closeOnSelect)) {
                    return $parse(attrs.closeOnSelect)();
                  } else {
                    return fsTypeaheadConfig.closeOnSelect;
                  }
                }();

                $select.onSelectCallback = $parse(attrs.onSelect);
                $select.onRemoveCallback = $parse(attrs.onRemove);

                //Limit the number of selections allowed
                $select.limit = (angular.isDefined(attrs.limit)) ? parseInt(attrs.limit, 10) : undefined;

                //Set reference to ngModel from fsTypeaheadCtrl
                $select.ngModel = ngModel;

                $select.choiceGrouped = function(group){
                  return $select.isGrouped && group && group.name;
                };

                if(attrs.tabindex){
                  attrs.$observe('tabindex', function(value) {
                    $select.focusInput.attr('tabindex', value);
                    element.removeAttr('tabindex');
                  });
                }

                scope.$watch('searchEnabled', function() {
                  var searchEnabled = scope.$eval(attrs.searchEnabled);
                  $select.searchEnabled = searchEnabled !== undefined ? searchEnabled : fsTypeaheadConfig.searchEnabled;
                });

                scope.$watch('sortable', function() {
                  var sortable = scope.$eval(attrs.sortable);
                  $select.sortable = sortable !== undefined ? sortable : fsTypeaheadConfig.sortable;
                });

                attrs.$observe('disabled', function() {
                  // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
                  $select.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
                });

                attrs.$observe('resetSearchInput', function() {
                  // $eval() is needed otherwise we get a string instead of a boolean
                  var resetSearchInput = scope.$eval(attrs.resetSearchInput);
                  $select.resetSearchInput = resetSearchInput !== undefined ? resetSearchInput : true;
                });

                attrs.$observe('tagging', function() {
                  if(attrs.tagging !== undefined)
                  {
                    // $eval() is needed otherwise we get a string instead of a boolean
                    var taggingEval = scope.$eval(attrs.tagging);
                    $select.tagging = {isActivated: true, fct: taggingEval !== true ? taggingEval : undefined};
                  }
                  else
                  {
                    $select.tagging = {isActivated: false, fct: undefined};
                  }
                });

                attrs.$observe('taggingLabel', function() {
                  if(attrs.tagging !== undefined )
                  {
                    // check eval for FALSE, in this case, we disable the labels
                    // associated with tagging
                    if ( attrs.taggingLabel === 'false' ) {
                      $select.taggingLabel = false;
                    }
                    else
                    {
                      $select.taggingLabel = attrs.taggingLabel !== undefined ? attrs.taggingLabel : '(new)';
                    }
                  }
                });

                attrs.$observe('taggingTokens', function() {
                  if (attrs.tagging !== undefined) {
                    var tokens = attrs.taggingTokens !== undefined ? attrs.taggingTokens.split('|') : [',','ENTER'];
                    $select.taggingTokens = {isActivated: true, tokens: tokens };
                  }
                });

                //Automatically gets focus when loaded
                if (angular.isDefined(attrs.autofocus)){
                  $timeout(function(){
                    $select.setFocus();
                  });
                }

                //Gets focus based on scope event name (e.g. focus-on='SomeEventName')
                if (angular.isDefined(attrs.focusOn)){
                  scope.$on(attrs.focusOn, function() {
                    $timeout(function(){
                      $select.setFocus();
                    });
                  });
                }

                function onDocumentClick(e) {
                  if (!$select.open) return; //Skip it if dropdown is close

                  var contains = false;

                  if (window.jQuery) {
                    // Firefox 3.6 does not support element.contains()
                    // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
                    contains = window.jQuery.contains(element[0], e.target);
                  } else {
                    contains = element[0].contains(e.target);
                  }

                  if (!contains && !$select.clickTriggeredSelect) {
                    //Will lose focus only with certain targets
                    var focusableControls = ['input','button','textarea'];
                    var targetController = angular.element(e.target).controller('fsTypeahead'); //To check if target is other fs-typeahead
                    var skipFocusser = targetController && targetController !== $select; //To check if target is other fs-typeahead
                    if (!skipFocusser) skipFocusser =  ~focusableControls.indexOf(e.target.tagName.toLowerCase()); //Check if target is input, button or textarea
                    $select.close(skipFocusser);
                    scope.$digest();
                  }
                  $select.clickTriggeredSelect = false;
                }

                // See Click everywhere but here event http://stackoverflow.com/questions/12931369
                $document.on('click', onDocumentClick);

                scope.$on('$destroy', function() {
                  $document.off('click', onDocumentClick);
                });

                // Move transcluded elements to their correct position in main template
                transcludeFn(scope, function(clone) {
                  // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

                  // One day jqLite will be replaced by jQuery and we will be able to write:
                  // var transcludedElement = clone.filter('.my-class')
                  // instead of creating a hackish DOM element:
                  var transcluded = angular.element('<div>').append(clone);

                  var transcludedMatch = transcluded.querySelectorAll('.fs-typeahead-match');
                  transcludedMatch.removeAttr('fs-typeahead-match'); //To avoid loop in case directive as attr
                  transcludedMatch.removeAttr('data-fs-typeahead-match'); // Properly handle HTML5 data-attributes
                  if (transcludedMatch.length !== 1) {
                    throw fsTypeaheadMinErr('transcluded', "Expected 1 .fs-typeahead-match but got '{0}'.", transcludedMatch.length);
                  }
                  element.querySelectorAll('.fs-typeahead-match').replaceWith(transcludedMatch);

                  var transcludedChoices = transcluded.querySelectorAll('.fs-typeahead-choices');
                  transcludedChoices.removeAttr('fs-typeahead-choices'); //To avoid loop in case directive as attr
                  transcludedChoices.removeAttr('data-fs-typeahead-choices'); // Properly handle HTML5 data-attributes
                  if (transcludedChoices.length !== 1) {
                    throw fsTypeaheadMinErr('transcluded', "Expected 1 .fs-typeahead-choices but got '{0}'.", transcludedChoices.length);
                  }
                  element.querySelectorAll('.fs-typeahead-choices').replaceWith(transcludedChoices);
                });

                // Support for appending the select field to the body when its open
                var appendToBody = scope.$eval(attrs.appendToBody);
                if (appendToBody !== undefined ? appendToBody : fsTypeaheadConfig.appendToBody) {
                  scope.$watch('$select.open', function(isOpen) {
                    if (isOpen) {
                      positionDropdown();
                    } else {
                      resetDropdown();
                    }
                  });

                  // Move the dropdown back to its original location when the scope is destroyed. Otherwise
                  // it might stick around when the user routes away or the select field is otherwise removed
                  scope.$on('$destroy', function() {
                    resetDropdown();
                  });
                }

                // Hold on to a reference to the .fs-typeahead-container element for appendToBody support
                var placeholder = null,
                    originalWidth = '';

                function positionDropdown() {
                  // Remember the absolute position of the element
                  var offset = uisOffset(element);

                  // Clone the element into a placeholder element to take its original place in the DOM
                  placeholder = angular.element('<div class="fs-typeahead-placeholder"></div>');
                  placeholder[0].style.width = offset.width + 'px';
                  placeholder[0].style.height = offset.height + 'px';
                  element.after(placeholder);

                  // Remember the original value of the element width inline style, so it can be restored
                  // when the dropdown is closed
                  originalWidth = element[0].style.width;

                  // Now move the actual dropdown element to the end of the body
                  $document.find('body').append(element);

                  element[0].style.position = 'absolute';
                  element[0].style.left = offset.left + 'px';
                  element[0].style.top = offset.top + 'px';
                  element[0].style.width = offset.width + 'px';
                }

                function resetDropdown() {
                  if (placeholder === null) {
                    // The dropdown has not actually been display yet, so there's nothing to reset
                    return;
                  }

                  // Move the dropdown element back to its original location in the DOM
                  placeholder.replaceWith(element);
                  placeholder = null;

                  element[0].style.position = '';
                  element[0].style.left = '';
                  element[0].style.top = '';
                  element[0].style.width = originalWidth;
                }

                // Hold on to a reference to the .fs-typeahead-dropdown element for direction support.
                var dropdown = null,
                    directionUpClassName = 'direction-up';

                // Support changing the direction of the dropdown if there isn't enough space to render it.
                scope.$watch('$select.open', function() {

                  if ($select.dropdownPosition === 'auto' || $select.dropdownPosition === 'up'){
                    scope.calculateDropdownPos();
                  }

                });

                var setDropdownPosUp = function(offset, offsetDropdown){

                  offset = offset || uisOffset(element);
                  offsetDropdown = offsetDropdown || uisOffset(dropdown);

                  dropdown[0].style.position = 'absolute';
                  dropdown[0].style.top = (offsetDropdown.height * -1) + 'px';
                  element.addClass(directionUpClassName);

                };

                var setDropdownPosDown = function(offset, offsetDropdown){

                  element.removeClass(directionUpClassName);

                  offset = offset || uisOffset(element);
                  offsetDropdown = offsetDropdown || uisOffset(dropdown);

                  dropdown[0].style.position = '';
                  dropdown[0].style.top = '';

                };

                scope.calculateDropdownPos = function(){

                  if ($select.open) {
                    dropdown = angular.element(element).querySelectorAll('.fs-typeahead-dropdown');
                    if (dropdown.length === 0) {
                      return;
                    }

                    // Hide the dropdown so there is no flicker until $timeout is done executing.
                    dropdown[0].style.opacity = 0;

                    // Delay positioning the dropdown until all choices have been added so its height is correct.
                    $timeout(function(){

                      if ($select.dropdownPosition === 'up'){
                        //Go UP
                        setDropdownPosUp(offset, offsetDropdown);

                      }else{ //AUTO

                        element.removeClass(directionUpClassName);

                        var offset = uisOffset(element);
                        var offsetDropdown = uisOffset(dropdown);

                        //https://code.google.com/p/chromium/issues/detail?id=342307#c4
                        var scrollTop = $document[0].documentElement.scrollTop || $document[0].body.scrollTop; //To make it cross browser (blink, webkit, IE, Firefox).

                        // Determine if the direction of the dropdown needs to be changed.
                        if (offset.top + offset.height + offsetDropdown.height > scrollTop + $document[0].documentElement.clientHeight) {
                          //Go UP
                          setDropdownPosUp(offset, offsetDropdown);
                        }else{
                          //Go DOWN
                          setDropdownPosDown(offset, offsetDropdown);
                        }

                      }

                      // Display the dropdown once it has been positioned.
                      dropdown[0].style.opacity = 1;
                    });
                  } else {
                    if (dropdown === null || dropdown.length === 0) {
                      return;
                    }

                    // Reset the position of the dropdown.
                    dropdown[0].style.position = '';
                    dropdown[0].style.top = '';
                    element.removeClass(directionUpClassName);
                  }
                };
              };
            }
          };
        }]);

  uis.directive('fsTypeaheadMatch', ['fsTypeaheadConfig', function(fsTypeaheadConfig) {
    return {
      restrict: 'EA',
      require: '^fsTypeahead',
      replace: true,
      transclude: true,
      templateUrl: function(tElement) {
        // Gets theme attribute from parent (fs-typeahead)
        var theme = tElement.parent().attr('theme') || fsTypeaheadConfig.theme;
        var multi = tElement.parent().attr('multiple');
        return 'typeahead/' + theme + (multi ? '/match-multiple.tpl.html' : '/match.tpl.html');
      },
      link: function(scope, element, attrs, $select) {
        $select.lockChoiceExpression = attrs.uiLockChoice;
        attrs.$observe('placeholder', function(placeholder) {
          $select.placeholder = placeholder !== undefined ? placeholder : fsTypeaheadConfig.placeholder;
        });

        function setAllowClear(allow) {
          $select.allowClear = (angular.isDefined(allow)) ? (allow === '') ? true : (allow.toLowerCase() === 'true') : false;
        }

        attrs.$observe('allowClear', setAllowClear);
        setAllowClear(attrs.allowClear);

        if($select.multiple){
          $select.sizeSearchInput();
        }

      }
    };
  }]);

  uis.directive('fsTypeaheadMultiple', ['fsTypeaheadMinErr','$timeout', function(fsTypeaheadMinErr, $timeout) {
    return {
      restrict: 'EA',
      require: ['^fsTypeahead', '^ngModel'],

      controller: ['$scope','$timeout', function($scope, $timeout){

        var ctrl = this,
            $select = $scope.$select,
            ngModel;

        //Wait for link fn to inject it
        $scope.$evalAsync(function(){ ngModel = $scope.ngModel; });

        ctrl.activeMatchIndex = -1;

        ctrl.updateModel = function(){
          ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
          ctrl.refreshComponent();
        };

        ctrl.refreshComponent = function(){
          //Remove already selected items
          //e.g. When user clicks on a selection, the selected array changes and
          //the dropdown should remove that item
          $select.refreshItems();
          $select.sizeSearchInput();
        };

        // Remove item from multiple select
        ctrl.removeChoice = function(index){

          var removedChoice = $select.selected[index];

          // if the choice is locked, can't remove it
          if(removedChoice._fsTypeaheadChoiceLocked) return;

          var locals = {};
          locals[$select.parserResult.itemName] = removedChoice;

          $select.selected.splice(index, 1);
          ctrl.activeMatchIndex = -1;
          $select.sizeSearchInput();

          // Give some time for scope propagation.
          $timeout(function(){
            $select.onRemoveCallback($scope, {
              $item: removedChoice,
              $model: $select.parserResult.modelMapper($scope, locals)
            });
          });

          ctrl.updateModel();

        };

        ctrl.getPlaceholder = function(){
          //Refactor single?
          if($select.selected && $select.selected.length) return;
          return $select.placeholder;
        };


      }],
      controllerAs: '$selectMultiple',

      link: function(scope, element, attrs, ctrls) {

        var $select = ctrls[0];
        var ngModel = scope.ngModel = ctrls[1];
        var $selectMultiple = scope.$selectMultiple;

        //$select.selected = raw selected objects (ignoring any property binding)

        $select.multiple = true;
        $select.removeSelected = true;

        //Input that will handle focus
        $select.focusInput = $select.searchInput;

        //From view --> model
        ngModel.$parsers.unshift(function () {
          var locals = {},
              result,
              resultMultiple = [];
          for (var j = $select.selected.length - 1; j >= 0; j--) {
            locals = {};
            locals[$select.parserResult.itemName] = $select.selected[j];
            result = $select.parserResult.modelMapper(scope, locals);
            resultMultiple.unshift(result);
          }
          return resultMultiple;
        });

        // From model --> view
        ngModel.$formatters.unshift(function (inputValue) {
          var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
              locals = {},
              result;
          if (!data) return inputValue;
          var resultMultiple = [];
          var checkFnMultiple = function(list, value){
            if (!list || !list.length) return;
            for (var p = list.length - 1; p >= 0; p--) {
              locals[$select.parserResult.itemName] = list[p];
              result = $select.parserResult.modelMapper(scope, locals);
              if($select.parserResult.trackByExp){
                var matches = /\.(.+)/.exec($select.parserResult.trackByExp);
                if(matches.length>0 && result[matches[1]] == value[matches[1]]){
                  resultMultiple.unshift(list[p]);
                  return true;
                }
              }
              if (angular.equals(result,value)){
                resultMultiple.unshift(list[p]);
                return true;
              }
            }
            return false;
          };
          if (!inputValue) return resultMultiple; //If ngModel was undefined
          for (var k = inputValue.length - 1; k >= 0; k--) {
            //Check model array of currently selected items
            if (!checkFnMultiple($select.selected, inputValue[k])){
              //Check model array of all items available
              if (!checkFnMultiple(data, inputValue[k])){
                //If not found on previous lists, just add it directly to resultMultiple
                resultMultiple.unshift(inputValue[k]);
              }
            }
          }
          return resultMultiple;
        });

        //Watch for external model changes
        scope.$watchCollection(function(){ return ngModel.$modelValue; }, function(newValue, oldValue) {
          if (oldValue != newValue){
            ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
            $selectMultiple.refreshComponent();
          }
        });

        ngModel.$render = function() {
          // Make sure that model value is array
          if(!angular.isArray(ngModel.$viewValue)){
            // Have tolerance for null or undefined values
            if(angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null){
              $select.selected = [];
            } else {
              throw fsTypeaheadMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
            }
          }
          $select.selected = ngModel.$viewValue;
          scope.$evalAsync(); //To force $digest
        };

        scope.$on('uis:select', function (event, item) {
          if($select.selected.length >= $select.limit) {
            return;
          }
          $select.selected.push(item);
          $selectMultiple.updateModel();
        });

        scope.$on('uis:activate', function () {
          $selectMultiple.activeMatchIndex = -1;
        });

        scope.$watch('$select.disabled', function(newValue, oldValue) {
          // As the search input field may now become visible, it may be necessary to recompute its size
          if (oldValue && !newValue) $select.sizeSearchInput();
        });

        $select.searchInput.on('keydown', function(e) {
          var key = e.which;
          scope.$apply(function() {
            var processed = false;
            // var tagged = false; //Checkme
            if(KEY.isHorizontalMovement(key)){
              processed = _handleMatchSelection(key);
            }
            if (processed  && key != KEY.TAB) {
              //TODO Check si el tab selecciona aun correctamente
              //Crear test
              e.preventDefault();
              e.stopPropagation();
            }
          });
        });
        function _getCaretPosition(el) {
          if(angular.isNumber(el.selectionStart)) return el.selectionStart;
          // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
          else return el.value.length;
        }
        // Handles selected options in "multiple" mode
        function _handleMatchSelection(key){
          var caretPosition = _getCaretPosition($select.searchInput[0]),
              length = $select.selected.length,
          // none  = -1,
              first = 0,
              last  = length-1,
              curr  = $selectMultiple.activeMatchIndex,
              next  = $selectMultiple.activeMatchIndex+1,
              prev  = $selectMultiple.activeMatchIndex-1,
              newIndex = curr;

          if(caretPosition > 0 || ($select.search.length && key == KEY.RIGHT)) return false;

          $select.close();

          function getNewActiveMatchIndex(){
            switch(key){
              case KEY.LEFT:
                // Select previous/first item
                if(~$selectMultiple.activeMatchIndex) return prev;
                // Select last item
                else return last;
                break;
              case KEY.RIGHT:
                // Open drop-down
                if(!~$selectMultiple.activeMatchIndex || curr === last){
                  $select.activate();
                  return false;
                }
                // Select next/last item
                else return next;
                break;
              case KEY.BACKSPACE:
                // Remove selected item and select previous/first
                if(~$selectMultiple.activeMatchIndex){
                  $selectMultiple.removeChoice(curr);
                  return prev;
                }
                // Select last item
                else return last;
                break;
              case KEY.DELETE:
                // Remove selected item and select next item
                if(~$selectMultiple.activeMatchIndex){
                  $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                  return curr;
                }
                else return false;
            }
          }

          newIndex = getNewActiveMatchIndex();

          if(!$select.selected.length || newIndex === false) $selectMultiple.activeMatchIndex = -1;
          else $selectMultiple.activeMatchIndex = Math.min(last,Math.max(first,newIndex));

          return true;
        }

        $select.searchInput.on('keyup', function(e) {

          if ( ! KEY.isVerticalMovement(e.which) ) {
            scope.$evalAsync( function () {
              $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
            });
          }
          // Push a "create new" item into array if there is a search string
          if ( $select.tagging.isActivated && $select.search.length > 0 ) {

            // return early with these keys
            if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which) ) {
              return;
            }
            // always reset the activeIndex to the first item when tagging
            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
            // taggingLabel === false bypasses all of this
            if ($select.taggingLabel === false) return;

            var items = angular.copy( $select.items );
            var stashArr = angular.copy( $select.items );
            var newItem;
            var item;
            var hasTag = false;
            var dupeIndex = -1;
            var tagItems;
            var tagItem;

            // case for object tagging via transform `$select.tagging.fct` function
            if ( $select.tagging.fct !== undefined) {
              tagItems = $select.$filter('filter')(items,{'isTag': true});
              if ( tagItems.length > 0 ) {
                tagItem = tagItems[0];
              }
              // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
              if ( items.length > 0 && tagItem ) {
                hasTag = true;
                items = items.slice(1,items.length);
                stashArr = stashArr.slice(1,stashArr.length);
              }
              newItem = $select.tagging.fct($select.search);
              newItem.isTag = true;
              // verify the the tag doesn't match the value of an existing item
              if ( stashArr.filter( function (origItem) { return angular.equals( origItem, $select.tagging.fct($select.search) ); } ).length > 0 ) {
                return;
              }
              newItem.isTag = true;
              // handle newItem string and stripping dupes in tagging string context
            } else {
              // find any tagging items already in the $select.items array and store them
              tagItems = $select.$filter('filter')(items,function (item) {
                return item.match($select.taggingLabel);
              });
              if ( tagItems.length > 0 ) {
                tagItem = tagItems[0];
              }
              item = items[0];
              // remove existing tag item if found (should only ever be one tag item)
              if ( item !== undefined && items.length > 0 && tagItem ) {
                hasTag = true;
                items = items.slice(1,items.length);
                stashArr = stashArr.slice(1,stashArr.length);
              }
              newItem = $select.search+' '+$select.taggingLabel;
              if ( _findApproxDupe($select.selected, $select.search) > -1 ) {
                return;
              }
              // verify the the tag doesn't match the value of an existing item from
              // the searched data set or the items already selected
              if ( _findCaseInsensitiveDupe(stashArr.concat($select.selected)) ) {
                // if there is a tag from prev iteration, strip it / queue the change
                // and return early
                if ( hasTag ) {
                  items = stashArr;
                  scope.$evalAsync( function () {
                    $select.activeIndex = 0;
                    $select.items = items;
                  });
                }
                return;
              }
              if ( _findCaseInsensitiveDupe(stashArr) ) {
                // if there is a tag from prev iteration, strip it
                if ( hasTag ) {
                  $select.items = stashArr.slice(1,stashArr.length);
                }
                return;
              }
            }
            if ( hasTag ) dupeIndex = _findApproxDupe($select.selected, newItem);
            // dupe found, shave the first item
            if ( dupeIndex > -1 ) {
              items = items.slice(dupeIndex+1,items.length-1);
            } else {
              items = [];
              items.push(newItem);
              items = items.concat(stashArr);
            }
            scope.$evalAsync( function () {
              $select.activeIndex = 0;
              $select.items = items;
            });
          }
        });
        function _findCaseInsensitiveDupe(arr) {
          if ( arr === undefined || $select.search === undefined ) {
            return false;
          }
          var hasDupe = arr.filter( function (origItem) {
                if ( $select.search.toUpperCase() === undefined || origItem === undefined ) {
                  return false;
                }
                return origItem.toUpperCase() === $select.search.toUpperCase();
              }).length > 0;

          return hasDupe;
        }
        function _findApproxDupe(haystack, needle) {
          var dupeIndex = -1;
          if(angular.isArray(haystack)) {
            var tempArr = angular.copy(haystack);
            for (var i = 0; i <tempArr.length; i++) {
              // handle the simple string version of tagging
              if ( $select.tagging.fct === undefined ) {
                // search the array for the match
                if ( tempArr[i]+' '+$select.taggingLabel === needle ) {
                  dupeIndex = i;
                }
                // handle the object tagging implementation
              } else {
                var mockObj = tempArr[i];
                mockObj.isTag = true;
                if ( angular.equals(mockObj, needle) ) {
                  dupeIndex = i;
                }
              }
            }
          }
          return dupeIndex;
        }

        $select.searchInput.on('blur', function() {
          $timeout(function() {
            $selectMultiple.activeMatchIndex = -1;
          });
        });

      }
    };
  }]);

  uis.directive('fsTypeaheadSingle', ['$timeout','$compile', function($timeout, $compile) {
    return {
      restrict: 'EA',
      require: ['^fsTypeahead', '^ngModel'],
      link: function(scope, element, attrs, ctrls) {

        var $select = ctrls[0];
        var ngModel = ctrls[1];

        //From view --> model
        ngModel.$parsers.unshift(function (inputValue) {
          var locals = {},
              result;
          locals[$select.parserResult.itemName] = inputValue;
          result = $select.parserResult.modelMapper(scope, locals);
          return result;
        });

        //From model --> view
        ngModel.$formatters.unshift(function (inputValue) {
          var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
              locals = {},
              result;
          if (data){
            var checkFnSingle = function(d){
              locals[$select.parserResult.itemName] = d;
              result = $select.parserResult.modelMapper(scope, locals);
              return result == inputValue;
            };
            //If possible pass same object stored in $select.selected
            if ($select.selected && checkFnSingle($select.selected)) {
              return $select.selected;
            }
            for (var i = data.length - 1; i >= 0; i--) {
              if (checkFnSingle(data[i])) return data[i];
            }
          }
          return inputValue;
        });

        //Update viewValue if model change
        scope.$watch('$select.selected', function(newValue) {
          if (ngModel.$viewValue !== newValue) {
            ngModel.$setViewValue(newValue);
          }
        });

        ngModel.$render = function() {
          $select.selected = ngModel.$viewValue;
        };

        scope.$on('uis:select', function (event, item) {
          $select.selected = item;
        });

        scope.$on('uis:close', function (event, skipFocusser) {
          $timeout(function(){
            $select.focusser.prop('disabled', false);
            if (!skipFocusser) $select.focusser[0].focus();
          },0,false);
        });

        scope.$on('uis:activate', function () {
          focusser.prop('disabled', true); //Will reactivate it on .close()
        });

        //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
        var focusser = angular.element("<input ng-disabled='$select.disabled' class='fs-typeahead-focusser fs-typeahead-offscreen' type='text' id='{{ $select.focusserId }}' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");
        $compile(focusser)(scope);
        $select.focusser = focusser;

        //Input that will handle focus
        $select.focusInput = focusser;

        element.parent().append(focusser);
        focusser.bind("focus", function(){
          scope.$evalAsync(function(){
            $select.focus = true;
          });
        });
        focusser.bind("blur", function(){
          scope.$evalAsync(function(){
            $select.focus = false;
          });
        });
        focusser.bind("keydown", function(e){

          if (e.which === KEY.BACKSPACE) {
            e.preventDefault();
            e.stopPropagation();
            $select.select(undefined);
            scope.$apply();
            return;
          }

          if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
            return;
          }

          if (e.which == KEY.DOWN  || e.which == KEY.UP || e.which == KEY.ENTER || e.which == KEY.SPACE){
            e.preventDefault();
            e.stopPropagation();
            $select.activate();
          }

          scope.$digest();
        });

        focusser.bind("keyup input", function(e){

          if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || e.which === KEY.BACKSPACE) {
            return;
          }

          $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
          focusser.val('');
          scope.$digest();

        });


      }
    };
  }]);
// Make multiple matches sortable
  uis.directive('fsTypeaheadSort', ['$timeout', 'fsTypeaheadConfig', 'fsTypeaheadMinErr', function($timeout, fsTypeaheadConfig, fsTypeaheadMinErr) {
    return {
      require: '^fsTypeahead',
      link: function(scope, element, attrs, $select) {
        if (scope[attrs.fsTypeaheadSort] === null) {
          throw fsTypeaheadMinErr('sort', "Expected a list to sort");
        }

        var options = angular.extend({
              axis: 'horizontal'
            },
            scope.$eval(attrs.fsTypeaheadSortOptions));

        var axis = options.axis,
            draggingClassName = 'dragging',
            droppingClassName = 'dropping',
            droppingBeforeClassName = 'dropping-before',
            droppingAfterClassName = 'dropping-after';

        scope.$watch(function(){
          return $select.sortable;
        }, function(n){
          if (n) {
            element.attr('draggable', true);
          } else {
            element.removeAttr('draggable');
          }
        });

        element.on('dragstart', function(e) {
          element.addClass(draggingClassName);

          (e.dataTransfer || e.originalEvent.dataTransfer).setData('text/plain', scope.$index);
        });

        element.on('dragend', function() {
          element.removeClass(draggingClassName);
        });

        var move = function(from, to) {
          /*jshint validthis: true */
          this.splice(to, 0, this.splice(from, 1)[0]);
        };

        var dragOverHandler = function(e) {
          e.preventDefault();

          var offset = axis === 'vertical' ? e.offsetY || e.layerY || (e.originalEvent ? e.originalEvent.offsetY : 0) : e.offsetX || e.layerX || (e.originalEvent ? e.originalEvent.offsetX : 0);

          if (offset < (this[axis === 'vertical' ? 'offsetHeight' : 'offsetWidth'] / 2)) {
            element.removeClass(droppingAfterClassName);
            element.addClass(droppingBeforeClassName);

          } else {
            element.removeClass(droppingBeforeClassName);
            element.addClass(droppingAfterClassName);
          }
        };

        var dropTimeout;

        var dropHandler = function(e) {
          e.preventDefault();

          var droppedItemIndex = parseInt((e.dataTransfer || e.originalEvent.dataTransfer).getData('text/plain'), 10);

          // prevent event firing multiple times in firefox
          $timeout.cancel(dropTimeout);
          dropTimeout = $timeout(function() {
            _dropHandler(droppedItemIndex);
          }, 20);
        };

        var _dropHandler = function(droppedItemIndex) {
          var theList = scope.$eval(attrs.fsTypeaheadSort),
              itemToMove = theList[droppedItemIndex],
              newIndex = null;

          if (element.hasClass(droppingBeforeClassName)) {
            if (droppedItemIndex < scope.$index) {
              newIndex = scope.$index - 1;
            } else {
              newIndex = scope.$index;
            }
          } else {
            if (droppedItemIndex < scope.$index) {
              newIndex = scope.$index;
            } else {
              newIndex = scope.$index + 1;
            }
          }

          move.apply(theList, [droppedItemIndex, newIndex]);

          scope.$apply(function() {
            scope.$emit('fsTypeaheadSort:change', {
              array: theList,
              item: itemToMove,
              from: droppedItemIndex,
              to: newIndex
            });
          });

          element.removeClass(droppingClassName);
          element.removeClass(droppingBeforeClassName);
          element.removeClass(droppingAfterClassName);

          element.off('drop', dropHandler);
        };

        element.on('dragenter', function() {
          if (element.hasClass(draggingClassName)) {
            return;
          }

          element.addClass(droppingClassName);

          element.on('dragover', dragOverHandler);
          element.on('drop', dropHandler);
        });

        element.on('dragleave', function(e) {
          if (e.target != element) {
            return;
          }
          element.removeClass(droppingClassName);
          element.removeClass(droppingBeforeClassName);
          element.removeClass(droppingAfterClassName);

          element.off('dragover', dragOverHandler);
          element.off('drop', dropHandler);
        });
      }
    };
  }]);

  /**
   * Parses "repeat" attribute.
   *
   * Taken from AngularJS ngRepeat source code
   * See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L211
   *
   * Original discussion about parsing "repeat" attribute instead of fully relying on ng-repeat:
   * https://github.com/angular-ui/fs-typeahead/commit/5dd63ad#commitcomment-5504697
   */

  uis.service('uisRepeatParser', ['fsTypeaheadMinErr','$parse', function(fsTypeaheadMinErr, $parse) {
    var self = this;

    /**
     * Example:
     * expression = "address in addresses | filter: {street: $select.search} track by $index"
     * itemName = "address",
     * source = "addresses | filter: {street: $select.search}",
     * trackByExp = "$index",
     */
    self.parse = function(expression) {


      var match;
      var isObjectCollection = /\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)/.test(expression);
      // If an array is used as collection

      // if (isObjectCollection){
      //00000000000000000000000000000111111111000000000000000222222222222220033333333333333333333330000444444444444444444000000000000000556666660000077777777777755000000000000000000000088888880000000
      match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(([\w\.]+)?\s*(|\s*[\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

      // 1 Alias
      // 2 Item
      // 3 Key on (key,value)
      // 4 Value on (key,value)
      // 5 Collection expresion (only used when using an array collection)
      // 6 Object that will be converted to Array when using (key,value) syntax
      // 7 Filters that will be applied to #6 when using (key,value) syntax
      // 8 Track by

      if (!match) {
        throw fsTypeaheadMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
            expression);
      }
      if (!match[6] && isObjectCollection) {
        throw fsTypeaheadMinErr('iexp', "Expected expression in form of '_item_ as (_key_, _item_) in _ObjCollection_ [ track by _id_]' but got '{0}'.",
            expression);
      }

      return {
        itemName: match[4] || match[2], // (lhs) Left-hand side,
        keyName: match[3], //for (key, value) syntax
        source: $parse(!match[3] ? match[5] : match[6]),
        sourceName: match[6],
        filters: match[7],
        trackByExp: match[8],
        modelMapper: $parse(match[1] || match[4] || match[2]),
        repeatExpression: function (grouped) {
          var expression = this.itemName + ' in ' + (grouped ? '$group.items' : '$select.items');
          if (this.trackByExp) {
            expression += ' track by ' + this.trackByExp;
          }
          return expression;
        }
      };

    };

    self.getGroupNgRepeatExpression = function() {
      return '$group in $select.groups';
    };

  }]);

}());
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
    .directive('fsEmailValidation', ["$validation", function ($validation) {
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
    }])
    .directive('fsRealnameValidation', ["$validation", function ($validation) {
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
    }])
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
    .directive('fsIdcardValidation', ["$validation", function ($validation) {
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
    }]);
angular.module("modal/modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modal/modal.tpl.html",
    "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n" +
    "  <div class=\"modal-dialog\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\" ng-show=\"title\">\n" +
    "        <button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"$hide()\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        <h4 class=\"modal-title\" ng-bind=\"title\"></h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\" ng-bind=\"content\"></div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"$hide()\">Close</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("aside/aside.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("aside/aside.tpl.html",
    "<div class=\"aside\" tabindex=\"-1\" role=\"dialog\">\n" +
    "  <div class=\"aside-dialog\">\n" +
    "    <div class=\"aside-content\">\n" +
    "      <div class=\"aside-header\" ng-show=\"title\">\n" +
    "        <button type=\"button\" class=\"close\" ng-click=\"$hide()\">&times;</button>\n" +
    "        <h4 class=\"aside-title\" ng-bind=\"title\"></h4>\n" +
    "      </div>\n" +
    "      <div class=\"aside-body\" ng-bind=\"content\"></div>\n" +
    "      <div class=\"aside-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"$hide()\">Close</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("tooltip/tooltip.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tooltip/tooltip.tpl.html",
    "<div class=\"tooltip in\" ng-show=\"title\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" ng-bind=\"title\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("datepicker/datepicker.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("datepicker/datepicker.tpl.html",
    "<div class=\"dropdown-menu datepicker\" ng-class=\"'datepicker-mode-' + $mode\" style=\"max-width: 320px;\">\n" +
    "    <table style=\"table-layout: fixed; height: 100%; width: 100%;\">\n" +
    "        <thead>\n" +
    "        <tr class=\"text-center\">\n" +
    "            <th>\n" +
    "                <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default pull-left\" ng-click=\"$selectPane(-1)\">\n" +
    "                    <i class=\"{{$iconLeft}}\"></i>\n" +
    "                </button>\n" +
    "            </th>\n" +
    "            <th colspan=\"{{ rows[0].length - 2 }}\">\n" +
    "                <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default btn-block text-strong\"\n" +
    "                        ng-click=\"$toggleMode()\">\n" +
    "                    <strong style=\"text-transform: capitalize;\" ng-bind=\"title\"></strong>\n" +
    "                </button>\n" +
    "            </th>\n" +
    "            <th>\n" +
    "                <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default pull-right\" ng-click=\"$selectPane(+1)\">\n" +
    "                    <i class=\"{{$iconRight}}\"></i>\n" +
    "                </button>\n" +
    "            </th>\n" +
    "        </tr>\n" +
    "        <tr ng-show=\"showLabels\" ng-bind-html=\"labels\"></tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"(i, row) in rows\" height=\"{{ 100 / rows.length }}%\">\n" +
    "            <td class=\"text-center\" ng-repeat=\"(j, el) in row\">\n" +
    "                <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default\" style=\"width: 100%\"\n" +
    "                        ng-class=\"{'btn-primary': el.selected, 'btn-info btn-today': el.isToday && !el.selected}\"\n" +
    "                        ng-click=\"$select(el.date)\" ng-disabled=\"el.disabled\">\n" +
    "                    <span ng-class=\"{'text-muted': el.muted}\" ng-bind=\"el.label\"></span>\n" +
    "                </button>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "        <tfoot ng-show=\"$showClearButton\">\n" +
    "        <tr>\n" +
    "            <td colspan=\"{{rows[0].length}}\">\n" +
    "                <button tabindex=\"-1\" type=\"button\" class=\"btn btn-default btn-block text-strong\" ng-click=\"$clear()\">\n" +
    "                    <strong style=\"text-transform: capitalize;\" ng-bind=\"$clearText\"></strong>\n" +
    "                </button>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tfoot>\n" +
    "    </table>\n" +
    "</div>\n" +
    "");
}]);

angular.module("dropdown/dropdown.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dropdown/dropdown.tpl.html",
    "<ul tabindex=\"-1\" class=\"dropdown-menu\" role=\"menu\">\n" +
    "  <li role=\"presentation\" ng-class=\"{divider: item.divider}\" ng-repeat=\"item in content\" >\n" +
    "    <a role=\"menuitem\" tabindex=\"-1\" ng-href=\"{{item.href}}\" ng-if=\"!item.divider && item.href\" target=\"{{item.target || ''}}\" ng-bind=\"item.text\"></a>\n" +
    "    <a role=\"menuitem\" tabindex=\"-1\" href=\"javascript:void(0)\" ng-if=\"!item.divider && item.click\" ng-click=\"$eval(item.click);$hide()\" ng-bind=\"item.text\"></a>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("pagination/pager.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pagination/pager.tpl.html",
    "<ul class=\"pager\">\n" +
    "  <li ng-class=\"{disabled: noPrevious(), previous: align}\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
    "  <li ng-class=\"{disabled: noNext(), next: align}\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
    "</ul>");
}]);

angular.module("pagination/pagination.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pagination/pagination.tpl.html",
    "<ul class=\"pagination\">\n" +
    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href ng-click=\"selectPage(1, $event)\">{{::getText('first')}}</a></li>\n" +
    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
    "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li>\n" +
    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href ng-click=\"selectPage(totalPages, $event)\">{{::getText('last')}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("popover/popover.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("popover/popover.tpl.html",
    "<div class=\"popover\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "  <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "  <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("select/select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("select/select.tpl.html",
    "<ul tabindex=\"-1\" class=\"select dropdown-menu\" ng-show=\"$isVisible()\" role=\"select\">\n" +
    "  <li ng-if=\"$showAllNoneButtons\">\n" +
    "    <div class=\"btn-group\" style=\"margin-bottom: 5px; margin-left: 5px\">\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"$selectAll()\">{{$allText}}</button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"$selectNone()\">{{$noneText}}</button>\n" +
    "    </div>\n" +
    "  </li>\n" +
    "  <li role=\"presentation\" ng-repeat=\"match in $matches\" ng-class=\"{active: $isActive($index)}\">\n" +
    "    <a style=\"cursor: default;\" role=\"menuitem\" tabindex=\"-1\" ng-click=\"$select($index, $event)\">\n" +
    "      <i class=\"{{$iconCheckmark}} pull-right\" ng-if=\"$isMultiple && $isActive($index)\"></i>\n" +
    "      <span ng-bind=\"match.label\"></span>\n" +
    "    </a>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("tab/tab.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tab/tab.tpl.html",
    "<ul class=\"nav\" ng-class=\"$navClass\" role=\"tablist\">\n" +
    "  <li role=\"presentation\" ng-repeat=\"$pane in $panes track by $index\" ng-class=\"[ $isActive($pane, $index) ? $activeClass : '', $pane.disabled ? 'disabled' : '' ]\">\n" +
    "    <a role=\"tab\" data-toggle=\"tab\" ng-click=\"!$pane.disabled && $setActive($pane.name || $index)\" data-index=\"{{ $index }}\" ng-bind-html=\"$pane.title\" aria-controls=\"$pane.title\"></a>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "<div ng-transclude class=\"tab-content\">\n" +
    "</div>\n" +
    "");
}]);

angular.module("table/filterRow.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("table/filterRow.tpl.html",
    "<tr ng-show=\"show_filter\" class=\"fs-table-filters\">\n" +
    "    <th data-title-text=\"{{$column.titleAlt(this) || $column.title(this)}}\" ng-repeat=\"$column in $columns\" ng-if=\"$column.show(this)\" class=\"filter\"\n" +
    "        ng-class=\"params.settings().filterLayout === 'horizontal' ? 'filter-horizontal' : ''\">\n" +
    "        <div ng-repeat=\"(name, filter) in $column.filter(this)\" ng-include=\"config.getTemplateUrl(filter)\" class=\"filter-cell\"\n" +
    "             ng-class=\"[getFilterCellCss($column.filter(this), params.settings().filterLayout), $last ? 'last' : '']\">\n" +
    "        </div>\n" +
    "    </th>\n" +
    "</tr>");
}]);

angular.module("table/filters/number.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("table/filters/number.tpl.html",
    "<input type=\"number\" name=\"{{name}}\" ng-disabled=\"$filterRow.disabled\" ng-model=\"params.filter()[name]\" class=\"input-filter form-control\"\n" +
    "       placeholder=\"{{getFilterPlaceholderValue(filter, name)}}\"/>");
}]);

angular.module("table/filters/select-multiple.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("table/filters/select-multiple.tpl.html",
    "<select ng-options=\"data.id as data.title for data in $column.data\"\n" +
    "        ng-disabled=\"$filterRow.disabled\"\n" +
    "        multiple ng-multiple=\"true\"\n" +
    "        ng-model=\"params.filter()[name]\"\n" +
    "        class=\"filter filter-select-multiple form-control\" name=\"{{name}}\">\n" +
    "</select>");
}]);

angular.module("table/filters/select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("table/filters/select.tpl.html",
    "<select ng-options=\"data.id as data.title for data in $column.data\"\n" +
    "        ng-disabled=\"$filterRow.disabled\"\n" +
    "        ng-model=\"params.filter()[name]\"\n" +
    "        class=\"filter filter-select form-control\" name=\"{{name}}\">\n" +
    "    <option style=\"display:none\" value=\"\"></option>\n" +
    "</select>");
}]);

angular.module("table/filters/text.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("table/filters/text.tpl.html",
    "<input type=\"text\" name=\"{{name}}\" ng-disabled=\"$filterRow.disabled\" ng-model=\"params.filter()[name]\" class=\"input-filter form-control\"\n" +
    "       placeholder=\"{{getFilterPlaceholderValue(filter, name)}}\"/>");
}]);

angular.module("table/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("table/header.tpl.html",
    "<fs-table-sorter-row></fs-table-sorter-row>\n" +
    "<fs-table-filter-row></fs-table-filter-row>");
}]);

angular.module("table/pager.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("table/pager.tpl.html",
    "<div class=\"ng-cloak fs-table-pager\" ng-if=\"params.data.length\">\n" +
    "    <div ng-if=\"params.settings().counts.length\" class=\"fs-table-counts btn-group pull-right\">\n" +
    "        <button ng-repeat=\"count in params.settings().counts\" type=\"button\"\n" +
    "                ng-class=\"{'active':params.count() == count}\"\n" +
    "                ng-click=\"params.count(count)\" class=\"btn btn-default\">\n" +
    "            <span ng-bind=\"count\"></span>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <ul ng-if=\"pages.length\" class=\"pagination fs-table-pagination\">\n" +
    "        <li ng-class=\"{'disabled': !page.active && !page.current, 'active': page.current}\" ng-repeat=\"page in pages\" ng-switch=\"page.type\">\n" +
    "            <a ng-switch-when=\"prev\" ng-click=\"params.page(page.number)\" href=\"\">&laquo;</a>\n" +
    "            <a ng-switch-when=\"first\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a>\n" +
    "            <a ng-switch-when=\"page\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a>\n" +
    "            <a ng-switch-when=\"more\" ng-click=\"params.page(page.number)\" href=\"\">&#8230;</a>\n" +
    "            <a ng-switch-when=\"last\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a>\n" +
    "            <a ng-switch-when=\"next\" ng-click=\"params.page(page.number)\" href=\"\">&raquo;</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("table/sorterRow.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("table/sorterRow.tpl.html",
    "<tr>\n" +
    "    <th title=\"{{$column.headerTitle(this)}}\"\n" +
    "        ng-repeat=\"$column in $columns\"\n" +
    "        ng-class=\"{\n" +
    "                    'sortable': $column.sortable(this),\n" +
    "                    'sort-asc': params.sorting()[$column.sortable(this)]=='asc',\n" +
    "                    'sort-desc': params.sorting()[$column.sortable(this)]=='desc'\n" +
    "                  }\"\n" +
    "        ng-click=\"sortBy($column, $event)\"\n" +
    "        ng-if=\"$column.show(this)\"\n" +
    "        ng-init=\"template = $column.headerTemplateURL(this)\"\n" +
    "        class=\"header {{$column.class(this)}}\">\n" +
    "        <div ng-if=\"!template\" class=\"fs-table-header\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'div'}\">\n" +
    "            <span ng-bind=\"$column.title(this)\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'span'}\"></span>\n" +
    "        </div>\n" +
    "        <div ng-if=\"template\" ng-include=\"template\"></div>\n" +
    "    </th>\n" +
    "</tr>");
}]);

angular.module("typeahead/bootstrap/choices.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/bootstrap/choices.tpl.html",
    "<ul class=\"fs-typeahead-choices fs-typeahead-choices-content fs-typeahead-dropdown dropdown-menu\"\n" +
    "    role=\"listbox\"\n" +
    "    ng-show=\"$select.items.length > 0\">\n" +
    "  <li class=\"fs-typeahead-choices-group\" id=\"fs-typeahead-choices-{{ $select.generatedId }}\" >\n" +
    "    <div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div>\n" +
    "    <div ng-show=\"$select.isGrouped\" class=\"fs-typeahead-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div>\n" +
    "    <div id=\"fs-typeahead-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"fs-typeahead-choices-row\"\n" +
    "         ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\">\n" +
    "      <a ng-click=\"$event.preventDefault()\" class=\"fs-typeahead-choices-row-inner\"></a>\n" +
    "    </div>\n" +
    "  </li>\n" +
    "</ul>");
}]);

angular.module("typeahead/bootstrap/match-multiple.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/bootstrap/match-multiple.tpl.html",
    "<span class=\"fs-typeahead-match\">\n" +
    "  <span ng-repeat=\"$item in $select.selected\">\n" +
    "    <span \n" +
    "      class=\"fs-typeahead-match-item btn btn-default btn-xs\"\n" +
    "      tabindex=\"-1\"\n" +
    "      type=\"button\"\n" +
    "      ng-disabled=\"$select.disabled\"\n" +
    "      ng-click=\"$selectMultiple.activeMatchIndex = $index;\"\n" +
    "      ng-class=\"{'btn-primary':$selectMultiple.activeMatchIndex === $index, 'select-locked':$select.isLocked(this, $index)}\"\n" +
    "      fs-typeahead-sort=\"$select.selected\">\n" +
    "        <span class=\"close fs-typeahead-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span>\n" +
    "        <span uis-transclude-append></span>\n" +
    "    </span>\n" +
    "  </span>\n" +
    "</span>\n" +
    "");
}]);

angular.module("typeahead/bootstrap/match.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/bootstrap/match.tpl.html",
    "<div class=\"fs-typeahead-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{'btn-default-focus':$select.focus}\">\n" +
    "  <span tabindex=\"-1\"\n" +
    "      class=\"btn btn-default form-control fs-typeahead-toggle\"\n" +
    "      aria-label=\"{{ $select.baseTitle }} activate\"\n" +
    "      ng-disabled=\"$select.disabled\" \n" +
    "      ng-click=\"$select.activate()\"\n" +
    "      style=\"outline: 0;\">\n" +
    "    <span ng-show=\"$select.isEmpty()\" class=\"fs-typeahead-placeholder text-muted\">{{$select.placeholder}}</span>\n" +
    "    <span ng-hide=\"$select.isEmpty()\" class=\"fs-typeahead-match-text pull-left\" ng-class=\"{'fs-typeahead-allow-clear': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span>\n" +
    "    <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i>\n" +
    "    <a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" \n" +
    "      ng-click=\"$select.clear($event)\" class=\"btn btn-xs btn-link pull-right\">\n" +
    "      <i class=\"fa fa-remove\" aria-hidden=\"true\"></i>\n" +
    "    </a>\n" +
    "  </span>\n" +
    "</div>\n" +
    "");
}]);

angular.module("typeahead/bootstrap/select-multiple.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/bootstrap/select-multiple.tpl.html",
    "<div class=\"fs-typeahead-container fs-typeahead-multiple fs-typeahead-bootstrap dropdown form-control\" ng-class=\"{open: $select.open}\">\n" +
    "  <div>\n" +
    "    <div class=\"fs-typeahead-match\"></div>\n" +
    "    <input type=\"text\"\n" +
    "           autocomplete=\"false\" \n" +
    "           autocorrect=\"off\" \n" +
    "           autocapitalize=\"off\" \n" +
    "           spellcheck=\"false\" \n" +
    "           class=\"fs-typeahead-search input-xs\"\n" +
    "           placeholder=\"{{$selectMultiple.getPlaceholder()}}\"\n" +
    "           ng-disabled=\"$select.disabled\"\n" +
    "           ng-hide=\"$select.disabled\"\n" +
    "           ng-click=\"$select.activate()\"\n" +
    "           ng-model=\"$select.search\"\n" +
    "           role=\"combobox\"\n" +
    "           aria-label=\"{{ $select.baseTitle }}\"\n" +
    "           ondrop=\"return false;\">\n" +
    "  </div>\n" +
    "  <div class=\"fs-typeahead-choices\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("typeahead/bootstrap/select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/bootstrap/select.tpl.html",
    "<div class=\"fs-typeahead-container fs-typeahead-bootstrap dropdown\" ng-class=\"{open: $select.open}\">\n" +
    "  <div class=\"fs-typeahead-match\"></div>\n" +
    "  <input type=\"text\" autocomplete=\"false\" tabindex=\"-1\"\n" +
    "         aria-expanded=\"true\"\n" +
    "         aria-label=\"{{ $select.baseTitle }}\"\n" +
    "         aria-owns=\"fs-typeahead-choices-{{ $select.generatedId }}\"\n" +
    "         aria-activedescendant=\"fs-typeahead-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\"\n" +
    "         class=\"form-control fs-typeahead-search\"\n" +
    "         placeholder=\"{{$select.placeholder}}\"\n" +
    "         ng-model=\"$select.search\"\n" +
    "         ng-show=\"$select.searchEnabled && $select.open\">\n" +
    "  <div class=\"fs-typeahead-choices\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("typeahead/select2/choices.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/select2/choices.tpl.html",
    "<ul class=\"fs-typeahead-choices fs-typeahead-choices-content select2-results\">\n" +
    "  <li class=\"fs-typeahead-choices-group\" ng-class=\"{'select2-result-with-children': $select.choiceGrouped($group) }\">\n" +
    "    <div ng-show=\"$select.choiceGrouped($group)\" class=\"fs-typeahead-choices-group-label select2-result-label\" ng-bind=\"$group.name\"></div>\n" +
    "    <ul role=\"listbox\"\n" +
    "      id=\"fs-typeahead-choices-{{ $select.generatedId }}\" ng-class=\"{'select2-result-sub': $select.choiceGrouped($group), 'select2-result-single': !$select.choiceGrouped($group) }\">\n" +
    "      <li role=\"option\" id=\"fs-typeahead-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"fs-typeahead-choices-row\" ng-class=\"{'select2-highlighted': $select.isActive(this), 'select2-disabled': $select.isDisabled(this)}\">\n" +
    "        <div class=\"select2-result-label fs-typeahead-choices-row-inner\"></div>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </li>\n" +
    "</ul>");
}]);

angular.module("typeahead/select2/match-multiple.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/select2/match-multiple.tpl.html",
    "<span class=\"fs-typeahead-match\">\n" +
    "  <li class=\"fs-typeahead-match-item select2-search-choice\" ng-repeat=\"$item in $select.selected\" \n" +
    "      ng-class=\"{'select2-search-choice-focus':$selectMultiple.activeMatchIndex === $index, 'select2-locked':$select.isLocked(this, $index)}\"\n" +
    "      fs-typeahead-sort=\"$select.selected\">\n" +
    "      <span uis-transclude-append></span>\n" +
    "      <a href=\"javascript:;\" class=\"fs-typeahead-match-close select2-search-choice-close\" ng-click=\"$selectMultiple.removeChoice($index)\" tabindex=\"-1\"></a>\n" +
    "  </li>\n" +
    "</span>\n" +
    "");
}]);

angular.module("typeahead/select2/match.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/select2/match.tpl.html",
    "<a class=\"select2-choice fs-typeahead-match\"\n" +
    "   ng-class=\"{'select2-default': $select.isEmpty()}\"\n" +
    "   ng-click=\"$select.toggle($event)\" aria-label=\"{{ $select.baseTitle }} select\">\n" +
    "  <span ng-show=\"$select.isEmpty()\" class=\"select2-chosen\">{{$select.placeholder}}</span>\n" +
    "  <span ng-hide=\"$select.isEmpty()\" class=\"select2-chosen\" ng-transclude></span>\n" +
    "  <abbr ng-if=\"$select.allowClear && !$select.isEmpty()\" class=\"select2-search-choice-close\" ng-click=\"$select.clear($event)\"></abbr>\n" +
    "  <span class=\"select2-arrow fs-typeahead-toggle\"><b></b></span>\n" +
    "</a>\n" +
    "");
}]);

angular.module("typeahead/select2/select-multiple.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/select2/select-multiple.tpl.html",
    "<div class=\"fs-typeahead-container fs-typeahead-multiple select2 select2-container select2-container-multi\"\n" +
    "     ng-class=\"{'select2-container-active select2-dropdown-open open': $select.open,\n" +
    "                'select2-container-disabled': $select.disabled}\">\n" +
    "  <ul class=\"select2-choices\">\n" +
    "    <span class=\"fs-typeahead-match\"></span>\n" +
    "    <li class=\"select2-search-field\">\n" +
    "      <input\n" +
    "        type=\"text\"\n" +
    "        autocomplete=\"false\"\n" +
    "        autocorrect=\"off\"\n" +
    "        autocapitalize=\"off\"\n" +
    "        spellcheck=\"false\"\n" +
    "        role=\"combobox\"\n" +
    "        aria-expanded=\"true\"\n" +
    "        aria-owns=\"fs-typeahead-choices-{{ $select.generatedId }}\"\n" +
    "        aria-label=\"{{ $select.baseTitle }}\"\n" +
    "        aria-activedescendant=\"fs-typeahead-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\"\n" +
    "        class=\"select2-input fs-typeahead-search\"\n" +
    "        placeholder=\"{{$selectMultiple.getPlaceholder()}}\"\n" +
    "        ng-disabled=\"$select.disabled\"\n" +
    "        ng-hide=\"$select.disabled\"\n" +
    "        ng-model=\"$select.search\"\n" +
    "        ng-click=\"$select.activate()\"\n" +
    "        style=\"width: 34px;\"\n" +
    "        ondrop=\"return false;\">\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "  <div class=\"fs-typeahead-dropdown select2-drop select2-with-searchbox select2-drop-active\"\n" +
    "       ng-class=\"{'select2-display-none': !$select.open}\">\n" +
    "    <div class=\"fs-typeahead-choices\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("typeahead/select2/select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("typeahead/select2/select.tpl.html",
    "<div class=\"fs-typeahead-container select2 select2-container\"\n" +
    "     ng-class=\"{'select2-container-active select2-dropdown-open open': $select.open,\n" +
    "                'select2-container-disabled': $select.disabled,\n" +
    "                'select2-container-active': $select.focus,\n" +
    "                'select2-allowclear': $select.allowClear && !$select.isEmpty()}\">\n" +
    "  <div class=\"fs-typeahead-match\"></div>\n" +
    "  <div class=\"fs-typeahead-dropdown select2-drop select2-with-searchbox select2-drop-active\"\n" +
    "       ng-class=\"{'select2-display-none': !$select.open}\">\n" +
    "    <div class=\"select2-search\" ng-show=\"$select.searchEnabled\">\n" +
    "      <input type=\"text\" autocomplete=\"false\" autocorrect=\"false\" autocapitalize=\"off\" spellcheck=\"false\"\n" +
    "       role=\"combobox\"\n" +
    "       aria-expanded=\"true\"\n" +
    "       aria-owns=\"fs-typeahead-choices-{{ $select.generatedId }}\"\n" +
    "       aria-label=\"{{ $select.baseTitle }}\"\n" +
    "       aria-activedescendant=\"fs-typeahead-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\"\n" +
    "             class=\"fs-typeahead-search select2-input\"\n" +
    "             ng-model=\"$select.search\">\n" +
    "    </div>\n" +
    "    <div class=\"fs-typeahead-choices\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
