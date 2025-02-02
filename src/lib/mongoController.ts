import { MongoClient } from 'mongodb';
import { CollectionStats, DatabaseStats } from '@/lib/types/mongo';

export class MongoController {
	readonly client: MongoClient;

	constructor() {
		this.client = new MongoClient(process.env.MONGODB_URL ?? 'mongodb://localhost:27017');
	}

	// SERVER
	public async getServerInfo() {
		await this.client.connect();
		const adminDb = this.client.db().admin();
		return adminDb.serverInfo();
	}
	

	// DATABASE
	public async listDatabases() {
		await this.client.connect();
		const adminDb = this.client.db().admin();
		return adminDb.listDatabases();
	}

	public async getDatabaseStats(dbName: string): Promise<DatabaseStats> {
		await this.client.connect();
		const db = this.client.db(dbName);
		return (await db.command({ dbStats: 1 })) as DatabaseStats;
	}

	// COLLECTION
	public async getDatabaseCollections(name: string) {
		await this.client.connect();
		return this.client.db(name).listCollections();
	}

	public async getCollectionStats(
		dbName: string,
		collectionName: string,
	): Promise<CollectionStats> {
		await this.client.connect();
		const db = this.client.db(dbName);
		return (await db.command({ collStats: collectionName })) as CollectionStats;
	}
}
