let cnv
let evolution
let shouldEvolve = true
let params

function getCanvasSize() {
    return [windowWidth, windowHeight]
}

function setup() {
    cnv = createCanvas(...getCanvasSize());
    cnv.style('display', 'block');

    params = getURLParams()

    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);

    frameRate(10)
    setupEvolution()

}

function setupEvolution(){
    evolution = new VisualEvolutionEngine( parseInt(params.cities) || floor(random(4,15) ), 0, 0, ...getCanvasSize(), params.seed).populateRandomly( params.pop || 100)
}

function mousePressed() {
    shouldEvolve = !shouldEvolve
    evolution.shouldEvolve = !evolution.shouldEvolve
    // prevent default
    return false;
  }


function draw() {
    background(color('#322931'));
    evolution.draw()
    //fill(color('rgba(0,0,0,0)'))
    //stroke(color('red'))
    //rect(0, 0, getCanvasSize()[0], getCanvasSize()[1]/2)
    //rect(0, 5 + getCanvasSize()[1]/2, getCanvasSize()[0], getCanvasSize()[1]/2)
    if(shouldEvolve){
        evolution.evolve(params.pop || 150, .3)
    }
}


function windowResized() {
    resizeCanvas(...getCanvasSize());
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
    setupEvolution()
}