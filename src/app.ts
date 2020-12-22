import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { auth } from './routes';

const app = express();

app.use(json());
app.use(
	cors({
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	})
);
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/api/auth', auth);

export default app;
