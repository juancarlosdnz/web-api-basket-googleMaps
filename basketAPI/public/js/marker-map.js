let map
let centerLat = (document.getElementById('currentMatchLat').innerHTML) * 1
let centerLng = (document.getElementById('currentMatchLng').innerHTML) * 1

function initMarkerMap() {
    drawMap()
    placeMatchMarkers()
}

function drawMap() {
    const { Map } = google.maps

    map = new Map(
        document.getElementById('myMarkerMap'),
        {
            zoom: 15,
            center: { lat: centerLat, lng: centerLng }
        }
    )
}

function placeMatchMarkers() {
    const { Marker } = google.maps

    const position = {
        lat: centerLat,
        lng: centerLng,
    }

    new Marker({ position, map })
}
