define(function(require, exports, module) {
    var $ = require('$');
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
        console.log(option);
        var _this = this;
        $.extend(defaultOpt, option);
        this.option = defaultOpt;
        this.target = $(this.option.target);
        this.curr = 0;
        this.interval = this.option.interval || null;
        this.length = 5;

        // bind prev and next btn
        var $next = $('[data-action="next"]');
        var $prev = $('[data-action="prev"]');

        $next.on('click', function() {
            _this.stop();
            _this.next();
        });

        $prev.on('click', function() {
            _this.stop();
            _this.prev();
        });

        this.autoGo();
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
                html += '<ul class="slider_dots"><li><span class="dot"></span></li>';
                i++;
            }
            html += '</ul>';
            $dotsContainer.html(html);
            var $lis = $dotsContainer.find('ul>li');
            console.log($lis);
            $lis.on('click mouseover', function() {
                var index = $(this).index();
                $lis.eq(index).find('.dot').css({
                    backgroundColor: 'purple'
                }).end().siblings().find('.dot').css({
                    backgroundColor: 'red'
                });
                _this.stop();
                _this.goto(index);
            });

        }

    };

    simpleSlider.prototype.goto = function(index) {
        this.trigger('switch', this.curr);
        if (index >= 5) {
            this.curr = index = 0;
        }

        if (index <= -1) {
            this.curr = index = 4;
        }

        this.target.animate({
            left: -index * 224
        }, 1000, 'easeOutQuad', function() {
            $('.slider_dots>li').eq(index).find('.dot').css({
                backgroundColor: 'purple'
            }).end().siblings().find('.dot').css({
                backgroundColor: 'red'
            });
        });
    };

    simpleSlider.prototype.next = function() {
        this.trigger('next', this.curr);
        this.curr++;
        this.goto(this.curr);
    };
    simpleSlider.prototype.prev = function() {
        this.trigger('prev', this.curr);
        this.curr--;
        this.goto(this.curr);
    };
    simpleSlider.prototype.stop = function() {
        var _this = this;
        this.trigger('stop', this.curr);
        // 清除自动播放
        clearTimeout(this.timeout);
        // 停止动画
        this.target.stop();
        this.timeout = setTimeout(function() {
            _this.autoGo();
        }, _this.interval);
    };
    simpleSlider.prototype.resume = function() {
        this.trigger('resume', this.curr);
    };

    simpleSlider.prototype.css = function(index) {

    };

    simpleSlider.prototype.autoGo = function() {
        var _this = this;
        this.curr++;
        this.goto(_this.curr);
        _this.timeout = setTimeout(function() {
            _this.autoGo();
        }, _this.interval);
    };

    module.exports = simpleSlider;
});