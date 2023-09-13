const apiKey = 'c2b0282e1b734424b00144205231008';

/* Получение названия города (значение из формы)*/

// Элементы на странице

const box = document.querySelector('.box');
const form = document.querySelector('#form');
const input = document.querySelector('.input'); //


// Слушаем отправку формы

form.onsubmit = (event) => {
    
    event.preventDefault(); // Отменяем отправку формы 

    let city = input.value.trim(); // сохраняем знеачение инпута в переменную city
    // trim удаляет пробелы с обоих сторон строки
    console.log(city)

    // Делаем запрос на сервер

    // Адрес запроса
    let url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    // Выполнение запроса
    fetch(url)

        .then(response => {
            return response.json();
    })
        .then((data) => {

            console.log(data);

            // Проверка на ошибку
            if (data.error) {
                // Если присутствует ошибка, то выводим ее 

                const befCard = document.querySelector('.card');

                if (befCard) {
                    befCard.remove();
                }
                
                // Добавляем div с ошибкой 

                const html = `  <div class="card">
                                    <div class="card-city"> ${data.error.message}</div>
                                </div>`;

                // Отображаем ошибку на странице
                box.insertAdjacentHTML('afterend', html);

            } else {
                // Если ее нет, то выводим карточку 

                // Отображаем полученные данные в карточку
            // Удаляем предидущие карточки

            const befCard = document.querySelector('.card');

            if (befCard) {
                befCard.remove();
            }
           

            // Разметка для карточки

            const html = `<div class="card">

                                <div class="card-city">
                                    ${data.location.name} <span>${data.location.country}</span>
                                </div>
                                <div class="card-temperature">   
                                    <img class="image-sun-cloud" src="./image/sun-cloud-left.png">
                                    ${data.current.temp_c}
                                    <img class="image-sun-cloud" src="./image/sun-cloud-right.png">
                                </div>
                                <div class="weather">
                                    ${data.current.condition.text} 
                                </div>
                            </div>`;

            

            // Отображаем карточку на странице
            
            box.insertAdjacentHTML('afterend', html);

            }
    })
}