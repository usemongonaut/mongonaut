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
} from '@/actions/databaseOperation';
import { envBool } from '@/lib/env';
import { Input } from '@/components/ui/input';
import { ClientDocumentView } from '@/components/custom/client-document-view';

type Props = {
	params: Promise<{
		database: string;
		collection: string;
	}>;
};

const CollectionDetailPage: FC<Props> = async ({ params: params }) => {
	const { database, collection } = await params;

	if (!(await isDatabaseCollectionExisting(database, collection))) {
		notFound();
	}

	const isReadonly = envBool('MONGONAUT_READONLY', false);

	const stats = await getDatabaseCollectionStats(database, collection);
	const content = await getDatabaseCollectionContent(database, collection);
	const contentArray = await content.find().toArray();

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
				<div className="flex flex-col gap-4 lg:col-span-2">
					<div>
						<Input placeholder={`Search in ${database}, ${collection}...`} />
					</div>

					{contentArray.map((doc, index) => {
						const plain = JSON.stringify(doc);

						return <ClientDocumentView key={index} data={plain} isReadonly={isReadonly} />;
					})}
				</div>
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
			</div>
		</AppContainer>
	);
};

export default CollectionDetailPage;
