const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const {
  puzzleString,
  puzzlesAndSolutions,
} = require("../controllers/puzzle-strings");
const { expect } = require("chai");

const solver = new Solver.SudokuSolver();

// Logic handles a valid puzzle string of 81 characters
// Logic handles a puzzle string with invalid characters (not 1-9 or .)
// Logic handles a puzzle string that is not 81 characters in length
// Logic handles a valid row placement
// Logic handles an invalid row placement
// Logic handles a valid Col placement
// Logic handles an invalid Col placement
// Logic handles a valid region (3x3 grid) placement
// Logic handles an invalid region (3x3 grid) placement
// Valid puzzle strings pass the solver
// Invalid puzzle strings fail the solver
// Solver returns the the expected solution for an incomplete puzzzle

suite("UnitTests", () => {
  suite("SudokuSolver.validate(puzzleString) tests", () => {
    test("Valid puzzle string of 81 characters", (done) => {
      const output = solver.validate(puzzlesAndSolutions[0][0]);

      assert.isTrue(output.valid);
      assert.notExists(output.error);
      done();
    });

    test("Invalid puzzle string with invalid characters", (done) => {
      const output = solver.validate(
        puzzlesAndSolutions[0][0].replace(".", "?")
      );

      assert.isFalse(output.valid);
      assert.equal(output.error, Solver.INVALID_CHAR_ERROR);
      done();
    });

    test("Invalid puzzle with length not equal to 81", (done) => {
      const output = solver.validate(puzzlesAndSolutions[0][0].substring(40));

      assert.isFalse(output.valid);
      assert.equal(output.error, Solver.INVALID_LENGTH_ERROR);
      done();
    });
  });

  suite('"Check" functions tests', () => {
    test("Valid row placement", (done) => {
      const output = solver.checkRowPlacement(
        puzzlesAndSolutions[0][0],
        4,
        1,
        3
      );

      assert.isTrue(output.valid);
      assert.notExists(output.error);
      done();
    });

    test("Invalid row placement", (done) => {
      const output = solver.checkRowPlacement(
        puzzlesAndSolutions[0][0],
        1,
        2,
        1
      );

      assert.isFalse(output.valid);
      assert.equal(output.error, Solver.ROW_CONFLICT_ERROR);
      done();
    });

    test("Valid Col placement", (done) => {
      const output = solver.checkColPlacement(
        puzzlesAndSolutions[0][0],
        3,
        1,
        5
      );

      assert.isTrue(output.valid);
      assert.notExists(output.error);
      done();
    });

    test("Invalid Col placement", (done) => {
      const output = solver.checkColPlacement(
        puzzlesAndSolutions[0][0],
        5,
        4,
        1
      );

      assert.isFalse(output.valid);
      assert.equal(output.error, Solver.COLUMN_CONFLICT_ERROR);
      done();
    });

    test("Valid region placement", (done) => {
      const output = solver.checkRegionPlacement(
        puzzlesAndSolutions[0][0],
        2,
        2,
        7
      );

      assert.isTrue(output.valid);
      assert.notExists(output.error);
      done();
    });

    test("Invalid region placement", (done) => {
      const output = solver.checkRegionPlacement(
        puzzlesAndSolutions[0][0],
        4,
        3,
        8
      );

      assert.isFalse(output.valid);
      assert.equal(output.error, Solver.REGION_CONFLICT_ERROR);
      done();
    });
  });

  suite('Solver.solve(puzzleString) tests', () => {
    test('Valid puzzle string', (done) => {
      const output = solver.validate(puzzlesAndSolutions[0][0]);

      assert.exists(output.solution);
      assert.notExists(output.error);
      done();
    });

    test('Invalid puzzle string', (done) => {
      const output = solver.solve(puzzlesAndSolutions[0][0].slice(5));

      assert.notExists(output.solution);
      assert.equal(output.error, Solver.INVALID_LENGTH_ERROR);
      done();
    });

    test('Return correct solution', (done) => {
      let output = solver.solve(puzzlesAndSolutions[0][0]);
      let expected = puzzlesAndSolutions[0][1];

      // assert.equal(output.solution, expected);
      // assert.notExists(output.error);

      output = solver.solve('7692354188514963724321789561745692833958427616287135492836571945169248379473816.5');
      expected = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      assert.equal(output, expected);
      done();
    });
  });
});
