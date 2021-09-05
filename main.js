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


const gridItems = document.querySelectorAll('.grid__item')
const findBtn = document.getElementById('btn')
const resetBtn = document.getElementById('reset')
const span = document.getElementById('shortest')

let start = null
let end = null

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

// Pass in the row and column of each grid item
let dataRow = -1
let grid = []
for(i=0; i<gridItems.length; i++){
    let dataColumn = i % 10 

    // Column
    gridItems[i].setAttribute("data-col", dataColumn)

    // Row
    if(dataColumn % 10 === 0){
        dataRow++
    }
    gridItems[i].setAttribute("data-row", dataRow)

    let spot = new Spot(gridItems[i], dataColumn, dataRow, i)

    if(dataColumn === 10){
        gridItems[i].setAttribute("data-row", dataRow-1)
        spot.row = dataRow -1
    }

    grid.push(spot)
}

let clickCount = 0
// Add event listener to change status of each grid item
if(grid){
    grid.forEach((spot) => {
        spot.gridItem.addEventListener('click', () => {

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
    gridItem.gridItem.setAttribute("data-neighbors", '[]')

    const row = parseInt(gridItem.gridItem.getAttribute('data-row')) //1 2
    const col = parseInt(gridItem.gridItem.getAttribute('data-col')) //1 1 

    let neighborArray = []

    // Add the neighbor above it
    if(row < 10-1 && !(grid[col + 10 + (10*(row%10))].is_barrier())){
        // neighborArray.push(`gridItems[${col} + 10 + (10*(${row}%10))]`)
        neighborArray.push(grid[col + 10 + (10*(row%10))])
        gridItem.gridItem.setAttribute("data-neighbors", neighborArray)
    } 

    // Add the neighbor below it
    if(row > 0 && !(grid[col+(10*(row%10)) - 10].is_barrier())){
        // neighborArray.push(`gridItems[${col} + (10*(${row}%10)) - 10]`)
        neighborArray.push(grid[col+(10*(row%10)) - 10])
        gridItem.gridItem.setAttribute("data-neighbors", neighborArray)
    }

    // Add the neighbor to the right
    if(col < 10-1 && !(grid[col+1 + (10*row)].is_barrier())){
        // neighborArray.push(`gridItems[${col}+1 + (10*${row})]`)
        neighborArray.push(grid[col+1 + (10*row)])
        gridItem.gridItem.setAttribute("data-neighbors", neighborArray)
    }

    // Add the neighbor to the left
    if(col > 0 && !(grid[col-1 + (10*row)].is_barrier())){
        // neighborArray.push(`gridItems[${col}-1 + (10*${row})]`)
        neighborArray.push(grid[col-1 + (10*row)])
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

if(findBtn){
    findBtn.addEventListener('click', () => {
        for(i=0; i<grid.length; i++){
            updateNeighbors(grid[i])
        }
        algorithm()
    })
}

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