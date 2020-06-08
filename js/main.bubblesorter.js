let visualSorter
let cnv
let canvasSize 
let params

function getCanvasSize(){
    return [windowWidth, windowHeight]
}

function setup() {
    cnv = createCanvas(...getCanvasSize());
    cnv.style('display', 'block');

    params = getURLParams()

    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);

    frameRate(params.fr || 30)
    makeSorter()
}

function makeSorter(){
    if(!visualSorter){
        visualSorter = new VisualBubbleSorter(...getCanvasSize(), 15).applyRandomizer()
    }
    visualSorter.reset()
    visualSorter.applyRandomizer()
}


function draw() {
    background(color('#322931'));
    visualSorter.draw()    

    let step = visualSorter.bubbleSortStep()

    if(step){
        makeSorter()
    }
}

function windowResized() {
    resizeCanvas(...getCanvasSize());
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
    makeSorter()
}
