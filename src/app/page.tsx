import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient('mongodb://localhost:27017');

export default async function Home() {
	await mongoClient.connect();
	const admin = mongoClient.db().admin();
	const result = await admin.listDatabases();
	const serverInfo = await admin.serverInfo();
	console.log(serverInfo);
	console.log(result);
	return <>mongonaut</>;
}
