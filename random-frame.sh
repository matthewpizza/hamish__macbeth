#!/usr/bin/env bash

pushd `dirname $0` > /dev/null
    __dirname=`pwd`
popd > /dev/null

# Pizza Party
corpus="Hamish Macbeth"
# pizza party
downstairs_corpus=$(tr "[:upper:]" "[:lower:]" <<< $corpus)
# pizza-party
sanitized_corpus=${downstairs_corpus// /-}

# 01. Hamish Macbeth-A Perfectly Simple Explanation-S2.avi
random_episode=$(ls "$__dirname/$corpus" | shuf -n 1)
# 01
episode_number=$(printf %02d ${random_episode:0:2})
# 02
season_number=$(printf %02d ${random_episode:(-5):1})

input_filename="$__dirname/$corpus/$random_episode"

# Vaguely the opening/closing credits duration
first_frame=45
closing_credits_duration=60

# Get duration in seconds
# https://stackoverflow.com/a/19013823
video_duration=$(
    ffmpeg -i "$input_filename" 2>&1 | \
    awk '/Duration/ {
        split($2, ts, ":");
        print (ts[1] * 3600) + (ts[2] * 60) + ts[3]
    }'
)

# No floating point numbers please
# https://unix.stackexchange.com/a/89843
last_frame=$((${video_duration%.*} - $closing_credits_duration))

# Random frame between two numbers
# https://stackoverflow.com/a/8988890
random_frame=$((($RANDOM % $last_frame) + $first_frame))
padded_frame=$(printf %04d $random_frame)

output_filename="$sanitized_corpus-$season_number-$episode_number-$padded_frame.jpg"

echo $input_filename
echo $output_filename

ffmpeg \
    -i "$input_filename" \
    -ss $random_frame \
    -vframes 1 \
    -loglevel quiet \
    "$__dirname/$output_filename"

node $__dirname/publish.js $output_filename
