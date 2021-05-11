import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcryptjs';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;
describe('Get balance', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('finapi', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, password, email, created_at, updated_at)
      VALUES('${id}', 'admin3', '${password}', 'admin3@finapi.com.br', 'NOW()', 'NOW()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able get balances of user', async () => {
    const { body } = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'admin3@finapi.com.br',
        password: 'finapi'
      });

    const response = await request(app)
      .get('/api/v1/statements/balance')
      .set({
        Authorization: `Bearer ${body.token}`
      });

    expect(response.body).toHaveProperty('balance');
  });
});
