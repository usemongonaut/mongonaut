import React from 'react';

export function AppContainer({ children }: { children?: React.ReactNode | React.ReactNode[] }) {
	return <div className="w-full h-full p-8 flex flex-col gap-4">{children}</div>;
}
