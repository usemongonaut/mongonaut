import { ChevronRightIcon, DatabaseIcon, SettingsIcon, TableIcon } from 'lucide-react';
import Image from 'next/image';
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
import { Button } from '@/components/ui/button';

export async function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader />
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
					<Image
						src="images/logo.svg"
						alt="Mongonaut"
						className="dark:invert"
						width={30}
						height={30}
					/>
					<Button size={'icon'} variant={'ghost'}>
						<SettingsIcon />
					</Button>
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
