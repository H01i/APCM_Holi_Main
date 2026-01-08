import { CarePlan, Patient } from "@/types/apcm";

const mockPatient: Patient = {
  patientId: "p1",
  name: "Alex Johnson",
  dateOfBirth: "1980-04-12",
  medicareNumber: "1234-567-890",
  riskLevel: "Level 2",
  chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  consentStatus: true,
};

const mockCarePlan: CarePlan = {
  planId: "cp-001",
  patientId: "p1",
  goals: [
    "Maintain A1c below 7.0%",
    "Reduce systolic BP to <130",
    "Increase weekly physical activity",
  ],
  needs: ["Medication reconciliation", "Nutrition counseling", "BP monitoring"],
  selfManagementActivities: [
    "Daily home BP log",
    "15-minute walks after meals",
    "Weekly weight tracking",
  ],
  revisionHistory: [
    {
      version: 1,
      updatedAt: "2024-11-02",
      updatedBy: "RN Smith",
      summary: "Initial plan created after enrollment",
    },
    {
      version: 2,
      updatedAt: "2025-01-15",
      updatedBy: "NP Taylor",
      summary: "Adjusted goals after medication change",
    },
  ],
};

export default function PatientProfile() {
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {mockPatient.name}
          </h2>
          <p className="text-sm text-slate-600">
            DOB {mockPatient.dateOfBirth} • Medicare {mockPatient.medicareNumber}
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
          {mockPatient.riskLevel}
        </span>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Patient Details</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">ID</p>
            <p>{mockPatient.patientId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Consent
            </p>
            <p>{mockPatient.consentStatus ? "On file" : "Pending"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Risk</p>
            <p>{mockPatient.riskLevel}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Chronic Conditions
            </p>
            <p>{mockPatient.chronicConditions.join(", ")}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Care Plan</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <CardList title="Goals" items={mockCarePlan.goals} />
          <CardList title="Needs" items={mockCarePlan.needs} />
          <CardList
            title="Self-Management Activities"
            items={mockCarePlan.selfManagementActivities}
          />
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-800">
            Revision History
          </h4>
          <ul className="mt-2 space-y-2">
            {mockCarePlan.revisionHistory.map((revision) => (
              <li
                key={revision.version}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">v{revision.version}</span>
                  <span className="text-xs text-slate-500">{revision.updatedAt}</span>
                </div>
                <p className="text-xs text-slate-600">
                  {revision.summary} — {revision.updatedBy}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function CardList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

