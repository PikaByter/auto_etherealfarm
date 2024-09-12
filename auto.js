function checkAndActivateWeather() {
    const weatherEffects = document.getElementsByClassName("efWeatherPerma");
    let lastLogTime = 0;
    function loopCheckWeather() {
        const activeEffect = document.getElementsByClassName("efWeatherOn").length > 0;
        if (activeEffect) {
            const currentTime = new Date().getTime();
            if (currentTime - lastLogTime >= 30000) {
                let activeWeatherName= document.getElementsByClassName("efWeatherOn")[0].previousElementSibling.ariaLabel
                let leftTime=document.getElementsByClassName("efWeatherOn")[0].textContent
                console.log(`active ability: ${activeWeatherName}, ${leftTime}`);
                lastLogTime = currentTime;
            }
        } else {
            let oneCoolDown = false;
            for (let i = 0; i < weatherEffects.length; i++) {
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
                console.log('all weather are cooling down, default choose sun ability');
                const weakWeather = Array.from(weatherEffects).filter(effect => 
                    window.getComputedStyle(effect).visibility === 'visible'
                );
                if (weakWeather.some(effect => effect.parentElement.ariaLabel !== 'sun ability')) {
                    weatherEffects[0].click();
                }
            }
        }
        setTimeout(loopCheckWeather, 2000);
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

function autoTranscension() {
    let lastLogTime = 0;
    function loopCheckTranscension() {
        const timeElement = document.getElementsByClassName("efInfo efSeasonBgWinter")[0].childNodes[1];
        const timeStr = timeElement ? timeElement.innerText : "0s";
        const totalSeconds = parseTime(timeStr);
        if (totalSeconds >= 2 * 3600 + 5 * 60) {
            console.log("runtime > 2小时15分钟，auto transcension...");
            executeTranscension();
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

checkAndActivateWeather();
autocClickFern();
autocRefreshBrassica();
autoTranscension();