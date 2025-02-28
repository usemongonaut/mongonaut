'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ConnectionError({ error }: { error: Error }) {
	return (
		<div className="flex-1 flex items-center justify-center">
			<Card className="w-md mx-auto border-destructive/50">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						<CardTitle>Connection Error</CardTitle>
					</div>
					<CardDescription>Could not establish connection to MongoDB.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-sm text-muted-foreground">
						<p>Please check:</p>
						<ul className="list-disc list-inside mt-2 space-y-1">
							<li>MongoDB is running on your system</li>
							<li>The connection URL is correct</li>
							<li>MongoDB is running on the expected port</li>
							<li>Your network connection is stable</li>
						</ul>
					</div>

					<Card className="bg-muted/50">
						<CardContent className="p-3">
							<code className="text-xs text-muted-foreground font-mono break-all">
								{error.message}
							</code>
						</CardContent>
					</Card>

					<Button
						variant="default"
						className="w-full cursor-pointer"
						onClick={() => window.location.reload()}
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						Try again
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
