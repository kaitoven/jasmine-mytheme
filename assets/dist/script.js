const img = document.getElementById('movingImage');
let direction = 1;
let position = 0;
const speed = 2; // 图片移动的速度
const imageWidth = img.clientWidth;

function moveImage() {
    const containerWidth = window.innerWidth;

    // 移动图片
    position += speed * direction;
    img.style.left = position + 'px';

    // 检查图片是否需要翻转方向
    if (position + imageWidth >= containerWidth || position <= 0) {
        direction *= -1;
        img.style.transform = `scaleX(${direction})`;
    }

    requestAnimationFrame(moveImage);
}

moveImage();
