const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();



const userRoute = require('./routes/user');






require('./db');

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));





app.use('/user', userRoute);

//port가 사용중이거나 에러면 5000번으로 대체 process.env.PORT 는 .env 에 저장해놓은 것 
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("server started..."));