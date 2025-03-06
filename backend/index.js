const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");

require("dotenv").config();
require("./Config/config");
const PORT = process.env.PORT || 8080;
app.use(cors()); // Allow all origins (not recommended for production)

//  allow specific frontend origin
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (req, res) => {
  res.send("Running server");
});

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
