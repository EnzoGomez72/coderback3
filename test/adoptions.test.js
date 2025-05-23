import mongoose from 'mongoose';
import { expect } from 'chai';
import request from 'supertest';

import config from '../src/config/env.js';
import app from '../src/app.js';
import connectDb from '../src/config/database.js';

import userModel from '../src/dao/models/User.js';
import petModel from '../src/dao/models/Pet.js';
import adoptionModel from '../src/dao/models/Adoption.js';


config.mongodb_url = 'mongodb+srv://enzo:1234@cluster0.bkbia.mongodb.net/adoptmetest?retryWrites=true&w=majority';

describe('Adoption Routes', () => {
  let userId, petId, adoptionId;

  before(async () => {
    try {

      await connectDb();
      

      await mongoose.connection.asPromise();
      
      await mongoose.connection.db.dropDatabase();

      const user = await userModel.create({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: '123456'
      });
      userId = user._id;

      const pet = await petModel.create({
        name: 'Firulais',
        specie: 'Dog',
        adopted: false,
        owner: userId
      });
      petId = pet._id;

      const adoption = await adoptionModel.create({
        owner: userId,
        pet: petId
      });
      adoptionId = adoption._id;
    } catch (err) {
      console.error('Test setup failed:', err);
      throw err;
    }
  });

  after(async () => {
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (err) {
      console.error('Test teardown failed:', err);
    }
  });

  it('GET /api/adoptions - should return all adoptions', async () => {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.be.an('array');
    
    if (res.body.payload.length > 0) {
      const adoption = res.body.payload[0];
      expect(adoption).to.include.keys('_id', 'owner', 'pet');
      if (adoption.adoptionDate) {
        expect(new Date(adoption.adoptionDate)).to.be.a('date');
      }
    }
  });

  it('GET /api/adoptions/:aid - should return a specific adoption', async () => {
    const res = await request(app).get(`/api/adoptions/${adoptionId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.not.be.null;
    expect(res.body.payload).to.include.keys('_id', 'owner', 'pet');
    expect(res.body.payload._id).to.equal(adoptionId.toString());
  });

  it('POST /api/adoptions/:uid/:pid - should create a new adoption', async () => {
    const newPet = await petModel.create({
      name: 'Michi',
      specie: 'Cat',
      adopted: false,
      owner: userId
    });
  
    const res = await request(app)
      .post(`/api/adoptions/${userId}/${newPet._id}`)
      .send({
        notes: 'Test adoption'
      });
  
    expect(res.status).to.equal(200); 
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('status', 'success');
    

    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.include.keys('pet', 'owner');
    expect(res.body.payload.pet).to.equal(newPet._id.toString());
  
    const updatedPet = await petModel.findById(newPet._id);
    expect(updatedPet.adopted).to.be.true;
  });
});

