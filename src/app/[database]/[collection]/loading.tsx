import { Skeleton } from '@/components/ui/skeleton';
import { AppContainer } from '@/components/custom/app-container';

export default function Loading() {
	return (
		<AppContainer>
			<div>
				<Skeleton className="bg-muted w-52 h-6 rounded-lg" />
			</div>
			<div className="w-full h-full grid lg:grid-cols-3 gap-4">
				<div className="flex flex-col gap-4 lg:col-span-2 w-full h-full">
					<div>
						<Skeleton className="bg-muted w-full h-10 rounded-lg" />
					</div>
					<Skeleton className="bg-muted w-full rounded-lg h-52" />
					<Skeleton className="bg-muted w-full rounded-lg h-52" />
					<Skeleton className="bg-muted w-full rounded-lg h-52" />
				</div>
				<div>
					<Skeleton className="bg-muted w-full rounded-lg h-40" />
				</div>
			</div>
		</AppContainer>
	);
}
