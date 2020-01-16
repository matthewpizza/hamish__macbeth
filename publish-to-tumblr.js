#!/usr/bin/env node

const credentials = require("./credentials.json")
const tumblr = require("tumblr.js").createClient(credentials.tumblr)

const getCaptionFromImage = (image) => {
    const parts = image.split("-")
    return `s${parts[2]} e${parts[3]}`
}

const image = process.argv[2]
const caption = getCaptionFromImage(image)

tumblr.createPhotoPost("hamish-macbeth", {
    caption: caption,
    data: image,
}, (err, resp) => {
    if (err) {
        return console.error(`Could not upload ${image}`, err)
    }

    console.log(`Uploaded ${image} - ${resp.id}`)
})
