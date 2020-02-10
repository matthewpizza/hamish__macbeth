#!/usr/bin/env node

const { readdirSync } = require("fs")
const { execSync } = require("child_process")

// Pizza Party
const corpus = "Hamish Macbeth"

// pizza-party
const sanitizedCorpus = corpus.toLowerCase().replace(" ", "-")

const allEpisodes = readdirSync(`${__dirname}/${corpus}`)

// 01. Hamish Macbeth-A Perfectly Simple Explanation-S2.avi
const randomEpisode = allEpisodes[Math.floor(Math.random() * allEpisodes.length)]

// 01
const episodeNumber = randomEpisode.substring(0, 2).padStart(2, "0")

// 02
const seasonNumber = randomEpisode.slice(-5, -4).padStart(2, "0")

const inputFilename = `${__dirname}/${corpus}/${randomEpisode}`

// Vaguely the opening/closing credits duration
const firstFrame = 45
const closingCreditsDuration = 60

// Get duration in seconds
// https://stackoverflow.com/a/19013823
const videoDuration = parseInt(execSync(`
    ffmpeg -i "${inputFilename}" 2>&1 | \
    awk '/Duration/ {
        split($2, ts, ":");
        print (ts[1] * 3600) + (ts[2] * 60) + ts[3]
    }'
`).toString("utf8"), 10)

const lastFrame = videoDuration - closingCreditsDuration
const randomFrame = (Math.floor(Math.random() * (lastFrame - firstFrame + 1)) + firstFrame).toString().padStart(4, "0")
const outputFilename = `${sanitizedCorpus}-${seasonNumber}-${episodeNumber}-${randomFrame}.jpg`

console.log(inputFilename)
console.log(outputFilename)

execSync(`ffmpeg \
    -i "${inputFilename}" \
    -ss ${randomFrame} \
    -vframes 1 \
    -loglevel quiet \
    "${__dirname}/${outputFilename}"
`)

execSync(`node ${__dirname}/publish.js ${outputFilename}`)
