# 多图片轮播

---

````html
 <style>
 #moe-slider-box {
 width:200px;
 height:355px;
  border:1px solid red;
  overflow:hidden;
 }
 #moe-slider-box ul {
    padding:0;
    margin:0;
    width:10000px;
 }

 #moe-slider-box ul li{
       float:left;
       list-style:none;
 }

 #moe-slider-box img {
    width:200px;
 }
 </style>
<div id="moe-slider-box">
    <ul>
        <li>
            <img src="http://source.bozhong.com/crazy/img/wap/01.png" alt="">
        </li>
         <li>
            <img src="http://source.bozhong.com/crazy/img/wap/02.png" alt="">
        </li>
         <li>
            <img src="http://source.bozhong.com/crazy/img/wap/03.png" alt="">
        </li>
         <li>
            <img src="http://source.bozhong.com/crazy/img/wap/04.png" alt="">
        </li>
         <li>
            <img src="http://source.bozhong.com/crazy/img/wap/05.png" alt="">
        </li>
    </ul>
</div>
<div style="clear:both;"></div>
````



## 代码
````javascript
seajs.use('simpleSlider', function(simpleSlider){
    console.log(simpleSlider);
    var slider = new simpleSlider({
        target:'#slider_img',
        item:'>ul',
        interval: 2000,
        dotsContainer:'.dots',
        auto:true,
        speed:1000,
        easing:'easeOutQuad',
        dotsActiveClass:'moe-dot-active',
        dotsTriggerEvent:'click mouseenter',
        hoverStop:false,
        mode:'images'
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
