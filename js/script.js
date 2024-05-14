document.addEventListener('DOMContentLoaded', async function() {
    
    const ctx = document.getElementById('bikeChart');
    const selectElement = document.getElementById('station-select');
    const timeSelectElement = document.getElementById('time-select'); 

    const apiUrl = 'https://673330-6.web.fhgr.ch/unload.php';
    const response = await fetch(apiUrl);
    const records = await response.json();

    const capacities = {
        "Fachhochschule Graubünden Pulvermühlestrasse": 10,
        "Bahnhof/Gürtelstrasse": 17,
        "Bahnhofplatz Chur": 20,
        "Stadthaus Chur": 9,
        "Kantonsschule Plessur": 10,
        "Kantonsspital": 8,
        "Pädagogische Hochschule Graubünden": 5,
        "Klinik Waldhaus": 8,
        "Fachhochschule Graubünden Comercialstrasse": 8,
        "Sinergia": 9
    };



     const stations = {
        "Fachhochschule Graubünden Pulvermühlestrasse": { lat: 46.85309, lng: 9.51228 },
        "Bahnhof/Gürtelstrasse": { lat: 46.85417, lng: 9.52839 },
        "Bahnhofplatz Chur": { lat: 46.85311, lng: 9.52903 },
        "Stadthaus Chur": { lat: 46.851702, lng: 9.534199 },
        "Kantonsschule Plessur": { lat: 46.84647, lng: 9.53609 },
        "Kantonsspital": { lat: 46.86357, lng: 9.53866 },
        "Pädagogische Hochschule Graubünden": { lat: 46.86694, lng: 9.53723 },
        "Klinik Waldhaus": { lat: 46.86924, lng: 9.54073 },
        "Fachhochschule Graubünden Comercialstrasse": { lat: 46.847347, lng: 9.509044 },
        "Sinergia": { lat: 46.84898, lng: 9.5145 }
    };

    document.getElementById('search-input').addEventListener('input', async function() {
        const input = this.value;
        if (input.length > 2) {
            const response = await fetch(`https://transport.opendata.ch/v1/locations?query=${input}&type=station`);
            const data = await response.json();
            const suggestions = data.stations
                .filter(station => station.coordinate && typeof station.coordinate.x === 'number' && station.coordinate.x !== 0 
                    && typeof station.coordinate.y === 'number' && station.coordinate.y !== 0 
                    && station.coordinate.x >= -180 && station.coordinate.x <= 180
                    && station.coordinate.y >= -90 && station.coordinate.y <= 90)
                .map(station => `<div class='suggestion-item' data-lat="${station.coordinate.x}" data-lng="${station.coordinate.y}" data-name="${station.name}">${station.name}</div>`)
                .join('');
            document.getElementById('suggestion-box').innerHTML = suggestions;
            document.getElementById('chartContainer').style.display = suggestions.length > 0 ? 'block' : 'none';
        } else {
            document.getElementById('suggestion-box').innerHTML = '';
            document.getElementById('chartContainer').style.display = 'none';
        }

 
    });
    
    

    function calculateRating(bikesAvailable, distance) {
     
        const maxDistance = 3000;
        // Maximale Anzahl von Fahrrädern, die in der Bewertung berücksichtigt wird
        const maxBikes = Math.max(...Object.values(capacities));
    
        // Berechnung des Basis-Ratings für die Verfügbarkeit der Fahrräder
        const bikeRating = (bikesAvailable / maxBikes) * 5.5;
    
        // Berechnung des Distanz-Ratings
        const distanceFactor = distance > maxDistance ? 0 : (1 - (distance / maxDistance));
        const distanceRating = distanceFactor * 6.5;
    
        // Gesamtbewertung als gewichtete Summe der beiden Ratings
        const totalRating = bikeRating + distanceRating;
    
        const scaledRating = Math.max(0.1, Math.min(10, totalRating));
    
        return scaledRating.toFixed(1);
    }
    
    document.getElementById('suggestion-box').addEventListener('click', function(event) {
        document.getElementById('chartContainer').style.display = 'block';
        const selectedStationName = event.target.getAttribute('data-name');
        const lat = parseFloat(event.target.getAttribute('data-lat'));
        const lng = parseFloat(event.target.getAttribute('data-lng'));
        document.getElementById('search-input').value = selectedStationName;
        this.innerHTML = '';
    
        const distances = Object.keys(stations).map(stationName => {
            const { lat: stationLat, lng: stationLng } = stations[stationName];
            const distance = calculateDistance(lat, lng, stationLat, stationLng) * 1000;
    
            const latestTimestamp = Object.keys(datasets[stationName]).reduce((latest, current) => latest > current ? latest : current, '1970-01-01T00:00:00Z');
            const bikesAtLatest = datasets[stationName][latestTimestamp] || 0;
    
            const rating = calculateRating(bikesAtLatest, distance);
    
            return { stationName, distance, bikesAtLatest, rating };
        });
    
        distances.sort((a, b) => b.rating - a.rating); // Sortieren nach Rating
        displaySortedStations(distances);
    
        // Rufe das Bubble-Chart auf, um es mit den aktualisierten Daten zu zeichnen
        createBubbleChart(distances);
    });
    
    function displaySortedStations(distances) {
        const container = document.getElementById('suggestion-box');
        container.innerHTML = '';  // Löscht vorhandene Inhalte.
        distances.forEach(item => {
            const stationDiv = document.createElement('div');
            stationDiv.className = 'station-item ' + getRatingClass(parseFloat(item.rating));
    
            const header = document.createElement('div');
            header.className = 'station-header';
            header.textContent = item.stationName;
            stationDiv.appendChild(header);
    
            const details = document.createElement('div');
            details.className = 'station-details';
    
            const distanceDiv = document.createElement('div');
            distanceDiv.className = 'detail';
            distanceDiv.innerHTML = `<span class="detail-value">${item.distance.toFixed(0)} m</span><br><span class="detail-label">Entfernung</span>`;
    
            const bikesDiv = document.createElement('div');
            bikesDiv.className = 'detail';
            bikesDiv.innerHTML = `<span class="detail-value">${item.bikesAtLatest}</span><br><span class="detail-label">Verfügbar</span>`;
    
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'detail';
            ratingDiv.innerHTML = `<span class="detail-value">${item.rating}</span><br><span class="detail-label">Bewertung</span>`;
    
            const mapsLink = document.createElement('button');
            mapsLink.textContent = 'Route anzeigen';
            mapsLink.className = 'maps-link';
            mapsLink.addEventListener('click', (e) => {
                e.stopPropagation();  // Verhindert das Auslösen von übergeordneten Event-Listeners.
                const lat = stations[item.stationName].lat;
                const lng = stations[item.stationName].lng;
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
            });
    
            details.appendChild(distanceDiv);
            details.appendChild(bikesDiv);
            details.appendChild(ratingDiv);
            stationDiv.appendChild(details);
            stationDiv.appendChild(mapsLink);  // Fügt den Google Maps Link hinzu
            container.appendChild(stationDiv);
        });
    }
    

function getRatingClass(rating) {
    if (rating >= 9.0) {
        return 'rating-excellent';
    } else if (rating >= 8.0) {
        return 'rating-good';
    } else if (rating >= 6.5) {
        return 'rating-average';
    } else if (rating >= 4.5) {
        return 'rating-poor';
    } else {
        return 'rating-bad';
    }
}

    
    
    
    

    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius der Erde in Kilometern
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distanz in Kilometern
    }
    
   

    const datasets = {};
    records.forEach(record => {
        if (!datasets[record.station_name]) {
            datasets[record.station_name] = {};
        }
        if (!datasets[record.station_name][record.timestamp]) {
            datasets[record.station_name][record.timestamp] = 0;
        }
        datasets[record.station_name][record.timestamp] += 1;
    });

    // Zeitbereich für Filterung berechnen
    const now = new Date();
    const filterDates = {
        'all': new Date(0), // Epoche
        '7days': new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)),
        '3days': new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000)),
        'today': new Date(now.getFullYear(), now.getMonth(), now.getDate())
    };

    const chartData = {
        labels: Object.keys(datasets['Sinergia']).sort(),
        datasets: Object.keys(datasets).map(station => ({
            label: station,
            data: Object.keys(datasets['Sinergia']).sort().map(timestamp => {
                const count = datasets[station][timestamp] || 0;
                const capacity = capacities[station];
                const available = capacity - count;
                return (available / capacity) * 100;
            }),
            fill: false,
            borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
            tension: 0.1
        }))
    };

    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        generateLabels: function(chart) {
                            return chart.data.datasets.filter(dataset => !dataset.hidden).map(dataset => ({
                                text: dataset.label,
                                fillStyle: dataset.borderColor,
                                hidden: dataset.hidden,
                                lineCap: dataset.borderCapStyle,
                                lineDash: dataset.borderDash,
                                lineDashOffset: dataset.borderDashOffset,
                                lineJoin: dataset.borderJoinStyle,
                                lineWidth: dataset.borderWidth,
                                strokeStyle: dataset.borderColor,
                                pointStyle: dataset.pointStyle,
                                datasetIndex: dataset.index
                            }));
                        }
                    }
                }
            }
        }
    });

    chartData.datasets.forEach((dataset, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = dataset.label;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener('change', function() {
        const selectedOptions = Array.from(selectElement.selectedOptions).map(opt => opt.value);
        myChart.data.datasets.forEach((dataset, index) => {
            dataset.hidden = !selectedOptions.includes(index.toString());
        });
        myChart.update();
    });

  // Hilfsfunktion zum Filtern der Zeitstempel basierend auf einem Intervall
  function filterByInterval(timestamps, intervalHours) {
    const interval = intervalHours * 60 * 60 * 1000; 
    let lastTimestamp = new Date(timestamps[0]).getTime() - interval; 
    return timestamps.filter(timestamp => {
        const currentTimestamp = new Date(timestamp).getTime();
        if (currentTimestamp >= lastTimestamp + interval) {
            lastTimestamp = currentTimestamp;
            return true;
        }
        return false;
    });
}


function updateXAxis(timeSelection) {
    const scales = myChart.options.scales;
    switch(timeSelection) {
        case 'today':
            scales.x.time.unit = 'hour';
            scales.x.time.displayFormats = { hour: 'HH:mm' };
            scales.x.time.tooltipFormat = 'HH:mm';
            break;
        case '3days':
            scales.x.time.unit = 'hour';
            scales.x.time.stepSize = 2;
            scales.x.time.displayFormats = { hour: 'MMM d, HH:mm' };
            scales.x.time.tooltipFormat = 'MMM d, HH:mm';
            break;
        case '7days':
            scales.x.time.unit = 'hour';
            scales.x.time.stepSize = 4;
            scales.x.time.displayFormats = { hour: 'MMM d, HH:mm' };
            scales.x.time.tooltipFormat = 'MMM d, HH:mm';
            break;
        default: // 'all'
            scales.x.time.unit = 'hour';
            scales.x.time.stepSize = 8;
            scales.x.time.displayFormats = { hour: 'MMM d, HH:mm' };
            scales.x.time.tooltipFormat = 'MMM d, HH:mm';
            break;
    }
    myChart.update();
}

timeSelectElement.addEventListener('change', function() {
    const selectedTime = timeSelectElement.value;
    const minDate = filterDates[selectedTime];
    const intervalHours = selectedTime === '3days' ? 2 : selectedTime === '7days' ? 4 : selectedTime === 'all' ? 3 : 1;

    let filteredTimestamps = Object.keys(datasets['Sinergia']).sort().filter(timestamp => new Date(timestamp) >= minDate);
    if (['3days', '7days', 'all'].includes(selectedTime)) {
        filteredTimestamps = filterByInterval(filteredTimestamps, intervalHours);
    }

    myChart.data.labels = filteredTimestamps;
    myChart.data.datasets.forEach(dataset => {
        dataset.data = myChart.data.labels.map(timestamp => {
            const count = datasets[dataset.label][timestamp] || 0;
            const capacity = capacities[dataset.label];
            const available = capacity - count;
            return (available / capacity) * 100;
        });
    });

    updateXAxis(selectedTime);
    myChart.update();
});

// Aufruf bei der Initialisierung
updateXAxis(timeSelectElement.value);
});


