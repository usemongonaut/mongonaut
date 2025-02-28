'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { MongoConnectionError } from '@/lib/errors/mongo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
	children: React.ReactNode;
}

interface State {
	error: Error | null;
	errorInfo: React.ErrorInfo | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
	}

	private isConnectionError(error: Error): boolean {
		return (
			error instanceof MongoConnectionError ||
			error.message.includes('ECONNREFUSED') ||
			error.message.includes('timeout') ||
			error.message.includes('Connection error')
		);
	}

	render() {
		if (this.state.error) {
			return (
				<div className="flex-1 flex items-center justify-center min-h-screen">
					<Card className="w-md mx-auto border-destructive/50">
						<CardHeader>
							<div className="flex items-center gap-2">
								<AlertCircle className="h-5 w-5 text-destructive" />
								<CardTitle>
									{this.isConnectionError(this.state.error)
										? 'Connection Error'
										: 'An Error Occurred'}
								</CardTitle>
							</div>
							<CardDescription>
								{this.isConnectionError(this.state.error)
									? 'Could not connect to the database'
									: this.state.error.message}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{this.isConnectionError(this.state.error) ? (
								<div className="text-sm text-muted-foreground">
									<p>Please check:</p>
									<ul className="list-disc list-inside mt-2 space-y-1">
										<li>MongoDB is running on your system</li>
										<li>The connection credentials are correct</li>
										<li>MongoDB is running on the expected port</li>
										<li>Your network connection is stable</li>
									</ul>
								</div>
							) : (
								<Card className="bg-muted/50">
									<CardContent className="p-3">
										<code className="text-xs text-muted-foreground font-mono break-all">
											{this.state.error.message}
										</code>
									</CardContent>
								</Card>
							)}

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

		return this.props.children;
	}
}
