'use client';

import { ThemeProvider } from 'next-themes';
import type { FC, ReactElement, ReactNode } from 'react';

type ProvidersProps = {
	children: ReactNode;
};

const Providers: FC<ProvidersProps> = ({ children }): ReactElement => (
	<ThemeProvider attribute="class">{children}</ThemeProvider>
);

export default Providers;
