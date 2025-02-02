import { FC } from 'react';
import { DatabaseIcon, TableIcon } from 'lucide-react';
import prettyBytes from 'next/dist/lib/pretty-bytes';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AppContainer } from '@/components/custom/app-container';
import { ClientJsonEditor } from '@/components/custom/client-json-editor';

type Props = {
	params: Promise<{
		database: string;
		collection: string;
	}>;
};

const CollectionDetailPage: FC<Props> = async ({ params: params }) => {
	const { database, collection } = await params;

	const testData = {
		_id: '1',
		name: 'John Doe',
		age: 30,
		email: 'lol@dd.de',
		names: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith', 'John Johnson', 'Jane Johnson'],
	};

	const data = {
		documents: 9,
		totalSize: 424233,
	};

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
					<ClientJsonEditor className="w-full h-full " data={testData} />
				</div>
				<div>
					<div className="border rounded-lg p-4 grid gap-2">
						<p className="text-lg font-semibold">Collection information</p>

						<div className="flex justify-between text-sm">
							<div className="text-muted-foreground">
								<p>Documents</p>
								<p>Collection Size</p>
							</div>
							<div>
								<p>{data.documents}</p>
								<p>{prettyBytes(data.totalSize)}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AppContainer>
	);
};

export default CollectionDetailPage;
