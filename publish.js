#!/usr/bin/env node

const credentials = require("./credentials.json")
const { readFileSync } = require("fs")
const tumblr = require("tumblr.js").createClient(credentials.tumblr)
const twitter = new require("twit")(credentials.twitter)

const getCaptionFromImage = (image) => {
    const parts = image.split("-")
    return `S${parts[2]}E${parts[3]}`
}

const image = process.argv[2]
const caption = getCaptionFromImage(image)
const data = Buffer.from(readFileSync(`${__dirname}/${image}`)).toString("base64")

twitter.post("media/upload", { media_data: data }, (err, data, resp) => {
    if (err) {
        return console.error(`Twitter: Could not upload ${image}`, err)
    }

    const mediaId = data.media_id_string;

    twitter.post("media/metadata/create", {
        media_id: mediaId,
        alt_text: { text: caption }
    }, (err, data, resp) => {
        if (err) {
            return console.error(`Twitter: Could not upload ${image}`, err)
        }

        twitter.post("statuses/update", {
            status: caption,
            media_ids: [ mediaId ],
        }, (err, data, resp) => {
            if (err) {
                return console.error(`Twitter: Could not upload ${image}`, err)
            }

            console.log(`Twitter: Uploaded ${image} - ${data.id}`)
        })
    })
})

tumblr.createPhotoPost("hamishmacbeth.tumblr.com", {
    caption: caption,
    data64: data,
}, (err, resp) => {
    if (err) {
        return console.error(`Tumblr: Could not upload ${image}`, err)
    }

    console.log(`Tumblr: Uploaded ${image} - ${resp.id}`)
})
