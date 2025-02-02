'use client';

import { ChevronRightIcon, DatabaseIcon, SearchIcon, SlashIcon, TableIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import prettyBytes from 'next/dist/lib/pretty-bytes';
import { Document } from 'mongodb';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { SettingsButton } from '@/components/custom/settings-button';
import { Database } from '@/lib/types/mongo';

export function AppSidebar({
	databases,
	totalSize,
	serverInfo,
}: {
	databases: Database[];
	totalSize?: number;
	serverInfo?: Document;
}) {
	const [search, setSearch] = useState('');

	const filteredDatabases = databases.filter(database => {
		return (
			database.name.toLowerCase().includes(search.trim().toLowerCase()) ||
			database.collections.some(collection =>
				collection.name.toLowerCase().includes(search.trim().toLowerCase()),
			)
		);
	});

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="relative mt-4">
					<Input
						placeholder="Search for anything..."
						className="pl-8"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>

					<div className="absolute p-2.5 left-0 top-0">
						<SearchIcon size={14} className="text-muted-foreground" />
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Databases</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{filteredDatabases.length > 0 ? (
								filteredDatabases.map((database, index) => (
									<CollapsibleDatabaseSidebarItem key={index} database={database} search={search} />
								))
							) : (
								<SidebarMenuItem className="border border-dashed px-2 py-4 rounded">
									<p className="text-muted-foreground text-xs">No databases found</p>
								</SidebarMenuItem>
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{serverInfo && (
					<div className="grid gap-2 px-2 border-b pb-3">
						<div className={'flex justify-between gap-2 text-xs'}>
							<div className="text-muted-foreground">
								{totalSize && <p>Used Space</p>}
								<p>Mongo Version</p>
								<p>Environment</p>
								<p>Max. Bson Size</p>
							</div>
							<div className="truncate">
								{totalSize && <p>{prettyBytes(totalSize)}</p>}
								<p>{serverInfo['version']}</p>
								<p>{serverInfo['buildEnvironment']['distmod']}</p>
								<p>{prettyBytes(serverInfo['maxBsonObjectSize'])}</p>
							</div>
						</div>
					</div>
				)}
				<div className={'flex justify-between'}>
					<Link
						href="https://github.com/usemongonaut/mongonaut"
						target="_blank"
						className="my-auto"
					>
						<Image
							src="images/logo.svg"
							alt="Mongonaut"
							className="dark:invert"
							width={30}
							height={30}
						/>
					</Link>
					<div className="my-auto flex">
						<SettingsButton />
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}

export function CollapsibleDatabaseSidebarItem({
	database,
	search,
}: {
	database: Database;
	search: string;
}) {
	const filteredCollections = (database: Database) => {
		return database.collections.filter(
			collection =>
				collection.name.toLowerCase().includes(search.trim().toLowerCase()) ||
				database.name.toLowerCase().includes(search.trim().toLowerCase()),
		);
	};

	return (
		<SidebarMenuItem>
			<Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRightIcon className="transition-transform" />
						<DatabaseIcon />
						{database.name}

						<div className="ml-auto text-muted-foreground text-xs">
							{prettyBytes(database.totalSize)}
						</div>
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{filteredCollections(database).map((collection, index) => (
							<SidebarMenuButton key={index} className="data-[active=true]:bg-transparent">
								<TableIcon />
								{collection.name}
								<div className="ml-auto text-muted-foreground text-xs flex gap-1">
									{collection.documentCount}
									<SlashIcon size={8} className="my-auto" />
									{prettyBytes(collection.totalSize)}
								</div>
							</SidebarMenuButton>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
}
