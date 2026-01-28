'use server';

import { MongoController } from '@/lib/mongoController';
import { Database, MongoDocument } from '@/lib/types/mongo';

const mongo = new MongoController();

export const getServerInfo = async () => {
	return await mongo.getServerInfo();
};

export const listDatabases = async () => {
	return await mongo.listDatabases();
};

export const collectSidebarDatabaseInformation = async () => {
	const databasesResult = await mongo.listDatabases();
	if (!databasesResult.success) {
		return { success: false, error: databasesResult.error };
	}

	if (!databasesResult.data) {
		return { success: false, error: new Error('No database data available') };
	}

	const databasesList = databasesResult.data.databases || [];
	const collectedDatabaseData: Database[] = [];

	for (const database of databasesList) {
		if (['admin', 'local', 'config'].includes(database.name)) {
			continue;
		}

		try {
			const collectionsResult = await mongo.getDatabaseCollections(database.name);
			if (!collectionsResult.success || !collectionsResult.data) {
				console.warn(`Could not get collections for database ${database.name}`);
				continue;
			}

			const collections = (await collectionsResult.data.toArray()).filter(
				col => col.name !== '__mongonaut_init',
			);

			const collectionsWithStats = await Promise.all(
				collections.map(async col => {
					try {
						const statsResult = await mongo.getCollectionStats(database.name, col.name);
						if (!statsResult.success || !statsResult.data) {
							console.warn(`Could not get stats for collection ${col.name}`);
							return {
								name: col.name,
								totalSize: 0,
								documentCount: 0,
							};
						}

						const stats = statsResult.data;
						return {
							name: col.name,
							totalSize: stats.size || 0,
							documentCount: stats.count || 0,
						};
					} catch (error) {
						console.error(`Error getting stats for ${col.name}:`, error);
						return {
							name: col.name,
							totalSize: 0,
							documentCount: 0,
						};
					}
				}),
			);

			collectedDatabaseData.push({
				name: database.name,
				collections: collectionsWithStats,
				totalSize: database.sizeOnDisk || 0,
			});
		} catch (error) {
			console.error(`Error processing database ${database.name}:`, error);
			continue;
		}
	}

	return { success: true, data: collectedDatabaseData };
};

export const getDatabaseCollection = async (name: string) => {
	const result = await mongo.getDatabaseCollections(name);
	return result.data;
};

export const getDatabaseCollectionStats = async (database: string, collection: string) => {
	const result = await mongo.getCollectionStats(database, collection);
	return result.data;
};

export const isDatabaseCollectionExisting = async (database: string, collection: string) => {
	const result = await mongo.isCollectionExisting(database, collection);
	return result.exists;
};

export const getDatabaseCollectionContent = async (
	database: string,
	collection: string,
	page: number = 1,
	pageSize: number = 10,
) => {
	const result = await mongo.getCollectionContent(database, collection, page, pageSize);

	return {
		documents: result.documents,
		pagination: result.pagination,
	};
};

export const getDatabaseCollectionAllDocumentsJson = async (
	database: string,
	collection: string,
) => {
	const result = await mongo.getAllDocuments(database, collection);

	return {
		success: result.success,
		json: result.documents ? JSON.stringify(result.documents, null, 2) : '[]',
		error: result.error,
	};
};

export const searchInCollection = async (
	database: string,
	collection: string,
	searchKey: string,
	searchValue: string,
	page: number = 1,
	pageSize: number = 10,
) => {
	const result = await mongo.searchInCollection(
		database,
		collection,
		searchKey,
		searchValue,
		page,
		pageSize,
	);

	return {
		documents: result.documents,
		pagination: result.pagination,
	};
};

export const deleteDocument = async (database: string, collection: string, documentId: string) => {
	const result = await mongo.deleteDocument(database, collection, documentId);

	return {
		success: result.success,
		deleted: result.deleted || false,
		error: result.error,
	};
};

export const deleteAllDocuments = async (database: string, collection: string) => {
	const result = await mongo.deleteAllDocuments(database, collection);

	return {
		success: result.success,
		deletedCount: result.deletedCount || 0,
		error: result.error,
	};
};

export const addDocument = async (database: string, collection: string, documentJson: string) => {
	try {
		const document = JSON.parse(documentJson);
		const result = await mongo.addDocument(database, collection, document);

		return {
			success: result.success,
			insertedId: result.insertedId || null,
			error: result.error,
		};
	} catch (error) {
		return {
			success: false,
			insertedId: null,
			error: error instanceof Error ? error : new Error('Invalid JSON'),
		};
	}
};

export const updateDocument = async (
	database: string,
	collection: string,
	documentId: string,
	updatedDocument: MongoDocument,
) => {
	const result = await mongo.updateDocument(database, collection, documentId, updatedDocument);

	return {
		success: result.success,
		updated: result.updated || false,
		error: result.error,
	};
};

export const createCollection = async (database: string, collection: string) => {
	return await mongo.createCollection(database, collection);
};

export const createDatabase = async (database: string) => {
	// MongoDB creates a database on first write, so we create a dummy collection
	const dummyCollection = '__mongonaut_init';
	// We don't drop the collection, otherwise the DB would be dropped as well if it's empty
	return await mongo.createCollection(database, dummyCollection);
};
