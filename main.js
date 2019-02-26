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
//fetch svg value
    fetch(URL_SVG)
        .then((response)=>response.json())
        .then((json)=>{
            //loop through the educational array
            for(let i = 0;i<data.length;i++){
                let fips = data[i].fips;
                //loop through the array of geometries of the counties
                let geometries = json.objects.counties.geometries;
                for(let j = 0; j<geometries.length;j++){
                    let id = geometries[j].id;
                    if (fips == id){
                        geometries[j] = Object.assign({},geometries[j],data[i]);
                        break;
                    }
                }
            }

            // console.log(json);
            return json;
        })
        .then((json) => drawMap(json));
}
// json data including educational data and county data
function drawMap(data) {
    colorScale.domain([0,d3.max(data.objects.counties.geometries, (d)=>d.bachelorsOrHigher)]);
    // console.log(data)

    /* as d3.geoPath() works with GeoJSON, it is first necessary to convert the object into a type of understandable format
     topojson.feature is a function from the topojson library which converts a topology to a feature collection
     it accepts two arguments, the object itself and the subset to be "feature-ized"*/
    let feature = topojson.feature(data, data.objects.counties);
    console.log(feature)

    //function that creates SVG values from the coordinates included in the JSON file
    const path = d3.geoPath();

    // console.log(path(feature))

    //append a path element for each feature

    svgCanvas.selectAll("path")
        .data(feature.features)
        .enter()
        .append("path")
        .attr("d",path)
        .attr("transform",`scale(0.82,0.62)`)
         //fcc user stories
        .attr("class","county")
        .attr("data-fips",(d,i) => data.objects.counties.geometries[i].fips)
        .attr("data-state",(d,i) => data.objects.counties.geometries[i].state)
        .attr("data-area",(d,i) => data.objects.counties.geometries[i].area_name)
        .attr("data-education",(d,i) => data.objects.counties.geometries[i].bachelorsOrHigher)
        // include a fill property dependant on the bachelorsOrHigher property and the color scale
        .attr("fill",(d,i)=>colorScale(data.objects.counties.geometries[i].bachelorsOrHigher))
        //including tooltip property
        .on("mouseenter",(d,i)=>{
            tooltip.style("opacity",1)
                .attr("data-fips",data.objects.counties.geometries[i].fips)
                .attr("data-education",data.objects.counties.geometries[i].bachelorsOrHigher)
                .style("left",`${d3.event.layerX+5}px`)
                .style("top",`${d3.event.layerY+5}px`);
            tooltip
                .select("p.area")
                .text(() => `${data.objects.counties.geometries[i].area_name}, ${data.objects.counties.geometries[i].state}`);
            tooltip
                .select("p.education")
                .text(() => `${data.objects.counties.geometries[i].area_name}, ${data.objects.counties.geometries[i].bachelorsOrHigher}%`);
        })
        .on("mouseout",()=>tooltip.style("opacity",0))


}





