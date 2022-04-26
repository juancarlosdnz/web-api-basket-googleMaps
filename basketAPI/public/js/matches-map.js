let map

function initMap() {
    drawMap()
    selectMatchPlace()
    // printMatchesMarker()

}

function drawMap() {
    const { Map } = google.maps

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
        document.getElementById("lat").value = event.latLng.lat();
        document.getElementById("lng").value = event.latLng.lng();
        marker.setPosition(event.latLng);
    });

}

// function getMatch(match) {

// }



// function printMatchesMarker() {

//     const { Marker } = google.maps

//     const position = {

//         lat: document.getElementById("lat").value,
//         lng: document.getElementById("lng").value
//     }

//     console.log(position.lat, position.lng)
//     new Marker({ position, map })
// }


