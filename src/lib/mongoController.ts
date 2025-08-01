import { MongoClient, MongoError, ObjectId } from 'mongodb';
import { CollectionStats, DatabaseStats, MongoDocument } from '@/lib/types/mongo';
import { env, envInt } from '@/lib/env';
import { MongoConnectionError } from '@/lib/errors/mongo';

export class MongoController {
	readonly client: MongoClient;
	private connected: boolean = false;
	private readonly TIMEOUT = envInt('MONGONAUT_TIMEOUT', 5000);

	constructor() {
		this.client = new MongoClient(env('MONGO_CONNECTION_URL', 'mongodb://localhost:27017'), {
			serverSelectionTimeoutMS: this.TIMEOUT,
			connectTimeoutMS: this.TIMEOUT,
		});
	}

	private async connect() {
		if (this.connected) return { success: true };

		try {
			await Promise.race([
				this.client.connect(),
				new Promise((_, reject) =>
					setTimeout(() => reject(new MongoConnectionError('Connection timeout')), this.TIMEOUT),
				),
			]);
			this.connected = true;
			return { success: true };
		} catch (error) {
			this.connected = false;
			if (error instanceof MongoError) {
				switch (error.code) {
					case 18:
						return {
							success: false,
							error: new MongoConnectionError('Invalid credentials'),
						};
					case 93:
						return {
							success: false,
							error: new MongoConnectionError('Invalid connection URL'),
						};
					default:
						return {
							success: false,
							error: new MongoConnectionError(`Connection error: ${error.message}`),
						};
				}
			}
			if (error instanceof Error) {
				if (error.message.includes('ECONNREFUSED')) {
					return {
						success: false,
						error: new MongoConnectionError('MongoDB server is not running'),
					};
				}
				if (error.message.includes('timeout')) {
					return {
						success: false,
						error: new MongoConnectionError('Connection timed out'),
					};
				}
			}
			return {
				success: false,
				error: new MongoConnectionError('Failed to connect to MongoDB'),
			};
		}
	}

