'use client';

import { FilterIcon } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface Props {
	defaultKey?: string;
	defaultValue?: string;
}

export default function Searchbar(props: Props) {
	const router = useRouter();
	const [key, setKey] = useState<string | undefined>(props.defaultKey);
	const [searchValue, setSearchValue] = useState<string | undefined>(props.defaultValue);

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		const baseUrl = window.location.pathname;

		const searchParams = new URLSearchParams();
		if (key) searchParams.set('key', key);
		if (searchValue) searchParams.set('value', searchValue);

		const newUrl = `${baseUrl}?${searchParams.toString()}`;

		router.push(newUrl);
	}

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
			<div className="flex gap-4">
				<FilterIcon className="text-muted-foreground my-auto" />
				<Input placeholder="Key" value={key || ''} onChange={e => setKey(e.target.value)} />
			</div>
			<Input
				placeholder="Value"
				value={searchValue || ''}
				onChange={e => setSearchValue(e.target.value)}
				className="col-span-2"
			/>
			<button type="submit" className="hidden" />
		</form>
	);
}
