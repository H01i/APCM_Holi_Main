import Dashboard from "@/components/dashboard/Dashboard";
import PatientList from "@/components/patient/PatientList";
import PatientProfile from "@/components/patient/PatientProfile";

export default function Home() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          APCM Command Center
        </h1>
        <p className="text-sm text-slate-600">
          Mock workspace aligned to the APCM master specification.
        </p>
      </header>

      <Dashboard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PatientList />
        <PatientProfile />
      </div>
    </div>
  );
}
