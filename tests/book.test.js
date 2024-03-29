const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../src/models");
const app = require("../src/app");

describe("/books", () => {
  try {
    before(() => Book.sequelize.sync());
  } catch (error) {
    console.log(error.Promise);
  }

  afterEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const response = await request(app).post("/books").send({
          title: "The River And The Source",
          author: "Margaret Ogola",
          genre: "Fiction",
          ISBN: "ISBN-13, 978-9966882059",
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal("The River And The Source");
        expect(newBookRecord.author).to.equal("Margaret Ogola");
        expect(newBookRecord.genre).to.equal("Fiction");
      });

      it("throws error when theres no title", async () => {
        const response = await request(app).post("/books").send({
          author: "Margaret Ogola",
          genre: "Fiction",
          ISBN: "ISBN-13, 978-9966882059",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "notNull Violation: Book.title cannot be null"
        );
      });

      it("throws error when theres no author", async () => {
        const response = await request(app).post("/books").send({
          title: "The River And The Source",
          genre: "Fiction",
          ISBN: "ISBN-13, 978-9966882059",
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "notNull Violation: Book.author cannot be null"
        );
      });
    });
  });
  describe("with records in the database", () => {
    let books;

    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: "The Whale Rider",
          author: "Witi Ihimaera",
          genre: "Fiction",
          ISBN: "ISBN-13, 978-0435131081",
        }),
        Book.create({
          title: "The River And The Source",
          author: "Margaret Ogola",
          genre: "Fiction",
          ISBN: "ISBN-13, 978-9966882059",
        }),
        Book.create({
          title: "The Caucasian Chalk Circle",
          author: "Bertolt Brecht",
          genre: "Drama",
          ISBN: "ISBN 13, 9780394172583",
        }),
      ]);
    });

    describe("GET /books", () => {
      it("gets all books records", async () => {
        const response = await request(app).get("/books");

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
        });
      });
    });

    describe("GET /books/:id", () => {
      it("gets books record by id", async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).get("/books/12345");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });

    describe("PATCH /books/:id", () => {
      it("updates books author by id", async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ author: "Margaret A. Ogola" });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.author).to.equal("Margaret A. Ogola");
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app)
          .patch("/books/12345")
          .send({ author: "Caucasian Chalk Cirle" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });

    describe("DELETE /book/:id", () => {
      it("deletes book record by id", async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it("returns a 404 if the book does not exist", async () => {
        const response = await request(app).delete("/books/12345");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The book could not be found.");
      });
    });
  });
});
