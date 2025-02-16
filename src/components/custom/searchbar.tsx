'use client';

import { FilterIcon } from 'lucide-react';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface Props {
	defaultKey?: string;
	defaultValue?: string;
}

export default function Searchbar(props: Props) {
	const [key, setKey] = useState<string | undefined>(props.defaultKey);
	const [searchValue, setSearchValue] = useState<string | undefined>(props.defaultValue);

	function search() {
		const currentHrefWithoutQuery = window.location.href.split('?')[0];
		redirect(`${currentHrefWithoutQuery}?key=${key}&value=${searchValue}`);
	}

	return (
		<form onSubmit={search} className="grid grid-cols-3 gap-2">
			<div className="flex gap-4">
				<FilterIcon className="text-muted-foreground my-auto" />
				<Input placeholder="Key" value={key} onChange={e => setKey(e.target.value)} />
			</div>
			<Input
				placeholder="Value"
				value={searchValue}
				onChange={e => setSearchValue(e.target.value)}
				className="col-span-2"
			/>
			<Input type="submit" className="hidden" />
		</form>
	);
}
