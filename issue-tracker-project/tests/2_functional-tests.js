/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  let bookId;

    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          console.log(res.body, ' The body')
          assert.equal(res.status, 200);           
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          bookId = res.body._id
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Kelechi Chinaka'
        })
        .end(function(err, res){
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Kelechi Chinaka');
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/apitest')
          .send({ })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required fields');
            done();
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/apitest')
        .send({_id: bookId})
        .end((err, res) =>  {
          assert.equal(res.status, 200);
          assert.equal(res.text, `no updated field sent`);
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/apitest')
        .send({
          _id: bookId,
          issue_title: `Update book records`
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, `successfully updated`);
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/apitest')
        .send({
          _id: bookId,
          issue_title: `Update book records`,
          created_by: "Kelechi Chinaka"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, `successfully updated`);
          done();
        });
      });

      test('No _id', function(done) {
        chai.request(server)
        .put('/api/issues/apitest')
        .send({
          _id: ''
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, `no _id sent`);
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({ open: true })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'open');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({ 
          issue_title: 'Title', 
          open: true })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'open');
          done()
        });
      })
      
    }); 
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/apitest')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no _id sent');
            done();
          })
         
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/apitest')
          .send({_id: bookId})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, `deleted ${bookId}`);
            done();
          })
          
      });
      
    });

});
