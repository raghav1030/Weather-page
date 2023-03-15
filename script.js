// console.log("Hello Jee");

// const API_KEY = 'af03a09957931637d1b7e7a34baa6efd';

// async function featchWeatherDetails (){

//     // let lat = 15.3333;
//     // let long = 74.0833;

//     try{

//         let city = 'delhi';
        
//         const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` );
//     let data = await response.json();

//     console.log("Weather data => " , data);
    
    

//     // Show Data on UI
//     renderWeatherInfo(data);
// }

// catch (error){
//     console.log("Error in fetching API Request");
// }
// }

// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
    
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C `;
    
//     document.body.appendChild(newPara);
// }

// async function getCustomWeatherDetails(){

// try{
//     let lat = 28.6246;
//     let long = 77.2987;

//     const result =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric` );
//     let data = await result.json();

//     console.log("Custom Weather Details => " , data);

//     renderWeatherInfo(data);
// }
// catch(error){
//     console.log("Error Found" , error);
// }
// }



const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const searchInput = document.querySelector('[data-searchInput]');
const  grantAccessContainer = document.querySelector('.grant-location-container');
const grantAccessButton = document.querySelector('[data-grantAccess]');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');


// variables

let currentTab = userTab;

const API_KEY = '730f090ace12567ff185ff240095513d';

currentTab.classList.add('current-tab');

getFromSessionStorage();    

// grantAccessContainer.classList.add('active');

// function for switching tabs

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');

        if(!searchForm.classList.contains('active')){
            grantAccessContainer.classList.remove('active');
            // userTab.classList.remove('active');
            userInfoContainer.classList.remove('active');
            searchForm.classList.add('active');
        }

        else{
            
            // grantAccessContainer.classList.rem('active');
            userInfoContainer.classList.remove('active');
            searchForm.classList.remove('active');

            getFromSessionStorage();    
        }

    }
}

userTab.addEventListener('click' ,()=>{
    //you clicked on userTab so current tab will switch to user tab 
    switchTab(userTab);

});

searchTab.addEventListener('click' ,()=>{
    //you clicked on userTab so current tab will switch to user tab 
    switchTab(searchTab);


});




// Function for storing coordinates to show user weather


function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');

    if(!localCoordinates){
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// fetch user weather data

async function fetchUserWeatherInfo(coordinates){
    const {lat , long} = coordinates;
    // make grantContainer invisible

    grantAccessContainer.classList.remove('active');

    loadingScreen.classList.add('active')

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove('active');

        userInfoContainer.classList.add('active');

        renderWeatherInfo(data);
    }

    catch(error){
        loadingScreen.classList.remove('active');
        console.log('Error Found' , error);
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch all the variables to store data in them and then show on the UI

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from API to the variables

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%` ; 

}


// get user coordinates

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
        alert('Location grant failed as the browser may not support this function')
    }
};

function showPosition(position){
    
    const userCoordinate = {
        lat : position.coords.latitude,
        long : position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates' , JSON.stringify(userCoordinate));
    fetchUserWeatherInfo(userCoordinate);
}


grantAccessButton.addEventListener('click' , getLocation);

searchForm.addEventListener('submit' , (e)=>{
    e.preventDefault();

    let city = searchInput.value;

    if(city === "") return;

    else{
        fetchWeatherinfoCity(city);
    }

})



//get weather data for searched city

async function fetchWeatherinfoCity(city){
    
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    
    try{
        userInfoContainer.classList.remove('active');
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');  
        renderWeatherInfo(data);
    }

    catch(error){
        loadingScreen.classList.remove('active');
        console.log('Error in loading the city' , error );
    }
}





