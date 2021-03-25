export const INVALID_CHAR_ERROR = "Invalid characters in puzzle";
export const INVALID_LENGTH_ERROR =  "Expected puzzle to be 81 characters long";
export const CANNOT_SOLVE_ERROR = "Puzzle cannot be solved";

export const ROW_CONFLICT_ERROR = "Row conflict found";
export const COLUMN_CONFLICT_ERROR = "Column conflict found";
export const REGION_CONFLICT_ERROR = "Region conflict found";

export class SudokuSolver {

  validate(puzzleString) {
    // Check length
    if (puzzleString.length != 81) return {valid: false, error: INVALID_LENGTH_ERROR};

    // Check for invalid characters
    if (/[^\d\.]/.test(puzzleString)) return {valid: false, error: INVALID_CHAR_ERROR};

    return {valid: true};
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // Find row start and end
    let rowStart = 0, rowEnd = 9;
    for (let i=1; i<=9; i++) {
      if ((row-1)*9 + (column-1) <= rowEnd-1 && (row-1)*9 + (column-1) >= rowStart-1) break

      rowStart += 9;
      rowEnd += 9;
    }

    let rowString = puzzleString.slice(rowStart, rowStart + column - 1) + puzzleString.slice(rowStart + column, rowEnd);

    if ((rowString.includes)(value)) return {valid: false, error: ROW_CONFLICT_ERROR};
    return {valid: true};
  }

  checkColPlacement(puzzleString, row, column, value) {
    let columnString = "";

    for (let i=1; i<=9; i++) {
      if (i!=row) columnString += puzzleString[(column - 1) + 9 * (i-1)];
    }

    if (columnString.includes(value)) return {valid: false, error: COLUMN_CONFLICT_ERROR};
    return {valid: true};
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionStartRow = (row - 1) - ((row - 1) % 3) + 1;   
    const regionStartCol = (column - 1) - ((column - 1) % 3) + 1;

    let regionString = '';
    for (let i=0; i<3; i++) {
      regionString += puzzleString.substring((regionStartCol - 1) + 9*(regionStartRow - 1) + 9*i, ((regionStartCol - 1) + 9*(regionStartRow - 1) + 9*i) + 3);
    }

    // Remove selected value
    const inRegionCoords = [row - regionStartRow, column - regionStartCol];
    const inRegionStringIndex = inRegionCoords[0]*3 + inRegionCoords[1]
    regionString = regionString.slice(0, inRegionStringIndex) + regionString.slice(inRegionStringIndex + 1);

    if (regionString.includes(value)) return {valid: false, error: REGION_CONFLICT_ERROR};
    return {valid: true};
  }

  solve(puzzleString) {
    // Perform checks
    const validation = this.validate(puzzleString);
    if (!validation.valid) return {error: validation.error};

    // Convert puzzleString to array
    let puzzleArray = []
    for (let i=1; i<=9; i++) {
      puzzleArray.push(puzzleString.substring((i-1) * 9, i*9));
    }

    // Find dots coordinates in puzzleArray
    let dotCoords = [];
    for (let i=1; i<=9; i++) {
      for (let j=1; j<=9; j++) {
        if (puzzleArray[i-1][j-1] == '.') dotCoords.push([i, j]);
      }
    }

    // Try with all numbers
    let coord = dotCoords[0];
    for (let i=1; i<=9; i++) {
      let rowCheck = this.checkRowPlacement(puzzleString, coord[0], coord[1], i);
      let colCheck = this.checkColPlacement(puzzleString, coord[0], coord[1], i);
      let regionCheck = this.checkRegionPlacement(puzzleString, coord[0], coord[1], i);

      if (rowCheck.valid && colCheck.valid && regionCheck.valid) {
        if (dotCoords.length == 1) return {solution: puzzleString.replace('.', i.toString())};

        let newSolve = this.solve(puzzleString.replace('.', i.toString()));

        if (newSolve.solution && !newSolve.error) {
          return {solution: newSolve.solution.replace('.', i.toString())};
        }
      }
    }
    return {error: CANNOT_SOLVE_ERROR};
  }
}