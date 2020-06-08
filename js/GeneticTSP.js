function City(x, y, name) {
    return {
        x: x,
        y: y,
        name: name
    }
}

/*const colors = [
    '#dd464c',
    '#fd8b19',
    '#fdcc59',
    '#8fc13e',
    '#149b93',
    '#1290bf',
    '#c85e7c',
    '#322931',
]*/

/*function pickOneByProbabilityKey(list, probabilityKey = 'pickProbability') {
    let index = 0
    let picker = random(1)

    while (picker > 0) {
        picker -= list[index][probabilityKey]
        index += 1
    }

    return list[index - 1]
}*/

function sum(list) {
    return list.reduce((a, b) => a + b, 0)
}

function pickOneByProbabilityFunction(list, probabilityCalculator, maxElement = 1) {
    let index = 0
    let picker = random(maxElement)

    while (picker > 0) {
        picker = picker - probabilityCalculator(list[index])
        index += 1
    }

    return list[index - 1]
}

function pickOneByProbabilityKey(list, probabilityKey = 'pickProbability', maxElement = 1) {
    return pickOneByProbabilityFunction(list, (element) => {
        return element[probabilityKey]
    }, maxElement)
}




function forEachRoad(cities, func, keyGenerator = undefined, runForInverseDirectionRoad = false) {

    function defineJ(i, runForInverseDirectionRoad) {
        if (runForInverseDirectionRoad) {
            return 0
        } else {
            return i + 1
        }
    }

    let result = keyGenerator ? {} : []
    for (let i = 0; i < cities.length; i++) {
        for (let j = defineJ(i, runForInverseDirectionRoad); j < cities.length; j++) {

            let cityA = cities[i]
            let cityB = cities[j]

            if (keyGenerator) {
                result[keyGenerator(cityA, cityB, i, j)] = func(cityA, cityB, result[keyGenerator(cityA, cityB, i, j)])
            } else {
                result.push(
                    func(cityA, cityB)
                )
            }
        }
    }
    return result
}

function forEachRoadDirection(cities, func, keyGenerator = undefined) {
    return forEachRoad(cities, func, keyGenerator, true)
}

function swap(array, index1, index2) {
    let aux = array[index1]

    let arrCopy = array.slice()
    arrCopy[index1] = arrCopy[index2]
    arrCopy[index2] = aux

    return arrCopy
}

function closedLoopPath(cities) {
    return [...cities, cities[0]]
}

function spinArrayLeft(list, units) {
    let result = new Array(list.length).fill(undefined)

    if (units <= 0) {
        return list
    }

    for (let index = 0; index < list.length; index++) {

        let newIndex = index - units

        if (newIndex >= 0) {
            result[newIndex] = list[index]
        } else {
            result[list.length + newIndex] = list[index]
        }
    }
    return result
}

function spinArrayToPutFirst(list, putFirst) {
    return spinArrayLeft(list, list.indexOf(putFirst))
}


class CachedData {

    constructor(cities) {
        this.roads = this.generateRoads(cities)
        this.distances = this.generateRoadDistancesMap(cities)
        this.citiesByName = this.generateCitiesByNameMap(cities)

        this.pathDistances = {}
    }

    distance(cityA, cityB) {
        return this.distanceByName(cityA.name, cityB.name)
    }

    distanceByName(nameCityA, nameCityB) {
        return this.distances[nameCityA][nameCityB]
    }

    city(name) {
        return this.citiesByName[name]
    }

    pathDistanceByNames(names) {

        names = spinArrayToPutFirst(names, 0)

        if (names.join('-') in this.pathDistances) {
            return this.pathDistances[names.join('-')]
        }

        let totalDistance = 0
        for (let i = 0; i < names.length - 1; i++) {
            totalDistance += this.distanceByName(names[i], names[i + 1])
        }

        this.pathDistances[names.join('-')] = totalDistance

        return totalDistance
    }

