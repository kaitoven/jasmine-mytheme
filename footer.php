<?php if (!defined("__TYPECHO_ROOT_DIR__")) {
  exit();
  
} ?>

<div class="flex flex-col lg:mb-16 py-3 dark:dark:text-gray-500">
    <div class="flex flex-col items-center">
        <div class="flex flex-row gap-x-1 items-center footer">
            <!--<img src="https://www.chendk.info/usr/themes/jasmine/pictures/2.gif" alt="动态图片" class="dynamic-image" />-->
            <span><a href="https://www.chendk.info" target="_blank">Kaitoven Lab</a></span>
            <img src="https://www.chendk.info/usr/themes/jasmine/pictures/f3.png" alt="动态图片" class="static-image" />
            <span><a target="_blank">Inside Chen's Mind</a></span>
        </div>

        <!-- 网站运行时间和动图 -->
        <div class="flex flex-row items-center gap-x-2">
            <img src="https://www.chendk.info/usr/themes/jasmine/pictures/f1.png" alt="计时器旁边的动图01" class="timer-image" />
            <div id="site-timer"></div>
            <img src="https://www.chendk.info/usr/themes/jasmine/pictures/f2.png" alt="计时器旁边的动图02" class="timer-image" />
        </div>

    </div>
</div>

<!-- 回到顶部按钮 -->
<div class="back-to-top" id="backToTop">
    <div class="back-to-top-container">
        <!--<img src="https://www.chendk.info/usr/themes/jasmine/pictures/s3.png" alt="Back to Top" class="back-to-top-img" title="返回顶部" />-->
        <!--<span class="back-to-top-text">TOP</span>-->
    </div>
</div>

<div class="footer-images-container">
    <!-- 左边界图片 -->
    <!--<img src="https://www.chendk.info/usr/themes/jasmine/pictures/bottom9.png" alt="左边界图片" class="footer-image left-boundary" />-->
    
    <!-- 左中间图片 -->
    <img src="https://www.chendk.info/usr/themes/jasmine/pictures/bottom1.png" alt="左中间图片" class="footer-image middle-left" />
    
    <!-- 中间图片 -->
    <img src="https://www.chendk.info/usr/themes/jasmine/pictures/bottom2.png" alt="中间图片" class="footer-image center-image" />
    
    <!-- 右中间图片 -->
    <img src="https://www.chendk.info/usr/themes/jasmine/pictures/bottom3.png" alt="右中间图片" class="footer-image middle-right" />
    
    <!-- 右边界图片 -->
    <!--<img src="https://www.chendk.info/usr/themes/jasmine/pictures/bottom2.png" alt="右边界图片" class="footer-image right-boundary" />-->
</div>

<!-- Fish 特效 -->
<!--<div id="jsi-flying-fish-container" class="container"></div>-->

<?php $this->footer(); ?>
<script>
    // 初始化自定义脚本
    <?php $this->options->customScript(); ?>

    // 初始化鱼特效
    window.onload = function() {
        console.log("Page loaded without other effects.");
        // if (typeof RENDERER !== 'undefined' && RENDERER.init) {
        //     RENDERER.init();
        // } else {
        //     console.error("Fish effect failed to load.");
        // }
    };

    // 显示或隐藏回到顶部按钮的逻辑
    window.onscroll = function() {
        const backToTopButton = document.getElementById("backToTop");
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    };

    // 点击回到顶部按钮，平滑滚动返回顶部
    document.getElementById("backToTop").addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 网站运行时间动态更新
    var timeElapsed = <?php 
        $siteLaunchTime = strtotime('2024-07-02 00:00:00');
        $currentTime = time();
        echo $currentTime - $siteLaunchTime;
    ?>;

    function formatTime(seconds) {
        var days = Math.floor(seconds / (24 * 3600));
        seconds %= (24 * 3600);
        var hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        var minutes = Math.floor(seconds / 60);
        var secs = seconds % 60;
        
        // 使用padStart()在个位数前补0
        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        secs = String(secs).padStart(2, '0');
        return `Running for ${days} days ${hours} hrs ${minutes} mins ${secs} secs`;
    }

    function updateTimer() {
        document.getElementById('site-timer').innerHTML = formatTime(timeElapsed);
        timeElapsed++;
    }

    // 每秒更新计时器
    setInterval(updateTimer, 1000);
</script>

<!-- Fish 特效 JS -->
<!--<script src="https://www.chendk.info/usr/themes/jasmine/assets/dist/fish.js"></script>-->

<!-- Fish 特效的样式 -->
<!--<link rel="stylesheet" href="https://www.chendk.info/usr/themes/jasmine/assets/dist/fish-style.css">-->

<!-- 内联样式 -->
<style>
    .dynamic-image {
        height: 1.0em;   /* 图片高度设置为与文本高度相似 */
        width: auto;/* 宽度自动调整，保持纵横比 */
        /* 水平翻转图片 */
        /*transform: scaleX(-1);*/
    }
    .static-image {
        height: 1.2em;   /* 图片高度设置为与文本高度相似 */
        width: auto;
    }

    .timer-image {
        height: 0.8em;
        width: auto;
        /*transform: scaleX(-1);*/
    }

    /* 回到顶部按钮样式 */
    .back-to-top {
        position: fixed;
        bottom: 45px;
        right: 30px;
        display: none;
        align-items: center;
        cursor: pointer;
        z-index: 1000;
    }

    .back-to-top-container {
        position: relative; /* 使内部元素可以进行绝对定位 */
        display: inline-block;
    }

    .back-to-top-img {
        height: 40px; /* 图片大小 */
        width: auto;
    }

    /* 页面滚动一定距离后显示按钮 */
    .show {
        display: flex !important; /* 显示回到顶部按钮 */
    }
    
    .footer-images-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgb(256, 256, 256, 0.6); /* 可根据需求调整背景色 */
        padding: 0;
        z-index: 1; /* 确保图片位于其他内容的上方 */
    }

    .footer-image {
        height: 50px; /* 设置图片高度 */
        width: auto; /* 保持纵横比 */
    }

    /* 针对具体的图片类做微调，如果需要 */
    .left-boundary, .right-boundary {
        margin: 0 10px; /* 边界图片的左右间距 */
    }

    .middle-left, .middle-right, .center-image {
        margin: 0 10px; /* 中间图片的间距 */
    }

</style>
