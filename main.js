/*
    To change how many grids, all we have to do is change:
    1) CSS:
        - grid__container grid-template-columns to number of rows/columns
    2) JS:
        - Update rows/columns to number of rows/columns
*/

// Priority Queue Data Structure
// User defined class
// to store element and its priority
class QElement {
	constructor(element, priority)
	{
		this.element = element;
		this.priority = priority;
	}
}

// PriorityQueue class
class PriorityQueue {

	// An array is used to implement priority
	constructor()
	{
		this.items = [];
	}

	// functions to be implemented
	// enqueue(item, priority)
    // enqueue function to add element
    // to the queue as per priority
    enqueue(element, priority)
    {
        // creating object from queue element
        var qElement = new QElement(element, priority);
        var contain = false;

        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(qElement);
        }
    }

	// dequeue()
    // dequeue method to remove
    // element from the queue
    dequeue()
    {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

	// front()
	// isEmpty()
    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }

	// printPQueue()
    // printQueue function
    // prints all the element of the queue
    printPQueue()
    {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }

}

// Global Variables
const gridContainer = document.getElementById('grid-container')
const findBtn = document.getElementById('btn')
const resetBtn = document.getElementById('reset')
const span = document.getElementById('shortest')
const slider = document.getElementById('slider')

let start = null
let end = null
let sliderValue = slider.value
let dataRow = -1
let dataColumn = 0 % sliderValue 
let grid = []


// Grid Item class
class Spot{
    constructor(gridItem=null, col=null, row=null, index=null){
        this.gridItem = gridItem
        this.col = col
        this.row = row
        this.index = index
        this.neighbors = []
        this.color = "blue"
    }

    // Check state of Spot object
    is_closed(){
        return this.color === "red"
    }

    is_open(){
        return this.color === "green"
    }

    is_path(){
        return this.color === "purple"
    }

    is_start(){
        return this.color === "orange"
    }

    is_end(){
        return this.color === "turquoise"
    }

    is_barrier(){
        return this.color === "black"
    }

    // Change state of Spot object
    make_reset(){
        this.gridItem.style.backgroundColor = "hsl(230, 100%, 90%)"
        this.color = "blue"
    }

    make_open(){
        this.gridItem.style.backgroundColor = "green"
        this.color = "green"
    }

    make_path(){
        this.gridItem.style.backgroundColor = "purple"
        this.color = "purple"
    }

    make_start(){
        this.gridItem.style.backgroundColor = "orange"
        this.color = "orange"
    }

    make_end(){
        this.gridItem.style.backgroundColor = "turquoise"
        this.color = "turquoise"
    }

    make_closed(){
        this.gridItem.style.backgroundColor = "red"
        this.color = "red"
    }

    make_barrier(){
        this.gridItem.style.backgroundColor = "black"
        this.color = "black"
    }
}

// Load function
document.body.onload = createGrid(sliderValue)

