define(function (require, exports, module) {
    /**
     * @todo
     * 1.set start index
     * 2.circle option
     */
    var $ = jQuery;
    var Events = require('arale/events/1.1.0/events');
    // check if support css3 animation
    var supportAnimation = typeof history.pushState === "function";
    // css3 transition map
    var transitionMap = {
        'linear': 'linear',
        '_default': 'ease',
        'ease-in': 'ease-in',
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
        'snap': 'cubic-bezier(0,1,.5,1)',
        // Penner equations
        'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
        'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
        'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
    };
    // translate function
    var translate = function ($target, key, value) {
            var valueTransform = "translate" + key + "(" + value + ")";
            supportAnimation &&
            $target.css("webkitTransform", valueTransform).css("transform", valueTransform);
        },
        transition = function (target, duration, isReset) {
            var transform = "transform " + duration + "ms linear";
            if (supportAnimation == false) return;
            // CSS3 transition设置
            if (isReset == true) {
                target.css("webkitTransition", "none").css("transition", "none")
                    .data("hasTransition", false);
            } else if (!target.data("hasTransition")) {
                target.css({
                    webkitTransition: "-webkit-" + transform,
                    webkitBackfaceVisibility: "hidden",
                    transition: transform,
                    BackfaceVisibility: "hidden"
                }).data("hasTransition", true);
            }
        };

    $.extend($.easing, {
        easeOutQuad: function (x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
    });

    // constructor
    var simpleSlider = function (option) {
        return this.init(option);
    };

    Events.mixTo(simpleSlider);

    var defaultOpt = {
        auto: true, // auto play
        speed: 1000, // animation duratin
        interval: 2000, // time delay
        easing: 'linear', // easing
        leftDisabledClass: '', // when scroll to the first one, add the class
        rightDisabledClass: '', // when scroll to the last one, add the class
        box: '#moe-slider-box', // sliders box, used for select prev and next button
        item: '>.slider-wrap>li',
        dotsContainer: '', // if specified, create dots list in the container,
        dotsEasing: 'linear', // can be styled in css or specified hear,
        dotsActiveClass: 'moe-dot-active', // dot active class
        dotsTriggerEvent: 'click',
        mode: 'images', // 'singleImage','images'
        startIndex: 0, // first show one
        circular: true, // if play circular,if true, ignore leftDisabledClass and not trigger relative events
        hoverStop: true, // if stop playing when hover on the slider
        listNo: 1,
        playNo: 1
    };

    var singleImageSwitch = function () {

    };

    // init
    simpleSlider.prototype.init = function (option) {
        var _this = this;
        $.extend(defaultOpt, option);
        this.option = this.o = defaultOpt;
        this.$target = $(this.o.box + ' ' + this.o.item);
        this.curr = 0;
        this.itemLength = this.$target.find('li').length;
        this.length = option.length || Math.ceil((this.$target.find('li').length - this.o.listNo) / this.o.playNo) + 1;
        this.itemWidth = this.$target.find('li').eq(0).width();
        this.lastOffset = -this.itemWidth * (this.itemLength - this.o.listNo);
        if (this.lastOffset > 0) {
            this.lastOffset -= this.lastOffset;
        }
        this.o.mode !== 'singleImage' && this.$target.css('-webkit-transition', 'all ' + this.o.speed + 'ms ' + transitionMap[this.o.easing]);
        // bind prev and next btn click event
        $(['next', 'prev']).each(function (index, one) {
            $(_this.o.box + ' [data-action="' + one + '"]').on('click', function () {
                _this[one]();
            });
        });

        this.$index = $(this.o.box + ' [data-fill="index"]').text(1);
        this.$length = $(this.o.box + ' [data-fill="length"]').text(this.length);

        // if set autoplay
        this.option.auto && setTimeout(function () {
            _this.autoGo();
        }, this.o.interval);

        // build dots
        this._buildDots();
    };

    simpleSlider.prototype._buildDots = function () {
        var _this = this;
        if (this.option.dotsContainer) {
            var $dotsContainer = $(this.option.dotsContainer);
            var html = '';
            var len = this.length;
            var i = 1;
            while (i <= len) {
                html += '<ul class="slider_dots"><li class="dot-item"><span class="dot"></span></li>';
                i++;
            }
            html += '</ul>';
            $dotsContainer.html(html);
            var $lis = $dotsContainer.find('li.dot-item');
            $lis.find('.dot').css({
                'webkit-transition': 'all 200ms ' + this.o.dotsEasing
            });
            _this.$dotItems = $lis;
            _this.$dots = $lis.find('.dot');

            // set the first dot as active
            this.setDotCss(0);

            $lis.on(_this.o.dotsTriggerEvent, function () {
                var index = $(this).index('.slider_dots>li.dot-item');
                _this.curr = index;
                _this.stop();
                _this.setDotCss(index);
                _this.goto(index);
                _this.resume();
            });

            // stop animation when hover over
            // do not stop until image reaches to the edge
            this.o.hoverStop && this.$target.mouseenter(function () {
                clearTimeout(_this.timeout);
            }).mouseleave(function () {
                    _this.resume();
                });
        }
    };

    simpleSlider.prototype.setDotCss = function (index) {
        if (!this.o.dotsContainer) {
            return;
        }
        // switch dot class
        this.$dots.removeClass(this.o.dotsActiveClass).eq(index).addClass(this.o.dotsActiveClass);
    };

    simpleSlider.prototype.goto = function (index) {
        var _this = this;
        (index >= this.length) && (this.curr = index = 0);
        (index <= -1) && (this.curr = index = this.length - 1);

        _this.curr === _this.length - 1 && _this.trigger('switch::lastone');
        _this.curr === 0 && _this.trigger('switch::firstone');

        this.$index.text(_this.curr + 1);
        this.trigger('switch::start', _this.curr);
        // mode::singleImage
        var style;
        if (this.o.mode === 'singleImage') {
            style = {
                left: -index * 224
            };
            this.$target.animate(style, {
                duration: _this.option.speed,
                easing: _this.o.easing,
                complete: function () {
                    _this.trigger('switch::done', _this.curr);
                    _this.setDotCss(_this.curr);
                },
                progress: function (a, b, c) {
                    // @todo when used with css3, can I get the progress?
                    _this.trigger('switch:progress', b);
                }
            });
        }

        if (this.o.mode === 'images') {
            if (index === 1 && this.length === 2) {
                translate(this.$target, 'X', this.lastOffset + 'px');
                return;
            }
            if (index < this.length - 1) {
                translate(this.$target, 'X', -index * this.itemWidth * this.o.playNo + 'px');
            } else {
                translate(this.$target, 'X', this.lastOffset + 'px');
            }
        }
    };

    simpleSlider.prototype.next = function () {
        this.trigger('next', this.curr);
        this.stop();
        this.curr++;
        this.goto(this.curr);
        this.resume();
    };

    simpleSlider.prototype.prev = function () {
        this.trigger('prev', this.curr);
        this.stop();
        this.curr--;
        this.goto(this.curr);
        this.resume();
        return this;
    };

    simpleSlider.prototype.stop = function () {
        // stop auto switch
        clearTimeout(this.timeout);
        clearTimeout(this.delayTimeout);
        // stop animation
        if (this.$target.is(':animated')) {
            this.$target.stop();
        }
        this.trigger('stop', this.curr);
        return this;
    };

    simpleSlider.prototype.resume = function () {
        var _this = this;
        if (this.option.auto) {
            this.trigger('resume', _this.curr);
            _this.delayTimeout = setTimeout(function () {
                _this.autoGo();
            }, _this.option.interval + _this.option.speed);

        }
    };

    simpleSlider.prototype.start = simpleSlider.prototype.resume;

    simpleSlider.prototype.autoGo = function () {
        var _this = this;
        _this.curr++;
        _this.goto(_this.curr);
        _this.timeout = setTimeout(function () {
            _this.autoGo();
        }, _this.option.interval + _this.option.speed);
    };
    module.exports = simpleSlider;
});