    generateCitiesByNameMap(cities) {
        let citiesObj = {}

        for (let i = 0; i < cities.length; i++) {
            citiesObj[cities[i].name] = cities[i]
        }

        return citiesObj
    }

    generateRoads(cities) {
        return forEachRoad(cities, (city_a, city_b) => {
            return {
                cities: [city_a, city_b],
                distance: dist(city_a.x, city_a.y, city_b.x, city_b.y)
            }
        })
    }

    generateRoadDistancesMap(cities) {
        return forEachRoadDirection(cities, (cityA, cityB, old) => {
            if (!old) old = {}
            old[cityB.name] = dist(cityA.x, cityA.y, cityB.x, cityB.y)
            return old
        }, (cityA, cityB, i, j) => cityA.name)
    }

}



class Drawer {
    static drawPossiblePaths(cities) {
        forEachRoad(cities,
            (city_a, city_b) => {
                stroke(color('rgba(0,0,0,.2)'))
                strokeWeight(1)
                line(
                    city_a.x, city_a.y, city_b.x, city_b.y
                )
            }
        )

    }

    static drawCity(city) {
        fill(color('#dd464c'))
        textSize(18);
        noStroke()
        let ballSize = 10
        circle(city.x, city.y, ballSize)
        fill(color('#fd8b19'))
        text(city.name, city.x - (ballSize / 2), city.y + 2.5 * ballSize);
    }

    static drawCities(cities) {
        for (let i = 0; i < cities.length; i++) {
            Drawer.drawCity(cities[i])
        }
    }

    static drawRoad(cityA, cityB) {
        stroke(color('#149b93'))
        strokeWeight(3)
        line(cityA.x, cityA.y, cityB.x, cityB.y)
    }

    static drawPath(cities) {
        for (let i = 0; i < cities.length - 1; i++) {
            Drawer.drawRoad(cities[i], cities[i + 1])
        }
    }

    static drawStats(list, stats) {

        let cursor = [10, 20]

        textSize(18);
        textStyle(BOLD);
        fill(color('#8fc13e'))
        noStroke()

        /*const colors = [
            '#dd464c',
            '#fd8b19',
            '#fdcc59',
            '#8fc13e',
            '#149b93',
            '#1290bf',
            '#c85e7c',
            '#322931',
        ]*/

        for (let i = 0; i < list.length; i++) {
            text(list[i], ...cursor)
            cursor[1] += 19
        }

        if (stats) {
            let titles = Object.keys(stats)

            for (let index = 0; index < titles.length; index++) {
                let title = titles[index]
                let toWrite = stats[titles[index]]

                fill(color('#1290bf'))

                textSize(13);
                textStyle(BOLD);
                text(title + ': ', ...cursor)

                fill(color('#fdcc59'))
                textStyle(NORMAL);
                text(toWrite, cursor[0] + textWidth(title) + 18, cursor[1])
                cursor[1] += 15

                

            }
        }
    }
}




class CitiesMap {
    constructor(cities, xInit, yInit, width, height) {
        this.xInit = xInit
        this.yInit = yInit
        this.width = width
        this.height = height

        if (Number.isInteger(cities)) {
            this.cities = this.generateCities(cities)
        } else {
            this.cities = cities.map((city) => {
                return City(city.x + xInit, city.y + yInit, city.name)
            })
        }
    }

    mapCityLocation(city) {
        return City(city.x + this.xInit, city.y + this.yInit, city.name)
    }

    generateCities(citiesAmount) {
        return new Array(citiesAmount).fill(undefined).map(
            (value, index) => City(...this.random2dCoordinate(this.xInit + 30, this.yInit + 30, this.width - 30, this.height - 30), index)
        )
    }

    random2dCoordinate(xInit, yInit, width, height) {
        return [
            floor(random(xInit, xInit + width)),
            floor(random(yInit, yInit + height))
        ]
    }

