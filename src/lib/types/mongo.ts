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
