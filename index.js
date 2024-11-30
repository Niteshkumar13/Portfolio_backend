const  Express = require("express");
const  bodyParser = require("body-parser");
const  cors = require("cors");
const { Pool } = require('pg');
const app = Express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(Express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(Express.json());
app.use(cors());
require('dotenv').config();

const pool = new Pool({
  connectionString:process.env.PGURL,
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});
  app.post('/add-data', async (req, res) => {
    try {
      const client = await pool.connect();
      const insertQuery = 'INSERT INTO my_data (name, email,msg) VALUES ($1, $2, $3) RETURNING *';
      const value = [req.body.first,req.body.second,req.body.third];
      const result = await client.query(insertQuery, value);
      res.json(result.rows[0]);
      client.release();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  app.get('/',(req,res)=>{
    res.send("hello");
  })
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("your code is working")
});
