mapboxgl.accessToken = 'pk.eyJ1IjoiY3dpbG1vdHQiLCJhIjoiY2s2bWRjb2tiMG1xMjNqcDZkbGNjcjVraiJ9.2nNOYL23A1cfZSE4hdC9ew';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/eandersonflint/cmh9rgfvw00qk01sm58wqg51i', // your Style URL goes here
  center: [-122.27, 37.87], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 14 // starting zoom
    });

map.on('load', function() {
  map.addSource('points-data', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/eandersonflint/BAHA-Map/refs/heads/main/data/JSON6.geojson'
});

map.addLayer({
  id: 'points-layer',
  type: 'circle',
  source: 'points-data',
  paint: {
      'circle-color': '#c33e15',
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    0.5
                ]
  }
});

map.on('click', 'points-layer', (e) => {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const properties = e.features[0].properties;

  
const popupContent = `
            <div>
                <h3>${properties.Landmark}</h3>
                <p><strong>Address:</strong> ${properties.Address}</p>
                <p><strong>Architect & Date:</strong> ${properties.Architect}</p>
                <p><strong>Designated:</strong> ${properties.Designated}</p>
                ${properties.Notes ? `<p><strong>Notes:</strong> ${properties.Notes}</p>` : ''}
            </div>
        `;

        new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true,
          anchor: 'bottom',
          offset: [0, -10]
        })
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map);
          });

          let hoveredPolygonId = null;
                    
 // When the user moves their mouse over the state-fill layer, we'll update the
        // feature state for the feature under the mouse.

         map.on('mousemove', 'points-layer', (e) => {
          if (e.features.length > 0) {
              if (hoveredPolygonId !== null) {
                  map.setFeatureState(
                      { source: 'points-data', id: hoveredPolygonId },
                      { hover: false }
                  );
              }
              hoveredPolygonId = e.features[0].id;
              map.setFeatureState(
                  { source: 'points-data', id: hoveredPolygonId },
                  { hover: true }
              );
          }
      });

          // Change cursor to pointer when hovering over points
          map.on('mouseenter', 'points-layer', () => {
                  map.getCanvas().style.cursor = 'pointer';

          });
    
          // Change cursor back when leaving points
          map.on('mouseleave', 'points-layer', () => {
                map.getCanvas().style.cursor = '';
                if (hoveredPolygonId !== null) {
                  map.setFeatureState(
                      { source: 'points-data', id: hoveredPolygonId },
                      { hover: false }
                  );
              }
              hoveredPolygonId = null;
          });

          document.getElementById('infoButton').addEventListener('click', () => {
            window.open('https://berkeleyheritage.com/photo_gallery.html', '_blank'); // opens in a new tab
          });
  });

  
