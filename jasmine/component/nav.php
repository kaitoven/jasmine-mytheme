<?php if (!defined("__TYPECHO_ROOT_DIR__")) {
  exit();
} ?>
<!--jasmine-primary-bg text-white px-2 py-1 absolute w-full rounded top-[5px] left-[60px] w-max z-50-->
<?php $menus = getLeftSidebarMenu(); ?>
<div class="flex grow flex-col justify-between">
    <ul class="flex flex-col flex-wrap content-center gap-y-3" id="nav">
        <?php if (!empty($menus)): ?>
        <?php foreach ($menus as $menu): ?>
            <?php
            // 获取当前页面的完整 URL
            $currentUrl = $_SERVER['REQUEST_URI'];
    
            // 获取菜单的完整 URL 包括路径和查询参数
            $menuUrl = $menu["url"];
    
            // 严格检查当前 URL 是否与菜单 URL 完全匹配，避免部分匹配
            $isActive = ($currentUrl === $menuUrl) ? 'active' : '';
            ?>
            <li class="relative nav-li <?php echo $isActive; ?>">
                <a href="<?php echo $menu["url"]; ?>" target="<?php echo $menu["newTab"] ? "_blank" : "_self"; ?>" title="<?php echo $menu["name"]; ?>">
                    <iconify-icon icon="<?php echo $menu["icon"]; ?>"
                                  class="rounded px-3 py-2 text-2xl jasmine-primary-bg-hover hover:text-white hover:shadow-lg"></iconify-icon>
                </a>
                <span class="jasmine-primary-bg text-white px-2 py-1 absolute w-full rounded top-[5px] left-[60px] w-max z-50"
                      style="display: none">
                    <?php echo $menu["name"]; ?>
                </span>
            </li>
        <?php endforeach; ?>
        <?php endif; ?>
    </ul>



    <ul class="flex flex-col flex-wrap content-center gap-y-2 ">

        <li class="relative nav-li">
            <button onclick="jasmine.switchDark()" >
                <iconify-icon icon="<?php echo getOptionValueOrDefault("switchDarkIconPhone", "tabler:sun-moon"); ?>"
                              title="Switch Mode"
                              class="rounded px-2 py-1 text-2xl jasmine-primary-bg-hover hover:text-white"></iconify-icon>
            </button>
        </li>        
        <!--<li class="relative nav-li">-->
        <!--    <button onclick="jasmine.backtop()" onmouseover="this.nextElementSibling.style.display='block';" onmouseout="this.nextElementSibling.style.display='none';">-->
        <!--        <img src="https://www.chendk.info/usr/themes/jasmine/pictures/top.png" -->
        <!--             alt="返回顶部" -->
        <!--             class="rounded px-2 py-1 jasmine-primary-bg-hover hover:text-white"-->
        <!--             style="width: 40px; height: 40px;"/>-->
        <!--    </button>-->
        <!--    <span class="jasmine-primary-bg text-white px-2 py-1 absolute w-full rounded top-0 left-[53px] w-max z-50" style="display: none">-->
        <!--        返回顶部-->
        <!--    </span>-->
        <!--</li>-->


        <li class="relative nav-li">
            <button onclick="jasmine.backtop()">
                <iconify-icon icon="tabler:chevrons-up"
                              title="Back Top"
                              class="rounded px-2 py-1 text-2xl jasmine-primary-bg-hover hover:text-white"></iconify-icon>
            </button>
        </li>
    </ul>
</div>
