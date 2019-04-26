import request from 'supertest'
import app from '../src/app'

let token = null

beforeAll((done) => request(app).post('/api/token')
  .send({ 'email': 'user_mock_alterado@mail.com', 'password': '123456' })
  .then(res => token = `Bearer ${res.body.token}`)
  .catch(err => { throw err })
  .finally(() => done()))

describe('User', () => {
  test('Obter os dados do usuário', (done) =>
    request(app).get('/api/user').set('Authorization', token)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body.email).toBe('user_mock_alterado@mail.com')
        done()
      }))

  test('Criar usuário sem nome', (done) =>
    request(app).post('/api/user')
      .send({ name: '', email: 'usuario@mail.com' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('O nome do usuário é obrigatório.')
        done()
      }))

  test('Criar usuário sem email', (done) =>
    request(app).post('/api/user')
      .send({ name: 'usuario', email: '' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('O email do usuário é obrigatório.')
        done()
      }))

  test('Criar usuário com email inválido', (done) =>
    request(app).post('/api/user')
      .send({ name: 'usuario', email: 'usuariomail.com' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('Email inválido.')
        done()
      }))

  test('Criar usuário com email já utilizado', (done) =>
    request(app).post('/api/user')
      .send({ name: 'usuario', email: 'user_mock_1@mail.com', password: '1234' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('Este email já está em uso por outro usuário.')
        done()
      }))

  test('Criar usuário sem senha', (done) =>
    request(app).post('/api/user')
      .send({ name: 'usuario', email: 'usuario@mail.com', password: '' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('A senha deve ter pelo menos 4 dígitos.')
        done()
      }))


  test('Criar usuário com senha inválida', (done) =>
    request(app).post('/api/user')
      .send({ name: 'usuario', email: 'usuario@mail.com', password: '123' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('A senha deve ter pelo menos 4 dígitos.')
        done()
      }))

  test('Criar usuário OK', (done) =>
    request(app).post('/api/user')
      .send({ name: 'usuario', email: 'usuario@mail.com', password: '1234' })
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('Usuário criado com sucesso.')
        done()
      }))

  test('Atualizar usuário sem nome', (done) =>
    request(app).put('/api/user')
      .set('Authorization', token)
      .send({ name: '', email: 'usuario@mail.com' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('O nome do usuário é obrigatório.')
        done()
      }))

  test('Atualizar usuário sem email', (done) =>
    request(app).put('/api/user')
      .set('Authorization', token)
      .send({ name: 'usuario', email: '' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('O email do usuário é obrigatório.')
        done()
      }))

  test('Atualizar usuário com email inválido', (done) =>
    request(app).put('/api/user')
      .set('Authorization', token)
      .send({ name: 'usuario', email: 'usuariomail.com' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('Email inválido.')
        done()
      }))

  test('Atualizar usuário com email já utilizado', (done) =>
    request(app).put('/api/user')
      .set('Authorization', token)
      .send({ name: 'usuario', email: 'user_mock_1@mail.com' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('Este email já está em uso por outro usuário.')
        done()
      }))

  test('Atualizar usuário OK', (done) =>
    request(app).put('/api/user')
      .set('Authorization', token)
      .send({ name: 'usuarioalterado', email: 'usuarioalterado@mail.com' })
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('Usuário alterado com sucesso.')
        done()
      }))

  test('Alterar senha com senha inválida', (done) =>
    request(app).put('/api/user-password')
      .set('Authorization', token)
      .send({ password: '123' })
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('A senha deve ter pelo menos 4 dígitos.')
        done()
      }))

  test('Alterar senha OK', (done) =>
    request(app).put('/api/user-password')
      .set('Authorization', token)
      .send({ password: '1234' })
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('Senha alterada com sucesso.')
        done()
      }))
})