import { MongoClient } from 'mongodb';
import { CollectionStats, DatabaseStats } from '@/lib/types/mongo';
import { env } from '@/lib/env';

export class MongoController {
	readonly client: MongoClient;

	constructor() {
		this.client = new MongoClient(env('MONGO_CONNECTION_URL', 'mongodb://localhost:27017'));
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

	public async getCollectionContent(dbName: string, collectionName: string) {
		await this.client.connect();
		const db = this.client.db(dbName);
		return db.collection(collectionName);
	}

	public async searchInCollection(
		dbName: string, 
		collectionName: string,
		searchKey: string,
		searchValue: string
	) {
		await this.client.connect();
		const db = this.client.db(dbName);
		const collection = db.collection(collectionName);
	
		const query = { 
			[searchKey]: { 
				$regex: searchValue, 
				$options: 'i'  // case-insensitive
			}
		};
	
		try {
			return await collection.find(query).toArray();
		} catch (error) {
			console.error('error in collection search:', error);
			return [];
		}
	}

	public async isCollectionExisting(dbName: string, collectionName: string) {
		await this.client.connect();
		const db = this.client.db(dbName);
		const collections = await db.listCollections().toArray();
		return collections.some(col => col.name === collectionName);
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
