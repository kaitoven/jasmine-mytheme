<?php
/**
 * 番剧推荐 - 每日放送
 *
 * @package custom
 */
if (!defined("__TYPECHO_ROOT_DIR__")) {
  exit();
}
?>
<!DOCTYPE html>
<html lang="zh">
<?php $this->need("header.php"); ?>
<body class="jasmine-body">
<div class="jasmine-container grid grid-cols-12">
    <?php $this->need("component/sidebar-left.php"); ?>
    <div class="flex col-span-12 lg:col-span-8 flex-col border-x-2 border-stone-100 dark:border-neutral-600 lg:pt-0 lg:px-6 pb-10 px-3">
        <?php $this->need("component/menu.php"); ?>

        <!-- 动漫推荐内容开始 -->
        <div class="flex flex-col gap-y-12">
            <h1 class="anime-recommendation-title">Anime Recommendation</h1>
            <div class="anime-container">
                <?php
                // 缓存设置
                $cache_file = __DIR__ . '/bangumi_cache.json'; // 缓存文件路径
                $cache_duration = 3600; // 缓存有效期为1小时（3600秒）

                // 检查缓存文件是否存在并且没有过期
                if (file_exists($cache_file) && (time() - filemtime($cache_file)) < $cache_duration) {
                    // 读取缓存文件
                    $anime_list = json_decode(file_get_contents($cache_file), true);
                } else {
                    // 使用 Bangumi API 获取每日放送动漫数据
                    $bangumi_api_url = 'https://api.bgm.tv/calendar';
                    $response = @file_get_contents($bangumi_api_url);
                    $anime_list = $response ? json_decode($response, true) : [];

                    // 将数据写入缓存文件
                    if (!empty($anime_list)) {
                        file_put_contents($cache_file, json_encode($anime_list));
                    }
                }

                // 确保 $anime_list 是数组
                if (!is_array($anime_list)) {
                    $anime_list = [];
                }

                // 整理数据，获取所有的 anime 项
                $all_anime = [];
                foreach ($anime_list as $day) {
                    foreach ($day['items'] as $anime) {
                        // 过滤掉没有有效图片的动漫
                        if (!empty($anime['images']['large'])) {
                            $all_anime[] = $anime;
                        }
                    }
                }

                // 分页逻辑
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $items_per_page = 20;
                $total_anime = count($all_anime);
                $total_pages = ceil($total_anime / $items_per_page);
                $start_index = ($page - 1) * $items_per_page;
                $anime_to_display = array_slice($all_anime, $start_index, $items_per_page);

                // 显示动漫
                if ($total_anime > 0):
                    foreach ($anime_to_display as $anime) : 
                        // 获取条目数据
                        $name_cn = $anime['name_cn'] ?? $anime['name'];
                        $rating = $anime['rating']['score'] ?? '无评分';
                        $name = $anime['name'];
                        $image_url = $anime['images']['large'];
                        ?>
                        <div class="anime-card" onclick="showImageModal('<?php echo $image_url; ?>')">
                            <img src="<?php echo $image_url; ?>" alt="<?php echo $name_cn; ?>">
                            <div class="anime-hover-content">
                                <h3><?php echo $name_cn; ?></h3>
                                <p>评分: <?php echo $rating; ?></p>
                            </div>
                        </div>
                    <?php endforeach;
                else: ?>
                    <p>未找到推荐的番剧。</p>
                <?php endif; ?>
            </div>

            <!-- 分页按钮，只在多于1页时显示 -->
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
            <!-- 分页按钮结束 -->

        </div>
        <!-- 动漫推荐内容结束 -->
    </div>
    <div class="hidden lg:col-span-3 lg:block" id="sidebar-right">
        <?php $this->need("component/sidebar.php"); ?>
    </div>
</div>

<!-- 模态框 -->
<div id="image-modal" class="modal">
    <span class="close" onclick="closeImageModal()">&times;</span>
    <img class="modal-content" id="modal-image">
</div>

<?php $this->need("footer.php"); ?>

<style>
  .anime-container {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr)); /* 保持4列布局 */
    gap: 20px;
    margin: 20px;
  }
  .anime-recommendation-title {
    font-weight: bold;
    text-align: center;
    margin-top: 50px;
    font-size: 1.6em;
  }
  .anime-card {
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    text-align: center;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    cursor: pointer;
  }

  .anime-card:hover {
    transform: scale(1.05);
  }

  .anime-card img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }

  .anime-hover-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* 半透明背景 */
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .anime-card:hover .anime-hover-content {
    opacity: 1; /* 悬停时显示 */
  }

  .anime-hover-content h3 {
    font-size: 0.65em; /* 调整悬浮时标题字体 */
    margin-bottom: 10px;
  }

  .anime-hover-content p {
    font-size: 0.5em; /* 调整评分字体 */
    margin: 0;
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

  /* 模态框样式 */
  .modal {
    display: none; /* 默认隐藏 */
    position: fixed;
    z-index: 9999;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .modal-content {
    display: block;
    margin: auto;
    max-width: 90%;
    max-height: 80%;
  }

  .close {
    position: absolute;
    top: 20px;
    right: 35px;
    color: #fff;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
  }

  @media (max-width: 1200px) {
    .anime-card {
      padding: 12px;
    }
    .anime-card img {
      width: 90%;
    }
  }

  @media (max-width: 992px) {
    .anime-card {
      padding: 10px;
    }
    .anime-card img {
      width: 85%;
    }
  }

  @media (max-width: 768px) {
    .anime-card {
      padding: 8px;
    }
    .anime-card img {
      width: 80%;
    }
  }

  @media (max-width: 576px) {
    .anime-card {
      padding: 6px;
    }
    .anime-card img {
      width: 75%;
    }
  }

  body {
    overflow-x: hidden;
  }
</style>

<script>
function showImageModal(imageUrl) {
    var modal = document.getElementById("image-modal");
    var modalImg = document.getElementById("modal-image");
    modal.style.display = "block";
    modalImg.src = imageUrl;
}

function closeImageModal() {
    var modal = document.getElementById("image-modal");
    modal.style.display = "none";
}
</script>

</body>
</html>