    draw(path = undefined) {
        //Drawer.drawRoad(this.cities[0], this.cities[1])
        Drawer.drawPossiblePaths(this.cities)

        if (path) {
            Drawer.drawPath(path)
        }

        Drawer.drawCities(this.cities)

    }

}



class DnaHelper {
    static citiesToDna(cities) {
        return cities.map((city) => city.name)
    }

    static generateRandomGene(citiesAmount) {
        return shuffle(new Array(citiesAmount).fill(undefined).map((value, index) => index))
    }


    static mutate(dna, mutationRate = .1) {

        const mutations = {
            //Swaps two random points
            randomSwap: {
                doMutation: (dna) => swap(dna, floor(random(dna.length)), floor(random(dna.length))),
                probability: .3
            },

            //Swaps two neighboring bases
            neighborSwap: {
                doMutation: (dna) => {
                    let turnPoint = floor(random(dna.length))
                    if (turnPoint == dna.length - 1) turnPoint -= 1
                    return swap(dna, turnPoint, turnPoint + 1)
                },
                probability: .3
            },

            //Swaps two bases around a third base, called the pivot point
            pivotSwap: {
                doMutation: (dna) => {
                    let pivot = floor(random(dna.length))
                    return swap(dna, (pivot + 1) % dna.length, pivot - 1 < 0 ? (dna.length - 1) : pivot - 1)
                },
                probability: .4
            },
        }

        if (random() <= mutationRate) { // If this is true, the DNA must mutate
            let mutationNames = Object.keys(mutations).map(
                (mutationName) => {
                    return {
                        name: mutationName,
                        probability: mutations[mutationName].probability
                    }
                }
            )
            let maxProbability = sum(Object.keys(mutations).map(el => mutations[el].probability))

            let chosenMutation = pickOneByProbabilityKey(mutationNames, 'probability', maxProbability).name
            let mutated = mutations[chosenMutation].doMutation(dna)
            return mutated
        }
        return dna
    }


    static crossover(dnaA, dnaB) {
        let sliceStart = floor(random(dnaA.length))
        let sliceEnd = floor(random(sliceStart + 1, dnaA.length))

        let offspringDna = dnaA.slice(sliceStart, sliceEnd)

        for (let i = 0; i < dnaB.length; i++) {
            if (!offspringDna.includes(dnaB[i])) {
                offspringDna.push(dnaB[i])
            }
        }
        return offspringDna
    }


}


class VisualEvolutionEngine {

    constructor(dnaSize = 10, xInit = 0, yInit = 0, width = windowWidth, height = windowHeight, seed = 99) {
        randomSeed(seed)

        this.dnaSize = dnaSize
        this.genePool = undefined
        this.bestEverVisualization = new CitiesMap(dnaSize, xInit, yInit, width, height / 2.2)
        this.currentBestVisualization = new CitiesMap(this.bestEverVisualization.cities, xInit, 5 + height / 2, width, height / 2.2)
        this.cities = this.bestEverVisualization.cities
        this.cache = new CachedData(this.cities)
        this.shouldEvolve = true
        this.generation = 0
        this.generationsSinceBestEver = 0

        this.bestDnaInGeneration = {
            gene: [],
            fitness: Infinity,
            mappedFitness: Infinity,
        }

        this.bestDnaEver = {
            gene: [],
            fitness: Infinity,
            mappedFitness: Infinity,
        }
    }

    populateRandomly(initialPopulation = 10) {

        this.genePool = new Array(initialPopulation * 1.5)
            .fill(undefined) //filling with some value
            .map(() => DnaHelper.generateRandomGene(this.dnaSize))
            .map((gene) => spinArrayToPutFirst(gene, 0))
        let comparablePool = this.genePool.map((gene) => gene.join('-'))

        this.genePool = this.genePool.filter((gene, index) => comparablePool.indexOf(gene.join('-')) == index)
        this.genePool = Array.from(new Set(this.genePool))

        return this
    }