// JavaScript, um die Filter-Container anzuzeigen oder zu verstecken
document.getElementById('filter_toggle').addEventListener('click', function() {
    var selectContainer = document.getElementById('select-container');
    if (selectContainer.style.display === 'none') {
        selectContainer.style.display = 'block';
    } else {
        selectContainer.style.display = 'none';
    }
});


function calculateBubbleRadius(rating) {
    const minRadius = 1; 
    const maxRadius = 20;
    return minRadius + (rating / 10.0) * (maxRadius - minRadius);
}



function createBubbleChart(data) {
    const ctx = document.getElementById('bubbleChart').getContext('2d');

    // Sicherstellen, dass das vorherige Chart korrekt zerstört wird, wenn es existiert
    if (window.bubbleChart && typeof window.bubbleChart.destroy === 'function') {
        window.bubbleChart.destroy();
    }

    // Erstelle ein neues Chart und speichere es in einer globalen Variable
    window.bubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: data.map(item => ({
                label: item.stationName,
                data: [{
                    x: item.distance,
                    y: item.bikesAtLatest,
                    r: calculateBubbleRadius(parseFloat(item.rating))
                }],
                backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`
            }))
        },
        options: {
            scales: {
                x: {
                    grid: {
                        color: 'white', 
                        borderColor: 'white'  
                    },
                    ticks: {
                        color: 'white'
                    },
                    title: {
                        display: true,
                        text: 'Distanz (Meter)',
                        color: 'white' 
                    }
                },
                y: {
                    grid: {
                        color: 'white', 
                        borderColor: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    title: {
                        display: true,
                        text: 'Verfügbare Velos',
                        color: 'white'  
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const roundedDistance = Math.round(context.raw.x);
                            return `${context.dataset.label}: Distanz = ${roundedDistance} m, Verfügbar = ${context.raw.y}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            backgroundColor: 'white'  // Hintergrundfarbe des Charts
        }
    });
}

