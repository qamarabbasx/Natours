/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicWFtYXJhYmJhc3giLCJhIjoiY2w0ejhsd3g3Mjc3NDNkbWxzbnM2eTd0MCJ9.EyEGvjas2z0Axh7cVGgtWA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/qamarabbasx/cl4zaelj7000b14pf1ucp0mzv',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false, // to make it fixed
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>DAy ${loc.day}: ${loc.description} </p>`)
      .addTo(map);
    // Extends map bounds to include current locations
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
