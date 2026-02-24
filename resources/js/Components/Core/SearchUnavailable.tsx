import { SearchX } from 'lucide-react';

export default function SearchUnavailable() {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 shadow-inner">
                <SearchX className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
                Pencarian Tidak Tersedia
            </h3>
            <p className="mt-2 max-w-sm text-slate-500">
                Fitur pencarian tidak tersedia di halaman ini.
            </p>
        </div>
    );
}
