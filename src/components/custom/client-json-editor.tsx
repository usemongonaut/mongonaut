'use client';

import { githubDarkTheme, githubLightTheme, JsonEditor, JsonEditorProps } from 'json-edit-react';
import { useTheme } from 'next-themes';
import {
	CheckIcon,
	ChevronDownIcon,
	PenIcon,
	PlusSquareIcon,
	TrashIcon,
	XIcon,
} from 'lucide-react';

export function ClientJsonEditor(props: JsonEditorProps) {
	const { theme } = useTheme();
	let jsonTheme = githubLightTheme;

	if (theme === 'dark') {
		jsonTheme = githubDarkTheme;
	}

	return (
		<JsonEditor
			theme={jsonTheme}
			enableClipboard={false}
			icons={{
				edit: <PenIcon size={14} />,
				delete: <TrashIcon size={14} className="text-red-600" />,
				add: <PlusSquareIcon size={14} />,
				cancel: <XIcon size={14} className="text-red-600" />,
				ok: <CheckIcon size={14} className="text-green-400" />,
				chevron: <ChevronDownIcon size={14} />,
			}}
			{...props}
		/>
	);
}
