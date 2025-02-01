export interface Collection {
	name: string;
}

export interface Database {
	name: string;
	collections: Collection[];
}
