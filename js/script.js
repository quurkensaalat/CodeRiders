document.addEventListener('DOMContentLoaded', async function() {
    const ctx = document.getElementById('bikeChart');

    // Fetch the data from your API
    const apiUrl = 'https://673330-6.web.fhgr.ch/unload.php';
    const response = await fetch(apiUrl);
    const records = await response.json();

    // Create an object to hold datasets for each station
    const datasets = {};
    records.forEach(record => {
        if (!datasets[record.station_name]) {
            datasets[record.station_name] = {};
        }
        datasets[record.station_name][record.timestamp] = (datasets[record.station_name][record.timestamp] || 0) + 1;
    });

    console.log(datasets);

    // Prepare the chart data
    const chartData = {
        labels: Object.keys(datasets['Sinergia']).sort(),
        datasets: Object.keys(datasets).map(station => ({
            label: station,
            data: Object.keys(datasets['Sinergia']).sort().map(timestamp => datasets[station][timestamp] || 0),
            fill: false,
            borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`, // Random color for each line
            tension: 0.1
        }))
    };

    console.log(chartData);

    // Create the chart
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
                    beginAtZero: true
                }
            }
        }
    });
});
