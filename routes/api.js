'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver.SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      const value = Number.parseInt(req.body.value) || -1;
      const coordinate = req.body.coordinate.toUpperCase();
      
      // Validation
      if (!puzzleString || !value || !coordinate) {
        return res.json({error: "Required field(s) missing"})
      }

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
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      const output = solver.solve(puzzleString);

      res.json(output);
    });
};
