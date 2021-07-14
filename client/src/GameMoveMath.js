/*

*****
*****
**#**
*****
*****

LeftHorizontal      -> [-1,  0][-2,  0]
LeftTopDiagonal     -> [-1,  1][-2,  2]

TopVertical         -> [ 0,  1][ 0,  2]
RightTopDiagonal    -> [ 1,  1][ 2,  2]

RightHorizontal     -> [ 1,  0][ 2,  0]
RightBottomDiagonal -> [ 1, -1][ 2, -2]

BottomVertical      -> [ 0, -1][ 0, -2]
LeftBottomDiagonal  -> [-1, -1][-2, -2]
*/

// ora - Outer Ring Array
const ora = [
    [-1, -1, 0, 1, 1, 1, 0, -1],
    [0, 1, 1, 1, 0, -1, -1, -1],
    [-2, -2, 0, 2, 2, 2, 0, -2],
    [0, 2, 2, 2, 0, -2, -2, -2]
];

/*
***
*#*
***

Horizontal     -> [-1,  0][ 1,  0]
Diagonal       -> [-1,  1][ 1, -1]
Vertical       -> [ 0,  1][ 0, -1]
ReverseDiagnol -> [ 1,  1][-1, -1]
*/

// ira - Inner Ring Array
const ira = [
    [-1, -1, 0, 1],
    [0, 1, 1, 1],
    [1, 1, 0, -1],
    [0, -1, -1, -1]
];

export { ora, ira };