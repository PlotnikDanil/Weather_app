const apiKey = 'c2b0282e1b734424b00144205231008';

// Элементы на странице

const box = document.querySelector('.box');
const form = document.querySelector('#form');
const input = document.querySelector('.input'); 

// Удаление карточки
function removeCard(){
    const befCard = document.querySelector('.card');

    if (befCard) {
        befCard.remove();
    }
}

// Выведение ошибки
function showError(errorMessage){
    const html = `<div class="card">
                        <div class="card-city"> ${errorMessage}</div>
                    </div>`;

    // Отображаем ошибку на странице
    box.insertAdjacentHTML('afterend', html);
}

// Получение данных содержащий погоду введеном городе
async function getWeather(city) {
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    return data;
}

// Отображение карточки города
function showCard (weatherData){

    const html = `<div class="card">
                        <div class="card-city">
                            ${weatherData.name} <span>${weatherData.country}</span>
                        </div>
                        <div class="card-temperature">   
                            <img class="image-sun-cloud" src="./image/sun-cloud-left.png">
                            ${weatherData.temp}
                            <img class="image-sun-cloud" src="./image/sun-cloud-right.png">
                        </div>
                        <div class="weather">
                            ${weatherData.condition} 
                        </div>
                    </div>`;

    // Отображаем карточку на странице             
    box.insertAdjacentHTML('afterend', html);
}



// Слушаем отправку формы

form.onsubmit = async function(event) {
    
    event.preventDefault(); // Отменяем отправку формы 

    let city = input.value.trim(); // сохраняем значение инпута в переменную city
    // trim удаляет пробелы с обоих сторон строки

    // Получаем данные с сервера 
    const data = await getWeather(city);

    // Выполнение запроса

    // Проверка на ошибку
    if (data.error) {
        // Если присутствует ошибка, то выводим ее 

        // Удаляем предидущие карточки
        removeCard();
        showError(data.error.message);

    } else {
        // Если ее нет, то выводим карточку 

        // Удаляем предидущие карточки
        removeCard();

        const weatherData = {
            name:data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            condition: data.current.condition.text
        }
           
        // Разметка для карточки

        showCard(weatherData);
        }
}