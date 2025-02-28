'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	total: number;
	query?: Record<string, string | undefined>;
}

export function PaginationControls({
	currentPage,
	totalPages,
	pageSize,
	total,
	query,
}: PaginationControlsProps) {
	const router = useRouter();
	const pathname = usePathname();

	const handlePageChange = (newPage: number) => {
		const urlParams = new URLSearchParams();
		if (query) {
			Object.entries(query).forEach(([key, value]) => {
				if (value) urlParams.set(key, value);
			});
		}
		urlParams.set('page', newPage.toString());

		router.push(`${pathname}?${urlParams.toString()}`);
	};

	return (
		<div className="flex justify-between items-center mt-4">
			<div className="text-sm text-muted-foreground">
				Showing {pageSize} of {total} items (Page {currentPage} of {totalPages})
			</div>

			<div className="flex gap-2">
				<Button
					variant="outline"
					disabled={currentPage <= 1}
					onClick={() => handlePageChange(currentPage - 1)}
				>
					Previous
				</Button>

				<Button
					variant="outline"
					disabled={currentPage >= totalPages}
					onClick={() => handlePageChange(currentPage + 1)}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
