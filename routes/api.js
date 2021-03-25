'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver.SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzleString = req.body.puzzle || "";
      let value = req.body.value;
      let coordinate = req.body.coordinate;
      
      // Validation
      if (!puzzleString || !value || !coordinate) {
        return res.json({error: "Required field(s) missing"})
      }

      value = Number.parseInt(value) || -1;
      coordinate = String(coordinate).toUpperCase();
      const row = coordinate[0].charCodeAt(0) - 64;
      const column = Number.parseInt(coordinate[1]);

      if (coordinate.length != 2 || row < 1 || row > 9 || column < 1 || column > 9) {
        return res.json({error: "Invalid coordinate"});
      }

      if (value < 1 || value > 9) {
        return res.json({error: "Invalid value"});
      }

      const solveValidation = solver.validate(puzzleString);
      if (!solveValidation.valid) return res.json({error: solveValidation.error});

      // Check placement
      const conflicts = [];
      const colCheck = solver.checkColPlacement(puzzleString, row, column, value);
      const rowCheck = solver.checkRowPlacement(puzzleString, row, column, value);
      const regionCheck = solver.checkRegionPlacement(puzzleString, row, column, value);

      if (!rowCheck.valid) conflicts.push('row');
      if (!colCheck.valid) conflicts.push('column');
      if (!regionCheck.valid) conflicts.push('region');

      if (conflicts.length >= 1) return res.json({valid: false, conflict: conflicts});
      return res.json({valid: true});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      const output = solver.solve(puzzleString);

      res.json(output);
    });
};