// Create grid on init
function createGrid(sliderValue){
    removeAllChildNodes(gridContainer)
    dataRow = -1
    dataColumn = 0 
    gridContainer.style.gridTemplateColumns = `repeat(${sliderValue}, 1fr)`

    for(i=0; i<sliderValue*sliderValue; i++){
        let gridElement = document.createElement('div')
        gridElement.classList.add('grid__item')
        gridContainer.appendChild(gridElement)
    }

    setGrid(document.querySelectorAll('.grid__item'))
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

slider.addEventListener('change', () => {
    start = null
    end = null
    count = 0
    cost = 0
    clickCount = 0
    createGrid(document.getElementById('slider').value)
})


// Pass in the row and column of each grid item to create the grid of spots
const gridItems = document.querySelectorAll('.grid__item')
function setGrid(gridItems){
    grid = []
    sliderValue = document.getElementById('slider').value
    for(i=0; i<gridItems.length; i++){
        dataColumn = i % sliderValue 

        // Column
        gridItems[i].setAttribute("data-col", dataColumn)
    
        // Row
        if(dataColumn % sliderValue === 0){
            dataRow++
        }
        gridItems[i].setAttribute("data-row", dataRow)
    
        let spot = new Spot(gridItems[i], dataColumn, dataRow, i)
    
        if(dataColumn === sliderValue){
            gridItems[i].setAttribute("data-row", dataRow-1)
            spot.row = dataRow -1
        }
    
        grid.push(spot)
    }

    if(grid){
        grid.forEach((spot) => {
            spot.gridItem.addEventListener('click', () => {
                console.log(spot)
                if(clickCount === 0){
                    spot.make_start()
                    start = spot
                    clickCount++
                    
                }
    
                else if(clickCount === 1){
                    spot.make_end()
                    end = spot
                    clickCount++
                }
    
                else{
                    spot.make_barrier()
                    clickCount++
                }
            })
        })
    }
}

// Add event listener to change status of each grid item
let clickCount = 0


// Heuristic function 
function h(p1, p2){
    const x1 = p1.getAttribute('data-row')
    const y1 = p1.getAttribute('data-col')

    const x2 = p2.getAttribute('data-row')
    const y2 = p2.getAttribute('data-col')

    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

// Update neighbors of grid spot
function updateNeighbors(gridItem){
    sliderValue = document.getElementById('slider').value
    gridItem.gridItem.setAttribute("data-neighbors", '[]')

    const row = parseInt(gridItem.gridItem.getAttribute('data-row')) //1 2
    const col = parseInt(gridItem.gridItem.getAttribute('data-col')) //1 1 

    let neighborArray = []
    // Add the neighbor above it
    if(row < parseInt(sliderValue)-1 && !(grid[col + parseInt(sliderValue) + (parseInt(sliderValue)*(row%parseInt(sliderValue)))].is_barrier())){
        // neighborArray.push(`gridItems[${col} + 10 + (10*(${row}%10))]`)
        neighborArray.push(grid[col + parseInt(sliderValue) + (parseInt(sliderValue)*(row%parseInt(sliderValue)))])
        gridItem.gridItem.setAttribute("data-neighbors", neighborArray)
    } 

    // Add the neighbor below it
    if(row > 0 && !(grid[col+(parseInt(sliderValue)*(row%parseInt(sliderValue))) - parseInt(sliderValue)].is_barrier())){
        // neighborArray.push(`gridItems[${col} + (10*(${row}%10)) - 10]`)
        neighborArray.push(grid[col+(parseInt(sliderValue)*(row%parseInt(sliderValue))) - parseInt(sliderValue)])
        gridItem.gridItem.setAttribute("data-neighbors", neighborArray)
    }

    // Add the neighbor to the right
    if(col < parseInt(sliderValue)-1 && !(grid[col+1 + (parseInt(sliderValue)*row)].is_barrier())){
        // neighborArray.push(`gridItems[${col}+1 + (10*${row})]`)
        neighborArray.push(grid[col+1 + (parseInt(sliderValue)*row)])
        gridItem.gridItem.setAttribute("data-neighbors", neighborArray)
    }

    // Add the neighbor to the left
    if(col > 0 && !(grid[col-1 + (parseInt(sliderValue)*row)].is_barrier())){
        // neighborArray.push(`gridItems[${col}-1 + (10*${row})]`)
        neighborArray.push(grid[col-1 + (parseInt(sliderValue)*row)])
        gridItem.gridItem.setAttribute("data-neighbors", neighborArray)
    }

    // neighborArray = neighborArray.split(',');
    gridItem.neighbors = neighborArray
}

// Reconstruct the shortest path
function reconstructPath(came_from, current){
    while(came_from.has(current)){
        // Current has to be the element (Spot object)
        current = came_from.get(current)
        current.make_path()
    }
}

// Main algorithm function
function algorithm(){
    count = 0
    var open_set = new PriorityQueue();
    open_set.enqueue(start, 0) 
    const came_from = new Map() // Keeps track of where the spot came from
    const g_score = new Map()
    const f_score = new Map()
    const open_set_hash = new Map()
    
    // Initialize each spot's g_score and f_score to 0 
    grid.forEach((spot) => {
        g_score.set(spot, Infinity)
        f_score.set(spot, Infinity)
    })

    // Initialize start's f and g score to the known values
    g_score.set(start, 0)
    f_score.set(start, h(start.gridItem, end.gridItem))

    // Data structure to check if spot is in priortit queue
    open_set_hash.set(start)
    
    while(!open_set.isEmpty()){
        current = open_set.dequeue()
        // console.log(current.element)
        open_set_hash.delete(current)

        // Found the shortest path 
        if(current.element === end){
            reconstructPath(came_from, end)

            end.make_end()
            start.make_start()

            cost = 1
            for(i=0; i<grid.length; i++){
                if(grid[i].is_path()){
                    cost += 1
                }
            }

            span.innerText = `Shortest distance is: ${cost}`
            return true
        }

        // Consider all the neighbors of the current node
        for(neighbor in current.element.neighbors){
            let temp_g_score = g_score.get(current.element) + 1

            if(temp_g_score < g_score.get(current.element.neighbors[neighbor])){
                came_from.set(current.element.neighbors[neighbor], current.element)

                g_score.set(current.element.neighbors[neighbor], temp_g_score)

                f_score.set(current.element.neighbors[neighbor], temp_g_score+h(current.element.neighbors[neighbor].gridItem, end.gridItem))

                if(!open_set_hash.has(current.element.neighbors[neighbor])){
                    count += 1
                    open_set.enqueue(current.element.neighbors[neighbor], f_score.get(current.element.neighbors[neighbor]))
                    current.element.neighbors[neighbor].make_open()
                }
            }
        }

        if(current.element !== start){
            current.element.make_closed()
        }
    }

    span.innerText = `Could not find a path`
    return false

}

// Find the solution
if(findBtn){
    findBtn.addEventListener('click', () => {
        for(i=0; i<grid.length; i++){
            updateNeighbors(grid[i])
        }
        algorithm()
    })
}

// Reset the solution
if(resetBtn){
    resetBtn.addEventListener('click', () => {
        console.log('reset')
        start = null
        end = null
        count = 0
        cost = 0
        clickCount = 0
        span.innerText = `Shortest distance is: ${cost}`
        grid.forEach((spot) => {
            spot.make_reset()
        })
    })
}