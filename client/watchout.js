

// start slingin' some d3 here.
var currentScore = 0;
var bestScore = $('#bestScore').text();
var height = 500;
var width = 960;
var collision = 0;

var svg = d3.select('body').append('svg')
          .attr('width', 960)
          .attr('height', 500)
          .style('display', 'block')
          .style('margin', '0 auto')
          .style('border', '5px solid black');


window.randomize = function(num){
  return Math.floor(Math.random()*num);
}
//draw an enemy in SVG

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
              .style('fill', 'steelblue')
              .style('cursor','pointer')
              .style('stroke-width', '1em')
              .style('stroke','gold');


var enemies = svg.selectAll('.enemies')
              .data(enemyData)
              .enter()
              .append('svg:circle')
              .attr('cx', function(d){ return d.x})
              .attr('cy', function(d){ return d.y})
              .attr('r', 25)
              .attr('class', 'enemies')
              .style('fill', 'black')
              .style('stroke-width', '1em')
              .style('stroke','silver');

var asteroids = svg.selectAll('image')
                .data(enemyData)
                .enter()
                .append('svg:image')
                .attr('xlink:href', 'asteroid.png')
                .attr('class','asteroid')
                .attr('x', function(d){ return d.x})
                .attr('y', function(d){ return d.y})
                .attr('width', '50')
                .attr('height', '50');

var floatingAsteroids = function(){
  asteroids
    .transition()
    .ease('linear', 1, 0.75)
    .duration(1700)
    .attr('x', function(d){ return randomize(d.x)})
    .attr('y', function(d){ return randomize(d.y)})
    .each('end', floatingAsteroids);
}

floatingAsteroids();

   // AH HA!
var collisionChecker = false;
              
var gaveOverStop = function() {
  clearInterval(gameOver);
};
setInterval(function(){
                enemies
                  .transition()
                  .duration(750)
                  .attr('cx', function(d) { return randomize(width)})
                  .attr('cy', function(d) { return randomize(height)});
                if(collisionChecker){ //checkCollision()
                  collision++;
                  d3.selectAll('.collisionNum')
                    .text(collision)
                }
                        $('svg').removeClass('hit');
                        $('.draggableCircle').removeClass('blink hurt')

                if(asteroidCheck) {
                  $(enemies[0].shift()).remove();
                  console.log('remove!');
                }
                collisionChecker = false;
                 asteroidCheck= false;

                 if(!enemies[0].length) {
                  // gameOverStop();
                  var finalScore = currentScore;
                  $('.currentScore').addClass('finalScore').removeClass('currentScore');
                  d3.selectAll('.finalScore').text(finalScore);
                 } 
              },1500)
  
var asteroidCheck = false;

var checkAsteroids = function(){
  var result = false;
  asteroids[0].forEach(function(asteroid, i){
    var x = asteroid.x.animVal.value - circle.attr('cx');
    var y = asteroid.y.animVal.value - circle.attr('cy');

    var hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    if(hypotenuse < (asteroid.width.animVal.value/2 + Number(circle.attr('r')))) {    
      $(asteroid).remove();
      asteroids[0].splice(i, 1);

      console.log(hypotenuse, asteroid.width.animVal.value/2 + Number(circle.attr('r')))
      console.log('score');
      currentScore += 100;
      result = true;
    }
    });
    return result;
}
var checkCollision = function(){
  var result = false;
  enemies[0].forEach(function(enemy) {
    
    var x = enemy.cx.animVal.value - circle.attr('cx'); // -500
    var y = enemy.cy.animVal.value - circle.attr('cy'); // +500 

    var hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    if(hypotenuse < (enemy.r.animVal.value + Number(circle.attr('r')))) {
      // $('svg').addClass('hit');
      $('.draggableCircle').addClass('hurt blink');
      result = true;

      if(bestScore<currentScore){
        d3.selectAll('#bestScore')
          .text(currentScore);
      } else {
      }
      currentScore = 0;
    }
  });
  return result;
}


// ends
//adds 1 point every 100 ms
var gameOver = setInterval(function(){
  collisionChecker = collisionChecker ||checkCollision();
  asteroidCheck = asteroidCheck || checkAsteroids();

    d3.selectAll('.currentScore')
      .text(currentScore);
      if(enemies[0].length){
        currentScore++;
      }
    
  },100);

//jQuery section
$(document).ready(function(){
  // refactor the event to record best score.  
  $('body').on('click', function(){ 
  });

  
});


