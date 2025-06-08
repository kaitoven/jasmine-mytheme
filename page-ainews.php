<?php
if (!defined("__TYPECHO_ROOT_DIR__")) {
  exit();
}

// 配置缓存文件路径和有效期
$cache_file = __DIR__ . '/ai_news_cache.json'; // 缓存文件路径
$cache_expiration = 3600; // 缓存有效期，单位为秒（1小时）

// 函数：抓取RSS新闻并解析为对象
function fetch_rss_news($feed_url) {
    $rss = simplexml_load_file($feed_url);
    $news_list = [];

    if ($rss) {
        foreach ($rss->channel->item as $item) {
            $news_list[] = [
                'title' => (string)$item->title,
                'link' => (string)$item->link,
                'description' => (string)$item->description,
                'pubDate' => (string)$item->pubDate,
                'source' => (string)$rss->channel->title
            ];
        }
    }

    return $news_list;
}

// 函数：加载缓存或抓取新闻
function load_or_fetch_news($cache_file, $cache_expiration) {
    // 如果缓存文件存在且未过期，直接读取缓存
    if (file_exists($cache_file) && (time() - filemtime($cache_file)) < $cache_expiration) {
        return json_decode(file_get_contents($cache_file), true);
    }

    // 抓取新闻源
    $ai_news = fetch_rss_news('https://www.technologyreview.com/feed/');
    $ars_technica_news = fetch_rss_news('https://feeds.arstechnica.com/arstechnica/technology-lab');
    $zdnet_news = fetch_rss_news('https://www.zdnet.com/topic/artificial-intelligence/rss.xml');

    // 合并新闻条目
    $all_news = array_merge($ai_news, $ars_technica_news, $zdnet_news);

    // 将新闻保存到缓存文件
    file_put_contents($cache_file, json_encode($all_news));

    return $all_news;
}

// 读取缓存或抓取新闻
$all_news = load_or_fetch_news($cache_file, $cache_expiration);

// 分页逻辑
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$news_per_page = 10;
$total_news = count($all_news);
$total_pages = ceil($total_news / $news_per_page);
$start_index = ($page - 1) * $news_per_page;
$news_to_display = array_slice($all_news, $start_index, $news_per_page);
?>

<!DOCTYPE html>
<html lang="zh">
<?php $this->need("header.php"); ?>
<body class="jasmine-body">
<div class="jasmine-container grid grid-cols-12">
    <?php $this->need("component/sidebar-left.php"); ?>
    <div class="flex col-span-12 lg:col-span-8 flex-col lg:border-x-2 border-stone-100 dark:border-neutral-600 lg:pt-0 lg:px-6 pb-10 px-3">
        <?php $this->need("component/menu.php"); ?>

        <!-- AI 新闻推荐内容开始 -->
        <div class="flex flex-col gap-y-12">
            <h1 class="news-recommendation-title">AI News Recommendation</h1>
            <div class="news-container">
                <?php foreach ($news_to_display as $news) : ?>
                    <div class="news-card">
                        <h3><a href="<?php echo $news['link']; ?>" target="_blank"><?php echo $news['title']; ?></a></h3>
                        <small>Source: <?php echo $news['source']; ?> | <?php echo date("M d, Y", strtotime($news['pubDate'])); ?></small>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- 手动分页，只在多于1页时显示 -->
            <?php if ($total_pages > 1): ?>
            <div class="pagination">
                <?php if ($page > 1): ?>
                    <a href="?page=<?php echo $page - 1; ?>" class="page-link">‹</a>
                <?php endif; ?>

                <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                    <a href="?page=<?php echo $i; ?>" class="page-link <?php echo $i == $page ? 'active' : ''; ?>"><?php echo $i; ?></a>
                <?php endfor; ?>

                <?php if ($page < $total_pages): ?>
                    <a href="?page=<?php echo $page + 1; ?>" class="page-link">›</a>
                <?php endif; ?>
            </div>
            <?php endif; ?>
            <!-- 手动分页结束 -->

        </div>
        <!-- AI 新闻推荐内容结束 -->

    </div>
    <div class="hidden lg:col-span-3 lg:block" id="sidebar-right">
        <?php $this->need("component/sidebar.php"); ?>
    </div>
</div>
<?php $this->need("footer.php"); ?>

<style>
  .news-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2列布局 */
    gap: 20px;
    margin: 20px;
  }
  .news-recommendation-title {
    font-weight: bold;
    text-align: center;
    margin-top: 50px;
    font-size: 1.6em;
  }
  .news-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    text-align: center;
    transition: all 0.3s ease-in-out;
  }

  .news-card:hover {
    transform: scale(1.05);
  }

  .news-card h3 {
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .page-link {
    background-color: #f0f0f0;
    color: #000;
    padding: 0.1rem 0.6rem;
    margin: 0.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }

  .page-link:hover {
    background-color: #e0e0e0;
  }

  .page-link.active {
    background-color: #000;
    color: #fff;
  }
</style>

</body>
</html>
