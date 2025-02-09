'use client';

import { EyeIcon } from 'lucide-react';
import { ClientJsonEditor } from '@/components/custom/client-json-editor';

export function ClientDocumentView({ data, isReadonly }: { data: string; isReadonly: boolean }) {
	return (
		<div className="border rounded-lg relative overflow-hidden">
			<ClientJsonEditor
				className="w-full h-full overflow-scroll !bg-card !dark:border-[#242424]"
				data={JSON.parse(data)}
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
}
