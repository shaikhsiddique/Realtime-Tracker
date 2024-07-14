// Initialize socket.io connection
const socket = io();

// Initialize the map and set the view
const map = L.map('map').setView([0, 0], 10);

// Add a tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png", {
    attribution: "@Siddique"
}).addTo(map);

// Object to store markers based on socket IDs
const markers = {};

// Socket.io event handler for receiving location updates

socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});


// Geolocation API to continuously send location updates to the server
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}
