function getGrid() {
    var puzzle = [

        "  X",
        "  X",
        "XXX",
        "X",
        "XXX",
        "  XX",
        "   XXX",
        "     X",
        "     XX",
        "      XXX",
        "        XXX",
        "          XX",
        "           X",
        "           X"];

    var grid = [];
    var maxlen = 0;

    var i, j;

    for(i = 0; i < puzzle.length; i++) {
        grid[i] = [];
        for(j = 0; j < puzzle[i].length; j++) {
            if(puzzle[i].charCodeAt(j) !== 32) {
                grid[i][j] = 1;
            } else {
                grid[i][j] = 0;
            }
        }
        if(j > maxlen) {
            maxlen = j;
        }
    }


    for(i = 0; i < grid.length; i++) {
        while(grid[i].length < maxlen) {
            grid[i].push(0);
        }    
    }


    return grid;
}

function printGrid(grid) {
    for(i = 0; i < grid.length; i++) {
        console.log(grid[i]);
    }

}

function gridEmpty(grid) {
    for(i = 0; i < grid.length; i++) {
        if(grid[i].indexOf(1) !== -1) {
            return false;
        }
    }
    return true;
}

function scanGrid(grid) {
    var tdir = [ [1, 0], [-1, 0], [0, 1], [0, -1 ] ];
    
    var c = grid[0].indexOf(1);
    var r = 0;
    var steps = [];
    var twists = [];

    var i;

//        console.log("----------------------------");
//        printGrid(grid);

    while(!gridEmpty(grid)) {
        steps.push([r,c, 0]);
        grid[r][c] = 0;

        for(i = 0; i < 4; i++) {
            if(grid[r + tdir[i][0]] && grid[r + tdir[i][0]][ c + tdir[i][1] ]) {
                r += tdir[i][0];
                c += tdir[i][1];
                break;
            }
        }
    } 

    //console.log("twists: ", twists);

    return steps;
}

function equal(v0, v1) {
    return v0[0] === v1[0] && v0[1] === v1[1] && v0[2] === v1[2];
}

function scanTwists(puzzle) {
    var i, twists = [], dirV0;

    for(i = 0; i < puzzle.length-1; i++) {
        var p0 = puzzle[i];
        var p1 = puzzle[i+1];

        var dirV1 = [ p1[0] - p0[0], p1[1] - p0[1] , p1[2] - p0[2] ];
        if(dirV0 && !equal(dirV0, dirV1) ) {
            twists.push(i-1);
        }
        dirV0 = dirV1;
    }
    return twists;
}

//      |
//      |         1 x = -y, y =  x 
//  ----+---*     2 x = -x, y = -y
//      |         3 x =  y, y = -x 
//      |

function rotateVectors(vectors, idx, steps) {
    var i, r0, r1, o0, o1;

    //console.log("twist vectors: ", vectors);

    o0 = vectors[0][idx[0]];
    o1 = vectors[0][idx[1]];

    for(i = 0; i < vectors.length; i++) {
        r0 = -(vectors[i][idx[1]] - o1);
        r1 =  (vectors[i][idx[0]] - o0);
        vectors[i][idx[0]] = r0 + o0;
        vectors[i][idx[1]] = r1 + o1;
    }

    //console.log("twisted vectors: ", vectors);
}

function dumpRotV(puzzle, node) {
    if(node + 1 >= puzzle.length) {
        return;
    }

    var p0 = puzzle[node];
    var p1 = puzzle[node+1];

    var dirV = [ p1[0] - p0[0], p1[1] - p0[1] , p1[2] - p0[2] ];

    var rotV; // = [0, 1, 2];
    if(dirV[0]) {
        rotV = [1, 2];
    } else if(dirV[1]) {
        rotV = [0, 2];
    } else if(dirV[2]) {
        rotV = [0, 1];
    }
    console.log("dirV: ", dirV, ", rotV: ", rotV);
}

function twistPuzzle(puzzle, node, turns) {
    if(node + 1 >= puzzle.length) {
        return;
    }

    var p0 = puzzle[node];
    var p1 = puzzle[node+1];

    var dirV = [ p1[0] - p0[0], p1[1] - p0[1] , p1[2] - p0[2] ];
    var rotV; // = [0, 1, 2];
    if(dirV[0]) {
        rotV = [1, 2];
    } else if(dirV[1]) {
        rotV = [0, 2];
    } else if(dirV[2]) {
        rotV = [0, 1];
    }
    rotateVectors(puzzle.slice(node), rotV, 1);
}

var maxStep = 0;

function solvePuzzle(puzzle, twists, step) {
    var i, j, k;

    if(step >= twists.length) {
        console.log("step: " + step + " exceeds twists: " + twists.length);
        return;
    }

    if(step > maxStep) {
        console.log("step: " + step);
        maxStep = step;
    }

    for(i = 0; i < 3; i++) {
        //console.log("twist: " + i + ", step: " + step);
        twistPuzzle(puzzle, twists[step], 1);

        // check that bounding box is a 3x3 cube
        var min = puzzle[0].slice(0);
        var max = puzzle[0].slice(0);
        
        var end = twists[step+1]+1

        if(step === 15) {
            end = puzzle.length;
            console.log("test until: " + end);
        }

        for(j = 0; j < end; j++) {
            var p = puzzle[j];
            for(k = 0; k < 3; k++) {
                if(p[k] > max[k]) {
                    max[k] = p[k];
                } else if(p[k] < min[k]) {
                    min[k] = p[k];
                }
                if(max[k] - min[k] > 2) {
                    break;
                }
            }
            if(k < 3) {
                break;
            }
        }
        if(j < end) {
            continue;
        }

        if(step === 15) {
            console.log("bbox ok, j: " + j + ", k: " + k + ", min: ", min, ", max: ", max);

            // look for self intersect
            for(j = 0; j < end; j++) {
                for(k = 1; k < j; k++) {
                    if(equal(puzzle[j], puzzle[k])) {
                        console.log("self intersect");
                        break;
                    }
                }
                if(k < j) {
                    break;
                }
            }
            if(j < end) {
                continue;
            }
        }            


        if(step === twists.length-1) {
            console.log("puzzle solved at step: " + step);
            return puzzle;
        }

        console.log("search for  solution at step: " + (step+1));
        var solution = solvePuzzle(puzzle, twists, step+1);
        if(solution) {
            return solution;
        }
    }
    // restore puzzle at current step before return
    twistPuzzle(puzzle, twists[step], 1);
    if(step === 15) {
        console.log("all combinations exhausted, solution not found, puzzle in original shape");
    } else {
        //console.log("dead end at step: " + step);
    }
}

var puzzle = scanGrid(getGrid());
var twists = scanTwists(puzzle);

console.log("twists size: ", twists.length);

var solution = solvePuzzle(puzzle, twists, 1);
console.log("solution: ", solution);


//console.log("steps:" , steps);
