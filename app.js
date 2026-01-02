// Global variables
let svg, projection, path, g, worldData;
let currentPole = [0, -90]; // [longitude, latitude] for rotation
let currentRotation = 0; // Additional rotation for WASD controls
let isDragging = false;
let dragStartPole = null;
let dragStartCoords = null;

// City database with major cities worldwide
const cities = {
    // Africa
    'cairo': [31.2357, 30.0444],
    'lagos': [3.3792, 6.5244],
    'nairobi': [36.8219, -1.2921],
    'johannesburg': [28.0473, -26.2041],
    'casablanca': [-7.6167, 33.5731],
    'addis ababa': [38.7469, 9.0320],
    // Asia
    'tokyo': [139.6917, 35.6895],
    'beijing': [116.4074, 39.9042],
    'shanghai': [121.4737, 31.2304],
    'delhi': [77.1025, 28.7041],
    'mumbai': [72.8777, 19.0760],
    'bangkok': [100.5018, 13.7563],
    'singapore': [103.8198, 1.3521],
    'seoul': [126.9780, 37.5665],
    'hong kong': [114.1694, 22.3193],
    'dubai': [55.2708, 25.2048],
    'istanbul': [28.9784, 41.0082],
    'jakarta': [106.8456, -6.2088],
    'manila': [120.9842, 14.5995],
    // Europe
    'london': [-0.1276, 51.5074],
    'paris': [2.3522, 48.8566],
    'berlin': [13.4050, 52.5200],
    'rome': [12.4964, 41.9028],
    'madrid': [-3.7038, 40.4168],
    'moscow': [37.6173, 55.7558],
    'amsterdam': [4.9041, 52.3676],
    'vienna': [16.3738, 48.2082],
    'stockholm': [18.0686, 59.3293],
    'athens': [23.7275, 37.9838],
    // North America
    'new york': [-74.0060, 40.7128],
    'los angeles': [-118.2437, 34.0522],
    'chicago': [-87.6298, 41.8781],
    'mexico city': [-99.1332, 19.4326],
    'toronto': [-79.3832, 43.6532],
    'san francisco': [-122.4194, 37.7749],
    'miami': [-80.1918, 25.7617],
    'vancouver': [-123.1207, 49.2827],
    // South America
    'sao paulo': [-46.6333, -23.5505],
    'rio de janeiro': [-43.1729, -22.9068],
    'buenos aires': [-58.3816, -34.6037],
    'lima': [-77.0428, -12.0464],
    'bogota': [-74.0721, 4.7110],
    'santiago': [-70.6483, -33.4489],
    // Oceania
    'sydney': [151.2093, -33.8688],
    'melbourne': [144.9631, -37.8136],
    'auckland': [174.7633, -36.8485],
    'perth': [115.8605, -31.9505],
    // Extreme/Interesting locations
    'reykjavik': [-21.8952, 64.1466],
    'anchorage': [-149.9003, 61.2181],
    'ushuaia': [-68.3029, -54.8019],
    'wellington': [174.7787, -41.2865],
    'murmansk': [33.0750, 68.9585],
};

// Normalize longitude to -180 to 180 range
function normalizeLongitude(lon) {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
}

// Calculate the shortest path between two longitudes
function shortestLongitudeDelta(fromLon, toLon) {
    let delta = toLon - fromLon;
    // Normalize delta to -180 to 180
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    return delta;
}

