import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcryptjs';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;
describe('Authenticate user', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('finapi', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, password, email, created_at, updated_at)
      VALUES('${id}', 'admin2', '${password}', 'admin2@finapi.com.br', 'NOW()', 'NOW()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able create a new session user', async () => {
    const { body } = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'admin2@finapi.com.br',
        password: 'finapi'
      });

    const response = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${body.token}`
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
