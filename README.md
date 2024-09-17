# auto_etherealfarm
etherealfarm: https://github.com/lvandeve/etherealfarm

## Prerequisites
- normally, every season need 3 layout for 3 stage
    - growing, to unlock the highest berry && update tree
    - seed, to collect seeds && update crops
    - spore, to collect spores && update tree
- the curve of the produce is not linear, so we should wait until main crops fully grown
- I define 3 grow stages:
    - growing, when you're using the growing layout
    - tempgrowing, when you're using the seed or spore layout, but you'er still waiting for the main crops fully grown
    - grownUp, when the  main crops fully grown
## What can this repo do?
- Auto activate weather
    - if you're in tempgrowing stage, skip check
    - check if sun is already, if yes, activate sun
    - then, check if mist is already, if yes, activate mist(when sporesProduceSpeed == 0/s,skip mist)
    - then, check if rainbow is already, if yes, activate rainbow
    - if they are all cooling down, default choose sun as week weather
- Auto pick up fern
    - check per 5s
- Auto refresh brassica
    - refresh per 10m
- Auto transcension at 2h
- Auto change fruit when stage changed
    - When you change stage to seed, auto-action would use seed fruit,seed layout, but you should use growing fruit, because it can help you reach the highest produce faster, and after that, you should change fruit back
    - When you change the stage to spore, you also need to use the growing fruit template temporarily
    - to use this function, you should put your fruit like this
        - growing fruit in fruit storage slot 1, named "growing"
        - seed fruit in fruit storage slot 2
        - spored fruit in fruit storage slot 3

## Test
Currently tested only on version 0.14.1 (2024-09-09)

## How to use it
You can run it in the Chrome console or use it with Tampermonkey.
- copy the code
- paste in Chrome console or Tampermonkey editor
- run!

## TODO
- [ ] config trigger for transcension
- [ ] add page button to configure all the frequencies and functions
- [x] legacy activate weather, such as seed plant would not activate mist
- [x] When switching to seed, keep the growing speed fruit until the end of the growth phase, then switch back to seed fruit. During this period, do not enable weather. The same applies when switching to spore.
- [ ] update default weather auto selection: During the seed stage, try two types of weather and choose the one with the highest seed yield. For the other two stages, choose the weather with the hiteshest spore yield.
- [ ] Auto-transcension is determined by the average resin yield. When the stage is spore and the crop is grown up, check every ten seconds. If the yield continues to decrease for 4 minutes, initiate auto-transcension.
- [ ] publish to Tampermonkey
- [ ] add CI to auto publish