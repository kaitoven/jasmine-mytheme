document.addEventListener("DOMContentLoaded", () => {
    const img = document.getElementById('movingImage');
    let directionX = 1; // 1 for right, -1 for left
    let directionY = 1; // 1 for down, -1 for up
    let posX = Math.random() * (window.innerWidth - img.offsetWidth); 
    let posY = Math.random() * (window.innerHeight - img.offsetHeight); 
    let speedX = 2 + Math.random() * 3; 
    let speedY = 2 + Math.random() * 3;

    img.style.left = posX + "px";
    img.style.top = posY + "px";

    const moveImage = () => {
        posX += speedX * directionX;
        posY += speedY * directionY;

        if (posX > window.innerWidth - img.offsetWidth) {
            directionX = -1;
            posX = window.innerWidth - img.offsetWidth;
            img.style.transform = `scaleX(-1)`;
        } else if (posX < 0) {
            directionX = 1;
            posX = 0;
            img.style.transform = `scaleX(1)`;
        }

        if (posY > window.innerHeight - img.offsetHeight) {
            directionY = -1;
            posY = window.innerHeight - img.offsetHeight;
        } else if (posY < 0) {
            directionY = 1;
            posY = 0;
        }

        img.style.left = posX + "px";
        img.style.top = posY + "px";

        requestAnimationFrame(moveImage);
    };

    moveImage();
    
    // Function to hide or show the image based on scroll
    const handleScroll = () => {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        if (scrollPosition > 300) {
            img.style.display = 'none'; // Hide the image when scrolled down more than 300px
        } else {
            img.style.display = 'block'; // Show the image when scrolled up to 300px or less
        }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Update boundaries when window is resized
    window.addEventListener('resize', () => {
        posX = Math.min(posX, window.innerWidth - img.offsetWidth);
        posY = Math.min(posY, window.innerHeight - img.offsetHeight);
    });    
    
});



