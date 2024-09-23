require('dotenv').config()
const express =  require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT;

const connectDB = require('./utils/db');
const AuthRoutes = require("./routes/auth.routes");


app.use(cors({origin: "*",credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], allowedHeaders: ["Origin",
    "Content-Type", "Accept", "Authorization", "X-Request-With"]}));

app.use(express.json());


app.get('/api/v1', (req, res) => {
      res.status(200).json("Welcome to reExchange");
});
app.use('/api/v1/auth', AuthRoutes);

connectDB()
app.listen(port, () => {
      console.log(`reExchange server is running on port ${port}`);
});
