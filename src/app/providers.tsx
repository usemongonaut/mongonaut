'use client';

import { ThemeProvider } from 'next-themes';
import type { FC, ReactElement, ReactNode } from 'react';
import { GlobalErrorBoundary } from '@/components/error/error-boundary';

type ProvidersProps = {
	children: ReactNode;
};

const Providers: FC<ProvidersProps> = ({ children }): ReactElement => (
	<GlobalErrorBoundary>
		<ThemeProvider attribute="class">{children}</ThemeProvider>
	</GlobalErrorBoundary>
);

export default Providers;
