import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcryptjs';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;
describe('Create statement', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('finapi', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, password, email, created_at, updated_at)
      VALUES('${id}', 'admin4', '${password}', 'admin4@finapi.com.br', 'NOW()', 'NOW()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able create a new deposit for user', async () => {
    const { body } = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'admin4@finapi.com.br',
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

    expect(response.body).toHaveProperty('id');
  });

  it('should be able create a new withdraw for user', async () => {
    const { body } = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'admin4@finapi.com.br',
        password: 'finapi'
      });

    // await request(app)
    //   .post('/api/v1/statements/deposit')
    //   .send({
    //     amount: 100,
    //     description: 'deposit'
    //   })
    //   .set({
    //     Authorization: `Bearer ${body.token}`
    //   });

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 50,
        description: 'withdraw'
      })
      .set({
        Authorization: `Bearer ${body.token}`
      });

    expect(response.body).toHaveProperty('id');
  });
});
