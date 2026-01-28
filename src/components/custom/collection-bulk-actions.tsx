'use client';

import { DownloadIcon, Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteAllDocuments, getDatabaseCollectionAllDocumentsJson } from '@/actions/databaseOperation';
import { Button } from '@/components/ui/button';
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

export function CollectionBulkActions() {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const params = useParams();
	const router = useRouter();

	const database = params.database as string;
	const collection = params.collection as string;

	const handleDownloadAll = async () => {
		setIsDownloading(true);
		try {
			const result = await getDatabaseCollectionAllDocumentsJson(database, collection);
			if (!result.success) {
				throw result.error || new Error('Failed to fetch documents');
			}

			const blob = new Blob([result.json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${collection}.json`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);

			toast.success('Documents downloaded');
		} catch (error) {
			console.error('Error downloading documents:', error);
			toast.error('Error downloading documents');
		} finally {
			setIsDownloading(false);
		}
	};

	const handleDeleteAll = async () => {
		setIsDeleting(true);
		try {
			const result = await deleteAllDocuments(database, collection);
			if (result.success) {
				toast.success(
					result.deletedCount > 0
						? `${result.deletedCount} documents deleted`
						: 'No documents to delete',
				);
				router.refresh();
			} else {
				throw result.error || new Error('Failed to delete documents');
			}
		} catch (error) {
			console.error('Error deleting documents:', error);
			toast.error('Error deleting documents');
		} finally {
			setIsDeleting(false);
			setShowDeleteDialog(false);
		}
	};

	return (
		<>
			<div className="ml-auto flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={handleDownloadAll}
					disabled={isDownloading || isDeleting}
				>
					<DownloadIcon size={14} />
					<span>Download all</span>
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setShowDeleteDialog(true)}
					disabled={isDeleting || isDownloading}
					className="text-destructive border-destructive/30 hover:bg-destructive/10"
				>
					<Trash2Icon size={14} />
					<span>Delete all</span>
				</Button>
			</div>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete all documents</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete every document in this collection. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteAll} disabled={isDeleting}>
							Delete all
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
