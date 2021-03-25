const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const {puzzlesAndSolutions} = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

    // Check a puzzle placement with all fields: POST request to /api/check
    // Check a puzzle placement with single placement conflict: POST request to /api/check
    // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    // Check a puzzle placement with all placement conflicts: POST request to /api/check
    // Check a puzzle placement with missing required fields: POST request to /api/check
    // Check a puzzle placement with invalid characters: POST request to /api/check
    // Check a puzzle placement with incorrect length: POST request to /api/check
    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    // Check a puzzle placement with invalid placement value: POST request to /api/check

suite('Functional Tests', () => {
  suite('Solve puzzle tests', () => {
    test('Solve puzzle with valid puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle: puzzlesAndSolutions[2][0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.solution, puzzlesAndSolutions[2][1]);
          done();
        })
    });

    test('Solve puzzle with missing puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle: ''})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.error, 'Required field missing');
          done();
        });
    });

    test('Solve puzzle with invalid characters', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle: puzzlesAndSolutions[0][0].replace('.', '?')})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle: puzzlesAndSolutions[0][0].slice(20)})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.error, 'Expected puzzle to be 81 characters long')
          done();
        });
    });
    
    test('Solve a puzzle that cannot be solved', (err, res) => {
      chai.request(server)
        .post('/api/solve')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....5.37.4.3..6..'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.error, 'Puzzle cannot be solved');
          done();
        })
    })
  });
});

