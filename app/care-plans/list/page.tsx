export default function CarePlansListPage() {
  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-slate-900">Care Plans</h1>
        <p className="text-sm text-slate-600">
          View generated APCM care plans. (Placeholder list — connect to data source.)
        </p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-700">
        No care plans to display yet. Integrate your data source to list plans here.
      </div>
    </div>
  );
}
