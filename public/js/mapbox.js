const locations = JSON.parse(document.getElementById("map").dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2xheWVybWQiLCJhIjoiY2s5eDZzYjhzMDhqMTNvbGk4cGc4OGZjdiJ9.RMvJPhwWQVgiTyD9DtuS_A";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
});
