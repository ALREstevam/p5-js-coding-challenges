class VisualBubbleSorter {

    constructor(xSpace, ySpace, barThickness, baseHue = undefined, hueOffset = 40) {
        this.barThickness = barThickness
        this.xSpace = xSpace
        this.ySpace = ySpace

        this.bars = new Array(floor(this.xSpace / this.barThickness)).fill(0)

        this.baseHue = baseHue || floor(random(255))
        this.bubbleSortVars = {
            i: 0,
            j: 0
        }
        this.hueOffset = hueOffset

        this.randomizers = {
            random: {
                r: (value, index) => floor(random(15, this.ySpace)),
                shouldShuffle: false,
            },
            inverseIndex: {
                r: (value, index) => floor(map(index, 0, this.bars.length, this.ySpace, 5)),
                shouldShuffle: false,
            },
            noisyShuffled: {
                r: (value, index) => floor(noise(index * 0.01) * this.ySpace),
                shouldShuffle: true,
            },
            noisy: {
                r: (value, index) => floor(noise(index * 0.1) * this.ySpace),
                shouldShuffle: false,
            },
        }
        this.reset()
    }

    chooseHue() {
        return shuffle([
            hue(color('#dd464c')),
            hue(color('#fd8b19')),
            hue(color('#fdcc59')),
            hue(color('#8fc13e')),
            hue(color('#149b93')),
            hue(color('#1290bf')),
            hue(color('#c85e7c')),
            hue(color('#322931')),
        ])[0]
    }

    reset() {
        colorMode(HSB, 255);
        this.baseHue = this.chooseHue()

        this.bubbleSortVars = {
            i: 0,
            j: 0
        }
    }

    applyRandomizer(name=undefined) {
        if(!name){
            name = random( Object.keys(this.randomizers) )
        }

        if (name in this.randomizers) {
            this.bars = this.bars.map((value, index) => this.randomizers[name].r(value, index))

            if (this.randomizers[name].shouldShuffle) {
                this.bars = shuffle(this.bars)
            }

        } else {
            console.error('Not randomized')
        }

        return this
    }


    rectParams(index, barValue) {
        return [
            index * this.barThickness,
            this.ySpace - barValue,
            this.barThickness,
            barValue
        ]
    }

    bubbleSortStep() {
        function swap(arr, indexA, indexB) {
            let aux = arr[indexA]
            let list = arr.slice()

            list[indexA] = list[indexB]
            list[indexB] = aux

            return list
        }


        if (this.bubbleSortVars.i == this.bars.length - 1) {
            this.bubbleSortVars.j += 1
            this.bubbleSortVars.i = 0
        }

        if (this.bubbleSortVars.j > this.bars.length - 1) {
            return true
        }

        if (this.bars[this.bubbleSortVars.i] > this.bars[this.bubbleSortVars.i + 1]) {
            this.bars = swap(this.bars, this.bubbleSortVars.i, this.bubbleSortVars.i + 1)
        }
        this.bubbleSortVars.i += 1
        return false
    }


    barColor(value) {
        return [
            floor(map(value, 0, Math.max(...this.bars), this.baseHue - this.hueOffset, this.baseHue + this.hueOffset)),
            255,
            floor(map(value, 0, Math.max(...this.bars), 90, 255))
        ]
    }



    draw() {
        for (let i = 0; i < this.bars.length; i++) {
            colorMode(HSB, 255);
            fill(...this.barColor(this.bars[i]))
            noStroke()
            rect(...this.rectParams(i, this.bars[i]))
        }
    }
}