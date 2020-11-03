import request from "supertest";
import { app } from "../src/app";
import mongoose from "mongoose";
import { testMongoUrl } from "./testConfig";
import { User } from "../src/models/User";

const email = "sergey@sizdev.com";
const password = "abracadabra";
describe("API", () => {
  beforeAll(async () => {
    await mongoose.connect(testMongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(() => mongoose.disconnect());

  beforeEach(() => User.deleteMany({}).exec());

  it("creates user with email and password", () => {
    return request(app)
      .post("/create_user")
      .send({
        email,
        password,
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((resp) => {
        expect(resp.body).toMatchObject({ authProviders: { emailPassword: { email } } });
      });
  });

  it("raises on duplicate email", async () => {
    await request(app).post("/create_user").send({
      email,
      password,
    });
    return request(app)
      .post("/create_user")
      .send({
        email,
        password,
      })
      .expect(400)
      .expect("Content-Type", /json/);
  });

  it("signs in via email and password", async () => {
    await request(app).post("/create_user").send({
      email,
      password,
    });
    return request(app)
      .post("/sign_in")
      .send({
        email,
        password,
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((resp) => console.log(resp.body));
  });

  it("raises on invalid password", async () => {
    await request(app).post("/create_user").send({
      email,
      password,
    });
    return request(app)
      .post("/sign_in")
      .send({
        email,
        password: password + "foasd",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .then((resp) => console.log(resp.body));
  });
});
