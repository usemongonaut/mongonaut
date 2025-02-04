'use client';

import { EyeIcon } from 'lucide-react';
import { WithId } from 'mongodb';
import { Document } from 'bson';
import { useState } from 'react';
import { ClientJsonEditor } from '@/components/custom/client-json-editor';
import { Input } from '@/components/ui/input';

export function ClientDocumentsView({
	contentArray,
	isReadonly,
	database,
	collection,
}: {
	contentArray: WithId<Document>[];
	isReadonly: boolean;
	database: string;
	collection: string;
}) {
	const [search, setSearch] = useState('');

	const filteredContentArray = contentArray.filter(doc => {
		const plain = JSON.stringify(doc);
		return plain.toLowerCase().includes(search.toLowerCase());
	});

	return (
		<>
			<div>
				<Input
					placeholder={`Search in ${database}, ${collection}...`}
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</div>

			{filteredContentArray.map((doc, index) => {
				const plain = JSON.stringify(doc);

				return (
					<div className="border rounded-lg relative overflow-hidden" key={index}>
						<ClientJsonEditor
							className="w-full h-full overflow-scroll"
							data={JSON.parse(plain)}
							restrictAdd={isReadonly}
							restrictDelete={isReadonly}
							restrictEdit={isReadonly}
							collapse={1}
						/>

						{isReadonly && (
							<p className="text-xs font-semibold flex gap-2 text-primary-foreground uppercase bg-primary rounded-full py-0.5 px-2.5 absolute top-2.5 right-2.5">
								<EyeIcon size={12} className="my-auto" />
								Read-Only
							</p>
						)}
					</div>
				);
			})}
		</>
	);
}
