'use client';

import { ExternalLinkIcon, HeartIcon, LucideIcon, SettingsIcon, SunMoonIcon } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, usePreferredTheme } from '@/lib/utils';

export function SettingsButton() {
	const { setTheme } = useTheme();
	const theme = usePreferredTheme();

	const toggleTheme = (dark: boolean) => {
		setTheme(!dark ? 'light' : 'dark');
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="icon" variant="ghost">
					<SettingsIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-1.5 grid gap-1 w-56">
				<SettingsMenuItem icon={SunMoonIcon} label="Dark Mode">
					<Switch checked={theme === 'dark'} onCheckedChange={e => toggleTheme(e)} />
				</SettingsMenuItem>
				<SettingsMenuItem icon={HeartIcon} label="Become a Sponsor" href="https://github.com/" />
			</PopoverContent>
		</Popover>
	);
}

export function SettingsMenuItem(props: {
	icon: LucideIcon;
	label: string;
	href?: string;
	children?: string | React.ReactNode | React.ReactNode[];
}) {
	return (
		<Link href={props.href ?? ''}>
			<div
				className={cn(
					'flex justify-between gap-2 text-sm p-2 cursor-default',
					props.href && 'hover:bg-accent/50 rounded-md cursor-pointer',
				)}
			>
				<div className="flex gap-2">
					<props.icon size={16} className="text-muted-foreground my-auto" />
					<p>{props.label}</p>
				</div>

				{props.children ??
					(props.href && <ExternalLinkIcon className="my-auto text-muted-foreground" size={14} />)}
			</div>
		</Link>
	);
}
