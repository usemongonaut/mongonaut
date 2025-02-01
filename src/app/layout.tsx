import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/custom/app-sidebar';
import { Database } from '@/lib/types/mongo';

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
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// TODO: Get real data
	const databases: Database[] = [
		{
			name: 'test',
			collections: [
				{
					name: 'test',
				},
			],
		},
		{
			name: 'minecraft',
			collections: [
				{
					name: 'players',
				},
				{
					name: 'gamers',
				},
			],
		},
	];

	return (
		<html lang="en" className="w-full h-full">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}>
				<SidebarProvider>
					<AppSidebar databases={databases} />
					<SidebarInset>
						<main>{children}</main>
					</SidebarInset>
				</SidebarProvider>
			</body>
		</html>
	);
}
