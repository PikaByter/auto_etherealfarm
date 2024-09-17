# auto_etherealfarm
[etherealfarm](https://github.com/lvandeve/etherealfarm)

## Prerequisites
- Typically, each season requires three layouts for three stages:
  - **Growing**: To unlock the highest berry yield and update trees
  - **Seed**: To collect seeds and update crops
  - **Spore**: To collect spores and update trees
- The production curve is not linear, so we should wait until the main crops are fully grown.
- I define three growth stages:
  - **Growing**: When using the growing layout
  - **TempGrowing**: When using the seed or spore layout, but still waiting for the main crops to be fully grown
  - **GrownUp**: When the main crops are fully grown

## What Can This Repo Do?
- **Auto Activate Weather**
  - If in the TempGrowing stage, skip the check.
  - Check if the sun is available; if yes, activate the sun.
  - Then, check if the mist is available; if yes, activate the mist (skip mist in Seed stage).
  - Finally, check if the rainbow is available; if yes, activate the rainbow.
  - If all are cooling down, default to choosing the sun as the weekly weather.
- **Auto Pick Up Fern**
  - Check every 5 seconds.
- **Auto Refresh Brassica**
  - Refresh every 10 minutes.
- **Automatic Transcension to after reach highest average resin yield**
  - If you are in the Spore stage and fully grown, record the current average resin yield every 10 seconds.
  - If the average yield continues to decrease for 3 minutes, trigger transcension.
- **Auto Change Fruit When Stage Changes**
  - When changing to the Seed stage, auto-action uses seed fruit and seed layout, but you should use growing fruit because it helps reach the highest yield faster. Afterward, switch back to seed fruit.
  - When changing to the Spore stage, you should also use the growing fruit template temporarily.
  - To use this function, arrange your fruits as follows:
    - Growing fruit in fruit storage slot 1, named "growing"
    - Seed fruit in fruit storage slot 2
    - Spore fruit in fruit storage slot 3

## Test
Currently tested only on version 0.14.1 (2024-09-09).

## How to Use It
You can run it in the Chrome console or use it with Tampermonkey.
- Copy the code.
- Paste it into the Chrome console or the Tampermonkey editor.
- Run it!

## TODO
### Features
- [x] Legacy activate weather, such as Seed stages not activating mist.
- [x] When switching to Seed stage, keep the growing speed fruit until the end of the growth phase, then switch back to seed fruit. During this period, do not enable weather. The same applies when switching to Spore.
- [ ] Update default weather auto-selection: During the Seed stage, try two types of weather and choose the one with the highest seed yield. For the other two stages, choose the weather with the highest spore yield.
- [x] Auto-transcension is determined by the average resin yield. When the stage is Spore and the crop is grown up, check every ten seconds. If the yield continues to decrease for 3 minutes, initiate auto-transcension.

### Usability
- [ ] Configure triggers for transcension.
- [ ] Add a page button to configure all frequencies and functions.

### CICD
- [ ] Publish to Tampermonkey.
- [ ] Add CI to auto-publish.