export class MongoConnectionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'MongoConnectionError';
	}
}

export class MongoQueryError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'MongoQueryError';
	}
}
