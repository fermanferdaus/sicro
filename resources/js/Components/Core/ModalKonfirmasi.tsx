import { Fragment } from 'react';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import PrimaryButton from '@/Components/Form/PrimaryButton';

interface ModalKonfirmasiProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isProcessing?: boolean;
}

export default function ModalKonfirmasi({
    isOpen,
    onClose,
    onConfirm,
    title = 'Simpan Perubahan',
    description = 'Apakah Anda yakin ingin menyimpan perubahan ini?',
    confirmText = 'Simpan',
    cancelText = 'Batal',
    isProcessing = false,
}: ModalKonfirmasiProps) {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <Save
                                                className="h-6 w-6 text-amber-600"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <DialogTitle
                                                as="h3"
                                                className="text-lg leading-6 font-bold text-slate-900"
                                            >
                                                {title}
                                            </DialogTitle>
                                            <div className="mt-2">
                                                <p className="text-sm text-slate-500">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-500"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <PrimaryButton
                                        type="button"
                                        className={cn(
                                            'w-full sm:ml-3 sm:w-auto',
                                            isProcessing &&
                                                'cursor-not-allowed opacity-75',
                                        )}
                                        onClick={onConfirm}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing
                                            ? 'Menyimpan...'
                                            : confirmText}
                                    </PrimaryButton>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-300 ring-inset hover:bg-slate-50 sm:mt-0 sm:w-auto"
                                        onClick={onClose}
                                        disabled={isProcessing}
                                    >
                                        {cancelText}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
