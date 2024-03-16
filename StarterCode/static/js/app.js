const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let dataDB;

//Fetch JSON data using D3.js and set up event listener to respond to changes in samples
d3.json(url).then(data => {
    dataDB = data;
    initializeCharts();

    document.getElementById("selDataset").addEventListener("change", function() {
        const inputValue = this.value;
        barChart(inputValue);
        bubbleChart(inputValue);
        showMetadata(inputValue);
        
    });
});

function initializeCharts() {
    const firstGraph = document.getElementById("selDataset");

    for (let i = 0; i < dataDB.names.length; i++) {
        let chartList = document.createElement("option");
        chartList.text = parseInt(dataDB.names[i]);
        chartList.value = dataDB.names[i];
        firstGraph.append(chartList, firstGraph[null]);
    }

    const inputValue = document.getElementById("selDataset").value;
    barChart(inputValue);
    bubbleChart(inputValue);
    showMetadata(inputValue);
   
}

function reverseArrays(...arrays) {
    return arrays.map(arr => arr.slice(0, 10).reverse());
}
//Create a horizontal bar chart
function barChart(value) {
    let subjectData = dataDB.samples.find(subject => subject.id === value);

    if (!subjectData) {
        console.error("Subject data not found for the given value");
        return;
    }

    let otuLabels = subjectData.otu_Labels || [];
    let otuIDs = subjectData.otu_ids || [];
    let subjectInfo = subjectData.sample_values || [];

    let [top10_otuLabels, top10_otuIDs, top10_subjectInfo] = reverseArrays(
        otuLabels,
        otuIDs,
        subjectInfo
    );

    let top10_otuIDsLabels = top10_otuIDs.map(id => "OTU " + id);

    let trace = {
        x: top10_subjectInfo,
        y: top10_otuIDsLabels,
        text: top10_otuLabels,
        type: "bar",
        orientation: "h"
    };
    
    let data = [trace];

    const layout = {
        xaxis: {
            zeroline: true,
            showline: false,
            showticklabels: true,
            showgrid: true
        }
    };

    Plotly.newPlot("bar", data, layout);
}

//Create a bubble chart that displays each sample
function bubbleChart(value) {
    let subjectData = dataDB.samples.find(subject => subject.id === value);

    if (!subjectData) {
        console.error("Subject data not found for the given value");
        return;
    }

    let otuIDs = subjectData.otu_ids || [];
    let sampleValues = subjectData.sample_values || [];
    let otuLabels = subjectData.otu_labels || [];

    const trace = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIDs,
            colorscale: 'Viridis'
        }
    };

    const data = [trace];
    const layout = {
        xaxis: { title: 'OTU ID' },
        showlegend: false
    };

    Plotly.newPlot('bubble', data, layout);
}

//Display the sample metadata of each individual
function showMetadata(value){
    let metadata = dataDB.metadata.find (item => item.id === parseInt(value));

    let metadataDiv = document.getElementById('sample-metadata');

    metadataDiv.innerHTML = '';

    if (metadata) {
        for(let[key, value] of Object.entries(metadata)) {
            let metadataEntry = document.createElement('p');
            metadataEntry.textContent = `${key}: ${value}`;
            metadataDiv.appendChild(metadataEntry);
        }
    }else {
        console.error("Metadata not found for the given value")
    }
    
}