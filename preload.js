// Preload all assets
function preloadAssets() {
    // Preload all clue images
    clues.forEach(clue => {
        if (clue.image) {
            const img = new Image();
            img.src = clue.image;
        }
    });

    // Preload wrong answer GIF
    const wrongGif = new Image();
    wrongGif.src = 'assets/wrong.gif';

    // Preload audio
    const audio = new Audio('assets/wrong.mp3');
}

// Start preloading when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadAssets);
} else {
    preloadAssets();
}
