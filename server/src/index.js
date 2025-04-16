const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const notFound = require("./middlewares/notFound");
const errorHandler = require('./middlewares/errorHandler');

//Initialization
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000",
}));

app.get("/", (req, res) => {
    res.json({
        message: "Hello World"
    })
});

app.use(notFound);
app.use(errorHandler);



const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});