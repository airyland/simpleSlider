define(function (require, exports, module) {
    /**
     * @todo
     * 1.set start index
     * 2.circle option
     */
    var $ = jQuery;
    var Events = require('arale/events/1.1.0/events');

    // if support css3 translate

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
        auto: true,  // auto play
        speed: 1000,// animation duratin
        interval: 2000, // time delay
        easing: 'linear',// easing
        leftDisabledClass: '',// when scroll to the first one, add the class
        rightDisabledClass: '',// when scroll to the last one, add the class
        box: '#moe-slider-box', // sliders box, used for select prev and next button
        item: '>.slider-wrap>li',
        dotsContainer: '',// if specified, create dots list in the container,
        dotsEasing: 'linear',// can be styled in css or specified hear,
        dotsActiveClass: 'moe-dot-active',// dot active class
        dotsTriggerEvent: 'click',
        mod: 'images', // 'singleImage','images'
        startIndex: 0,// first show one
        circular: true // if play circular,if true, ignore leftDisabledClass and not trigger relative events
    };

    var singleImageSwitch = function () {

    };

    // init
    simpleSlider.prototype.init = function (option) {
        var _this = this;
        $.extend(defaultOpt, option);
        this.option = this.o = defaultOpt;
        this.$target = $(this.option.target);
        this.curr = 0;
        this.length = 5;

        // bind prev and next btn click event
        $(['next', 'prev']).each(function (index, one) {
            $(_this.o.box + ' [data-action="' + one + '"]').on('click', function () {
                _this[one]();
            });
        });

        // if set autoplay
        if (this.option.auto) {
            setTimeout(function () {
                _this.autoGo();
            }, this.o.interval);
        }
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
            this.$target.mouseenter(function () {
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
        this.$dotItems.find('.dot').removeClass(this.o.dotsActiveClass).end().eq(index).find('.dot').addClass(this.o.dotsActiveClass);

        this.$dotItems.find('.dot').css({
            backgroundColor: 'red'
        });

        this.$dotItems.eq(index).find('.dot').css({
            backgroundColor: 'purple'
        });
    };

    simpleSlider.prototype.goto = function (index) {
        var _this = this;
        if (index >= 5) {
            this.curr = index = 0;
        }

        if (index <= -1) {
            this.curr = index = 4;
        }

        this.trigger('switch::start', _this.curr);

        this.$target.animate({
            left: -index * 224
        }, {
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