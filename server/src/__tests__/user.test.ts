import app from '../index';
import supertest from 'supertest'
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User, { IUserModel } from '../models/userSchema';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start();
  const mongoUri = await mongoServer.getUri();

  await mongoose.connect(mongoUri, { retryWrites: true, w: 'majority' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('user', () => {

  describe('create user route', () => {
    describe('given the user does not exist', () => {
      it('should return a 201 and create the user', async () => {
        const userData = {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@gmail.com',
        };
        const res = await supertest(app)
          .post('/users/create')
          .send(userData);
        expect(res.status).toBe(201);
        expect(res.body.newUser).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          }),
        );

        await User.findByIdAndDelete(res.body.newUser._id);
      });
    });

    describe('given the email does exist', () => {
      let createdUser: IUserModel | null = null;

      beforeEach(async () => {
        createdUser = new User({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@gmail.com',
        });
        await createdUser.save();
      });

      afterEach(async () => {
        if (createdUser) {
          await User.findByIdAndDelete(createdUser._id);
        }
      });

      it('should return a 401', async () => {
        if (createdUser) {
          const userData = {
            firstName: 'Jane',
            lastName: 'Doe',
            email: createdUser.email,
          };
          const res = await supertest(app)
            .post('/users/create')
            .send(userData);
          expect(res.status).toBe(401);
        } else {
          throw new Error('User not created');
        }
      });
    });
  });

  describe('get user route', () => {

    describe('given the user does not exist', () => {
      it('should return a 401', async () => {
        const userId = new mongoose.Types.ObjectId().toString();
        const res = await supertest(app).get(`/users/get/${userId}`);
        expect(res.status).toBe(401);
      });
    });

    describe('given the user does exists', () => {
      let createdUser: IUserModel | null = null;

      beforeEach(async () => {
        createdUser = new User({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@gmail.com',
          trips: []
        });
        await createdUser.save();
      });

      afterEach(async () => {
        if (createdUser) {
          await User.findByIdAndDelete(createdUser._id);
        }
      });

      it('should return a 200 and the user', async () => {
        if (createdUser) {
          const res = await supertest(app).get(`/users/get/${createdUser._id}`);
          expect(res.status).toBe(200);
          expect(res.body.user).toEqual({
            _id: createdUser._id.toString(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@gmail.com',
            trips: []
          });
        } else {
          throw new Error('User not created');
        }
      });
    });

  })
})
