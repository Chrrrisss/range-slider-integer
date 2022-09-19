(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = create_sample

const sheet = new CSSStyleSheet
const theme = fetch_theme()
sheet.replaceSync(theme)

function create_sample (opts, notify) {
    debugger
    const { min = 0, max= 1000 } = opts
    const el = document.createElement("div")
    const shadow = el.attachShadow({ mode: "closed" })
    
    const input = document.createElement("input")
    input.type = "number"
    input.min = min
    input.max = max
    input.onkeyup = (e) => handle_onkeyup(e, input, min, max)
    input.onmouseleave = (e) => handle_onmouseleave_and_blur(e, input, min)
    input.onblur = (e) => handle_onmouseleave_and_blur(e, input, min)
    shadow.append(input)

    shadow.adoptedStyleSheets = [sheet]
    return el

    // handlers
    function handle_onkeyup (e, input, min, max) {
        const val = Number(e.target.value)
    
        const val_len = val.toString().length
        const min_len = min.toString().length
    
        if (val > max) input.value = ""
        else if (val_len === min_len && val < min) input.value = ""
    
        notify({ type: "update", body: val })
    }
    
    function handle_onmouseleave_and_blur (e, input, min) {
        const val = Number(e.target.value)
        if (val < min) input.value = ""
    }
}

function fetch_theme () {
    return `
    :host {
        --b: 0, 0%;
        --color-white: var(--b), 100%;
        --color-black: var(--b), 0%;
        --color-grey: var(--b), 85%;
        --bg-color: var(--color-grey);
        --shadow-xy: 0 0;
        --shadow-blur: 8px;
        --shadow-color: var(--color-white);
        --shadow-opacity: 0;
        --shadow-opacity-focus: 0.65;
    }
    input {
        text-align: left;
        align-items: center;
        font-size: 1.4rem;
        font-weight: 300;
        color: hsla(var(--color-black), 1);
        padding: 8px 12px;
        box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color),var(--shadow-opacity));
        transition: font-size .3s, color .3s, background-color .3s, box-shadow .3s ease-in-out;
        outline: none;
        border: 1px solid hsla(var(--bg-color), 1);
        border-radius: 8px;
        border: 1px solid grey;
        border-radius: 4px;
    }
    input:focus {
        --shadow-color: var(--color-black);
        --shadow-opacity: var(--shadow-opacity-focus);
        --shadow-xy: 4px 4px;
        box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(  var(--shadow-color), var(--shadow-opacity));
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-apperance: none;
    }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    `
}


},{}],2:[function(require,module,exports){
const range_slider_integer = require("..")

const opts = { min: 0, max: 10 }
const rsi = range_slider_integer(opts)

document.body.append(rsi)


},{"..":4}],3:[function(require,module,exports){
module.exports = range_slider

function range_slider (opt) {
    const { min = 0, max = 100 } = opt
    const el = document.createElement("div")
    el.classList.add("container")
    const shadow = el.attachShadow({ mode: "closed" })
    
    const input = document.createElement("input")
    input.type = "range"
    input.min = min
    input.max = max
    input.value = min 

    input.oninput = handle_input

    const bar = document.createElement("div")
    bar.classList.add("bar")

    const ruler = document.createElement("div")
    ruler.classList.add("ruler")

    const fill = document.createElement("div")
    fill.classList.add("fill")

    bar.append(ruler, fill)

    const style = document.createElement("style")
    style.textContent = get_theme()

    shadow.append(style, input, bar)
    return el

    // handler
    function handle_input (e) {
        const val = Number(e.target.value)
        fill.style.width = `${(val/max)*100}%`
    }
}


function get_theme () {
    return `
    :host { box-sizing: border-box; }
    *, *:before, *:after { box-sizing: inherit; }
    :host {
        --white         :hsla(0,0%,100%,1);
        --transparent   :hsla(0,0%,0%,0);
        --grey          :hsla(0,0%,90%,1);
        --blue          :hsla(207, 88%, 66%, 1);
        position: relative;
        width: 100%;
        height: 16px;
    }
    input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        -webkit-appearance: none;
        outline: none;
        margin: 0;
        z-index: 2;
        background-color: var(--transparent);
    }
    .bar {
        position: absolute;
        top: 3px;
        left: 0;
        z-index: 0;
        height: 10px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        background-color: var(--grey);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .ruler {
        position: absolute;
        height: 6px;
        width: 100%;
        transform: scale(-1, 1);
        background-size: 20px 8px;
        background-image: repeating-linear-gradient(to right,
            var(--grey) 0px,
            var(--grey) 17px,
            var(--white) 17px,
            var(--white) 20px
        );
    }
    .fill {
        position: absolute;
        height: 100%;
        width: 0%;
        background-color: var(--grey);
    }
    input:focus + .bar .fill,
    input:focus-within + .bar .fill,
    input:active + .bar .fill {
        background-color: var(--blue);
    }
    input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--white);
        border: 1px solid var(--grey);
        cursor: pointer;
        box-shadow: 0 3px 6px rgba(0, 0, .4);
        transition: background-color .3s, box-shadow .15s linear;
    }
    input::-webkit-slider-thumb:hover {
        box-shadow: 0 0 0 14px rgba(94, 176, 245, .8);
    }
    input::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--white);
        border: 1px solid var(--grey);
        cursor: pointer;
        box-shadow: 0 3px 6px rgba(0, 0, .4);
        transition: background-color .3s, box-shadow .15s linear;
    }
    input::-moz-range-thumb:hover {
        box-shadow: 0 0 0 14px rgba(94, 176, 245, .8);
    }
    `
}
},{}],4:[function(require,module,exports){
const range = require("range-slider-213")
const integer = require("create-sample-11")

module.exports = range_slider_integer

function range_slider_integer (opts) {
    const el = document.createElement("div")
    const shadow = el.attachShadow({ mode: "closed" })
    
    const range_slider = range(opts, listen)
    const create_sample = integer(opts, listen)

    const output = document.createElement("div")
    output.innerText = 0

    shadow.append(range_slider, create_sample, output)

    return el

    function listen (message) {
        const { type, body } = message
        if (type === "update") output.innerText = body 
    }
}
},{"create-sample-11":1,"range-slider-213":3}]},{},[2]);
