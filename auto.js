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
                console.log(`active ability: ${activeWeatherName}, left time: ${leftTime}`);
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

checkAndActivateWeather();
autocClickFern();
autocRefreshBrassica();