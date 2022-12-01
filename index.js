const { Pool } = require("pg");
const express = require("express");
const path = require("path");

// Creating the Express server
const app = express();

// Server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
    user: "uobhmomx",
    host: "peanut.db.elephantsql.com",
    database: "uobhmomx",
    password: "rxU_1pf1EGhzUqsBHw9V4j_gTQV0hVML",
    port: 5432
  });
  console.log("Successful connection to the database");

  const sql_create = `CREATE TABLE IF NOT EXISTS Books (
    Book_ID SERIAL PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    Comments TEXT
  );`;
  
  pool.query(sql_create, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of the 'Books' table");
  });
  console.log("Successful creation of the 'Books' table");
  // Database seeding
  const sql_insert = `INSERT INTO Books (Book_ID, Title, Author, Comments) VALUES
    (1, 'Mrs. Bridge', 'Evan S. Connell', 'First in the serie'),
    (2, 'Mr. Bridge', 'Evan S. Connell', 'Second in the serie'),
    (3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne')
  ON CONFLICT DO NOTHING;`;
  pool.query(sql_insert, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    const sql_sequence = "SELECT SETVAL('Books_Book_ID_Seq', MAX(Book_ID)) FROM Books;";
    pool.query(sql_sequence, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Successful creation of 3 books");
    });
  });
  app.get("/books", (req, res) => {
    const sql = "SELECT * FROM Books ORDER BY Title"
    pool.query(sql, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("books", { model: result.rows });
    });
  });
// Starting the server
app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

// GET /
app.get("/", (req, res) => {
  // res.send("Hello world...");
  res.render("index");
});

// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

// GET /data
app.get("/data", (req, res) => {
  const test = {
    titre: "Test",
    items: ["one", "two", "three"]
  };
  res.render("data", { model: test });
});
// GET /create
app.get("/create", (req, res) => {
    res.render("create", { model: {} });
  });
  
  // POST /create
  app.post("/create", (req, res) => {
    const sql = "INSERT INTO Books (Title, Author, Comments) VALUES ($1, $2, $3)";
    const book = [req.body.title, req.body.author, req.body.comments];
    pool.query(sql, book, (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/books");
    });
  });
  
  // GET /edit/5
  app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Books WHERE Book_ID = $1";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("edit", { model: result.rows[0] });
    });
  });
  
  // POST /edit/5
  app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const book = [req.body.title, req.body.author, req.body.comments, id];
    const sql = "UPDATE Books SET Title = $1, Author = $2, Comments = $3 WHERE (Book_ID = $4)";
    pool.query(sql, book, (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/books");
    });
  });
  
  // GET /delete/5
  app.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Books WHERE Book_ID = $1";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("delete", { model: result.rows[0] });
    });
  });
  
  // POST /delete/5
  app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM Books WHERE Book_ID = $1";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/books");
    });
  });