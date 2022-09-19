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