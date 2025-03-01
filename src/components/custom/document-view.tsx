'use client';

import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ClientJsonEditor } from '@/components/custom/client-json-editor';
import { deleteDocument } from '@/actions/databaseOperation';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DocumentView({ data, isReadonly }: { data: string; isReadonly: boolean }) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const router = useRouter();
	const params = useParams();

	const document = JSON.parse(data);
	const documentId = document._id?.$oid || document._id;

	const handleDelete = async () => {
		if (!documentId || isReadonly) return;

		setIsDeleting(true);
		try {
			const result = await deleteDocument(
				params.database as string,
				params.collection as string,
				documentId,
			);

			if (result.success && result.deleted) {
				toast.success('Document deleted', {
					description: 'The document has been successfully deleted.',
				});

				router.refresh();
			} else {
				toast.error("Error deleting document'", {
					description: result.error?.message || 'An unknown error occurred',
				});

				console.error('Error deleting document:', result.error);
			}
		} catch (error) {
			console.error('Error deleting document:', error);
		} finally {
			setIsDeleting(false);
			setShowDeleteDialog(false);
		}
	};

	return (
		<div className="border rounded-lg relative overflow-hidden w-full">
			{!isReadonly && (
				<div className="absolute top-2 right-2 z-10">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowDeleteDialog(true)}
						disabled={isDeleting}
						className="text-muted-foreground hover:text-destructive cursor-pointer"
					>
						<TrashIcon size={16} />
					</Button>
				</div>
			)}

			<ClientJsonEditor
				className="w-full h-full overflow-scroll bg-background! !dark:border-[#242424]"
				data={document}
				restrictAdd={isReadonly}
				restrictDelete={isReadonly}
				restrictEdit={isReadonly}
				collapse={1}
			/>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Document</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this document? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
