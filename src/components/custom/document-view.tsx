'use client';

import { ClientJsonEditor } from '@/components/custom/client-json-editor';

export function DocumentView({ data, isReadonly }: { data: string; isReadonly: boolean }) {
	return (
		<div className="border rounded-lg relative overflow-hidden w-full">
			<ClientJsonEditor
				className="w-full h-full overflow-scroll !bg-background !dark:border-[#242424]"
				data={JSON.parse(data)}
				restrictAdd={isReadonly}
				restrictDelete={isReadonly}
				restrictEdit={isReadonly}
				collapse={1}
			/>
		</div>
	);
}
