
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [7.4256, 43.740445], // [longitude, latitude]
    // center: campground.geometry.coordinates,
    zoom: 9, // starting zoom
});

const marker1 = new mapboxgl.Marker()
    .setLngLat([7.4256, 43.740445])
    //.setLngLat(campground.geometry.coordinates)
    .addTo(map);



