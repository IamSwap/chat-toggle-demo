# iOS Specific Hacks

## Adjust Fullscreen for Orientation

This hack adjusts the height of the body element to ensure proper fullscreen behavior on iOS devices when the orientation changes.

```javascript
function adjustFullscreenForOrientation() {
    if (isIOS) {
        if (window.innerHeight > window.innerWidth) {
            // Portrait mode
            document.body.style.height = '200vh';
            document.body.style.paddingBottom = '100px';
        } else {
            // Landscape mode
            document.body.style.height = '100vh';
            document.body.style.paddingBottom = '0';
        }
        window.scrollTo(0, 1);
    }
}
```

## Enter Fullscreen

This hack ensures that the fullscreen mode is properly entered on iOS devices, including locking the screen orientation to landscape.

```javascript
function enterFullscreen() {
    if (isIOS) {
        adjustFullscreenForOrientation();
        window.addEventListener('orientationchange', adjustFullscreenForOrientation);
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => { });
        }
    }
}
```

## Exit Fullscreen

This hack ensures that the fullscreen mode is properly exited on iOS devices, including unlocking the screen orientation.

```javascript
function exitFullscreen() {
    if (isIOS) {
        document.body.style.height = '';
        document.body.style.paddingBottom = '';
        window.removeEventListener('orientationchange', adjustFullscreenForOrientation);
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }
}
```

## Fullscreen Button Event Listener for iOS

This hack adds an event listener to the fullscreen button to handle entering and exiting fullscreen mode on iOS devices.

```javascript
fullscreenBtn.addEventListener('click', () => {
    const isFullscreen = video.classList.contains('ios-fullscreen');
    fullscreenBtn.innerHTML = isFullscreen ?
        '<i class="fas fa-expand"></i>' :
        '<i class="fas fa-compress"></i>';
    if (!isFullscreen) {
        video.classList.add('ios-fullscreen');
        videoContainer.classList.add('fullscreen');
        mainContainer.classList.add('fullscreen');
        toggleButton.classList.add('fullscreen');
        const controls = document.querySelector('.controls');
        if (controls) controls.classList.add('ios-fullscreen');
        if (isChatOpen) {
            chatSidebar.style.zIndex = '10001';
        }
        chatSidebar.setAttribute("is-fullscreen", "true");
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => { });
        }
        enterFullscreen();
    } else {
        video.classList.remove('ios-fullscreen');
        videoContainer.classList.remove('fullscreen');
        mainContainer.classList.remove('fullscreen');
        toggleButton.classList.remove('fullscreen');
        const controls = document.querySelector('.controls');
        if (controls) controls.classList.remove('ios-fullscreen');
        chatSidebar.setAttribute("is-fullscreen", "false");
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
        exitFullscreen();
    }
});
```

## Prevent Default Touch Move

This hack prevents the default touch move behavior when the video is in fullscreen mode on iOS devices to avoid unwanted scrolling.

```javascript
document.addEventListener('touchmove', (e) => {
    if (video.classList.contains('ios-fullscreen')) {
        e.preventDefault();
    }
}, { passive: false });
