require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const db = require("./db")

const app = express();

const jsonParser = bodyParser.json();

app.get("/restaurants", async (req, res) => {
    try {
        const results = await db.query("select * from restaurants;");
        // console.log(results)
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                restaurants: results.rows,
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

app.get("/restaurants/:id", async (req, res) => {
    try {
        const results = await db.query("select * from restaurants where id = $1", [req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

app.post("/restaurants", jsonParser,  async (req, res) => {
    console.log(req.body);

    try {
        const results = await db.query(
            "INSERT INTO restaurants (name, address, start_at, end_at, price_rating, website_url) values ($1, $2, $3, $4, $5, $6) returning *",
            [req.body.name, req.body.address, req.body.start_at, req.body.end_at, req.body.price_rating, req.body.website_url]
        );

        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0]
            }
        })
    }
    catch (err) {
        console.log(err);
    }
})

app.put("/restaurants/:id", jsonParser, async (req, res) => {
    try {
      const results = await db.query(
        "UPDATE restaurants SET name = $1, address = $2, start_at = $3, end_at = $4, price_rating = $5, website_url = $6 where id = $7 returning *",
        [req.body.name, req.body.address, req.body.start_at, req.body.end_at, req.body.price_rating, req.body.website_url, req.params.id]
      );
  
      res.status(200).json({
        status: "success",
        data: {
          retaurant: results.rows[0],
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

  app.delete("/restaurants/:id", async (req, res) => {
    try {
      db.query("DELETE FROM restaurants where id = $1", [req.params.id,]);
      res.status(204).json({
        status: "success",
      });
    } catch (err) {
      console.log(err);
    }
  });

const port = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`server is up and listening on port ${port}`);
});