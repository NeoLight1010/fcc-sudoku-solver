const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const {puzzlesAndSolutions} = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Solve puzzle tests', () => {
    test('Solve puzzle with valid puzzle string', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: puzzlesAndSolutions[2][0]})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, puzzlesAndSolutions[2][1]);
        done();
      })
    });
    
    test('Solve puzzle with missing puzzle string', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: ''})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
    });
    
    test('Solve puzzle with invalid characters', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: puzzlesAndSolutions[0][0].replace('.', '?')})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
    });
    
    test('Solve a puzzle with incorrect length', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: puzzlesAndSolutions[0][0].slice(20)})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done();
      });
    });
    
    test('Solve a puzzle that cannot be solved', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....5.37.4.3..6..'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
    });
  });
  
  suite('Check puzzle placement test', () => {
    test('Check a placement with all fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
               coordinate: 'A5',
               value: 2
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        })
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
               coordinate: 'd3',
               value: 3
              })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict, ['row']);
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
               coordinate: 'd3',
               value: 6
              })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict, ['row', 'region']);
          done();
        });      
    });

    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
               coordinate: 'd5',
               value: 1
              })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict, ['row', 'column', 'region']);
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
               coordinate: '',
               value: ''
              })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.?',
               coordinate: 'a5',
               value: '5'
              })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......2.71...9....4.37.4.3..6..',
               coordinate: 'a5',
               value: '5'
              })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
               coordinate: 'p',
               value: '5'
              })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
               coordinate: 'a5',
               value: 'p'
              })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});

