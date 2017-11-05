var DH = DH || {};
DH.Player = function () {

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const stop = player.querySelector('.stop');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreen = player.querySelector('.fullScreen');
const videoName = player.querySelector('.player__name');
const playlist = document.querySelector('.playlist');

const videos = [];
const currentUrl = window.location.href;
const url = currentUrl + '/assets/videos.json';

function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function stopVideo() {
    video.pause();
    video.currentTime = 0;
    video.load();
    progressBar.style.flexBasis = `0%`;
}

function updateButton() {
    const icon = this.paused ? '>' : '||';
    toggle.textContent = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    // console.log(e);
}

function changeEnded() {
    const source = this.querySelector('.viewer__source');
    const sourceIndex = source.dataset.index;
    videos.forEach((el, index) =>  {
        let max = videos.length;
        let nextVideo = videos[index + 1];

        if (index == sourceIndex && index < videos.length - 1 ) {

            let elementsList = playlist.querySelectorAll('.playlist__element');
            elementsList.forEach((element, i) => {
                element.classList.remove('active');
                if (i == nextVideo.id) {
                    element.classList.add('active');
                }
            });
            videoName.innerText = nextVideo.name;
            source.src = nextVideo.link;
            source.setAttribute("data-index", index + 1);
            video.load();
            video.play();
        }
    });
}

function addPlaylist() {
    videos.forEach((el, i) => {
        playlist.innerHTML += `<li class="playlist__element" data-link="${el.link}" data-index="${i}">${el.name}</li>`
    });
}

fetch(url)
    .then(res => res.json())
    .then(data => {
        videos.push(...data);
        addPlaylist()
    });


// -----change movie
function changeMovie (e) {
    let elementsList = playlist.querySelectorAll('.playlist__element');
    elementsList.forEach(element => {
        element.classList.remove('active');
    });

    if(!e.target.matches('li')) return;
    const el = e.target;
    const link = el.dataset.link;
    const videoSource = video.querySelector('.viewer__source');
    const index = el.dataset.index;

    el.classList += ' active';

    videoName.innerText = el.textContent;
    videoSource.src = link;
    videoSource.setAttribute("data-index", index);
    video.load();
    video.play();
}

playlist.addEventListener('click', changeMovie);
// -----end change Movie


// -----fullscreen mode
function toggleFullScreen() {

    if (!document.mozFullScreen && !document.webkitFullScreen) {
        if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else {
            video.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            document.webkitCancelFullScreen();
        }
    }
}
fullScreen.addEventListener("click", function() {
    toggleFullScreen();
}, false);

// -----end fullscreen mode

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('ended', changeEnded);

toggle.addEventListener('click', togglePlay);
stop.addEventListener('click', stopVideo);
skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', () => {
    if(mousedown && scrub(e)) {
    scrub(e);
}
});
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

}();