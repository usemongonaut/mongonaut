'use server';

import { MongoController } from '@/lib/mongoController';
import { Database } from '@/lib/types/mongo';

const mongo = new MongoController();

export const getServerInfo = async () => {
	return mongo.getServerInfo();
};

export const listDatabases = async () => {
	return mongo.listDatabases();
};

export const getDatabaseCollection = async (name: string) => {
	return mongo.getDatabaseCollections(name);
};

export const getDatabaseCollectionStats = async (database: string, collection: string) => {
	return mongo.getCollectionStats(database, collection);
};

export const isDatabaseCollectionExisting = async (database: string, collection: string) => {
	return mongo.isCollectionExisting(database, collection);
};

export const getDatabaseCollectionContent = async (database: string, collection: string) => {
	return mongo.getCollectionContent(database, collection);
};

export const collectSidebarDatabaseInformation = async (): Promise<Database[]> => {
	const { databases } = await mongo.listDatabases();

	const collectedDatabaseData = [];
	for (const database of databases) {
		const collectionsResult = await mongo.getDatabaseCollections(database.name);
		const collections = await collectionsResult.toArray();

		const collectionsWithStats = await Promise.all(
			collections.map(async col => {
				const stats = await mongo.getCollectionStats(database.name, col.name);
				return {
					name: col.name,
					totalSize: stats.size || 0,
					documentCount: stats.count || 0,
				};
			}),
		);

		collectedDatabaseData.push({
			name: database.name,
			collections: collectionsWithStats,
			totalSize: database.sizeOnDisk || 0,
		});
	}

	return collectedDatabaseData;
};
