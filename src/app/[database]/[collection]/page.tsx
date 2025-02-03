import { FC } from 'react';
import { DatabaseIcon, TableIcon } from 'lucide-react';
import prettyBytes from 'next/dist/lib/pretty-bytes';
import { redirect } from 'next/navigation';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AppContainer } from '@/components/custom/app-container';
import { ClientJsonEditor } from '@/components/custom/client-json-editor';
import {
	getDatabaseCollectionContent,
	getDatabaseCollectionStats,
	isDatabaseCollectionExisting,
} from '@/actions/databaseOperation';

type Props = {
	params: Promise<{
		database: string;
		collection: string;
	}>;
};

const CollectionDetailPage: FC<Props> = async ({ params: params }) => {
	const { database, collection } = await params;

	if (!(await isDatabaseCollectionExisting(database, collection))) {
		redirect('/404');
	}

	const stats = await getDatabaseCollectionStats(database, collection);
	const content = await getDatabaseCollectionContent(database, collection);
	const contentAsJson = await content.find().toArray();

	// Parsing json twice to simplify the data for client-side
	const plainJson = JSON.stringify(contentAsJson, null, 2);

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
				<div className="lg:col-span-2 border rounded-lg">
					<ClientJsonEditor
						className="w-full h-full overflow-scroll"
						data={JSON.parse(plainJson)}
					/>
				</div>
				<div>
					<div className="border rounded-lg p-4 grid gap-2 sticky top-4">
						<p className="text-lg font-semibold">Collection information</p>

						<div className="flex justify-between text-sm">
							<div className="text-muted-foreground">
								<p>Documents</p>
								<p>Collection Size</p>
								<p>Avg. Object Size</p>
							</div>
							<div>
								<p>{stats.count}</p>
								<p>{prettyBytes(stats.size)}</p>
								<p>{prettyBytes(stats.avgObjSize)}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AppContainer>
	);
};

export default CollectionDetailPage;
