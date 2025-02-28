import { FC } from 'react';
import { DatabaseIcon, TableIcon } from 'lucide-react';
import prettyBytes from 'next/dist/lib/pretty-bytes';
import { notFound } from 'next/navigation';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AppContainer } from '@/components/custom/app-container';
import {
	getDatabaseCollectionContent,
	getDatabaseCollectionStats,
	isDatabaseCollectionExisting,
	searchInCollection,
} from '@/actions/databaseOperation';
import { envBool } from '@/lib/env';
import { DocumentView } from '@/components/custom/document-view';
import Searchbar from '@/components/custom/searchbar';
import { PaginationControls } from '@/components/custom/pagination-controls';

type Props = {
	params: Promise<{
		database: string;
		collection: string;
	}>;
	searchParams?: Promise<{
		[key: string]: string | undefined;
		page?: string;
		pageSize?: string;
	}>;
};

const CollectionDetailPage: FC<Props> = async ({ params, searchParams }) => {
	const { database, collection } = await params;
	const query = await searchParams;

	const currentPage = query?.page ? parseInt(query.page) : 1;
	const pageSize = query?.pageSize ? parseInt(query.pageSize) : 20;

	if (!(await isDatabaseCollectionExisting(database, collection))) {
		notFound();
	}

	const isReadonly = envBool('MONGONAUT_READONLY', false);
	const stats = await getDatabaseCollectionStats(database, collection);

	let content;
	if (query?.key && query?.value) {
		content = await searchInCollection(
			database,
			collection,
			query.key,
			query.value,
			currentPage,
			pageSize,
		);
	} else {
		content = await getDatabaseCollectionContent(database, collection, currentPage, pageSize);
	}

	return (
		<AppContainer>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage className="flex gap-2">
							<DatabaseIcon size={12} className="text-muted-foreground my-auto" />
							{database}
						</BreadcrumbPage>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className="flex gap-2">
							<TableIcon size={12} className="text-muted-foreground my-auto" />
							{collection}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="w-full h-full grid lg:grid-cols-3 gap-4">
				<div className={`flex flex-col gap-4 ${stats ? 'lg:col-span-2' : 'lg:col-span-3'} w-full`}>
					<Searchbar defaultKey={query?.key} defaultValue={query?.value} />

					{content?.documents.map((doc, index) => (
						<DocumentView key={index} data={JSON.stringify(doc)} isReadonly={isReadonly} />
					))}

					<PaginationControls
						currentPage={currentPage}
						totalPages={content?.pagination.totalPages || 0}
						pageSize={content?.pagination.pageSize || 0}
						total={content?.pagination.total || 0}
						query={query}
					/>
				</div>

				{stats && (
					<div>
						<div className="border rounded-lg p-4 grid gap-2 sticky top-4">
							<p className="text-lg font-semibold">Collection information</p>

							<div className="flex justify-between text-sm">
								<div className="text-muted-foreground">
									<p>Documents</p>
									<p>Collection Size</p>
									{stats.avgObjSize && <p>Avg. Object Size</p>}
								</div>
								<div>
									<p>{stats.count}</p>
									<p>{prettyBytes(stats.size)}</p>
									{stats.avgObjSize && <p>{prettyBytes(stats.avgObjSize)}</p>}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</AppContainer>
	);
};

export default CollectionDetailPage;
