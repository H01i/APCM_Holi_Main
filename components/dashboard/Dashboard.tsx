'use client';
/* eslint-disable @next/next/no-img-element */
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const patientsByRisk = [
  { level: "Level 1", count: 42 },
  { level: "Level 2", count: 28 },
  { level: "Level 3", count: 12 },
];

const careGaps = [
  { name: "Wellness visit", overdue: 24 },
  { name: "A1c check", overdue: 18 },
  { name: "Retinal exam", overdue: 9 },
  { name: "BP follow-up", overdue: 14 },
];

export default function Dashboard() {
  const totalPatients = patientsByRisk.reduce(
    (sum, entry) => sum + entry.count,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Total Enrolled"
          value={totalPatients.toString()}
          helper="Patients with an APCM care plan"
        />
        <StatCard
          title="Level 2"
          value={patientsByRisk.find((p) => p.level === "Level 2")?.count ?? 0}
          helper="Elevated risk needing self-management support"
        />
        <StatCard
          title="Level 3"
          value={patientsByRisk.find((p) => p.level === "Level 3")?.count ?? 0}
          helper="High-risk, complex care coordination"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Patients by Risk Level
          </h3>
          <p className="text-sm text-slate-600">
            Distribution based on chronic conditions and claims history.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {patientsByRisk.map((entry) => (
              <div
                key={entry.level}
                className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-800"
              >
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                {entry.level}: {entry.count}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Care Gaps</h3>
          <p className="text-sm text-slate-600">
            Overdue preventive and chronic care activities (mock data).
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={careGaps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="overdue" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: number | string;
  helper: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

