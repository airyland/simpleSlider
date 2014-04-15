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
    </style>

````html
<div class="sliders">
    <img src="../src/sliders.png" alt="" id="slider_img">
</div>
<a href="javascript:" data-action="prev">上一个</a>
<a href="javascript:" data-action="next">下一个</a>
<div class="dots">
<!--    <ul class="slider_dots">
 <li><span class="dot"></span></li>
 <li>
     <span class="dot">
 </li>
 <li>
     <span class="dot">
 </li>
 <li>
     <span class="dot">
 </li>
 <li>
     <span class="dot">
 </li>
</ul>  -->
</div>

<div style="clear:both;"></div>
````

## 代码 
````javascript
seajs.use('simpleSlider', function(simpleSlider){
    var slider = new simpleSlider({
        target:'#slider_img',
        interval: 1000,
        dotsContainer:'.dots',
        auto:true,
        speed:1000
        auto:true
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
    });
});
````
