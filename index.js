const API_KEY = "0116c61afa1f783df2f1cbf1b536aacc";

const yourTab = document.querySelector("[your]");
const searchTab = document.querySelector("[search]");
const grantLoc = document.querySelector(".grantloc");
const grantBut = document.querySelector("[permbut]");
const searchCity = document.querySelector("[searchcity]");
const cityName = document.querySelector(".locname");
const countryFlag = document.querySelector(".flag");
const weatherDesc = document.querySelector(".desc1");
const weatherImg = document.querySelector(".weatherimg");
const temp = document.querySelector(".temp");
const windVal = document.querySelector("[windval]");
const cloudVal = document.querySelector("[cloudsval]");
const humidityVal = document.querySelector("[humidityval]");

const searchSection = document.querySelector(".searchbox");
const searchButton = document.querySelector("#qbutton");
const grantSection = document.querySelector(".grantloc");
const userinfo = document.querySelector(".userinfo");
const loadingScreen = document.querySelector(".load");
// console.log(searchCity);

let currentTab = yourTab;
currentTab.classList.add("currTab");

searchTab.addEventListener("click",()=>{
    toggle(searchTab);
})
yourTab.addEventListener("click",()=>{
    toggle(yourTab);
})

checkStoredInfo();

function toggle(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("currTab");
        clickedTab.classList.add("currTab");
        currentTab = clickedTab ;
        if(!searchSection.classList.contains("active")){
            // search tab band hai , to ise kholo
            searchSection.classList.add("active");
            grantLoc.classList.remove("active");
            userinfo.classList.remove("active");
        }
        else{
            searchSection.classList.remove("active");
            searchCity.value="";
            userinfo.classList.remove("active");
            checkStoredInfo();
        }
    }
}

function checkStoredInfo(){
    let coords = sessionStorage.getItem("userCoords");
    if(coords){
        // api call and make usernfo visible
        coords = JSON.parse(coords);
        fetchUsingCoords(coords);
    }
    else{
        grantLoc.classList.add("active");
    }
}
async function fetchUsingCoords(coord){
    const {lat,lon} = coord;
    try{
        grantLoc.classList.remove("active");
        loadingScreen.classList.add("active");
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data =await res.json();
        loadingScreen.classList.remove("active");
        userinfo.classList.add("active");
        renderWeather(data);
    }
    
    catch{
        loadingScreen.classList.remove("active");
        console.log("unable to get location");
    }

}
function renderWeather(data){
    console.log(data?.name);
    cityName.textContent = data?.name;
    countryFlag.src = `https://flagcdn.com/16x12/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.textContent = data?.weather?.[0]?.description;
    weatherImg.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.textContent = ` ${data?.main?.temp}`+" Celsius";;
    windVal.textContent = `${data?.wind?.speed}`+" km/hr";
    cloudVal.textContent =`${data?.clouds?.all}`+" %";
    humidityVal.textContent = `${data?.main?.humidity}`+" %";

    userinfo.classList.add("active");
    // searchSection.classList.add("active");
}

grantBut.addEventListener("click",()=>
{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("your browser doesnot support geolocation")
    }
})

function showPosition(pos){
    const uCoord = {
        lat:pos.coords.latitude,
        lon : pos.coords.longitude,
    }
    sessionStorage.setItem("userCoords", JSON.stringify(uCoord));
    fetchUsingCoords(uCoord);
}
async function fetchCityWeather(){
    const cityName = searchCity.value;
    if(cityName != ""){
        loadingScreen.classList.add("active");
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data =await res.json();
        renderWeather(data);
        loadingScreen.classList.remove("active");

    }
}
searchCity.addEventListener("keypress",(event)=>{
    if(event.key === "Enter"){
        fetchCityWeather();
    }
})