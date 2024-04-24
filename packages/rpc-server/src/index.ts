import { JSONRPCServer } from 'json-rpc-2.0';
import express from 'express';
// @ts-expect-error err
import bodyParser from 'body-parser';
import cors from 'cors';

import { SingleForeignCallParam, ForeignCallResult } from '../types';

import dotenv from 'dotenv';
import { calculateDistance, parseCoordinates } from './helpers';
dotenv.config();

const port = process.env.PORT || 5555;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = new JSONRPCServer();

app.post('/', (req, res) => {
	const jsonRPCRequest = req.body;
	server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
		if (jsonRPCResponse) {
			res.json(jsonRPCResponse);
		} else {
			res.sendStatus(204);
		}
	});
});

server.addMethod(
	'get_distance',
	async (params: SingleForeignCallParam[]): Promise<ForeignCallResult> => {
		const [lat1, lon1, lat2, lon2] = parseCoordinates(params);
		console.log({
			guess: [lat1, lon1],
			actual: [lat2, lon2],
		});
		const distance = calculateDistance(lat1, lon1, lat2, lon2);

		const result: ForeignCallResult = {
			values: [{ Single: distance.toString(16) }],
		};

		console.log('Distance: ', distance, 'km\n');

		return result;
	}
);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
