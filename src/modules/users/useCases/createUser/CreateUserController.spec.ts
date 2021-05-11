import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { hash } from 'bcryptjs';

import { app } from '../../../../app';
import createConnection from '../../../../database';

let connection: Connection;

describe('Create user', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able create a new user', async () => {
    const { statusCode } = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'Supertest',
        email: 'supertest@example.com',
        password: '123456'
      });

    expect(statusCode).toBe(201);
  });
});
