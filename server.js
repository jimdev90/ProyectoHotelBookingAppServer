import express from 'express';
import cors from 'cors';
import fs from 'fs'
const morgan = require("morgan")

const mongoose = require('mongoose');

require('dotenv').config()



mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

const app = express()

//middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


fs.readdirSync('./routes').map((r) =>
    app.use('/api', require(`./routes/${r}`))
);



const port = process.env.PORT
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})