const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');






require('./db');

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));








const PORT = 3000;
app.listen(PORT, console.log("server started..."));