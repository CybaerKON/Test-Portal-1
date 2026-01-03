// 1. 图表动画逻辑
window.addEventListener('load', () => {
    // 延迟一小段时间启动，确保视觉效果平滑
    setTimeout(() => {
        // 处理具有 data-width 属性的图表（左侧面板）
        document.querySelectorAll('.chart-bar-fill').forEach(bar => {
            const target = bar.getAttribute('data-width');
            if (target) bar.style.width = target;
        });

        // 处理通过 CSS 变量定义的图表（右侧面板）
        document.querySelectorAll('.bar-fill').forEach(bar => {
            const styleValue = bar.getAttribute('style');
            if (styleValue && styleValue.includes('--target-width')) {
                const match = styleValue.match(/--target-width:\s*([^;%]+%?)/);
                if (match) bar.style.width = match[1];
            }
        });
    }, 300);
});

// 2. 视频弹窗与播放逻辑
const modal = document.getElementById('video-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalVideoContainer = document.getElementById('modal-video-container');
let currentPlayer = null;

// 为所有视频按钮绑定点击事件
document.querySelectorAll('.video-btn').forEach(item => {
    item.addEventListener('click', (e) => {
        const videoUrl = item.getAttribute('data-video-url');
        if (videoUrl) {
            // 显示弹窗
            modal.classList.add('active');
            
            // 如果已有播放器则销毁，防止内存泄漏和声音残留
            if (currentPlayer) { 
                currentPlayer.dispose(); 
            }
            
            // 创建新的视频标签
            const type = videoUrl.includes('m3u8') ? 'application/x-mpegURL' : 'video/mp4';
            modalVideoContainer.innerHTML = `
                <video id="active-video" class="video-js vjs-default-skin vjs-16-9" controls preload="auto" width="100%">
                    <source src="${videoUrl}" type="${type}">
                </video>`;
            
            // 初始化 Video.js 播放器
            currentPlayer = videojs('active-video', { 
                autoplay: true, 
                responsive: true, 
                fluid: true 
            });
        }
    });
});

// 关闭弹窗的函数
const closeFunc = () => {
    modal.classList.remove('active');
    if (currentPlayer) { 
        currentPlayer.pause(); 
    }
};

// 绑定关闭事件
closeModalBtn.addEventListener('click', closeFunc);

// 点击弹窗背景（遮罩层）时也关闭
modal.addEventListener('click', (e) => { 
    if (e.target === modal) closeFunc(); 
});