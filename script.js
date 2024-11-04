// Simple Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const weatherDataCache = new Map(); // Using Map instead of object for better key-value handling

class WeatherCache {
    static set(location, data) {
        const cacheEntry = {
            data,
            timestamp: Date.now()
        };
        
        weatherDataCache.set(location, cacheEntry);
    }

    static get(location) {
        const cached = weatherDataCache.get(location);
        if (!cached) return null;
        
        // Check if cache is expired
        if (Date.now() - cached.timestamp > CACHE_DURATION) {
            weatherDataCache.delete(location);
            return null;
        }
        return cached.data;
    }

    static clear() {
        weatherDataCache.clear();
    }
}

//Constants for base and training items
const BASE_ITEMS = [
    "Liquids: 1 liter (32oz) of liquid per 1 hour of activity",
    "Snacks: 2:1 carbohydrates to protein",
    "ID and Emergency Contact Information" 
];
const ACTIVITY_ITEMS = {
    running: {
        cold: ["Running Gloves"],
        warm: ["Sunglasses"]
    },
    swimming: {
        cold: ["Wetsuit", "Clear Goggles"],
        warm: ["Swim Cap", "Shaded Goggles"]
    },
    biking: {
        cold: ["Windbreaker", "Full Gloves"],
        warm: ["Sunglasses", "Regular Gloves"]
    }
};

//Current state
let currentActivity = 'running'
let currentWeatherTrend = 'cold';

//DOM elements
const citySelect = document.getElementById('citySelect')
const activityButtons = document.querySelectorAll('.activity-btn');
const recommendedItemsList = document.getElementById('recommendedItems');

//Event Listeners
citySelect.addEventListener('change', updateDisplay)

// Fixed handleActivityClick function
function handleActivityClick(e) {
    // Remove active class from all buttons
    activityButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });

    // Add active class to clicked button
    e.target.classList.add('active');
    e.target.setAttribute('aria-pressed', 'true');

    // Update current activity and refresh supplies list
    currentActivity = e.target.dataset.activity;
    updateRecommendedItems();
}

// Add click handlers to activity buttons
activityButtons.forEach(button => {
    button.addEventListener('click', handleActivityClick);
//Keyboard support (accessibility)
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                button.click()
            }
        })
})

//Fetch weather data
async function fetchWeatherCondition(location) {

    // Check cache first
    const cachedData = WeatherCache.get(location);
    if (cachedData) {
        console.log("Returning cached data for: ", location);   
        return cachedData;
    }
    //If not in cache, fetch new data
    //(free proxy from OpenWeather - api not exposed)
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.API_KEY}&units=metric`;
    try {
        const response = await fetch(PROXY_URL + WEATHER_URL);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const data = await response.json();
        
    //    // Extract current and future temperatures
    //     const currentTemp = Math.round(data.list[0].main.temp * 9/5 + 32); // Convert to Fahrenheit
    //     const futureTemp = Math.round(data.list[1].main.temp * 9/5 + 32);
        
    //     return {
    //         current: currentTemp,
    //         future: futureTemp,
    //         condition: data.list[0].weather[0].main
    //     };
          // Process the weather data
          const weatherData = {
            current: Math.round(data.list[0].main.temp * 9/5 + 32),
            future: Math.round(data.list[1].main.temp * 9/5 + 32),
            condition: data.list[0].weather[0].main
        };

        // Store in cache before returning
        WeatherCache.set(location, weatherData);

        return weatherData
    } catch (error) {
        console.error(`Error fetching weather: ${error.message}`);
        return null;
    }
}

async function updateDisplay() {
    const selectedCity = citySelect.value;
    
    if (selectedCity) {
        try {
            const weatherData = await fetchWeatherCondition(selectedCity);
            
            if (weatherData) {
                 // Update city and temperatures
                 document.getElementById('selectedCity').textContent = selectedCity;
                 document.getElementById('currentTemp').textContent = `Current: ${weatherData.current}°F`;
                 document.getElementById('futureTemp').textContent = `In 3 hours: ${weatherData.future}°F`;
                 
                 // Update trend
                 const trend = weatherData.future > weatherData.current ? 'warmer' : 'colder';
                 const trendElement = document.getElementById('tempTrend');
                 trendElement.textContent = `Trending: ${trend}`;
                 trendElement.className = `trend ${trend}`;
                 
                 // Update weather trend and recommended items
                 currentWeatherTrend = trend === 'warmer' ? 'warm' : 'cold';
                 updateRecommendedItems();
            }
        } catch (error) {
            console.error('Failed to update weather display:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = 'Unable to fetch weather data. Please try again later.';
            document.getElementById('selectedCity').after(errorDiv);
        }
    }
}

// Event listener for city selection
citySelect.addEventListener('change', updateDisplay);

function updateRecommendedItems() {
    recommendedItemsList.innerHTML = '';
    const weatherItems = ACTIVITY_ITEMS[currentActivity][currentWeatherTrend];
    
    if (weatherItems) {
        weatherItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            recommendedItemsList.appendChild(li);
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateRecommendedItems();
});