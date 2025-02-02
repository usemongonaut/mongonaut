import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/custom/app-sidebar';
import {
	collectSidebarDatabaseInformation,
	getServerInfo,
	listDatabases,
} from '@/actions/databaseOperation';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Mongonaut',
	description: 'Mongonaut is a lightweight easy-to-use MongoDB UI for the web.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const serverInfo = await getServerInfo();
	const { totalSize } = await listDatabases();
	const collectedDbInfo = await collectSidebarDatabaseInformation();

	return (
		<html lang="en" className="w-full h-full">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}>
				<SidebarProvider
					style={
						{
							'--sidebar-width': '350px',
						} as React.CSSProperties
					}
				>
					<AppSidebar databases={collectedDbInfo} totalSize={totalSize} serverInfo={serverInfo} />
					<SidebarInset>
						<main className="min-h-screen w-full">{children}</main>
					</SidebarInset>
				</SidebarProvider>
			</body>
		</html>
	);
}
