function checkAndActivateWeather() {
    const weatherEffects = document.getElementsByClassName("efWeatherPerma");
    let lastLogTime = 0;
    function loopCheckWeather() {
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
                console.log(`activating ${activeWeatherName}, ${leftTime}`);
                lastLogTime = currentTime;
            }
        } else {
            let oneCoolDown = false;
            for (let i = 0; i < weatherEffects.length; i++) {
                if (i === 1 && currentStage === GrowingStage.Seed ) {
                    continue;
                }
                const cooldownText = weatherEffects[i].parentElement.nextElementSibling.textContent;
                if (cooldownText === '') {
                    let name=weatherEffects[i].parentElement.ariaLabel
                    console.log(`active ${name} `);
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

function autoTranscension() {
    const CHECK_INTERVAL_MS = 10000;
    const DECLINE_THRESHOLD_MINUTES = 3;
    const DECLINE_THRESHOLD_MS = DECLINE_THRESHOLD_MINUTES * 60 * 1000;
    let resinSpeedHistory = [];
    function loopCheckTranscension() {
        if (currentStage === GrowingStage.Spore && currentGrowStatus === growStatus.grownUp) {
            const resinSpeedStr = document.getElementsByClassName("efInfo")[3].childNodes[3].innerText.substring(0, 6);
            const resinSpeed = parseFloat(resinSpeedStr);
            // console.log(`Current resin speed: ${resinSpeed}`);
            resinSpeedHistory.push(resinSpeed);
            console.log(`Spore Grown up, Current resin speed: ${resinSpeed}`);
            // console.log(`Resin speed history: ${resinSpeedHistory}`);
            if (resinSpeedHistory.length > (DECLINE_THRESHOLD_MS / CHECK_INTERVAL_MS)) {
                resinSpeedHistory.shift();
                // console.log(`Trimmed resin speed history: ${resinSpeedHistory}`);
            }
            const isDeclining = resinSpeedHistory.every((speed, index) => 
                index === 0 || speed < resinSpeedHistory[index - 1]
            );
            // console.log(`Is declining: ${isDeclining}`);
            if (isDeclining && resinSpeedHistory.length >= (DECLINE_THRESHOLD_MS / CHECK_INTERVAL_MS)) {
                console.log(`Resin speed has been declining for ${DECLINE_THRESHOLD_MINUTES} minutes.`);
                console.log(`resin speed history: ${resinSpeedHistory}`);
                console.log(`Executing transcension...`);
                resinSpeedHistory = [];
                executeTranscension();
            }
        }
        setTimeout(loopCheckTranscension, CHECK_INTERVAL_MS);
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

let CropTypes={
    seed: 1,
    spore: 2,
}

const zeroSpeed='0/s';

let currentStage = GrowingStage.Growing;
function autoUpdateCurrentStage() {
    let lastTreeLevel = null;
    function loopCheckCurrentStage() {
        const sporesProduceSpeed = getProduceSpeed(CropTypes.spore);
        switch (currentStage) {
            case GrowingStage.Growing:
                if (sporesProduceSpeed === zeroSpeed) {
                    // Wait for 1 second and check again. If it is still 0, then confirm the transition.
                    setTimeout(() => {
                        if (getProduceSpeed(CropTypes.spore) === zeroSpeed) {
                            currentStage = GrowingStage.Seed;
                        }
                    }, 1000);
                }
                break;
            case GrowingStage.Seed:
                if (sporesProduceSpeed != zeroSpeed) {
                    currentStage = GrowingStage.Spore;
                }
                break;
            case GrowingStage.Spore:
                let treeLevel;
                if (treeLevel === undefined) {
                    treeLevel = document.getElementsByClassName("efInfo")[0]?.childNodes[0]?.innerText || '';
                }
                if (treeLevel.includes('level')) {
                    let currentLevel = parseInt(treeLevel.split(' ')[1]);
                    if (lastTreeLevel === null) {
                        lastTreeLevel = currentLevel;
                    } else {
                        // console.log(`lastTreeLevel: ${lastTreeLevel}, currentLevel: ${currentLevel}`);
                        if (currentLevel < lastTreeLevel) {
                            currentStage = GrowingStage.Growing;
                        } 
                        lastTreeLevel = currentLevel;
                    }
                }
                break;
        }
        setTimeout(loopCheckCurrentStage, 100);
    }
    loopCheckCurrentStage();
}

function getProduceSpeed(type){
    const produceSpeedIndexMap = {
        [CropTypes.seed]: 1,
        [CropTypes.spore]: 2,
    };
    let i= produceSpeedIndexMap[type] || 0;
    return document.getElementsByClassName("efInfo")[i]?.childNodes[2]?.innerText || zeroSpeed;
}

// when change to seed or spore layout, wait for crops to grow
// during this time, the produce speed is so lower then the produce speed of full grown up
// because the curve of the produce speed is not linear
// so we need to speed up the growth speed so we can reach the full grown up earlier
function changeFruitWhenGrowingUp() {
    // check stage per 3s, change fruit when stage change
    function loopCheckStageChange(lastStage) {
        function updateStageAndUseFruit() {
            lastStage = currentStage;
            console.log(`stage change to ${currentStage}, change fruit back to Growing fruit`);
            useGrowingFruit();
        }
        // recover from tempgrowing
        if (currentGrowStatus===growStatus.tempgrowing){
            console.log('recover from tempgrowing');
            updateStageAndUseFruit();
            return;
        }
        if (currentStage == GrowingStage.Seed && lastStage == GrowingStage.Growing){
            console.log('wait for 20s to make sure seed is enough for the new crops');
            setTimeout(() => {updateStageAndUseFruit()}, 20000);
            return;
        }else if (currentStage == GrowingStage.Spore && lastStage == GrowingStage.Seed) {
            updateStageAndUseFruit()
            return;
        }
        setTimeout(() => loopCheckStageChange(lastStage), 3000);
    }

    // use growing fruit
    function useGrowingFruit(){
        chooseFruit(0);
        loopCheckGrowingUp('');
    }
    
    function loopCheckGrowingUp(lastProduceSpeed) {
        let produceSpeed='';
        const stageCropCheckMap = {
            [GrowingStage.Seed]: CropTypes.seed,
            [GrowingStage.Spore]: CropTypes.spore,
        };
        produceSpeed=getProduceSpeed(stageCropCheckMap[currentStage]);
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
        // wait for status to be updated
        // then go back to step 1
        setTimeout(() => loopCheckStageChange(currentStage), 3000);
    }
    // start auto machine
    loopCheckStageChange(GrowingStage.Growing);
}

let growStatus={
    growing: "growing",
    tempgrowing: "tempgrowing",
    grownUp: "grownUp",
}

let currentGrowStatus=growStatus.growing;
function autoUpdateCurrentGrowStatus(){
    function loopCheckCurrentGrowStatus() {
        if (currentStage == GrowingStage.Growing){
            currentGrowStatus=growStatus.growing;
        }else{
            let fruit=document.getElementById("fruit_tab").innerText
            if (fruit.includes('growing')){
                // Wait for 1s to confirm the current status. If stage is still not Growing, then confirm tempgrowing.
                // Without this reconfirmation, when auto-transaction is excuted, fruit would change to growing immediately,
                // but since the state updates every 100ms, currentStage would still be at Spore.
                // Therefore, this would incorrectly assume currentGrowStatus is tempgrowing,
                // whereas it should actually be growing.
                setTimeout(() => {
                    if (currentStage != GrowingStage.Growing) {
                        currentGrowStatus=growStatus.tempgrowing;
                    }
                }, 1000);
            }else{
                currentGrowStatus=growStatus.grownUp;
            }
        }
        setTimeout(loopCheckCurrentGrowStatus, 100);
    }
    loopCheckCurrentGrowStatus();
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
autoUpdateCurrentStage();
autoUpdateCurrentGrowStatus();
changeFruitWhenGrowingUp();