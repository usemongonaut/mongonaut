export interface MongoServerInfo {
	version: string;
	host: string;
	process: string;
	pid: number;
	uptime: number;
	port?: number;
  }

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

export interface DatabaseStats {
	db: string;
	collections: number;
	views: number;
	objects: number;
	avgObjSize: number;
	dataSize: number;
	storageSize: number;
	indexes: number;
	indexSize: number;
	totalSize: number;
	scaleFactor: number;
	fsUsedSize: number;
	fsTotalSize: number;
	ok: number;
}
