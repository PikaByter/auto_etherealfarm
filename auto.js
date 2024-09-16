function checkAndActivateWeather() {
    const weatherEffects = document.getElementsByClassName("efWeatherPerma");
    let lastLogTime = 0;
    function loopCheckWeather() {
        updateCurrentGrowingStatus();
        // tempGrowing do not active weather
        if (currentGrowStatus===growStatus.grownUp || currentGrowStatus==growStatus.growing){
            doWeathercheak();
        }else{
            const currentTime = new Date().getTime();
            if (currentTime - lastLogTime >= 20000){
                lastLogTime = currentTime;
                console.log(`currentGrowStatus is ${currentGrowStatus} skip weather check`);
            }
        }
        setTimeout(loopCheckWeather, 2000);
    }

    function doWeathercheak(){
        const activeEffect = document.getElementsByClassName("efWeatherOn").length > 0;
        if (activeEffect) {
            const currentTime = new Date().getTime();
            if (currentTime - lastLogTime >= 30000) {
                let activeWeatherName= document.getElementsByClassName("efWeatherOn")[0].previousElementSibling.ariaLabel
                let leftTime=document.getElementsByClassName("efWeatherOn")[0].textContent
                console.log(`activeing ability: ${activeWeatherName}, ${leftTime}`);
                lastLogTime = currentTime;
            }
        } else {
            let oneCoolDown = false;
            updateCurrentStage();
            for (let i = 0; i < weatherEffects.length; i++) {
                if (i === 1 && currentStage === GrowingStage.Seed ) {
                    console.log('seed stage, skip mist');
                    continue;
                }
                const cooldownText = weatherEffects[i].parentElement.nextElementSibling.textContent;
                if (cooldownText === '') {
                    let name=weatherEffects[i].parentElement.ariaLabel
                    console.log(`actice ${name} `);
                    weatherEffects[i].click();
                    oneCoolDown = true;
                    break;
                }
            }
            if (!oneCoolDown) {
                const currentTime = new Date().getTime();
                if (currentTime - lastLogTime >= 20000){
                    console.log('all weather are cooling down, default choose sun ability');
                }
                const weakWeather = Array.from(weatherEffects).filter(effect => 
                    window.getComputedStyle(effect).visibility === 'visible'
                );
                if (weakWeather.some(effect => effect.parentElement.ariaLabel !== 'sun ability')) {
                    weatherEffects[0].click();
                }
            }
        }
    }
    loopCheckWeather();
}

function autocClickFern() {
    function loopCheckFern() {
        const divs = document.querySelector('div[aria-label="basic field"]').getElementsByTagName('div');
        for (let i = 0; i < divs.length; i++) {
            const div = divs[i];
            if (div.getAttribute('aria-label') && div.getAttribute('aria-label').includes('fern.')) {
                div.click();
                console.log('pick up Fern');
                break;
            }
        }
        setTimeout(loopCheckFern, 5000);
    }
    loopCheckFern();
}

function autocRefreshBrassica() {
    function loopRefresh() {
        document.querySelector('div[aria-label="refresh brassica"]').click()
        console.log('refresh brassica');
        setTimeout(loopRefresh, 600000);
    }
    loopRefresh();
}

function parseTime(timeStr) {
    let totalSeconds = 0;
    const timeParts = timeStr.match(/(\d+)([hms])/g);
    if (timeParts) {
        for (const part of timeParts) {
            const match = part.match(/(\d+)([hms])/);
            if (match) {
                const [_, num, unit] = match;
                switch (unit) {
                    case 'h': totalSeconds += parseInt(num) * 3600; break;
                    case 'm': totalSeconds += parseInt(num) * 60; break;
                    case 's': totalSeconds += parseInt(num); break;
                }
            }
        }
    }
    return totalSeconds;
}

function findAndClickTreeLevel() {
    const pixelatedElements = document.getElementsByTagName('div');
    for (let i = 0; i < pixelatedElements.length; i++) {
        const element = pixelatedElements[i];
        if (element.getAttribute('aria-label') && element.getAttribute('aria-label').includes('tree level')) {
            element.click();
            console.log('click tree level');
            break;
        }
    }
}

function showTranscensionDialog() {
    const transcensionDialog = document.querySelector('div[aria-description="Show the transcension dialog"]');
    if (transcensionDialog) {
        transcensionDialog.click();
        console.log('click transcension dialog');
    }
}

function clickTranscensionButton() {
    const transcensionButton = document.querySelector('div[aria-label="regular run (dialog button)"]');
    if (transcensionButton) {
        transcensionButton.click();
        console.log('excute transcension');
    }
}

function executeTranscension() {
    findAndClickTreeLevel();
    showTranscensionDialog();
    clickTranscensionButton();

}

// reset all state machines after transcension
function resetAllStatus() {
    currentStage = GrowingStage.Growing;
    currentGrowStatus=growStatus.growing;
    lastStage=GrowingStage.Growing;
}

