<?php if (!defined("__TYPECHO_ROOT_DIR__")) {
  exit();
} ?>
<!DOCTYPE html>
<html lang="zh">
<?php $this->need("header.php"); ?>
<body class="jasmine-body" data-prismjs-copy="点击复制" data-prismjs-copy-error="按Ctrl+C复制" data-prismjs-copy-success="内容已复制！">
<div class="jasmine-container grid grid-cols-12">
<?php $this->need("component/sidebar-left.php"); ?>
        <div class="flex col-span-12 lg:col-span-8 flex-col lg:border-x-2 border-stone-100 dark:border-neutral-600 lg:pt-0 lg:px-6 pb-10 px-3">
            <?php $this->need("component/menu.php"); ?>
            <div class="flex flex-col gap-y-12">
                <div></div>
                <?php $this->need("component/post-title.php"); ?>
                <div class="markdown-body dark:!bg-[#161829] dark:!bg-[#0d1117] !text-neutral-900 dark:!text-gray-400" itemprop="articleBody">
                <!--<div class="markdown-body dark:!bg-rgba(18, 18, 18, 0.2) dark:!bg-rgba(18, 18, 18, 0.8) !text-neutral-900 dark:!text-gray-400" itemprop="articleBody">-->
                    <?php echo handleContent($this->content); ?>
                </div>
                
                <!-- 目录按钮和容器 -->
                <div class="directory-container">
                    <div class="directory-toggle">
                        <span class="iconify" id="toggle-icon" data-icon="lets-icons:expand-left-double-light" data-inline="false"></span>
                    </div>
                    <div class="article-directory">
                        <!-- 目录将由 JavaScript 动态生成 -->
                    </div>
                </div>
                
                <div class="flex flex-row gap-x-2 " id="post-tag">
                    <?php $this->tags(" ", true, ""); ?>
                </div>
                <div class="border-b-2 border-stone-100 dark:border-neutral-600"></div>
                <div>
                    <?php $this->need("comments.php"); ?>
                </div>
            </div>
        </div>
        <div class="hidden lg:col-span-3 lg:block" id="sidebar-right">
            <?php $this->need("component/sidebar.php"); ?>
        </div>
    </div>
    <?php $this->need("footer.php"); ?>
</body>
</html>
