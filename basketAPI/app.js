require("dotenv/config");

require("./db");

const express = require("express");
const app = express()

require('./config')(app)
require('./config/session.config')(app)

app.locals.appTitle = `BasketAPI`;

const index = require("./routes/index.routes");
app.use("/", index);

require("./error-handling")(app);

module.exports = app;
