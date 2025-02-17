import { AppContainer } from '@/components/custom/app-container';

export default function Home() {
	return (
		<AppContainer>
			<div className="border m-auto w-full rounded-lg p-6 relative overflow-hidden max-w-lg">
				<div className="grid gap-4">
					<p className="text-xl font-semibold">Mongonaut</p>

					<div className="flex justify-between z-10">
						<div className="grid gap-2">
							<p>Version</p>
							<p>Contributors</p>
							<p>GitHub</p>
						</div>
						<div className="text-muted-foreground grid gap-2">
							<p>v0.0.1-ROV</p>
							<p>Levi H, Mathis F</p>
							<p>github.com/usemongonaut/mongonaut</p>
						</div>
					</div>
					<div className="items-center absolute -right-36 top-0">
						<img
							src="/images/logo.svg"
							draggable={false}
							alt="Mongonaut"
							className="w-96 h-96 opacity-[0.025] z-0"
						/>
					</div>
				</div>
			</div>
		</AppContainer>
	);
}
