import request from "supertest";
import { app } from "../src/app";
import mongoose from "mongoose";
import { testMongoUrl } from "./testConfig";
import { User } from "../src/models/User";

const email = "sergey@sizdev.com";
const password = "abracadabra";

describe("Email Password API", () => {
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

  describe("actions with user", () => {
    beforeEach(() =>
      request(app).post("/create_user").send({
        email,
        password,
      })
    );
    it("signs in via email and password", async () => {
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

    it("changes password", async () => {
      const newPassword = "newpassword";
      return request(app)
        .post("/change_password")
        .send({
          email,
          oldPassword: password,
          newPassword,
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .then((resp) => console.log(resp.body))
        .then((_) =>
          request(app)
            .post("/sign_in")
            .send({
              email,
              password: newPassword,
            })
            .expect(200)
            .expect("Content-Type", /json/)
        );
    });

    it("raises on change with invalid password", async () => {
      const newPassword = "newpassword";
      return request(app)
        .post("/change_password")
        .send({
          email,
          oldPassword: password + "asd",
          newPassword,
        })
        .expect(400);
    });
  });
});
