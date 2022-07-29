
import '@popperjs/core'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'
import './css/general-styles.css'
import './css/responsive.css'




window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

const wrapSlider = document.querySelector("#js-wrapSlider");
const widthWrap = wrapSlider.offsetWidth;

let items;
let sliders;
let sliderList = [];

const getSliderList = () => {
    sliders = document.querySelectorAll(".js-slider");
    sliderList = [...sliders];
};
getSliderList();

const slider = document.querySelectorAll(".js-slider")[0];
const sliderWidth = slider.offsetWidth;
const sumIsLargerThanSlider = sliderWidth >= widthWrap + sliderWidth;
const iterationItems = Math.ceil((widthWrap + sliderWidth) / sliderWidth);

if (iterationItems > 1) {
    for (let i = 0; i < iterationItems - 1; i++) {
        const clone = slider.cloneNode(true);
        wrapSlider.appendChild(clone);
    }
    getSliderList();
}

let stateList = sliderList.map((item, i) => {
    let pos = 0;
    let start = false;

    if (i < iterationItems - 1) {
        pos = -widthWrap + sliders[i].offsetWidth * i;
        start = true;
        sliders[i].style.transform = `translate(${pos}px, -50%)`;
    }
    return {
        pos,
        start
    };
});

const translate = () => {
    for (let i = 0; i < sliderList.length; i++) {
        const slider = sliderList[i];
        const sliderWidth = slider.offsetWidth;
        const nextIndex = i != sliderList.length - 1 ? i + 1 : 0;
        let pos;

        if (stateList[i].start) {
            stateList[i].pos -= 1;
            pos = stateList[i].pos;
            slider.style.transform = `translate(${pos}px, -50%)`;
        }

        const isComplete = pos <= -sliderWidth;
        const isOutSeen = pos <= -widthWrap - sliderWidth;

        if (isComplete) {
            stateList[nextIndex].start = true;
        }
        if (isOutSeen) {
            stateList[i].start = false;
            stateList[i].pos = 0;
        }
    }
};

let isPaused = false;
function start() {
    if (!isPaused) {
        translate();
    }
    requestAnimFrame(start);
}

wrapSlider.addEventListener("mouseover", () => {
    isPaused = true;
});
wrapSlider.addEventListener("mouseout", () => {
    isPaused = false;
});
start();