// Initialize the map
function init() {
    const width = document.getElementById('map').clientWidth;
    const height = 700;

    // Create SVG with drag behavior
    svg = d3.select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(d3.drag()
            .on('start', handleDragStart)
            .on('drag', handleDrag)
            .on('end', handleDragEnd));

    // Create projection
    projection = d3.geoMercator()
        .scale(width / (2 * Math.PI))
        .translate([width / 2, height / 2]);

    // Create path generator
    path = d3.geoPath().projection(projection);

    // Create group for all map elements
    g = svg.append('g');

    // Add ocean background rectangle that captures all clicks
    g.append('rect')
        .attr('class', 'ocean')
        .attr('width', width)
        .attr('height', height)
        .on('click', handleMapClick);

    // Add graticule (grid lines)
    const graticule = d3.geoGraticule();
    g.append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', path);

    // Load world data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(data => {
            worldData = data;
            const countries = topojson.feature(data, data.objects.countries);

            // Draw countries
            g.selectAll('.land')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('class', 'land')
                .attr('d', path)
                .on('click', handleMapClick);
        })
        .catch(error => {
            console.error('Error loading map data:', error);
            d3.select('#map').html('<div class="loading">Error loading map data. Please refresh the page.</div>');
        });
}

// Handle map click - now centers the map instead of setting pole
function handleMapClick(event, d) {
    // Don't handle click if we just finished dragging
    if (isDragging) return;

    const coords = projection.invert(d3.pointer(event));
    if (coords) {
        centerMap(coords[0], coords[1]);
    }
}

// Center the map on a specific location
function centerMap(lon, lat) {
    const width = document.getElementById('map').clientWidth;
    const height = 700;

    // Calculate the new center by adjusting the rotation
    // To center on a point, we rotate it to [0, 0] in the rotated coordinate system
    currentPole = [normalizeLongitude(-lon), lat];

    updateProjection();
    updatePoleInfo(-currentPole[0], currentPole[1]);
}

// Handle drag start
function handleDragStart(event) {
    const coords = projection.invert([event.x, event.y]);
    if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
        isDragging = true;
        dragStartPole = [...currentPole];
        dragStartCoords = coords;
        document.getElementById('map').classList.add('dragging');
    }
}

// Handle drag movement - moves the pole
function handleDrag(event) {
    if (!dragStartPole || !dragStartCoords) return;

    const coords = projection.invert([event.x, event.y]);
    if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
        // Calculate the delta from the drag start position
        const deltaLon = shortestLongitudeDelta(dragStartCoords[0], coords[0]);
        const deltaLat = coords[1] - dragStartCoords[1];

        // Apply the delta to the original pole position
        let newLon = normalizeLongitude(dragStartPole[0] + deltaLon);
        let newLat = Math.max(-85, Math.min(85, dragStartPole[1] + deltaLat));

        currentPole = [newLon, newLat];
        updateProjectionImmediate();
        updatePoleInfo(-newLon, newLat);
    }
}

// Handle drag end
function handleDragEnd(event) {
    document.getElementById('map').classList.remove('dragging');
    dragStartPole = null;
    dragStartCoords = null;
    // Small delay before allowing clicks again
    setTimeout(() => { isDragging = false; }, 100);
}

// Set new pole location (with animation)
function setPole(lon, lat) {
    currentPole = [normalizeLongitude(lon), -lat]; // Negative because we're rotating TO this point
    updateProjection();
    updatePoleInfo(lon, lat);
}

// Set new pole location immediately (no animation, for dragging)
function setPoleImmediate(lon, lat) {
    currentPole = [normalizeLongitude(lon), -lat];
    updateProjectionImmediate();
    updatePoleInfo(lon, lat);
}

// Update the projection with new rotation
function updateProjection() {
    const width = document.getElementById('map').clientWidth;
    const height = 700;

    projection = d3.geoMercator()
        .rotate([currentPole[0], currentPole[1], currentRotation])
        .scale(width / (2 * Math.PI))
        .translate([width / 2, height / 2]);

    path = d3.geoPath().projection(projection);

    // Update all paths with animation
    const graticule = d3.geoGraticule();

    g.select('.graticule')
        .transition()
        .duration(1000)
        .attr('d', path.projection(projection)(graticule()));

    g.selectAll('.land')
        .transition()
        .duration(1000)
        .attr('d', path);
}

