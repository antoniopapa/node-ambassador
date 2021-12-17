import express from 'express';
import cors from 'cors';
import {createConnection} from "typeorm";
import {routes} from "./routes";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import {createClient} from "redis";

dotenv.config();

export const client = createClient({
    url: 'redis://redis:6379'
});

createConnection().then(async () => {
    await client.connect();

    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(cors({
        credentials: true,
        origin: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5000']
    }));

    routes(app);

    app.listen(8000, () => {
        console.log('listening to port 8000')
    });
});

