const baseURL = 'https://api.airvisual.com/v2/';
const APIkey = 'key=87fcffe3-9593-41f1-88fc-2bc3c6b89fe2';

const indyData = baseURL+"city?city=Indianapolis&state=Indiana&country=USA&"+APIkey;
const nearestCityToUser = baseURL+'nearest_city?'+APIkey;

const counrtyOption = document.querySelector('#selectCountry');
const stateOption = document.querySelector('#selectState');
const cityOption = document.querySelector('#selectCity');
const ShowIndyData = document.querySelector('select');
const cityToUser = document.querySelector('select');

const titleData = document.querySelector('.title');
const aqiData = document.querySelector('.aqi');
const currentAqi = document.querySelector('.aqi');
const weatherIcon = document.querySelector('.icon');
const patternData = document.querySelector('.patt');
const tempData = document.querySelector('.temp');
const humidData = document.querySelector('.humid');
const speedData = document.querySelector('.speed');
const directData = document.querySelector('.direct');

let blob;
const formdata = new FormData();
const requestOptions = {
  method: 'GET',
  body: formdata,
  redirect: 'follow'
};

async function catchCountries() {
  const response = await fetch(baseURL+'countries?'+APIkey);
  blob = await response.json();
  console.log(blob.data)
  document.querySelector('#countryform').style.display = 'block';

  for (let i=0; i<blob.data.length; i++) {
    const countries = blob.data[i].country;
    const countryLI = document.createElement('option');
    countryLI.innerText = countries;
    counrtyOption.appendChild(countryLI);
  }
}
catchCountries();

async function catchStates() {
  const response = await fetch(baseURL+`states?country=`+counrtyOption.value+`&`+APIkey);
  blob = await response.json(); 
  console.log(blob.data[8]);
  console.log(blob.data.length);
  document.querySelector('#stateForm').style.display = 'block';

  for (let i=0; i<blob.data.length; i++) {
    const states = blob.data[i].state;
    const stateLI = document.createElement('option');
    stateLI.innerText = states;
    stateOption.appendChild(stateLI);
  }
}

async function catchCities() {
  const response = await fetch(baseURL+`cities?state=`+stateOption.value+`&country=`+counrtyOption.value+`&`+APIkey);
  blob = await response.json();
  console.log(blob.data[0]);
  console.log(blob.data.length);
  document.querySelector('#cityForm').style.display = 'block';

  for (let i=0; i<blob.data.length; i++) {
    const cities = blob.data[i].city;
    const cityLI = document.createElement('option');
    cityLI.innerText = cities;
    cityOption.appendChild(cityLI);
  }
} 

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  const latitude = position.coords.latitude; //39.8852095999996 for example
  const longitude = position.coords.longitude; //-86.1274112 for example
  const gpsAddress = baseURL+"nearest_city?lat="+latitude+"&lon="+longitude+"&"+APIkey;
  async function catchAPIAgain() {
    const responseGPS = await fetch(gpsAddress);
    blob = await responseGPS.json();
    console.log(blob); 

    const title = blob.data.city+", "+blob.data.country;
    const showTitle = document.createElement('h1');
    showTitle.innerText = title;
    titleData.appendChild(showTitle);

    showData();
  }
  catchAPIAgain();
}

async function catchFormData() {
  const response = await fetch(baseURL+`city?city=`+cityOption.value+`&state=`+stateOption.value+`&country=`+counrtyOption.value+`&`+APIkey);
  blob = await response.json();
  console.log(blob.data);
  // console.log(blob.data.current.weather.wd)
  const title = cityOption.value+', '+stateOption.value+', '+counrtyOption.value;
  const showTitle = document.createElement('h1');
  showTitle.innerText = title;
  titleData.appendChild(showTitle);
  showData();
}

function showData() {
  document.querySelector('.aqi').style.display = 'block';
  document.querySelector('.key').style.display = 'block';
  document.querySelector('.patt').style.display = 'block';
  document.querySelector('.temp').style.display = 'block';
  document.querySelector('.humid').style.display = 'block';
  document.querySelector('.speed').style.display = 'block';
  document.querySelector('.direct').style.display = 'block';

  const icon = blob.data.current.weather.ic;
  const showIcon = document.createElement('img');
  showIcon.src = "assets/"+icon+".jpg";
  weatherIcon.appendChild(showIcon);

  const aqius = blob.data.current.pollution.aqius;
  const showAqi = document.createElement('h2');
  showAqi.innerText = "Current AQI index: "+aqius;
  aqiData.appendChild(showAqi);

  if (aqius<51) {
    aqiData.style.backgroundColor = '#048040';
  } else if (aqius<101) {
    aqiData.style.backgroundColor = '#f7f722';
  } else if (aqius<151) {
    aqiData.style.backgroundColor = '#ffa101';
  } else if (aqius<201) {
    aqiData.style.backgroundColor = '#f21137';
  } else if (aqius<301) {
    aqiData.style.backgroundColor = '#9f496e';
  } else {
    aqiData.style.backgroundColor = '#68020f';
  }

  const pattern = blob.data.current.weather.ic;
  const patternBlock = 
    pattern == '01d' ? 'Sunny' 
    : pattern == '01n' ? 'Clear sky' 
    : pattern == '02d' ? 'Few clouds' 
    : pattern == '02n' ? 'Few clouds' 
    : pattern == '03d' ? 'Scattered clouds' 
    : pattern == '03n' ? 'Scattered clouds'
    : pattern == '04d' ? 'Broken clouds' 
    : pattern == '04n' ? 'Broken clouds'
    : pattern == '09d' ? 'Shower rain' 
    : pattern == '10d' ? 'Rain' 
    : pattern == '10n' ? 'Rain' 
    : pattern == '11d' ? 'Thunderstorm' 
    : pattern == '13d' ? 'Snow' 
    : pattern == '50d' ? 'Mist' 
    : 'Mist';
  const showPattern = document.createElement('h4');
  showPattern.innerText = "Current weather pattern: "+patternBlock;
  patternData.appendChild(showPattern);

  const temp = blob.data.current.weather.tp;
  const tempF = temp * 9 / 5 + 32;
  const showTemp = document.createElement('h4');
  showTemp.innerText = "Temperature: "+tempF+" F";
  tempData.appendChild(showTemp);

  const humid = blob.data.current.weather.hu;
  const showHumid = document.createElement('h4');
  showHumid.innerText = "Humidity: "+humid+" %";
  humidData.appendChild(showHumid);

  const winds = blob.data.current.weather.ws;
  const windMPH = (winds * 2.24);
  const windMph = windMPH.toFixed(1);
  const showWindS = document.createElement('h4');
  showWindS.innerText = "Wind speed: "+windMph+" mph";
  speedData.appendChild(showWindS);

  let windd = blob.data.current.weather.wd;

  if ((windd>=338) || (windd<=23)) {
    windd = "North";
  } else if ((windd>=24) || (windd<=69)) {
    windd = "Northeast";
  } else if ((windd>=70) || (windd<=115)) {
    windd = "East";
  } else if ((windd>=116) || (windd<=161)) {
    windd = "Southeast";
  } else if ((windd>=162) || (windd<=207)) {
    windd = "South";
  } else if ((windd>=208) || (windd<=253)) {
    windd = "Southwest";
  } else if ((windd>=254) || (windd<=289)) {
    windd = "West";
  } else {
    windd = "Northwest";
  }
  const showWindD = document.createElement('h4');
  showWindD.innerText = "Wind direction: "+windd;
  directData.appendChild(showWindD);
}