// Update the projection immediately (no animation, for dragging)
function updateProjectionImmediate() {
    const width = document.getElementById('map').clientWidth;
    const height = 700;

    projection = d3.geoMercator()
        .rotate([currentPole[0], currentPole[1], currentRotation])
        .scale(width / (2 * Math.PI))
        .translate([width / 2, height / 2]);

    path = d3.geoPath().projection(projection);

    // Update all paths immediately (no transition)
    const graticule = d3.geoGraticule();

    g.select('.graticule')
        .attr('d', path.projection(projection)(graticule()));

    g.selectAll('.land')
        .attr('d', path);
}

// Update pole information display
function updatePoleInfo(lon, lat) {
    const lonDir = lon >= 0 ? 'E' : 'W';
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonAbs = Math.abs(lon).toFixed(2);
    const latAbs = Math.abs(lat).toFixed(2);

    document.getElementById('pole-info').innerHTML =
        `<strong>Current center:</strong> ${latAbs}°${latDir}, ${lonAbs}°${lonDir}`;
}

// Search for a city
function searchCity() {
    const searchTerm = document.getElementById('city-search').value.toLowerCase().trim();

    if (cities[searchTerm]) {
        const [lon, lat] = cities[searchTerm];
        centerMap(lon, lat);

        // Update search box with proper capitalization
        const cityName = searchTerm.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        document.getElementById('city-search').value = cityName;
    } else {
        alert('City not found. Try: Tokyo, Paris, Cairo, New York, Sydney, etc.');
    }
}

// Reset to original projection
function resetProjection() {
    currentPole = [0, 0];
    currentRotation = 0;
    updateProjection();
    document.getElementById('pole-info').innerHTML =
        '<strong>Current center:</strong> 0°N, 0°E';
    document.getElementById('city-search').value = '';
}

// Handle keyboard controls
function handleKeyDown(event) {
    // Ignore if user is typing in the search box
    if (event.target.tagName === 'INPUT') return;

    const step = 5; // degrees to move
    const rotationStep = 5; // degrees to rotate

    let handled = false;

    // Arrow keys - move the pole/center
    if (event.key === 'ArrowUp') {
        currentPole[1] = Math.min(85, currentPole[1] + step);
        handled = true;
    } else if (event.key === 'ArrowDown') {
        currentPole[1] = Math.max(-85, currentPole[1] - step);
        handled = true;
    } else if (event.key === 'ArrowLeft') {
        currentPole[0] = normalizeLongitude(currentPole[0] - step);
        handled = true;
    } else if (event.key === 'ArrowRight') {
        currentPole[0] = normalizeLongitude(currentPole[0] + step);
        handled = true;
    }
    // WASD - rotate the view
    else if (event.key === 'w' || event.key === 'W') {
        currentRotation = normalizeLongitude(currentRotation + rotationStep);
        handled = true;
    } else if (event.key === 's' || event.key === 'S') {
        currentRotation = normalizeLongitude(currentRotation - rotationStep);
        handled = true;
    } else if (event.key === 'a' || event.key === 'A') {
        currentPole[0] = normalizeLongitude(currentPole[0] - step);
        handled = true;
    } else if (event.key === 'd' || event.key === 'D') {
        currentPole[0] = normalizeLongitude(currentPole[0] + step);
        handled = true;
    }

    if (handled) {
        event.preventDefault();
        updateProjectionImmediate();
        updatePoleInfo(-currentPole[0], currentPole[1]);
    }
}

// Theme toggle function
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');

    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        icon.innerHTML = '&#9728;'; // Sun icon for dark mode
    } else {
        body.setAttribute('data-theme', 'light');
        icon.innerHTML = '&#9790;'; // Moon icon for light mode
    }
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        d3.select('#map svg').remove();
        init();
    }, 250);
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up search box enter key handler
    document.getElementById('city-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchCity();
        }
    });

    // Set up keyboard controls
    document.addEventListener('keydown', handleKeyDown);

    // Initialize the map
    init();
});
