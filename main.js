import conditions from "./conditions.js";

const apiKey = 'c2b0282e1b734424b00144205231008';

const box = document.querySelector('.box');
const form = document.querySelector('#form');
const input = document.querySelector('.input');
const header = document.querySelector('.header');
const headerLine = document.querySelector('.header-line');


function removeCard(){
    const befCard = document.querySelector('.card');

    if (befCard) {
        befCard.remove();
    }
}


function showError(errorMessage){
    const html = `<div class="card">
                        <div class="card-city"> ${errorMessage}</div>
                    </div>`;

    box.insertAdjacentHTML('afterend', html);
}


async function getWeather(city) {
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}


function showCard (weatherData){

    const html = `<div class="card">
                        <div class="card-city">
                            ${weatherData.name} <span>${weatherData.country}</span>
                        </div>
                        <div class="card-temperature">
                            <img class="image-sun-cloud" src="${weatherData.imgPath}">
                            ${weatherData.temp}
                            <img class="image-sun-cloud-1" src="${weatherData.imgPath}">
                        </div>
                        <div class="weather">
                            ${weatherData.condition}
                        </div>
                    </div>`;

    box.insertAdjacentHTML('afterend', html);
}


function findLanguage(city, data, info) {

    if (/^([А-ЯЁа-яё]+(\s*[-]?\s*[А-ЯЁа-яё]+)*)$/.test(city)) {
        const infoRus = info.languages.find((obj) => obj.lang_name === 'Russian');

        let weatherText = data.current.is_day 
        ? infoRus.day_text
        : infoRus.night_text
        return weatherText
    }   else { 
        return data.current.condition.text
    }
}


function cardColor (data) {

    if (data.current.is_day) {
        if (data.current.condition.text.includes('rain')) {
            headerLine.style.background = 'linear-gradient(180deg, #7D7D7D 38.43%, #FFF 90.92%)';
            header.style.color = '#000';
        } else {
            headerLine.style.background = 'linear-gradient(180deg, #03A9CE 0%, #FFF 91.15%)';
            header.style.color = '#000';
        }
    } else {
        headerLine.style.background = 'linear-gradient(180deg, #012194 40.84%, #C7E7FF 94.73%)';
        header.style.color = '#E1E1E1';
    }
}


function backVideo (data) {
    const video = document.querySelector('.background-video');

    if(video) {
        video.remove();
    }
    if (data.current.is_day) {
        if (data.current.condition.text.includes('rain')) {
            const html = `<video class="background-video" src="/video/rain.mp4" autoplay muted loop></video>`;

            header.insertAdjacentHTML("afterBegin", html);
        } else {
            const html = `<video class="background-video" src="/video/day.mp4" autoplay muted loop></video>`;

            header.insertAdjacentHTML("afterBegin", html);
        }
    } else {
        const html = `<video class="background-video" src="/video/night.mp4" autoplay muted loop></video>`;

        header.insertAdjacentHTML("afterBegin", html);
    }
}


form.onsubmit = async function(event) {

    event.preventDefault(); 

    let city = input.value.trim(); 

    const data = await getWeather(city);

    
    if (data.error) {
        
        removeCard();
        showError(data.error.message);

    } else {

        removeCard();

        const info = conditions.find((obj) => obj.code === data.current.condition.code);
        
        const filePath = './image/' + (data.current.is_day ? 'day' : 'night') + '/';
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName;

        const Condition = findLanguage(city, data, info);
        
        const weatherData = {
            name:data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            condition: Condition,
            imgPath: imgPath
        }

        showCard(weatherData);
        cardColor(data);
        backVideo(data);
        }
}