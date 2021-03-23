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
    let rowStart = 1, rowEnd = 1;
    for (let i=1; i<=9; i++) {
      rowStart *= i;
      rowEnd *= i + 1;

      if (row <= rowEnd && row >= rowStart) break
    }

    let rowString = puzzleString.slice(rowStart - 1, column - 1) + puzzleString.slice(column, rowEnd);

    if ((rowString.includes)(value)) return {valid: false, error: ROW_CONFLICT_ERROR};
    return {valid: true};
  }

  checkColPlacement(puzzleString, row, column, value) {
    let columnString = "";

    for (let i=1; i<=9; i++) {
      if (i!=row) columnString += puzzleString[(column - 1) + 9 * i];
    }

    if (columnString.includes(value)) return {valid: false, error: COLUMN_CONFLICT_ERROR};
    return {valid: true};
  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}
