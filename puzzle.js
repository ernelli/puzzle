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
    
    var dir = -1;
      

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

                if(dir !== -1 && dir !== i) {
                    twists.push( [steps.length-2, dir]);
                }

                dir = i;

                break;
            }
        }
    } 

    //console.log("twists: ", twists);

    return steps;
}

//      |
//      |         1 x = -y, y =  x 
//  ----+---*     2 x = -x, y = -y
//      |         3 x =  y, y = -x 
//      |

function rotateVectors(vectors, idx, steps) {
    var i, r0, r1, o0, o1;

    console.log("twist vectors: ", vectors);

    o0 = vectors[0][idx[0]];
    o1 = vectors[0][idx[1]];

    for(i = 0; i < vectors.length; i++) {
        r0 = -(vectors[i][idx[1]] -o1);
        r1 = (vectors[i][idx[0]] - o0);
        vectors[i][idx[0]] = r0 + o1;
        vectors[i][idx[1]] = r1 + o0;
    }

    console.log("twisted vectors: ", vectors);
}

function twistPuzzle(puzzle, turns) {
    rotateVectors(puzzle.slice(2), [2, 1], 1);
}

//var steps = scanGrid(getGrid());
//console.log("steps:" , steps);
