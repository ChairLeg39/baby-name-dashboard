// Build Metadata Panel
const csvUrl = "baby_names_cleaned.csv";
function buildMetadata(selectedValue) {
d3.csv(csvUrl).then((data) => {
console.log(`Data: ${data}`);
// Filter the data for the object with the desired child's name
let filteredData = data.filter((entry) => entry['First Name'] === selectedValue);
let obj = filteredData[0];
// Use d3 to select the panel with id of `#sample-metadata`
let metapanel = d3.select("#sample-metadata");
// Clear any existing metadata
metapanel.html("");
// Append new tags for each key-value in the filtered metadata.
let entries = Object.entries(obj);
entries.forEach(([key, value]) => {
metapanel.append("h5").text(`${key}: ${value}`);
});
console.log(entries);
});
}

// Build Bubble Chart for Name Popularity
function buildChart(selectedValue) {
d3.csv(csvUrl).then((data) => {
// Filter data for the selected name
let filteredData = data.filter((entry) => entry['First Name'] === selectedValue);

// Group by Year of Birth and sum counts
const yearCounts = d3.rollup(filteredData,
v => d3.sum(v, d => +d.Count),
d => d['Year of Birth']
);

// Prepare data for Bubble Chart
let years = Array.from(yearCounts.keys());
let counts = Array.from(yearCounts.values());

let bubbleData = [{
x: years,
y: counts,
text: years.map((year, index) => `${year}: ${counts[index]}`),
mode: 'markers',
marker: {
size: counts,
color: counts,
colorscale: 'Viridis',
showscale: true
}
}];

let bubbleLayout = {
title: {
text: "",
x: 0.05
},
margin: { t: 30, l: 60 },
hovermode: "closest",
xaxis: { title: "Year of Birth" },
yaxis: { title: "Total Count of Names" },
autosize: true,
font: { family: "Calibri" }
};

// Render the Bubble Chart
Plotly.newPlot("bubble", bubbleData, bubbleLayout);
});
}

// Function to generate a random baby name based on gender and ethnicity
function generateRandomName(gender, ethnicity) {
d3.csv(csvUrl).then((data) => {
// Filter names by gender and ethnicity
let filteredNames = data.filter(entry => entry['Gender'] === gender && entry['Ethnicity'] === ethnicity);

if (filteredNames.length > 0) {
const randomIndex = Math.floor(Math.random() * filteredNames.length);
const randomName = filteredNames[randomIndex]['First Name'];

// Display the random name in the designated area
d3.select("#random-name").text(`Random Baby Name: ${randomName}`);
} else {
d3.select("#random-name").text("No names found for selected criteria.");
}
});
}

// Function to run on page load
function init() {
    d3.csv(csvUrl).then((data) => {
        console.log(`Data: ${data}`);

        // Get unique names from the dataset
        let names = [...new Set(data.map(entry => entry['First Name']))];

        // Sort the names alphabetically
        names.sort((a, b) => a.localeCompare(b));

        // Use D3 to select the dropdown with id of `#selDataset`
        let dropdownMenu = d3.select("#selDataset");

        // Clear existing options
        dropdownMenu.html("");

        // Populate the select options with sorted unique names
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Get the first sample from the list
        let name = names[0];

        // Build charts and metadata panel with the first sample
        buildMetadata(name);
        buildChart(name);

        // Populate gender and ethnicity dropdowns
        populateDropdowns(data);
    });
}

// Function to populate gender and ethnicity dropdowns for random name generator
function populateDropdowns(data) {
const genders = [...new Set(data.map(entry => entry['Gender']))];
const ethnicities = [...new Set(data.map(entry => entry['Ethnicity']))];

const genderDropdown = d3.select("#genderDropdown");
genders.forEach(gender => {
genderDropdown.append("option").text(gender).property("value", gender);
});

const ethnicityDropdown = d3.select("#ethnicityDropdown");
ethnicities.forEach(ethnicity => {
ethnicityDropdown.append("option").text(ethnicity).property("value", ethnicity);
});
}

// Function for event listener when a new sample is selected
function optionChanged(selectedValue) {
buildMetadata(selectedValue);
buildChart(selectedValue);
}

// Function for generating a random baby name based on user selection
function generateName() {
const selectedGender = d3.select("#genderDropdown").property("value");
const selectedEthnicity = d3.select("#ethnicityDropdown").property("value");

generateRandomName(selectedGender, selectedEthnicity);
}

// Initialize the dashboard
init();