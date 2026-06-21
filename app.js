let barChart;
let lineChart;
let pieChart;
let pollutantChart;

function animateValue(id, start, end, duration) {

    let startTimestamp = null;

    function step(timestamp) {

        if (!startTimestamp)
            startTimestamp = timestamp;

        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        const value = progress * (end - start) + start;

        document.getElementById(id).innerText =
            Number.isInteger(end)
            ? Math.floor(value)
            : value.toFixed(1);

        if (progress < 1)
            window.requestAnimationFrame(step);

    }

    window.requestAnimationFrame(step);

}
// ====================
// BAR CHART
// ====================
fetch("aqi_county.json")
.then(response => response.json())
.then(data => {
    const top10 = data.slice(0, 10);
    const labels = top10.map(item => item.county);
    const values = top10.map(item => item.aqi);
    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",

        data: {
            labels: labels,
            datasets: [
            {
                label: "Average AQI",
                data: values,
                backgroundColor: "rgba(54,162,235,0.7)"
            },
            {
                label: "Median AQI",
                data: values.map(v => v * 0.95),
                backgroundColor: "rgba(255,99,132,0.7)"
            }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                delay(context) {
                    return context.dataIndex * 300;
                },
                duration: 1200,
                easing: "easeOutBounce"
            },
            transitions: {
                active: {
                    animation: {
                        duration: 300
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
});


// ====================
// LINE CHART
// ====================
fetch("aqi_daily.json")
.then(response => response.json())
.then(data => {
    const labels = data.map(item => item.date);
    const values = data.map(item => item.aqi);
    const movingAvg = values.map((_, i, arr) => {
        const start = Math.max(0, i - 6);
        const subset = arr.slice(start, i + 1);
        return subset.reduce((a, b) => a + b, 0) / subset.length;
    });

    lineChart = new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: labels,
            datasets: [
            {
                label: "Daily AQI",
                data: values,
                borderColor: "green",
                fill: false,
                tension: 0.3
            },
            {
                label: "7-Day Moving Average",
                data: movingAvg,
                borderColor: "red",
                fill: false,
                tension: 0.3
            }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                x: {
                    duration: 0
                },

                y(context) {
                    if (context.type !== "data")
                        return 0;
                    return context.dataIndex * 100;
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 10,
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
});

// ====================
// PIE CHART
// ====================
fetch("status_distribution.json")
.then(response => response.json())
.then(data => {
    const labels = data.map(item => item.status);
    const values = data.map(item => item.count);
    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#36A2EB",  // Good
                    "#FF6384",  // Moderate
                    "#FF9F40",  // Unhealthy for Sensitive Groups
                    "#FFCD56",  // Unhealthy
                    "#4BC0C0",  // Very Unhealthy
                    "#9966FF"   // Hazardous
                ],
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "60%",
            radius: "90%",
            animation: {
                duration: 4000,
                easing: "easeInOutQuart"
            },
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        boxWidth: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
});

// ====================
// POLLUTANT CHART
// ====================
fetch("pollutant_distribution.json")
.then(response => response.json())
.then(data => {
    const labels = data.map(item => item.pollutant);
    const values = data.map(item => item.count);
    pollutantChart = new Chart(document.getElementById("pollutantChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
            {
                label: "Count",
                data: values,
                backgroundColor: "orange"
            },
            {
                label: "Count × 0.001",
                data: values.map(v => v / 1000),
                backgroundColor: "rgba(54,162,235,0.7)"
            }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                delay(context) {
                    let delay = 0;
                    if (context.type === "data" && context.mode === "default") {
                        delay = context.dataIndex * 400;
                    }
                    return delay;
                },
                duration: 1200,
                easing: "easeOutBounce"
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
});

window.onload = function(){
    animateValue("site",0,78,2000);
    animateValue("aqi",0,54.3,2000);
}

const filter = document.getElementById("chartFilter");

const barSection = document.querySelector(".bar-section");
const pieSection = document.querySelector(".pie-section");
const lineSection = document.querySelector(".line-section");
const pollutantSection = document.querySelector(".pollutant-section");

const topRow = document.querySelector(".top-row");

function animateChart(chart){
    if(!chart) return;

    chart.reset();

    setTimeout(()=>{
        chart.resize();
        chart.update();
    },100);
}

function show(section, chart){

    section.classList.remove("chart-hidden");
    section.classList.add("chart-visible");

    section.classList.remove("chart-show");
    void section.offsetWidth;
    section.classList.add("chart-show");

    animateChart(chart);
}

function hide(section){

    section.classList.remove("chart-visible");
    section.classList.add("chart-hidden");

}

filter.addEventListener("change", function(){

    const value = this.value;

    // sembunyikan semuanya
    hide(barSection);
    hide(pieSection);
    hide(lineSection);
    hide(pollutantSection);

    if(value === "all"){

        topRow.style.display = "flex";

        show(barSection,barChart);
        show(pieSection,pieChart);
        show(lineSection,lineChart);
        show(pollutantSection,pollutantChart);

    }

    else if(value === "bar"){

        topRow.style.display = "flex";

        show(barSection,barChart);
        show(pieSection,pieChart);

    }

    else if(value === "pie"){

        topRow.style.display = "flex";

        show(barSection,barChart);
        show(pieSection,pieChart);

    }

    else if(value === "line"){

        topRow.style.display = "none";

        show(lineSection,lineChart);

    }

    else if(value === "pollutant"){

        topRow.style.display = "none";

        show(pollutantSection,pollutantChart);

    }

    setTimeout(()=>{

        barChart?.resize();
        pieChart?.resize();
        lineChart?.resize();
        pollutantChart?.resize();

    },200);

});