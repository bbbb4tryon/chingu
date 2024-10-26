
document.getElementByID("packingForm").addEventListener("submit", function(e){
    e.preventDefault();

    const location = document.getElementById("location").value
    const adveture = document.getElementById("adventure").value
    const time = document.getElmentById("weather").value

    const simulatedPackingSuggestions = getPackingList(adventure, weather);

    const packingList = document.getElementById("list");
    packingList.innerHTML = ""; // clears previous packingList
    packingSuggestions.forEach(item => {
        const listItem = document.createElement("li")
        listItem.textContext = item;
        packingList.appendChild(listItem)
    });
});

function getPackingList(adventure, time ) {
    const baseItems = ["1 Liter Water per 1 hour activity snacks", "snacks", "hat"]
    if (adventure == swimming) {
        baseItems.push("googles")
    } else if (adventure == biking) {
        baseItems.push("electrolytes", "sunglasses")
    } else if (adventure == running) {
        baseItems.push("running socks")
    }

    if (weather == "cold") {
baseItems.push("full gloves")
    } else if (weather == "warmer") {
baseItems.push("spray sunscreen")
    }

    return baseItems
}

function fetchWeatherCondition(location) {
    const fakeapiKey = 'REPLACE_WITH YOURACTUAL_KEY'
}