import Link from "next/link";
import { Patient } from "@/types/apcm";

const mockPatients: Patient[] = [
  {
    patientId: "p1",
    name: "Alex Johnson",
    dateOfBirth: "1980-04-12",
    medicareNumber: "1234-567-890",
    riskLevel: "Level 2",
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    consentStatus: true,
  },
  {
    patientId: "p2",
    name: "Maria Chen",
    dateOfBirth: "1972-09-03",
    medicareNumber: "9876-543-210",
    riskLevel: "Level 1",
    chronicConditions: ["Asthma"],
    consentStatus: false,
  },
  {
    patientId: "p3",
    name: "Samir Patel",
    dateOfBirth: "1959-11-21",
    medicareNumber: "1357-246-802",
    riskLevel: "Level 3",
    chronicConditions: ["CHF", "CKD", "Type 2 Diabetes"],
    consentStatus: true,
  },
];

export default function PatientList() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Patients</h2>
        <p className="text-sm text-slate-600">
          Mock roster with consent and risk level status.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Consent
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {mockPatients.map((patient) => (
              <tr key={patient.patientId} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {patient.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {patient.riskLevel}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      patient.consentStatus
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        patient.consentStatus ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {patient.consentStatus ? "Consent on file" : "Pending consent"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link
                    href={`/patients/${patient.patientId}`}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    View profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

