<?php
if (!defined("__TYPECHO_ROOT_DIR__")) {
  exit();
} ?>
<!DOCTYPE html>
<html lang="zh">
<?php $this->need("header.php"); ?>
<body class="jasmine-body">
<div class="jasmine-container grid grid-cols-12">
    <?php $this->need("component/sidebar-left.php"); ?>
    <div class="flex col-span-12 lg:col-span-8 flex-col lg:border-x-2 border-stone-100 dark:border-neutral-600 lg:pt-0 lg:px-6 pb-10 px-3">
        <?php $this->need("component/menu.php"); ?>
        <?php if ($this->is("index") && $this->_currentPage == 1): ?>
        <?php $this->need("component/post-top.php"); ?>
        <?php endif; ?>
        <?php $this->need("component/post-item.php"); ?>
        <?php $this->need("component/paging.php"); ?>
    </div>
    <div class="hidden lg:col-span-3 lg:block" id="sidebar-right">
        <?php $this->need("component/sidebar.php"); ?>
    </div>
</div>

<!-- 你的移动图片 -->
<img id="movingImage" src="https://www.chendk.info/usr/themes/jasmine/pictures/m1.png" alt="Moving Image" 
     style="position: fixed; z-index: 1002; width: 45px; height: 45px; opacity: 0.8;">

<!-- 引用外部的 script.js 文件 -->
<script src="https://www.chendk.info/usr/themes/jasmine/assets/dist/move.js"></script>
<?php $this->need("footer.php"); ?>

</body>
</html>
