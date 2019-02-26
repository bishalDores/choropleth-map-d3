const container = d3.select("div.container");

//adding h1 title
container.append("h1")
    .attr("id","title")
    .text("US Educational Attainment")
//adding h2 title
container.append("h3")
    .attr("id","description")
    .text("Bachelor's degree or higher 2010-2014");

const tooltip = container
    .append("div")
    .attr("id","tooltip");

tooltip.append("p").attr("class","area");
tooltip.append("p").attr("class","education");

//margin to safely draw the legend and the overall visualization
const margin = {
    top:20,
    right:20,
    bottom:20,
    left:20
}

const width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//appending svg to the container
const svgContainer = container.append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
//defining the group element inside svg
const svgCanvas = svgContainer.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);


//creating legend values, color and percentage to fill rect elements
const legendValues = {
    percentage:[3, 12, 21, 30, 39, 48, 57, 66],
    color:["#E5F5E0", "#C7E9C0", "#A1D99B", "#74C476", "#41AB5D", "#238B45", "#006D2C", "#00441B"],
    height:15,
    width:30
}
//creating and appending svg at the top of the svg
const legend = svgCanvas.append("g").attr("id","legend")
    .attr("transform",`translate(${width-legendValues.percentage.length*legendValues.width},0)`);

legend.selectAll("rect")
    .data(legendValues.percentage)
    .enter()
    .append("rect")
    .attr("width", legendValues.width)
    .attr("height",legendValues.height)
    .attr("x",(d,i)=>i*legendValues.width)
    .attr("y",0)
    .attr("fill",(d,i)=>legendValues.color[i]);

//adding texts as labels in legend
legend.selectAll("text")
    .data(legendValues.percentage)
    .enter()
    .append("text")
    .attr("x" ,(d,i)=>i*legendValues.width)
    .attr("y" ,legendValues.height*2)
    .style("font-size","0.6rem")
    .text((d)=> `${d}%`);

//creating quantize scale
const colorScale = d3.scaleQuantize().range(legendValues.color);

//storing the two json data in two constants

const URL_DATA = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
const URL_SVG = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

//first of fetching the education data and passing the json data in a function responsible for merge
fetch(URL_DATA)
    .then((response)=>response.json())
    .then((json)=>mergeData(json));

function mergeData(data) {
    // console.log(data);

}