    fitness(path) {
        return this.cache.pathDistanceByNames([...path, path[0]])
    }

    mapFitness(value, minFitness, maxFitness) {
        return map(value, minFitness, maxFitness, 0, 1)
    }

    bruteForce() {
        [0, 1, 2, 3]
    }


    evolve(populationGoal = 10, mutationRate = .1) {
        if (!shouldEvolve) {
            return
        }

        let nextGeneration = []
        let geneFitness = this.genePool.map(gene => {
            return {
                fitness: this.fitness(gene) + 0.01,
                gene: gene,
            }
        })

        const epow = (num, pow, e = 2.71828) => {
            //return Math.pow(e, Math.pow(num, pow))
            return Math.pow(num, pow)
        }

        geneFitness = geneFitness.sort((dnaA, dnaB) => dnaA.fitness - dnaB.fitness)

        geneFitness = geneFitness.map(gene => {
            let pow = 5

            return {
                gene: gene.gene,
                mappedFitness: this.mapFitness(
                    epow(gene.fitness, pow),
                    epow(geneFitness[geneFitness.length - 1].fitness, pow),
                    epow(geneFitness[0].fitness, pow)
                ),
                fitness: gene.fitness,
            }

        })

        let scoreSum = sum(geneFitness.map(geneFitness => geneFitness.mappedFitness))

        //Offspring
        for (let i = 0; i < populationGoal; i++) {
            let selectedGeneA = pickOneByProbabilityKey(geneFitness, 'mappedFitness', scoreSum)
            let selectedGeneB = pickOneByProbabilityKey(geneFitness, 'mappedFitness', scoreSum)
            let offspringDna = DnaHelper.crossover(selectedGeneA.gene, selectedGeneB.gene)
            nextGeneration.push(
                DnaHelper.mutate(offspringDna, mutationRate)
            )
        }

        for (let i = 0; i < ceil(populationGoal * 1.5); i++) {
            //Mutated survivors
            nextGeneration.push(DnaHelper.mutate(pickOneByProbabilityKey(geneFitness, 'mappedFitness', scoreSum).gene, 1))
        }

        for (let i = 0; i < ceil(populationGoal * .1); i++) {
            //Survivors
            nextGeneration.push(pickOneByProbabilityKey(geneFitness, 'mappedFitness', scoreSum).gene)
        }

        this.bestDnaInGeneration = geneFitness[0]

        if (geneFitness[0].fitness < this.bestDnaEver.fitness) {
            this.bestDnaEver = geneFitness[0]
            this.generationsSinceBestEver = 0
        }

        this.removeDuplicatedDna()
        this.genePool = nextGeneration

        this.generation += 1
        this.generationsSinceBestEver += 1

    }

    removeDuplicatedDna() {
        let comparablePool = this.genePool.map((gene) => gene.join('-'))

        this.genePool = this.genePool.filter((gene, index) => comparablePool.indexOf(gene.join('-')) == index)
        this.genePool = Array.from(new Set(this.genePool))
    }

    draw() {

        this.bestEverVisualization.draw(
            closedLoopPath(
                this.bestDnaEver.gene.map((name) => this.cache.city(name))
            ),
        )

        this.currentBestVisualization.draw(
            closedLoopPath(
                this.bestDnaInGeneration.gene
                .map((name) => this.cache.city(name))
                .map(city => this.currentBestVisualization.mapCityLocation(city))
            ),
        )

        Drawer.drawStats(['Traveling Salesman Problem - genetic algorithm'], {
            'Best ever': this.bestDnaEver.fitness.toFixed(5),
            'Best in current generation': this.bestDnaInGeneration.fitness.toFixed(5),
            'Generations': this.generation,
            'Generations since best ever': this.generationsSinceBestEver,
            'Population': this.genePool.length,
            'Evolve enabled': this.shouldEvolve ? 'yes' : 'no'
        })


    }




}