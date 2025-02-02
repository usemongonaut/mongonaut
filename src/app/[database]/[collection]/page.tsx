import { FC } from 'react';

type Props = {
	params: Promise<{
		database: string;
		collection: string;
	}>;
};

const CollectionDetailPage: FC<Props> = async ({ params: params }) => {
	const { database, collection } = await params;
	return (
		<>
			{database} - {collection}
		</>
	);
};

export default CollectionDetailPage;
