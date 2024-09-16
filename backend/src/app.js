require('dotenv').config()
const express =  require("express");
const cors = require("cors");
const bodyParser = require("body-parser");



const app = express();
const port = process.env.PORT;



app.use(cors({origin: "*",credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], allowedHeaders: ["Origin",
    "Content-Type", "Accept", "Authorization", "X-Request-With"]}));

app.use(bodyParser.json());



app.get('/api/v1', (req, res) => {
      res.status(200).json("Welcome to reExchange");
});


app.listen(port, () => {
      console.log(`reExchange server is running on port ${port}`);
});
