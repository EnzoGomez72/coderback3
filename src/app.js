import express from 'express';
import config from "./config/env.js"
import cookieParser from 'cookie-parser';
import connectDb from "./config/database.js";

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();
app.set("PORT", config.port)
/*const PORT = process.env.PORT||8080;*/
/*const connection = mongoose.connect(`URL DE MONGO`)*/

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter);

connectDb();
/*connectDb(config.mongodb_url);
app.listen(app.get("PORT"), () => {
    console.log(`Server on port ${app.get("PORT")}`);
});*/

app.listen(app.get("PORT"), () => {
    console.log(`🚀 Server running on port ${app.get("PORT")}`);
});

/*app.listen(PORT,()=>console.log(`Listening on ${PORT}`))*/