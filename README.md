# auto_etherealfarm
etherealfarm: https://github.com/lvandeve/etherealfarm

## What can this repo do?
- Auto activate weather
    - check if sun is already, if yes, activate sun
    - then, check if mist is already, if yes, activate mist(when sporesProduceSpeed == 0/s,skip mist)
    - then, check if rainbow is already, if yes, activate rainbow
    - if they are all cooling down, default choose sun as week weather
- Auto pick up fern
    - check per 5s
- Auto refresh brassica
    - refresh per 10m
- Auto transcension at 2h


## Test
Currently tested only on version 0.14.1 (2024-09-09)

## How to use it
You can run it in the Chrome console or use it with Tampermonkey.

## TODO
- [ ] config trigger for transcension
- [ ] add button to configure all the frequencies
- [x] legacy activate weather, such as seed plant would not activate mist