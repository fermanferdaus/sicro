import { Edit, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableActionProps {
    onEdit?: () => void;
    onDelete?: () => void;
    editTitle?: string;
    deleteTitle?: string;
    className?: string;
}

export default function TableAction({
    onEdit,
    onDelete,
    editTitle = 'Edit',
    deleteTitle = 'Hapus',
    className,
}: TableActionProps) {
    return (
        <div
            className={cn('flex items-center justify-center gap-2', className)}
        >
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="p-1 text-slate-400 transition-colors hover:text-blue-500"
                    title={editTitle}
                >
                    <Edit className="h-5 w-5" />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-red-500 transition-all hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                    title={deleteTitle}
                >
                    <Trash className="h-4.5 w-4.5" />
                </button>
            )}
        </div>
    );
}
