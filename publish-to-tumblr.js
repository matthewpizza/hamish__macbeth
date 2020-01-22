#!/usr/bin/env node

const credentials = require("./credentials.json")
const { readFileSync } = require("fs")
const tumblr = require("tumblr.js").createClient(credentials.tumblr)

const getCaptionFromImage = (image) => {
    const parts = image.split("-")
    return `s${parts[2]} e${parts[3]}`
}

const image = process.argv[2]
const caption = getCaptionFromImage(image)
const data = Buffer.from(readFileSync(image)).toString("base64")

tumblr.createPhotoPost("hamishmacbeth.tumblr.com", {
    caption: caption,
    data64: data,
}, (err, resp) => {
    if (err) {
        return console.error(`Could not upload ${image}`, err)
    }

    console.log(`Uploaded ${image} - ${resp.id}`)
})
