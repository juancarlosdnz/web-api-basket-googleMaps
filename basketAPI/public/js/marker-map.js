let map
let centerLat
let centerLng
centerLat = document.getElementById('currentMatchLat').innerHTML
centerLng = document.getElementById('currentMatchLng').innerHTML
centerLat = centerLat * 1
centerLng = centerLng * 1

console.log(centerLat)
console.log(centerLng)

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

// function getMatches() {

//     axios.get('/api/matches')
//         .then(({ data }) => placeMatchMarkers(data))
//         .catch(err => console.log(err))
// }

// function placeMatchMarkers(matches) {
//     const { Marker } = google.maps

//     matches.forEach(match => {

//         const position = {
//             lat: match.location.coordinates[0],
//             lng: match.location.coordinates[1],
//         }

//         new Marker({ position, map })
//     })
// }



function placeMatchMarkers() {
    const { Marker } = google.maps


    const position = {
        lat: centerLat,
        lng: centerLng,
    }

    new Marker({ position, map })
}
