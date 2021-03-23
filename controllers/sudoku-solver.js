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

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}
