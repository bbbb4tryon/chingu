//Simple cache
const weatherDataCache = {};
const cacheTimeouts = {};
const CACHE_DURATION = 30 * 60 * 1000;

//Cache functions
function setWeatherCache(location, data) {
    weatherDataCache[location] = data;

    if (cacheTimeouts[location]) {
        clearTimeout(cacheTimeouts[location]);
    }

    cacheTimeouts[location] = setTimeout(() => {
        delete weatherDataCache[location];
        delete cacheTimeouts[location];
    }, CACHE_DURATION);
}
function getWeatherCache(location) {
    return weatherDataCache[location];
}

//Constants for base and training items
const BASE_ITEMS = [
    "Liquids: 1 liter (32oz) of liquid per 1 hour of activity",
    "Snacks: 2:1 carbohydrates to protein",
    "ID and Emergency Contact Information" 
];
const ACTIVITY_ITEMS = {
    running: ["Socks", "Sunglasses"],
    swimming: ["Goggles", "Towel"],
    biking: ["Sunglasses", "Helmet"]
}

//DOM elements
const citySelect = document.getElementById('citySelect');
const activityButtons = document.querySelectorAll('.activity-btn');
const suppliesContainer = document.getElementById('suppliesContainer');
const baseItemsList = document.getElementById('baseItems');
const recommendedItemsList = document.getElementById('recommendedItems');

//Current state
let currentActivity = 'running';

//Event Listeners
citySelect.addEventListener('change', updateSupplies);

activityButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        //update styling
        activityButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        //update activity; refresh supplies list
        currentActivity = button.dataset.actvity;
        updateSupplies();
    });
});



// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);