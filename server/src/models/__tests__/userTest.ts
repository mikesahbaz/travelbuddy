import app from '../../index';
import supertest from 'supertest';
const request = supertest(app);
//import { User } from '../models/userModel';

describe('Get /users/all', () => {
  it ('should return all users', async () => {
    const res = await request.get('/users/all');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('firstName');
  });
});
