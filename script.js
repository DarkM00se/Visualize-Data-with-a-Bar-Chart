//ideclare the dataset
let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";//dataset used in the bar chart
let req = new XMLHttpRequest();//how we import variable data


let values= []//value variable, store the array in values




const w = 800;//width of chart
const h = 600;//height of chart
const padding = 40;//padding

let svg = d3.select("svg");//select and up svg container where the axis will be drawn

let drawChart = () =>{
    svg.attr("width",w)//add width attribute to svg chart
    svg.attr("height",h)//add height attribute
    
}

let generateScales = () =>{//generate the length and width of the scales in the chart

            yScale =d3.scaleLinear()//height scale of chart
            .domain([0,d3.max(values,(item)=>{
                return item[1];
            
            })])//domain is minimum and maximum values from the gdp array dtase
            .range([0,h-(2*padding)])//height should minus the padding

                xScale = d3.scaleLinear()        //creating the xScale which determines how long the x scale axis is.
                .domain([0, values.length-1])
                .range([padding, w-padding])

let datesArray =values.map((item)=>{//create new array for the dates
    return new Date(item[0])//convert a string into date object
})


xAxisScale= d3.scaleTime()//dates on the xAxisScale
.domain([d3.min(datesArray), d3.max(datesArray)])
.range([padding, w-padding])

yAxisScale= d3.scaleLinear()
.domain([0, d3.max(values, (item)=>{
    return item[1]
})])
.range([h-padding, padding])



}



let drawBars=()=>{//use attribute rec(for rectangle to shape the bars in the graph)
     //create a tooltip for user story,
    let tooltip= d3.select("body")
    .append("div")
    .attr("id","tooltip")
    .style("visibility","hidden")
    .style("width","auto")
    .style("height","auto")
   
    const barColor ="purple";
    svg.selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class","bar")//setc class to "bar"
    .attr("width",(w-(2*padding))/values.length)// set the width for the rectangle bar, values.length will divide the bars evenly
    .attr("data-date",(item)=>{
        return item[0]
  
    })
   
    
    
    .attr("data-gdp",(item)=>{
        return item[1]}
    )
    .attr("height",(item)=>{
        return yScale(item[1])
    })
    .attr("x",(item,index)=>{
        return xScale(index)
    })
    .attr("y",(item)=>{
        return (h-padding) - yScale(item[1])
    })    
    .attr('fill', barColor)

    .on("mouseover",(event,item) => {//event handler for mouseover function, must include and event and data argument.
      
        tooltip.transition().style("visibility", "visible");
        tooltip.text(item[0]);
       console.log(item[0])//data log
        document.querySelector("#tooltip").setAttribute("data-date",item[0]);
      })
      
      .on("mouseout", () => {
        tooltip.transition().style("visibility", "hidden");
      });
}



let generateAxis= () =>{//generate the x and y axis


    let xAxis =d3.axisBottom(xAxisScale)
    let yAxis =d3.axisLeft(yAxisScale)

    svg.append("g")//ge element x axis
    .call(xAxis)
    .attr("id","x-axis")//set id to x-axis
    .attr("transform", "translate(0, " + (h-padding) + ")" )// Move the axis to the bottom of the SVG container
   
    svg.append("g")
    .call(yAxis)
    .attr("id","y-axis")
    .attr("transform","translate("  + padding + ",0)")
  

}
//fetching the JSON data
req.open("GET",url,true)//get request to get the database values 
req.onload= () => {//onload values to data
    data = JSON.parse(req.responseText) //convert the response into json.parse
   values = data.data //values to data
    console.log(values)//console.log the values
    drawChart()
    generateScales()
    drawBars()
    generateAxis()
}

req.send()//send the response