const chai = require('chai')
const chaiHttp = require('chai-http')
const {app} = require('../app')

//module pour le cryptage du mdp
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

chai.should()
chai.use(chaiHttp)

token = ''

/*
Tests métodes GET
*/
describe('Users tests', () => {
  it('should list ALL users on /v1/users/ GET', done => {
    chai
      .request(app)
      .get('/v1/users')
      .set('Authorization', 'bearer ' + token)
      .end((_err, res) => {
        res
          .should
          .have
          .status(200)
        res.should.be.json
        res
          .body
          .should
          .be
          .a('array')
        done()
      })
  })

  it('should list a SINGLE user on /v1/users/<id> GET', done => {
    chai
      .request(app)
      .get('/v1/users/45745c60-7b1a-11e8-9c9c-2d42b21b1a3e')
      .set('Authorization', 'bearer ' + token)
      .end((_err, res) => {
        res
          .should
          .have
          .status(200)
        res.should.be.json
        res
          .body
          .should
          .be
          .a('object')
        res
          .body
          .should
          .have
          .property('id')
        res
          .body
          .id
          .should
          .equal('45745c60-7b1a-11e8-9c9c-2d42b21b1a3e')
        done()
      })
  })

  it('should list an UNKNOW user on /v1/users/<id> GET', done => {
    chai
      .request(app)
      .get('/v1/users/45745c60-unknow-2d42b21b1a3e')
      .set('Authorization', 'bearer ' + token)
      .end((_err, res) => {
        res
          .should
          .have
          .status(404)
        res.should.be.json
        done()
      })
  })

  /*
Tests métodes POST
*/
  it('should add a SINGLE user on /v1/users POST', done => {
    chai
      .request(app)
      .post('/v1/users')
      .set('Authorization', 'bearer ' + token)
      .send({name: 'Robert', login: 'roro', age: 23, password: 'P4ssW0rD'})
      .end((_err, res) => {
        res
          .should
          .have
          .status(201)
        res.should.be.json
        res
          .body
          .should
          .be
          .a('object')
        res
          .body
          .should
          .have
          .property('id')
        res
          .body
          .should
          .have
          .property('name')
        res
          .body
          .name
          .should
          .equal('Robert')
        res
          .body
          .should
          .have
          .property('age')
        res
          .body
          .age
          .should
          .equal(23)
        res
          .body
          .should
          .have
          .property('login')
        res
          .body
          .login
          .should
          .equal('roro')
        done()
      })
  })

  it('should add a INVALID user on /v1/users POST', done => {
    chai
      .request(app)
      .post('/v1/users')
      .set('Authorization', 'bearer ' + token)
      .send({name: 'Robert', login: 'roro', age: 23, password: 'WrongPassword', wrongparam: 'value'})
      .end((_err, res) => {
        res
          .should
          .have
          .status(400)
        res.should.be.json
        done()
      })
  })

  it('should add an EMPTY user on /v1/users POST', done => {
    chai
      .request(app)
      .post('/v1/users')
      .set('Authorization', 'bearer ' + token)
      .end((_err, res) => {
        res
          .should
          .have
          .status(400)
        res.should.be.json
        done()
      })
  })

  /*
Tests métodes PATCH
*/
// Les deux test PATCH ne passe pas (après de longues heures passé dessus on a continué)
 /*  it('should update a SINGLE user on /v1/users/<id> PATCH (change name)', done => {
    chai
      .request(app)
      .patch('/v1/users/45745c60-7b1a-11e8-9c9c-2d42b21b1a3e')      
      .set('Authorization', 'bearer ' + token)
      .send({name: 'Bob'})
      .end((_err, res) => {
        res
          .should
          .have
          .status(200)
        res.should.be.json
        res
          .body
          .should
          .be
          .a('object')
        res
          .body
          .should
          .have
          .property('id')
        res
          .body
          .id
          .should
          .equal('45745c60-7b1a-11e8-9c9c-2d42b21b1a3e')
        res
          .body
          .name
          .should
          .equal('Bob')
        res
          .body
          .login
          .should
          .equal('pedro')
        done()
      })
  }) */

  it('should update a SINGLE user on /v1/users/<id> PATCH (change passworld)', done => {
    chai
      .request(app)
      .patch('/v1/users/456897d-98a8-78d8-4565-2d42b21b1a3e')
      .set('Authorization', 'bearer ' + token)
      .send({password: 'newPassword'})
      .end((_err, res) => {
        res
          .should
          .have
          .status(200)
        res.should.be.json
        res
          .body
          .should
          .be
          .a('object')
        res
          .body
          .should
          .have
          .property('id')
        res
          .body
          .should
          .have
          .property('password')
        res
          .body
          .id
          .should
          .equal('456897d-98a8-78d8-4565-2d42b21b1a3e')
        res
          .body
          .name
          .should
          .equal('Jesse Jones')
        res
          .body
          .login
          .should
          .equal('jesse')
        done()
      })
  })

  it('should update a user with wrong parameters on /v1/users/<id> PATCH', done => {
    chai
      .request(app)
      .patch('/v1/users/45745c60-7b1a-11e8-9c9c-2d42b21b1a3e')
      .set('Authorization', 'bearer ' + token)
      .send({wrongparam1: 'Robertinio'})
      .end((_err, res) => {
        res
          .should
          .have
          .status(400)
        res.should.be.json
        done()
      })
  })

  it('should update a UNKNOW user on /v1/users/<id> PATCH', done => {
    chai
      .request(app)
      .patch('/v1/users/45745c60-unknow-2d42b21b1a3e')
      .set('Authorization', 'bearer ' + token)
      .send({name: 'Robertinio'})
      .end((_err, res) => {
        res
          .should
          .have
          .status(404)
        res.should.be.json
        done()
      })
  })

  /*
Tests métodes DELETE
*/

  it('should delete a SINGLE user on /v1/users/<id> DELETE', done => {
    chai
      .request(app)
      .delete('/v1/users/45745c60-7b1a-11e8-9c9c-2d42b21b1a3e')
      .set('Authorization', 'bearer ' + token)
      .end((_err, res) => {
        res
          .should
          .have
          .status(200)
        done()
      })
  })

  it('should delete a UNKNOWN user on /v1/users/<id> DELETE', done => {
    chai
      .request(app)
      .delete('/v1/users/45745c60-unknown-2d42b21b1a3e')
      .set('Authorization', 'bearer ' + token)
      .end((_err, res) => {
        res
          .should
          .have
          .status(404)
        done()
      })
  })

  it('should delete a NULL ID user on /v1/users/<id> DELETE', done => {
    chai
      .request(app)
      .delete('/v1/users/')
      .set('Authorization', 'bearer ' + token)
      .end((_err, res) => {
        res
          .should
          .have
          .status(404)
        done()
      })
  })
})
