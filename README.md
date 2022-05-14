# Developer Test #1 - Weather App

https://jimzandueta.github.io/accuw-rcm/
 
---

## Project Installation
1. Clone the project repository.
```sh
$ git clone https://github.com/jimzandueta/accuw-rcm.git
$ cd accuw-rcm
```
2. Duplicate `.bak.env` and rename it to `.env` .
```sh
$ cp .bak.env .env
```
3. Open `.env` and update the Accuweather API Key.

```sh
$ vim .env

# .env
...
VUE_APP_API_KEY=<YOUR-API-KEY>
...
```

4. Install the project dependencies.
```sh
$ npm install
```
5. Run the application
```sh
$ npm run serve

# Navigate to http://localhost:8080/ using your favorite browser.
```

## Project Dependencies

```json
{
    "buefy": "^0.9.20",
    "core-js": "^3.8.3",
    "moment": "^2.29.3",
    "moment-timezone": "^0.5.34",
    "register-service-worker": "^1.7.2",
    "secure-ls": "^1.2.6",
    "vue": "^2.6.14",
    "vue-router": "^3.5.1",
    "vuex": "^3.6.2",
    "vuex-persistedstate": "^4.1.0"
}
```

## Features:
1. **Live Location** - Displays date, time, city, and weather data base on user location. Location is determined by:
     - using browser location (with user's permission)
     - checking IP address location
2. **Persistent Data and Auto Update** - Weather data is saved in localstorage to prevent multiple request on the same location. Weather date is updated every 15 minutes, unless location is changed.
3. **Search with Autocomplete** - Check date, time, and weather data in other locations by using the search feature.

## Improvements:
- Improve responsiveness to support mobile devices.
- Use notification to prompt user if an error occured when fetching weather data. 
- List top three recent searches. 
- Use graphs to visualize temperature trend.
- Update background based on current location and time. 
- Create more e2e test cases.