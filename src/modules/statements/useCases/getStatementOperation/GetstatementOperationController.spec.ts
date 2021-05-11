import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcryptjs';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;
describe('Get statement', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('finapi', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, password, email, created_at, updated_at)
      VALUES('${id}', 'admin5', '${password}', 'admin5@finapi.com.br', 'NOW()', 'NOW()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able get statement by id', async () => {
    const { body } = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'admin5@finapi.com.br',
        password: 'finapi'
      });

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 50,
        description: 'deposit'
      })
      .set({
        Authorization: `Bearer ${body.token}`
      });

    const { body: bodyStatement, statusCode } = await request(app)
      .get(`/api/v1/statements/${response.body.id}`)
      .set({
        Authorization: `Bearer ${body.token}`
      });

    expect(bodyStatement).toHaveProperty('id');
  });


});