	// SERVER
	public async getServerInfo() {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error };
		}

		try {
			const adminDb = this.client.db().admin();
			const serverInfo = await adminDb.serverInfo();
			return { success: true, data: serverInfo };
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
			};
		}
	}

	// DATABASE
	public async listDatabases() {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error };
		}

		try {
			const adminDb = this.client.db().admin();
			const databases = await adminDb.listDatabases();
			return { success: true, data: databases };
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
			};
		}
	}

	public async getDatabaseStats(dbName: string) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error };
		}

		try {
			const db = this.client.db(dbName);
			const stats = (await db.command({ dbStats: 1 })) as DatabaseStats;
			return { success: true, data: stats };
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
			};
		}
	}

	// COLLECTION
	public async getDatabaseCollections(name: string) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error };
		}

		try {
			const collections = await this.client.db(name).listCollections();
			return { success: true, data: collections };
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
			};
		}
	}

	public async getCollectionContent(
		dbName: string,
		collectionName: string,
		page: number = 1,
		pageSize: number = 10,
	) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return {
				success: false,
				error: connectResult.error,
				documents: [],
				pagination: {
					total: 0,
					page: 1,
					pageSize,
					totalPages: 0,
				},
			};
		}

		const db = this.client.db(dbName);
		const collection = db.collection(collectionName);

		const skip = (page - 1) * pageSize;

		try {
			const total = await collection.countDocuments();
			const documents = await collection.find().skip(skip).limit(pageSize).toArray();

			return {
				success: true,
				documents,
				pagination: {
					total,
					page,
					pageSize,
					totalPages: Math.ceil(total / pageSize),
				},
			};
		} catch (error) {
			console.error('Error fetching collection content:', error);
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
				documents: [],
				pagination: {
					total: 0,
					page: 1,
					pageSize,
					totalPages: 0,
				},
			};
		}
	}

	public async searchInCollection(
		dbName: string,
		collectionName: string,
		searchKey: string,
		searchValue: string,
		page: number = 1,
		pageSize: number = 10,
	) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return {
				success: false,
				error: connectResult.error,
				documents: [],
				pagination: {
					total: 0,
					page: 1,
					pageSize,
					totalPages: 0,
				},
			};
		}

		const db = this.client.db(dbName);
		const collection = db.collection(collectionName);

		const formattedKey = searchKey.replace(/_/g, '.');

		let query;

		const numberValue = Number(searchValue);
		if (!isNaN(numberValue)) {
			query = { [formattedKey]: numberValue };
		} else if (searchValue.toLowerCase() === 'true') {
			query = { [formattedKey]: true };
		} else if (searchValue.toLowerCase() === 'false') {
			query = { [formattedKey]: false };
		} else {
			query = {
				[formattedKey]: {
					$regex: searchValue,
					$options: 'i',
				},
			};
		}

		const skip = (page - 1) * pageSize;

		try {
			const total = await collection.countDocuments(query);
			const documents = await collection.find(query).skip(skip).limit(pageSize).toArray();

			return {
				success: true,
				documents,
				pagination: {
					total,
					page,
					pageSize,
					totalPages: Math.ceil(total / pageSize),
				},
			};
		} catch (error) {
			console.error('Error in collection search:', error);
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
				documents: [],
				pagination: {
					total: 0,
					page: 1,
					pageSize,
					totalPages: 0,
				},
			};
		}
	}

	public async isCollectionExisting(dbName: string, collectionName: string) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error, exists: false };
		}

		try {
			const db = this.client.db(dbName);
			const collections = await db.listCollections().toArray();
			const exists = collections.some(col => col.name === collectionName);
			return { success: true, exists };
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
				exists: false,
			};
		}
	}

	public async getCollectionStats(dbName: string, collectionName: string) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error };
		}

		try {
			const db = this.client.db(dbName);
			const stats = (await db.command({ collStats: collectionName })) as CollectionStats;
			return { success: true, data: stats };
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
			};
		}
	}

	// DOCUMENT
	public async addDocument(dbName: string, collectionName: string, document: JSON) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error };
		}

		try {
			const db = this.client.db(dbName);
			const collection = db.collection(collectionName);
			const result = await collection.insertOne(document);

			return {
				success: true,
				insertedId: result.insertedId,
			};
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
			};
		}
	}

	public async updateDocument(
		dbName: string,
		collectionName: string,
		documentId: string,
		updatedDocument: MongoDocument,
	) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error, updated: false };
		}

		try {
			const db = this.client.db(dbName);
			const collection = db.collection(collectionName);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { _id, ...documentWithoutId } = updatedDocument;

			let query = {};
			if (/^[0-9a-fA-F]{24}$/.test(documentId)) {
				query = { _id: new ObjectId(documentId) };
			} else {
				query = { _id: documentId };
			}

			const result = await collection.updateOne(query, { $set: documentWithoutId });

			return {
				success: true,
				updated: result.modifiedCount > 0,
			};
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
				updated: false,
			};
		}
	}

	public async deleteDocument(dbName: string, collectionName: string, documentId: string) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error };
		}

		try {
			const db = this.client.db(dbName);
			const collection = db.collection(collectionName);

			let query = {};

			if (/^[0-9a-fA-F]{24}$/.test(documentId)) {
				query = { _id: new ObjectId(documentId) };
			} else {
				query = { _id: documentId };
			}

			const result = await collection.deleteOne(query);

			return {
				success: true,
				deleted: result.deletedCount > 0,
			};
		} catch (error) {
			this.connected = false;
			return {
				success: false,
				error: error instanceof Error ? error : new Error('Unknown error'),
				deleted: false,
			};
		}
	}

	public async createCollection(dbName: string, collectionName: string) {
		const connectResult = await this.connect();
		if (!connectResult.success) {
			return { success: false, error: connectResult.error };
		}
		try {
			const db = this.client.db(dbName);
			await db.createCollection(collectionName);
			return { success: true };
		} catch (error) {
			return { success: false, error };
		}
	}
}
