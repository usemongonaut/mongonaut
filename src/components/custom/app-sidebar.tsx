import { ChevronRightIcon, DatabaseIcon, SearchIcon, SettingsIcon, TableIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

export async function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="relative mt-4">
					<Input placeholder="Search for anything..." className="pl-8" />

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
							<CollapsibleDatabaseSidebarItem
								name="minecraft"
								collections={[
									{
										name: 'players',
									},
								]}
							/>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className={'flex justify-between'}>
					<Link href="https://github.com/usemongonaut/mongonaut" target="_blank">
						<Image
							src="images/logo.svg"
							alt="Mongonaut"
							className="dark:invert"
							width={30}
							height={30}
						/>
					</Link>
					<SettingsButton />
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}

export function CollapsibleDatabaseSidebarItem({
	name,
	collections,
}: {
	name: string;
	collections: {
		name: string;
	}[];
}) {
	return (
		<SidebarMenuItem>
			<Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRightIcon className="transition-transform" />
						<DatabaseIcon />
						{name}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{collections.map((collection, index) => (
							<SidebarMenuButton
								key={index}
								isActive={name === 'button.tsx'}
								className="data-[active=true]:bg-transparent"
							>
								<TableIcon />
								{collection.name}
							</SidebarMenuButton>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
}
