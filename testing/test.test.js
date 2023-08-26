const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 

const feedbackModel = require('../model/feedback');
let complaintModel = require('../model/complaint');
let employeeModel = require('../model/user');
let appoinmentModel = require('../model/doctorAppoinment');
let eModel = require('../model/entertainment');
let foodDonationModel = require('../model/foodDonation');
let moneyDonationModel = require('../model/moneyDonation');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Test routes', () => {

  test('POST - Feedback Send Successfully', async () => {
    try {
      const feedback = 'This is a test feedback';
      const response = await request(app)
        .post('/feedbacks/addfeedback')
        .send({ feedback });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ '': ' Added Successfully' });
  
      const fb = await feedbackModel.findOne({ feedback: feedback });
      expect(fb).toBeTruthy();
    } catch (err) {
      test('POST - if something went wrong', async () => {
        const response = await request(app)
          .post('/feedbacks/addfeedback')
          .send({});
    
        expect(response.status).toBe(404);
      });
      console.error(err);
      fail();
    }
  }); 
  
  test('POST - Complaint to database', async () => {
    try {
      const email = 'test@example.com';
      const complaint = 'This is a test complaint';
      const response = await request(app)
        .post('/complaints/addcomplaint')
        .send({ email, complaint });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Complaint added successfully' });
  
      const complaintFromDb = await complaintModel.findOne({ email: email, complaint: complaint });
      expect(complaintFromDb).toBeTruthy();
    } catch (err) {
      console.error(err);
    }
  });

  test('GET - all feedbacks', async () => {
    const testfb = {
      feedback: 'g',
    };
    await feedbackModel.create(testfb);
    const res = await request(app).get('/feedbacks/getFeedback');
    expect(res.statusCode).toBe(200);
  });

  test('GET - all Complains', async () => {
    const test = {
      email: 'kavinduhashan2k17@gmail.com',
      complaint: 'a'
    };
    await complaintModel.create(test);
    const res = await request(app).get('/complaints/getComplaint');
    expect(res.statusCode).toBe(200);
  });

  test('GET - registration details', async () => {
    const test = {
      name: 'k',
      email: 'k@gmail.com',
      nic: '1',
      phone: '1234567890',
    };
    await employeeModel.create(test);
    const res = await request(app).get('/employees/getuser');
    expect(res.statusCode).toBe(200);
  });

  // test('GET - clinic details', async () => {
  //   const test = {
  //     dname: 'Dr. Mohommad',
  //     dspecialty: 'cancer',
  //     cancertype: 'blood',
  //     date: '2023-05-17T00:00:00.000+00:00',
  //   };
  //   await clinicModel.create(test);
  //   const res = await request(app).get('/clinics/getclinic');
  //   expect(res.statusCode).toBe(200);
  // });

  test('GET - Doctor Appoinment details', async () => {
    const test = {
      name: 'binalka',
      email: 'binki.amarajeewa187@gmail.com',
      phone: '763582348',
      dname: 'Dr. Mohommad',
      cancertype: 'blood',
      date: '2023-05-25T00:00:00.000+00:00',
    };
    await appoinmentModel.create(test);
    const res = await request(app).get('/appoinmnets/getAppoinment');
    expect(res.statusCode).toBe(200);
  });

  test('GET - Entertainment  details', async () => {
    const test = {
      name: 'binalka',
      email: 'binki.amarajeewa187@gmail.com',
      phone: '763582348',
      etype: 'jh',
      date: '2023-05-25T00:00:00.000+00:00',
    };
    await eModel.create(test);
    const res = await request(app).get('/Entertainmnets/getE');
    expect(res.statusCode).toBe(200);
  });

  test('GET - Food Donation details', async () => {
    const test = {
      name: 'binalka',
      email: 'binki.amarajeewa187@gmail.com',
      phone: '763582348',
      date: '2023-05-25T00:00:00.000+00:00',
    };
    await foodDonationModel.create(test);
    const res = await request(app).get('/Entertainmnets/getE');
    expect(res.statusCode).toBe(200);
  });

  test('GET - Money Donation details', async () => {
    const test = {
      name: 'binalka',
      email: 'k@gmail.com',
    };
    await moneyDonationModel.create(test);
    const res = await request(app).get('/moneyDonations/getmoney');
    expect(res.statusCode).toBe(200);
  });
    

});
