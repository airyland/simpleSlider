define(function(require, exports, module) {
    /**
     * 1. stop animation when hover
     */
    var $ = jQuery;
    var Events = require('arale/events/1.1.0/events');
    $.extend($.easing, {
        easeOutQuad: function(x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
    });

    var simpleSlider = function(option) {
        return this.init(option);
    };

    Events.mixTo(simpleSlider);

    var defaultOpt = {
        auto: true,
        interval: 2000
    };

    // init
    simpleSlider.prototype.init = function(option) {
        var _this = this;
        $.extend(defaultOpt, option);
        this.option = defaultOpt;
        this.$target = $(this.option.target);
        this.curr = 0;
        this.length = 5;

        // bind prev and next btn
        var $next = $('[data-action="next"]');
        var $prev = $('[data-action="prev"]');

        $next.on('click', function() {
            _this.next();
        });

        $prev.on('click', function() {
            _this.prev();
        });

        // if set auto
        if (this.option.auto) {
            this.autoGo();
        }

        // build dots
        this._buildDots();
    };

    simpleSlider.prototype._buildDots = function() {
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
            _this.$dotItems = $lis;

            $lis.on('click mouseenter', function() {
                var index = $(this).index('.slider_dots>li.dot-item');
                _this.curr = index;
                _this.stop();
                _this.setDotCss(index);
                _this.goto(index);
                _this.resume();
            });

            // stop animation when hover over
            // do not stop until image reaches to the edge
            this.$target.mouseenter(function() {
                clearTimeout(_this.timeout);
            }).mouseleave(function() {
                _this.resume();
            });
        }
    };

    simpleSlider.prototype.setDotCss = function(index) {
        this.$dotItems.find('.dot').css({
            backgroundColor: 'red'
        });

        this.$dotItems.eq(index).find('.dot').css({
            backgroundColor: 'purple'
        });
    };

    simpleSlider.prototype.goto = function(index) {
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
        }, this.option.speed, 'easeOutQuad', function() {
            _this.trigger('switch::done', _this.curr);

            _this.$dotItems.find('.dot').css({
                backgroundColor: 'red'
            });

            _this.$dotItems.eq(index).find('.dot').css({
                backgroundColor: 'purple'
            });

        });
    };

    simpleSlider.prototype.next = function() {
        this.trigger('next', this.curr);
        this.stop();
        this.curr++;
        this.goto(this.curr);
        this.resume();
    };

    simpleSlider.prototype.prev = function() {
        this.trigger('prev', this.curr);
        this.stop();
        this.curr--;
        this.goto(this.curr);
        this.resume();
    };

    simpleSlider.prototype.stop = function() {
        var _this = this;
        this.trigger('stop', _this.curr);
        // stop auto switch
        clearTimeout(_this.timeout);
        clearTimeout(_this.delayTimeout);
        // stop animation
        this.$target.stop();
    };

    simpleSlider.prototype.resume = function() {
        var _this = this;
        if (this.option.auto) {
            this.trigger('resume', _this.curr);
            _this.delayTimeout = setTimeout(function() {
                _this.autoGo();
            }, _this.option.interval + _this.option.speed);

        }
    };

    simpleSlider.prototype.autoGo = function() {
        var _this = this;
        _this.curr++;
        _this.goto(_this.curr);
        _this.timeout = setTimeout(function() {
            _this.autoGo();
        }, _this.option.interval + _this.option.speed);
    };
    module.exports = simpleSlider;
});