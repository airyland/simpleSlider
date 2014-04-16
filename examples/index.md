# 演示文档

---

<style> 
.sliders {
        width:224px;
        height:375px;
        overflow:hidden;
        position:relative;
    }
    #slider_img {
        position:absolute;
        top:0;
        left:0;
        /* -webkit-transition:left 200ms ease-in;*/
    }
    .slider_dots li {
        float:left;
        list-style:none;
        margin-right:3px;
    }
    .dot {
        display:block;
        width:10px;
        height:10px;
        border-radius:5px;
        background:red;
        cursor:pointer;
    }
    .moe-slider-progress{
        width:224px;
        height:2px;
        border-radius:2px;

    }
    .moe-slider-progress-inner{
        width:100%;
        background:red;
        height:2px;
    }
    .moe-dot-active {
        background-color:purple;
    }
    </style>

````html
<div id="moe-slider-box">
    <div class="sliders">
        <img src="../src/sliders.png" alt="" id="slider_img">
    </div>
    <a href="javascript:" data-action="prev">上一个</a>
    <a href="javascript:" data-action="next">下一个</a>
    <div class="dots"></div>
    <div class="moe-slider-progress">
        <div class="moe-slider-progress-inner">
        </div>
    </div>
</div>
<div style="clear:both;"></div>
````

## 代码 
````javascript
seajs.use('simpleSlider', function(simpleSlider){
    console.log(simpleSlider);
    var slider = new simpleSlider({
        target:'#slider_img',
        interval: 2000,
        dotsContainer:'.dots',
        auto:true,
        speed:1000,
        easing:'easeOutQuad',
        dotsActiveClass:'moe-dot-active',
        dotsTriggerEvent:'click mouseenter'
    });
    /**
    slider.on('next',function(index){
        console.log('next',index);
    }).on('resume',function(){
    console.log('resume');
    })
    **/
    slider.on('all',function(arg1,arg2){
        console.log(arg1,arg2);
    }).on('switch:progress',function(precent){
        jQuery('.moe-slider-progress-inner').css('width',(1-precent)*100+'%');
    })
});
````
