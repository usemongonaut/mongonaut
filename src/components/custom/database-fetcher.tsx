'use client';

import { ReactNode, useEffect, useState, useTransition } from 'react';
import { Document } from 'mongodb';
import {
	collectSidebarDatabaseInformation,
	getServerInfo,
	listDatabases,
} from '@/actions/databaseOperation';
import { DatabaseContent } from '@/components/custom/database-content';
import { MongoConnectionError } from '@/lib/errors/mongo';
import { Database } from '@/lib/types/mongo';

interface DatabaseFetcherProps {
	children: ReactNode;
}

type ActionResult<T> =
	| { success: true; data: T; error?: undefined }
	| { success: false; error: Error; data?: undefined };

interface DbListData {
	databases: unknown[];
	totalSize: number;
}

export function DatabaseFetcher({ children }: DatabaseFetcherProps) {
	const [databases, setDatabases] = useState<Database[]>([]);
	const [totalSize, setTotalSize] = useState<number | undefined>(undefined);
	const [serverInfo, setServerInfo] = useState<Document | undefined>(undefined);
	const [error, setError] = useState<Error | undefined>(undefined);
	const [initialLoading, setInitialLoading] = useState(true);
	const [isPending, startTransition] = useTransition();

	const fetchAllData = async () => {
		try {
			const [databasesResult, dbListResult, serverInfoResult] = await Promise.all([
				collectSidebarDatabaseInformation(),
				listDatabases() as Promise<ActionResult<DbListData>>,
				getServerInfo(),
			]);

			if (databasesResult.success && databasesResult.data) {
				setDatabases(databasesResult.data);
			} else {
				setDatabases([]);
			}

			if (dbListResult.success && dbListResult.data) {
				setTotalSize(dbListResult.data.totalSize);
			} else {
				setTotalSize(undefined);
			}

			if (serverInfoResult.success && serverInfoResult.data !== undefined) {
				setServerInfo(serverInfoResult.data);
			} else {
				setServerInfo(undefined);
			}

			// @ts-expect-error types are rip - need to clean up
			const connectionError = getConnectionError(databasesResult, dbListResult, serverInfoResult);
			setError(connectionError);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unexpected error occurred'));
			setDatabases([]);
			setTotalSize(undefined);
			setServerInfo(undefined);
		}
	};

	useEffect(() => {
		startTransition(() => {
			fetchAllData().finally(() => setInitialLoading(false));
		});
	}, []);

	useEffect(() => {
		if (initialLoading) return;

		const intervalId = setInterval(() => {
			startTransition(() => {
				void fetchAllData();
			});
		}, 60000);

		return () => clearInterval(intervalId);
	}, [initialLoading]);

	const isLoading = initialLoading || isPending;

	return (
		<DatabaseContent
			databases={databases}
			totalSize={totalSize}
			serverInfo={serverInfo}
			error={error}
			loading={isLoading}
		>
			{children}
		</DatabaseContent>
	);
}

function getConnectionError(
	...results: (
		| ActionResult<Database[]>
		| ActionResult<DbListData>
		| ActionResult<Document | undefined>
	)[]
): Error | undefined {
	for (const result of results) {
		if (!result.success && result.error) {
			if (
				result.error instanceof MongoConnectionError ||
				result.error.message.includes('ECONNREFUSED') ||
				result.error.message.includes('timeout') ||
				result.error.message.includes('Connection error')
			) {
				return result.error;
			}
		}
	}
	return undefined;
}
