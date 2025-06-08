<?php if (!defined("__TYPECHO_ROOT_DIR__")) {
  exit();
}

error_reporting(E_ERROR);

require_once "core/index.php";

/**
 * 初始化主题
 * @param $archive
 * @return void
 */
function themeInit($archive)
{
  //评论回复楼层最高999层.这个正常设置最高只有7层
  Helper::options()->commentsMaxNestingLevels = 999;
  //将最新的评论展示在前
  Helper::options()->commentsOrder = "DESC";
  // 关闭检查评论来源URL与文章链接是否一致判断
  // Helper::options()->commentsCheckReferer = false;
  // 强制开启评论markdown
  // Helper::options()->commentsMarkdown = "1";
  // Helper::options()->commentsHTMLTagAllowed .= "<img class src alt><div class>";
  // if (getOptions()->pjaxLoadPage) {
  //   Helper::options()->commentsAntiSpam = false;
  // }
}

/**
 * 文章与独立页自定义字段
 */
function themeFields(Typecho_Widget_Helper_Layout $layout)
{
  $banner = new Typecho_Widget_Helper_Form_Element_Text(
    "thumbnail",
    null,
    null,
    _t("缩略图"),
    _t("输入一个图片 url，作为缩略图显示在文章列表，没有则不显示")
  );
  $layout->addItem($banner);
  $keyword = new Typecho_Widget_Helper_Form_Element_Textarea(
    "keyword",
    null,
    null,
    _t("SEO 关键词"),
    _t("多个关键词用英文下逗号隔开")
  );
  $layout->addItem($keyword);
  $description = new Typecho_Widget_Helper_Form_Element_Textarea(
    "description",
    null,
    null,
    _t("SEO 描述"),
    _t("简单一句话描述")
  );
  $layout->addItem($description);
}

$custom_functions = __DIR__ . "/custom/functions.php";
if (file_exists($custom_functions)) {
  include_once $custom_functions;
}



// function themeInit($archive)
// {
//     //这里如果放开那么就表示不用更改post.php文件自动替换，但可能产生不兼容问题
//     /*if ($archive->is('single')) {
//         $archive->content = ParseReply($archive->content);
//     }*/
// }
/* 格式化 */
function ParseReply($content)
{
    // $content = preg_replace_callback(
    //     '/\:\@\(\s*(tuxue|huaji|chijing|shengqi|kuqi|die|yiwen|feizao|fule|heng|daxiao|toukan|maimeng|OK|xiasi|yaotou|shuijiao|wuyu|chigua|jizhi)\s*\)/is',
    //     'ParseQuYinBiaoqingCallback',
    //     $content
        
    $content = preg_replace_callback(
        // '/\:\@\(\s*(吐血|滑稽|吃惊|生气|哭泣|die|疑问|肥皂|扶额|哼|大笑|偷看|卖萌|OK|吓死宝宝惹|摇头|睡觉|无语|吃瓜|机智)\s*\)/is',
        '/\:\@\(\s*(偷看|摊手|无语|害怕|die|睡觉|哭泣|滑稽|肥皂|生气|不愧是我|吃惊|扶额|大笑|卖萌|吃瓜|吐血|OK|哼|疑问|第一|吐魂|委屈|郁闷|困惑|汗|喝水|耶)\s*\)/is',


        'ParseQuYinBiaoqingCallback',
        $content
    );
    return $content;
}
// function ParseQuYinBiaoqingCallback($match)
// {

//     return '<img class="owo" style="width:66px;height:66px" src="' . '/OwO/quyin/' . urlencode($match[1]) . '.png">';
// }

function ParseQuYinBiaoqingCallback($match)
{
    // 定义表情名称与文件夹及文件名的映射
    $emojiMap = [
        'quyin' => [
            '偷看' => 'E89B86E99FB3E5A898_E581B7E79C8B',
            '摊手' => 'E89B86E99FB3E5A898_E6918AE6898B',
            '无语' => 'E89B86E99FB3E5A898_E697A0E8AFAD',
            '害怕' => 'E89B86E99FB3E5A898_E5AEB3E68095',
            '去世' => 'E89B86E99FB3E5A898_E58EBBE4B896',
            '睡觉' => 'E89B86E99FB3E5A898_E79DA1E8A789',
            '哭泣' => 'E89B86E99FB3E5A898_E593ADE6B3A3',
            '滑稽' => 'E89B86E99FB3E5A898_E6BB91E7A8BD',
            '肥皂' => 'E89B86E99FB3E5A898_E882A5E79A82',
            '生气' => 'E89B86E99FB3E5A898_E7949FE6B094',
            '不愧是我' => 'E89B86E99FB3E5A898_E4B88DE684A7E698AFE68891',
            '吃惊' => 'E89B86E99FB3E5A898_E59083E6838A',
            '扶额' => 'E89B86E99FB3E5A898_E689B6E9A29D',
            '大笑' => 'E89B86E99FB3E5A898_E5A4A7E7AC91',
            '卖萌' => 'E89B86E99FB3E5A898_E58D96E8908C',
            '吃瓜' => 'E89B86E99FB3E5A898_E59083E7939C',
            '吐血' => 'E89B86E99FB3E5A898_E59090E8A180',
            'OK' => 'E89B86E99FB3E5A898_OK',
            '哼' => 'E89B86E99FB3E5A898_E593BC',
            '疑问' => 'E89B86E99FB3E5A898_E79691E997AE'
        ],
        '2233' => [
            '第一' => '2233E5A898_E7ACACE4B880',
            '无语' => '2233E5A898_E697A0E8AFAD',
            '吐魂' => '2233E5A898_E59090E9AD82',
            '委屈' => '2233E5A898_E5A794E5B188',
            '哭泣' => '2233E5A898_E593ADE6B3A3',
            '郁闷' => '2233E5A898_E98381E997B7',
            '困惑' => '2233E5A898_E59BB0E68391',
            '生气' => '2233E5A898_E7949FE6B094',
            '吃惊' => '2233E5A898_E59083E6838A',
            '汗' => '2233E5A898_E6B197',
            '大笑' => '2233E5A898_E5A4A7E7AC91',
            '喝水' => '2233E5A898_E5969DE6B0B4',
            '耶' => '2233E5A898_E880B6',
            '卖萌' => '2233E5A898_E58D96E8908C',
            '疑问' => '2233E5A898_E79691E997AE'
        ]
    ];

    // 遍历两个文件夹的映射
    foreach ($emojiMap as $folder => $emojis) {
        if (isset($emojis[$match[1]])) {
            $filename = $emojis[$match[1]];
            return '<img class="owo" style="width:66px;height:66px" src="/OwO/' . $folder . '/' . $filename . '.png">';
        }
    }

    // 如果匹配的表情名称不存在映射中，返回原始文本
    return $match[0];
}