function autoTranscension() {
    let lastLogTime = 0;
    function loopCheckTranscension() {
        const timeElement = document.getElementsByClassName("efInfo")[0].childNodes[1]
        const timeStr = timeElement ? timeElement.innerText : "0s";
        const totalSeconds = parseTime(timeStr);
        if (totalSeconds >= 2 * 3600) {
            console.log("runtime > 2h, auto transcension...");
            executeTranscension();
            resetAllStatus();
        } else {
            const currentTime = new Date().getTime();
            if (currentTime - lastLogTime >= 600000) {
                console.log(`current runtime: ${timeStr}, runtime > 2h5m will autotranscension`);
                lastLogTime = currentTime;
            }
        }
        setTimeout(loopCheckTranscension, 60000);
    }
    loopCheckTranscension();
}

// The process consists of 3 stages: growth, seed, and spore. 
// Except for the seed stage, the other two stages produce spores.
// The initial stage is growth, followed by seed, and finally spore.
let GrowingStage = {
    Growing: "Growing",
    Seed: "Seed",
    Spore: "Spore",
}
let currentStage = GrowingStage.Growing;

let CropTypes={
    seed: 1,
    spore: 2,
}
const produceSpeedIndexMap = {
    [CropTypes.seed]: 1,
    [CropTypes.spore]: 2,
};

const zeroSpeed='0/s';

function updateCurrentStage() {
    const sporesProduceSpeed = getProduceSpeed(CropTypes.spore);
    switch (currentStage) {
        case GrowingStage.Growing:
            if (sporesProduceSpeed === zeroSpeed) {
                currentStage = GrowingStage.Seed;
            }
            break;
        case GrowingStage.Seed:
            if (sporesProduceSpeed != zeroSpeed) {
                currentStage = GrowingStage.Spore;
            }
            break;
        case GrowingStage.Spore:
            break;
    }
    return currentStage;
}

function getProduceSpeed(type){
    let i= produceSpeedIndexMap[type] || 0;
    return document.getElementsByClassName("efInfo")[i]?.childNodes[2]?.innerText || zeroSpeed;
}

// when change to seed or spore layout, wait for crops to grow
// during this time, the produce speed is so lower then the produce speed of full grown up
// because the curve of the produce speed is not linear
// so we need to speed up the growth speed so we can reach the full grown up earlier
let lastStage = GrowingStage.Growing;
function changeFruitWhenGrowingUp() {
    // check stage per 3s, change fruit when stage change
    function loopCheckStageChange() {
        updateCurrentStage();
        if ( currentStage!= lastStage) {
            lastStage = currentStage;
            console.log(`stage change to ${currentStage}, change fruit back to Growing fruit`)
            useGrowingFruit();
            return;
        }
        setTimeout(loopCheckStageChange, 3000);
    }

    // use growing fruit
    function useGrowingFruit(){
        chooseFruit(0);
        loopCheckGrowingUp('');
    }
    
    function loopCheckGrowingUp(lastProduceSpeed) {
        let produceSpeed='';
        let checkCrop='';
        switch (currentStage) {
            case GrowingStage.Seed:
                checkCrop=CropTypes.seed;
                break;
            case GrowingStage.Spore:
                checkCrop=CropTypes.spore;
                break;
        }
        produceSpeed=getProduceSpeed(checkCrop);
        if (lastProduceSpeed.length===0){
            lastProduceSpeed=produceSpeed;
        }else{
            // chcek if produce speed is almost the same as last time
            if (produceSpeed.substring(0,5) == lastProduceSpeed.substring(0,5)){
                console.log(`fully grown up, change fruit back`);
                // console.log(`last produce speed: ${lastProduceSpeed}, current produce speed: ${produceSpeed}`)
                useFruitBack();
                return;
            }else{
                // console.log(`last produce speed: ${lastProduceSpeed}, current produce speed: ${produceSpeed}`)
                lastProduceSpeed=produceSpeed;
            }
        }
        setTimeout(() => loopCheckGrowingUp(lastProduceSpeed), 3000);
    }

    function useFruitBack(){
        switch (currentStage) {
            case GrowingStage.Seed:
                chooseFruit(1);
                break;
            case GrowingStage.Spore:
                chooseFruit(2);
                break;
        }
        // back to step 1
        loopCheckStageChange();
    }
    // start auto machine
    loopCheckStageChange();
}

let growStatus={
    growing: "growing",
    tempgrowing: "tempgrowing",
    grownUp: "grownUp",
}

let currentGrowStatus=growStatus.growing;
function updateCurrentGrowingStatus(){
    updateCurrentStage()
    if (currentStage == GrowingStage.Growing){
        currentGrowStatus=growStatus.growing;
    }else{
        let fruit=document.getElementById("fruit_tab").innerText
        if (fruit.includes('growing')){
            currentGrowStatus=growStatus.tempgrowing;
        }else{
            currentGrowStatus=growStatus.grownUp;
        }
    }
}

function chooseFruit(fruitID) {
    let allDiv = document.getElementsByTagName("div");
    for (let i = 0; i < allDiv.length; i++) {
        if (allDiv[i] && allDiv[i].hasAttribute('aria-label')) {
            let ariaLabel = allDiv[i].getAttribute('aria-label');
            if (ariaLabel.includes(`activate fruit ${fruitID}:`)) {
                console.log(`${ariaLabel}`);
                allDiv[i].click();
                break;
            }
        }
    }
}

checkAndActivateWeather();
autocClickFern();
autocRefreshBrassica();
autoTranscension();
changeFruitWhenGrowingUp();