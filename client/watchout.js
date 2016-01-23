

// start slingin' some d3 here.
var currentScore = 0;
var height = 500;
var width = 960;

var svg = d3.select('body').append('svg')
          .attr('width', 960)
          .attr('height', 500)

window.randomize = function(num){
  return Math.floor(Math.random()*num);
}
//draw an enemy in SVG
// var Enemy = function(id) {
//   this.id = id;
//   this.class = 'enemies';
//   this.cx = randomize(width);
//   this.cy = randomize(height);
//   this.r = 30;
//   d3.select('svg').append('circle')
//         .attr('id',this.id)
//         .attr('class', this.class)
//         .attr('cx', this.cx)
//         .attr('cy', this.cy)
//         .attr('r', this.r)
//         .attr('fill', 'black');
// }

var enemyData = [];
var makeEnemies = function(num) {
  for(var i = 0; i < num; i++) {
    // make objects with x, y, and id 
    enemyData.push({
      id: i,
      x: randomize(width),
      y: randomize(height)
    });
  }
}

makeEnemies(10);



setInterval(function(){
  var newCoordinates = [];
  for(var i = 0; i < enemyData.length; i++){
    newCoordinates.push({
      cx: randomize(width),
      cy: randomize(height)
    });
  }
  // d3.selectAll("circle")
  //       .data(newCoordinates)
  //       .transition()
  //       .attr('cx', function(d){return d.cx})
  //       .attr('cy', function(d){return d.cy})
  //       .duration(750);

},3000)



var drag = d3.behavior.drag()  
             .on('dragstart', function() { circle.style('fill', 'green'); })
             .on('drag', function() { 

              circle.attr('cx', d3.event.x)
                .attr('cy', d3.event.y); })
             .on('dragend', function() { circle.style('fill', 'steelblue'); });
var circle = svg.selectAll('.draggableCircle')  
                .data([{ x: randomize(width), y: randomize(height), r: 25 }])
                .enter()
                .append('svg:circle')
                .attr('class', 'draggableCircle')
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .attr('r', function(d) { return d.r; })
                .call(drag)
                .style('fill', 'steelblue');
var enemies = svg.selectAll('.enemies')
                .data(enemyData)
                .enter()
                .append('svg:circle')
                .attr('cx', function(d){ return d.x})
                .attr('cy', function(d){ return d.y})
                .attr('r', 25)
                .style('fill','black')

                // AH HA!
                setInterval(function(){
                  enemies
                    .transition()
                    .attr('cx', function(d) { return randomize(width)})
                    .attr('cy', function(d) { return randomize(height)})
                    .duration(750);
                },3000)


// ends
//adds 1 point every 100 ms
setInterval(function(){
  d3.selectAll('.currentScore')
    .text(currentScore);
  currentScore++;
  
},100);
    // d3.selectAll(".enemies").transition()
    //     .attr('cx',200)
    //     .attr('height',100)
    //     .style('top',500)
    //     .duration(750);




//jQuery section
$(document).ready(function(){
  // refactor the event to record best score.  
  $('body').on('click', function(){ 
    var currentBest = $('#bestScore').text();
    if(currentBest<currentScore){
      console.log("best score!");
      d3.selectAll('#bestScore')
        .text(currentScore);
    } else {
      console.log("not best score");
    }
    currentScore = 0;
  });

  
});

