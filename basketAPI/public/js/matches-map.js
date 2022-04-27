let map
let markers = []
let centerLat
let centerLng

function initMap() {
    drawMap()
    selectMatchPlace()
    placeMatchMarkers()
}

function drawMap() {
    const { Map,Marker } = google.maps

    map = new Map(
        document.getElementById('myMap'),
        {
            zoom: 15,
            center: { lat: 40.39158752397648, lng: - 3.6975056494255663 }
        }
    )
}

function selectMatchPlace() {
    google.maps.event.addListener(map, 'click', function (event) {
        centerLat = document.getElementById("lat").value = event.latLng.lat();
        centerLng = document.getElementById("lng").value = event.latLng.lng();
        placeMatchMarkers(centerLat,centerLng)
    })
}

function placeMatchMarkers(centerLat,centerLng) {
    deleteMarkers()

    const { Marker } = google.maps
    const position = {
        lat: centerLat * 1,
        lng: centerLng * 1,
    }

    markers.push(new Marker({ position, map }))
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map)
    }
}

function hideMarkers() {
    setMapOnAll(null)
}

function deleteMarkers() {
    hideMarkers()
    markers = []
}

