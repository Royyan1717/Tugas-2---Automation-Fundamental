const request = require("supertest");
const { expect } = require("chai");
require("dotenv").config();

const baseUrl = process.env.API_URL;
const bookingData = require("../data/bookingData.json");

let token;
let bookingId;

describe("E2E Testing Restful-Booker API", () => {
  
  // 1. Auth API - Get Token
  it("Should authenticate and return token", async () => {
    const res = await request(baseUrl)
      .post("/auth")
      .send({
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    token = res.body.token;
  });

  // 2. Create Booking
  it("Should create a new booking", async () => {
    const res = await request(baseUrl)
      .post("/booking")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(bookingData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("bookingid");
    expect(res.body.booking).to.deep.include(bookingData);

    bookingId = res.body.bookingid;
  });

  // 3. Get Booking
  it("Should retrieve created booking by ID", async () => {
    const res = await request(baseUrl)
      .get(`/booking/${bookingId}`)
      .set("Accept", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.include(bookingData);
  });

  // 4. Delete Booking
  it("Should delete booking with valid token", async () => {
    const res = await request(baseUrl)
      .delete(`/booking/${bookingId}`)
      .set("Cookie", `token=${token}`);

    expect(res.status).to.equal(201); // sesuai dokumentasi: 201 Created untuk delete
  });
});
