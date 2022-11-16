// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testCat;

beforeEach(async function () {
  await db.query("DELETE FROM cats");
  let result = await db.query(`
    INSERT INTO cats (name)
    VALUES ('TestCat')
    RETURNING id, name`);
  testCat = result.rows[0];
});


/** GET /cats - returns `{cats: [cat, ...]}` */

describe("GET /cats", function () {
  test("Gets a list of 1 cat", async function () {
    const resp = await request(app).get(`/cats`);
    expect(resp.body).toEqual({
      cats: [testCat],
    });
  });
});
// end

/** POST /cats - create cat from data; return `{cat: cat}` */

describe("POST /cats", function () {
  test("Create new cat", async function () {
    const resp = await request(app)
        .post(`/cats`)
        .send({ name: "Ezra" });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      cat: { id: expect.any(Number), name: "Ezra" },
    });
  });
});
// end

afterAll(async function () {
  // close db connection --- if you forget this, Jest will hang
  await db.end();
});