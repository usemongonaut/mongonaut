export interface Collection {
	name: string;
	totalSize: number;
	documentCount: number;
}

export interface Database {
	name: string;
	collections: Collection[];
	totalSize: number;
}

export interface CollectionStats {
	size: number;
	count: number;
	storageSize: number;
	avgObjSize: number;
}
