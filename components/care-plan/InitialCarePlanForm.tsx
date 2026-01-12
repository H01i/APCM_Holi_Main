'use client';

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const LS_KEY = "apcm-care-plan-draft";
const primaryHeader = "bg-[#1F4E78]";
const secondaryHeader = "bg-[#4472C4]";
const borderColor = "border-[#CCCCCC]";

type ConditionRow = {
  condition: string;
  status: string;
  changes: string;
  providerAware: boolean;
};

type GoalRow = {
  description: string;
  barriers: string;
  progress: string;
  actions: string;
};

type MedicationRow = {
  name: string;
  adherence: string;
  issues: string;
};

type UtilizationRow = {
  event: string;
  occurred: string;
  provider: string;
  followUp: string;
};

type RiskRow = {
  assessment: string;
  status: string;
  flags: string;
  response: string;
};

type EducationRow = {
  topic: string;
  understanding: string;
  resources: string;
};

type CommunicationRow = {
  member: string;
  type: string;
  date: string;
};

type AttestationItem = {
  id: number;
  element: string;
  documented: boolean;
};

type Assessment = {
  assessment: string;
  actions: string;
};

type APCMCarePlan = {
  patientId: string;
  patientName: string;
  dob: string;
  age: string;
  mrn: string;
  email: string;
  intakeDate: string;
  careCoordinator: string;
  provider: string;
  conditions: ConditionRow[];
  goals: GoalRow[];
  medications: MedicationRow[];
  utilization: UtilizationRow[];
  risk: RiskRow[];
  education: EducationRow[];
  assessment: Assessment;
  communications: CommunicationRow[];
  attestations: AttestationItem[];
  lastModified?: string;
};

type PatientOption = { id: string; name: string; risk: string; dob?: string; mrn?: string };

type FormStatus =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const basePatientOptions: PatientOption[] = [
  { id: "p1", name: "Alex Johnson", risk: "Level 2", dob: "1980-04-12", mrn: "1234-567" },
  { id: "p2", name: "Maria Chen", risk: "Level 1", dob: "1972-09-03", mrn: "9876-543" },
  { id: "p3", name: "Samir Patel", risk: "Level 3", dob: "1959-11-21", mrn: "1357-246" },
];

const attestationElements: AttestationItem[] = [
  { id: 1, element: "Patient consent on file (written/verbal)", documented: false },
  { id: 2, element: "Comprehensive assessment completed", documented: false },
  { id: 3, element: "Personalized care plan created and reviewed", documented: false },
  { id: 4, element: "Medication reconciliation performed", documented: false },
  { id: 5, element: "24/7 access instructions reviewed", documented: false },
  { id: 6, element: "Care coordination with external providers", documented: false },
  { id: 7, element: "SDOH barriers assessed and addressed", documented: false },
  { id: 8, element: "Patient education provided", documented: false },
  { id: 9, element: "Self-management goals established", documented: false },
  { id: 10, element: "Follow-up schedule set", documented: false },
  { id: 11, element: "Communication preferences documented", documented: false },
  { id: 12, element: "Advance directives / proxy status reviewed", documented: false },
  { id: 13, element: "Care plan copy provided to patient", documented: false },
];

const initialPlan: APCMCarePlan = {
  patientId: "",
  patientName: "",
  dob: "",
  age: "",
  mrn: "",
  email: "",
  intakeDate: "",
  careCoordinator: "",
  provider: "",
  conditions: [{ condition: "", status: "", changes: "", providerAware: false }],
  goals: [{ description: "", barriers: "", progress: "", actions: "" }],
  medications: [{ name: "", adherence: "", issues: "" }],
  utilization: [{ event: "", occurred: "", provider: "", followUp: "" }],
  risk: [{ assessment: "", status: "", flags: "", response: "" }],
  education: [{ topic: "", understanding: "", resources: "" }],
  assessment: { assessment: "", actions: "" },
  communications: [{ member: "", type: "", date: "" }],
  attestations: attestationElements,
};

const samplePlan: APCMCarePlan = {
  patientId: "p1",
  patientName: "Alex Johnson",
  dob: "1980-04-12",
  age: "44",
  mrn: "1234-567",
  email: "patient@example.com",
  intakeDate: "2025-01-08",
  careCoordinator: "RN Smith",
  provider: "Dr. Taylor",
  conditions: [
    {
      condition: "Hypertension",
      status: "Active",
      changes: "Home BP trending 140s/80s",
      providerAware: true,
    },
    {
      condition: "Type 2 Diabetes",
      status: "Active",
      changes: "A1c 8.2 last month",
      providerAware: true,
    },
  ],
  goals: [
    {
      description: "Lower A1c to 7.0% in 3 months",
      barriers: "Diet adherence; med cost",
      progress: "Working on meal plan",
      actions: "RD referral; med sync; weekly RN call",
    },
    {
      description: "Control BP <130/80 in 8 weeks",
      barriers: "Missed doses; high-sodium meals",
      progress: "Started home BP log",
      actions: "Cuff education; sodium coaching; med reminders",
    },
  ],
  medications: [
    { name: "Metformin 1000 mg BID", adherence: "Partial", issues: "Misses PM dose" },
    { name: "Losartan 50 mg daily", adherence: "Good", issues: "None" },
  ],
  utilization: [
    {
      event: "ED visit dizziness (11/2024)",
      occurred: "Yes",
      provider: "ED discharge to PCP",
      followUp: "RN call; PCP follow-up scheduled",
    },
  ],
  risk: [
    {
      assessment: "Fall risk",
      status: "Moderate",
      flags: "Dizziness; polypharmacy",
      response: "Fall precautions reviewed; med review planned",
    },
  ],
  education: [
    {
      topic: "Low-sodium diet; hypoglycemia signs",
      understanding: "Teach-back completed",
      resources: "Handouts; portal links",
    },
  ],
  assessment: {
    assessment: "Needs tighter glycemic and BP control; SDOH barriers with transport",
    actions: "Coordinate transport; RD referral; med sync; close BP follow-up",
  },
  communications: [
    { member: "PCP", type: "Secure message", date: "2025-01-10" },
    { member: "RD", type: "Referral sent", date: "2025-01-12" },
  ],
  attestations: attestationElements.map((a) => ({ ...a, documented: true })),
  lastModified: new Date().toISOString(),
};

export default function InitialCarePlanForm() {
  const [plan, setPlan] = useState<APCMCarePlan>(initialPlan);
  const [patients, setPatients] = useState<PatientOption[]>(basePatientOptions);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [prefillChecked, setPrefillChecked] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");

  const formattedLastSaved = useMemo(
    () => (lastSaved ? new Date(lastSaved).toLocaleString() : "Not yet saved"),
    [lastSaved],
  );

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as APCMCarePlan;
      setPlan(parsed);
      setLastSaved(parsed.lastModified ?? "");
      setPrefillChecked(false);
    }
  }, []);

  useEffect(() => {
    if (!lastSaved) return;
    localStorage.setItem(LS_KEY, JSON.stringify({ ...plan, lastModified: lastSaved }));
  }, [plan, lastSaved]);

  const touch = () => {
    const iso = new Date().toISOString();
    setLastSaved(iso);
    return iso;
  };

  const updatePlan = (updater: (prev: APCMCarePlan) => APCMCarePlan) => {
    setPlan((prev) => {
      const next = updater(prev);
      const iso = touch();
      return { ...next, lastModified: iso };
    });
  };

  const handleBasicChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    updatePlan((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientSelect = (value: string) => {
    const selected = patients.find((p) => p.id === value);
    updatePlan((prev) => ({
      ...prev,
      patientId: value,
      patientName: selected?.name ?? prev.patientName,
      dob: selected?.dob ?? prev.dob,
      mrn: selected?.mrn ?? prev.mrn,
    }));
  };

  const updateRow = <K extends ArrayKeys, F extends keyof APCMCarePlan[K][number]>(
    key: K,
    index: number,
    field: F,
    value: APCMCarePlan[K][number][F],
  ) => {
    updatePlan((prev) => {
      const list = [...prev[key]];
      const target = { ...list[index], [field]: value } as APCMCarePlan[K][number];
      list[index] = target;
      return { ...prev, [key]: list };
    });
  };

  const addRow = (key: ArrayKeys) => {
    const defaults: Record<ArrayKeys, any> = {
      conditions: { condition: "", status: "", changes: "", providerAware: false },
      goals: { description: "", barriers: "", progress: "", actions: "" },
      medications: { name: "", adherence: "", issues: "" },
      utilization: { event: "", occurred: "", provider: "", followUp: "" },
      risk: { assessment: "", status: "", flags: "", response: "" },
      education: { topic: "", understanding: "", resources: "" },
      communications: { member: "", type: "", date: "" },
    };
    updatePlan((prev) => ({
      ...prev,
      [key]: [...prev[key], defaults[key]],
    }));
  };

  const toggleAttestation = (id: number, checked: boolean) => {
    updatePlan((prev) => ({
      ...prev,
      attestations: prev.attestations.map((item) =>
        item.id === id ? { ...item, documented: checked } : item,
      ),
    }));
  };

  const handlePrefillToggle = (checked: boolean) => {
    setPrefillChecked(checked);
    if (checked) {
      setPlan(samplePlan);
      setGeneratedPlan("");
      setStatus({
        type: "success",
        message: "Sample data prefilled for quick testing.",
      });
      setLastSaved(samplePlan.lastModified ?? new Date().toISOString());
    } else {
      setPlan(initialPlan);
      setGeneratedPlan("");
      setStatus({ type: "idle" });
      setLastSaved("");
    }
  };

  const generateTestPatients = () => {
    const names = [
      "Jordan Lee",
      "Priya Nair",
      "Diego Martinez",
      "Fatima Rahman",
      "Chris O'Connor",
    ];
    const risks = ["Level 1", "Level 2", "Level 3"];
    const now = Date.now();
    const generated: PatientOption[] = names.map((name, idx) => ({
      id: `tp-${now}-${idx}`,
      name,
      risk: risks[idx % risks.length],
    }));

    setPatients((prev) => [...prev, ...generated]);
    if (!plan.patientId && generated.length > 0) {
      handlePatientSelect(generated[0].id);
    }
    setStatus({
      type: "success",
      message: `Added ${generated.length} test patients for training.`,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const required = ["patientId", "patientName", "careCoordinator", "provider", "intakeDate"] as const;
    const missingRequired = required.filter((key) => !(plan as any)[key]);
    const missingTables: string[] = [];
    if (!plan.conditions.length) missingTables.push("Chronic Conditions");
    if (!plan.goals.length) missingTables.push("Patient Goals");
    if (!plan.medications.length) missingTables.push("Medication Review");

    if (missingRequired.length || missingTables.length) {
      setStatus({
        type: "error",
        message: `Please complete required fields: ${[...missingRequired, ...missingTables].join(", ")}`,
      });
      return;
    }

    setIsSubmitting(true);
    setGeneratedPlan("");
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/ai-care-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: plan }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error ?? "Failed to generate care plan");
      }

      const data = (await response.json()) as { plan?: string };
      setGeneratedPlan(data.plan ?? "");
      setStatus({
        type: "success",
        message: "Care plan saved. AI summary ready below.",
      });
    } catch (error) {
      console.error("Care plan generation failed", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate care plan right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPlan(initialPlan);
    setGeneratedPlan("");
    setStatus({ type: "idle" });
    setLastSaved("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">APCM Care Plan</h2>
          <p className="text-sm text-slate-600">
            Professional, print-friendly layout with inline editing and attestation.
          </p>
          <p className="text-xs text-slate-500">Last modified: {formattedLastSaved}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={generateTestPatients}
              className="inline-flex items-center justify-center rounded-md border border-[#4472C4] bg-[#D9E1F2] px-3 py-1.5 text-xs font-semibold text-[#1F4E78] transition hover:bg-[#c8d5ec] focus:outline-none focus:ring-2 focus:ring-[#4472C4] focus:ring-offset-1"
            >
              Generate test patients
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center rounded-md border border-[#4472C4] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F4E78] transition hover:bg-[#D9E1F2] focus:outline-none focus:ring-2 focus:ring-[#4472C4] focus:ring-offset-1"
            >
              Print / Export PDF
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-800">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-[#1F4E78] focus:ring-[#4472C4]"
              checked={prefillChecked}
              onChange={(e) => handlePrefillToggle(e.target.checked)}
            />
            Pre-fill required fields (sample data)
          </label>
          <span className="rounded-full bg-[#D9E1F2] px-3 py-1 text-xs font-semibold text-[#1F4E78]">
            Required fields marked *
          </span>
        </div>
      </div>

      {status.type === "error" && (
        <div className="mt-4 rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {status.message}
        </div>
      )}
      {status.type === "success" && (
        <div className="mt-4 rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {status.message}
        </div>
      )}

      <form className="mt-6 space-y-10" onSubmit={handleSubmit}>
        <SectionCard title="Patient Demographics">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className={`${primaryHeader} text-white`}>
                <TableHeader>Patient Name *</TableHeader>
                <TableHeader>DOB / Age</TableHeader>
                <TableHeader>MRN</TableHeader>
                <TableHeader>Care Coordinator *</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white even:bg-[#D9E1F2]">
                <TableCell>
                  <div className="flex gap-2">
                    <select
                      value={plan.patientId}
                      onChange={(e) => handlePatientSelect(e.target.value)}
                      className="w-40 rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                      required
                    >
                      <option value="">Select patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} — {patient.risk}
                        </option>
                      ))}
                    </select>
                    <input
                      name="patientName"
                      value={plan.patientName}
                      onChange={handleBasicChange}
                      className="flex-1 rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                      placeholder="Patient name"
                      required
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <input
                      name="dob"
                      type="date"
                      value={plan.dob}
                      onChange={handleBasicChange}
                      className="w-40 rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                    />
                    <input
                      name="age"
                      value={plan.age}
                      onChange={handleBasicChange}
                      className="w-16 rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                      placeholder="Age"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <input
                    name="mrn"
                    value={plan.mrn}
                    onChange={handleBasicChange}
                    className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                    placeholder="Medical record number"
                  />
                </TableCell>
                <TableCell>
                  <input
                    name="careCoordinator"
                    value={plan.careCoordinator}
                    onChange={handleBasicChange}
                    required
                    className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                    placeholder="Coordinator name"
                  />
                </TableCell>
              </tr>
              <tr className="odd:bg-white even:bg-[#D9E1F2]">
                <TableCell>
                  <input
                    name="email"
                    type="email"
                    value={plan.email}
                    onChange={handleBasicChange}
                    className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                    placeholder="Email (optional)"
                  />
                </TableCell>
                <TableCell>
                  <input
                    name="intakeDate"
                    type="date"
                    value={plan.intakeDate}
                    onChange={handleBasicChange}
                    required
                    className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  />
                </TableCell>
                <TableCell>
                  <input
                    name="provider"
                    value={plan.provider}
                    onChange={handleBasicChange}
                    required
                    className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                    placeholder="Provider"
                  />
                </TableCell>
                <TableCell />
              </tr>
            </tbody>
          </table>
        </SectionCard>

        <TableSection
          title="1) Chronic Conditions"
          description="Condition, status, changes, provider awareness"
          columns={["Condition", "Status", "Changes", "Provider Aware"]}
          headerTone="primary"
          onAddRow={() => addRow("conditions")}
        >
          {plan.conditions.map((row, idx) => (
            <tr key={`cond-${idx}`} className="odd:bg-white even:bg-[#D9E1F2]">
              <TableCell>
                <input
                  value={row.condition}
                  onChange={(e) => updateRow("conditions", idx, "condition", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Condition"
                />
              </TableCell>
              <TableCell>
                <input
                  value={row.status}
                  onChange={(e) => updateRow("conditions", idx, "status", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Status"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.changes}
                  onChange={(e) => updateRow("conditions", idx, "changes", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Recent changes / notes"
                />
              </TableCell>
              <TableCell className="text-center">
                <input
                  type="checkbox"
                  checked={row.providerAware}
                  onChange={(e) => updateRow("conditions", idx, "providerAware", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1F4E78] focus:ring-[#4472C4]"
                />
              </TableCell>
            </tr>
          ))}
        </TableSection>

        <TableSection
          title="2) Patient Goals & Progress"
          description="Goal, barriers, progress, coordinator actions"
          columns={["Goal Description", "Barriers", "Progress", "Coordinator Actions"]}
          headerTone="secondary"
          onAddRow={() => addRow("goals")}
        >
          {plan.goals.map((row, idx) => (
            <tr key={`goal-${idx}`} className="odd:bg-white even:bg-[#D9E1F2]">
              <TableCell>
                <textarea
                  value={row.description}
                  onChange={(e) => updateRow("goals", idx, "description", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Goal description"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.barriers}
                  onChange={(e) => updateRow("goals", idx, "barriers", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Barriers"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.progress}
                  onChange={(e) => updateRow("goals", idx, "progress", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Progress"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.actions}
                  onChange={(e) => updateRow("goals", idx, "actions", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Coordinator actions"
                />
              </TableCell>
            </tr>
          ))}
        </TableSection>

        <TableSection
          title="3) Medication Review"
          description="Medication, adherence, issues"
          columns={["Medication / Dose", "Adherence Status", "Issues"]}
          headerTone="primary"
          onAddRow={() => addRow("medications")}
        >
          {plan.medications.map((row, idx) => (
            <tr key={`med-${idx}`} className="odd:bg-white even:bg-[#D9E1F2]">
              <TableCell>
                <textarea
                  value={row.name}
                  onChange={(e) => updateRow("medications", idx, "name", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Medication and dose"
                />
              </TableCell>
              <TableCell>
                <input
                  value={row.adherence}
                  onChange={(e) => updateRow("medications", idx, "adherence", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Good / Partial / Poor"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.issues}
                  onChange={(e) => updateRow("medications", idx, "issues", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Side effects, cost, access"
                />
              </TableCell>
            </tr>
          ))}
        </TableSection>

        <TableSection
          title="4) Healthcare Utilization & Care Transitions"
          description="Events, occurrence, provider details, follow-up"
          columns={["Event Type", "Occurred", "Provider Details", "Follow-up"]}
          headerTone="secondary"
          onAddRow={() => addRow("utilization")}
        >
          {plan.utilization.map((row, idx) => (
            <tr key={`util-${idx}`} className="odd:bg-white even:bg-[#D9E1F2]">
              <TableCell>
                <input
                  value={row.event}
                  onChange={(e) => updateRow("utilization", idx, "event", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Hospital/ED/SNF/etc."
                />
              </TableCell>
              <TableCell>
                <input
                  value={row.occurred}
                  onChange={(e) => updateRow("utilization", idx, "occurred", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Yes/No + date"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.provider}
                  onChange={(e) => updateRow("utilization", idx, "provider", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Provider details"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.followUp}
                  onChange={(e) => updateRow("utilization", idx, "followUp", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Follow-up actions"
                />
              </TableCell>
            </tr>
          ))}
        </TableSection>

        <TableSection
          title="5) Risk Assessment & Safety"
          description="Risk, score/status, flags, response"
          columns={["Risk Assessment", "Score/Status", "Safety Flags", "Response"]}
          headerTone="primary"
          onAddRow={() => addRow("risk")}
        >
          {plan.risk.map((row, idx) => (
            <tr key={`risk-${idx}`} className="odd:bg-white even:bg-[#D9E1F2]">
              <TableCell>
                <input
                  value={row.assessment}
                  onChange={(e) => updateRow("risk", idx, "assessment", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Fall risk, PHQ-9, etc."
                />
              </TableCell>
              <TableCell>
                <input
                  value={row.status}
                  onChange={(e) => updateRow("risk", idx, "status", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Score or status"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.flags}
                  onChange={(e) => updateRow("risk", idx, "flags", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Safety flags"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.response}
                  onChange={(e) => updateRow("risk", idx, "response", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Response / plan"
                />
              </TableCell>
            </tr>
          ))}
        </TableSection>

        <TableSection
          title="6) Education Provided"
          description="Topics, understanding, resources"
          columns={["Topics Covered", "Patient Understanding", "Resources"]}
          headerTone="secondary"
          onAddRow={() => addRow("education")}
        >
          {plan.education.map((row, idx) => (
            <tr key={`edu-${idx}`} className="odd:bg-white even:bg-[#D9E1F2]">
              <TableCell>
                <textarea
                  value={row.topic}
                  onChange={(e) => updateRow("education", idx, "topic", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Topics covered"
                />
              </TableCell>
              <TableCell>
                <input
                  value={row.understanding}
                  onChange={(e) => updateRow("education", idx, "understanding", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Teach-back / understanding"
                />
              </TableCell>
              <TableCell>
                <textarea
                  value={row.resources}
                  onChange={(e) => updateRow("education", idx, "resources", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  rows={2}
                  placeholder="Links, handouts"
                />
              </TableCell>
            </tr>
          ))}
        </TableSection>

        <SectionCard title="7) Coordinator Clinical Assessment">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className={`${primaryHeader} text-white`}>
                <TableHeader>Overall Assessment</TableHeader>
                <TableHeader>Recommended Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white even:bg-[#D9E1F2]">
                <TableCell>
                  <textarea
                    value={plan.assessment.assessment}
                    onChange={(e) =>
                      updatePlan((prev) => ({
                        ...prev,
                        assessment: { ...prev.assessment, assessment: e.target.value },
                      }))
                    }
                    className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                    rows={3}
                    placeholder="Coordinator assessment"
                  />
                </TableCell>
                <TableCell>
                  <textarea
                    value={plan.assessment.actions}
                    onChange={(e) =>
                      updatePlan((prev) => ({
                        ...prev,
                        assessment: { ...prev.assessment, actions: e.target.value },
                      }))
                    }
                    className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                    rows={3}
                    placeholder="Recommended actions"
                  />
                </TableCell>
              </tr>
            </tbody>
          </table>
        </SectionCard>

        <TableSection
          title="8) Care Coordination & Communication"
          description="Care team member, communication type, date"
          columns={["Care Team Member", "Communication Type", "Date"]}
          headerTone="secondary"
          onAddRow={() => addRow("communications")}
        >
          {plan.communications.map((row, idx) => (
            <tr key={`comm-${idx}`} className="odd:bg-white even:bg-[#D9E1F2]">
              <TableCell>
                <input
                  value={row.member}
                  onChange={(e) => updateRow("communications", idx, "member", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Team member"
                />
              </TableCell>
              <TableCell>
                <input
                  value={row.type}
                  onChange={(e) => updateRow("communications", idx, "type", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                  placeholder="Call / message / visit"
                />
              </TableCell>
              <TableCell>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => updateRow("communications", idx, "date", e.target.value)}
                  className="w-full rounded-md border border-[#CCCCCC] px-2 py-1 text-sm focus:border-[#4472C4] focus:outline-none focus:ring-1 focus:ring-[#4472C4]"
                />
              </TableCell>
            </tr>
          ))}
        </TableSection>

        <SectionCard title="9) APCM Service Elements Attestation">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className={`${primaryHeader} text-white`}>
                <TableHeader className="w-10 text-center">#</TableHeader>
                <TableHeader>Service Element</TableHeader>
                <TableHeader className="w-32 text-center">Documented</TableHeader>
              </tr>
            </thead>
            <tbody>
              {plan.attestations.map((item) => (
                <tr key={`att-${item.id}`} className="odd:bg-white even:bg-[#D9E1F2]">
                  <TableCell className="text-center font-semibold">{item.id}</TableCell>
                  <TableCell>{item.element}</TableCell>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={item.documented}
                      onChange={(e) => toggleAttestation(item.id, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#1F4E78] focus:ring-[#4472C4]"
                    />
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-[#1F4E78] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#15375a] focus:outline-none focus:ring-2 focus:ring-[#4472C4] focus:ring-offset-1"
          >
            {isSubmitting ? "Generating..." : "Save & Generate Care Plan"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-md border border-[#CCCCCC] px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-[#D9E1F2] focus:outline-none focus:ring-2 focus:ring-[#4472C4] focus:ring-offset-1"
          >
            Reset Form
          </button>
          <p className="text-xs text-slate-500">
            Draft auto-saves locally. Set OPENAI_API_KEY to enable AI summary.
          </p>
        </div>
      </form>

      {generatedPlan && (
        <div className="mt-6 space-y-3 rounded-lg border border-[#CCCCCC] bg-[#F7F9FC] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1F4E78]">
            <span className="h-2 w-2 rounded-full bg-[#4472C4]" />
            AI-Generated APCM Care Plan
          </div>
          <div className="rounded-md border border-[#D9E1F2] bg-white p-4 text-sm text-slate-800 shadow-inner">
            {renderPlan(generatedPlan)}
          </div>
        </div>
      )}

    </section>
  );
}

type ArrayKeys =
  | "conditions"
  | "goals"
  | "medications"
  | "utilization"
  | "risk"
  | "education"
  | "communications";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-md border border-[#CCCCCC] bg-[#D9E1F2] p-4">
      <div className="text-sm font-semibold text-[#1F4E78]">{title}</div>
      <div className="rounded-md border border-[#CCCCCC] bg-white p-2">{children}</div>
    </div>
  );
}

function TableSection({
  title,
  description,
  columns,
  headerTone = "primary",
  onAddRow,
  children,
}: {
  title: string;
  description?: string;
  columns: string[];
  headerTone?: "primary" | "secondary";
  onAddRow?: () => void;
  children: React.ReactNode;
}) {
  const headerColor = headerTone === "primary" ? primaryHeader : secondaryHeader;
  return (
    <SectionCard title={title}>
      {description ? (
        <p className="px-1 text-xs text-slate-600">{description}</p>
      ) : null}
      <table className="mt-2 w-full border-collapse text-sm">
        <thead>
          <tr className={`${headerColor} text-white`}>
            {columns.map((col) => (
              <TableHeader key={col}>{col}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {onAddRow ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={onAddRow}
            className="inline-flex items-center justify-center rounded-md border border-[#4472C4] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F4E78] transition hover:bg-[#D9E1F2] focus:outline-none focus:ring-2 focus:ring-[#4472C4] focus:ring-offset-1"
          >
            Add row
          </button>
        </div>
      ) : null}
    </SectionCard>
  );
}

function TableHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`border ${borderColor} px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`border ${borderColor} px-3 py-2 align-top text-sm text-slate-800 ${className}`}>
      {children}
    </td>
  );
}

function renderPlan(plan: string) {
  // GPT sometimes wraps markdown in ```markdown ... ``` or leaves stray fences;
  // strip any fenced blocks first and normalize line endings so ReactMarkdown can style it.
  const stripCodeFence = (text: string) => {
    const fenced = text.match(/```(?:markdown)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) return fenced[1];
    return text.replace(/```/g, "");
  };

  const normalizeIndentation = (text: string) => {
    const lines = text.split("\n");
    const indents = lines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^(\s*)/)?.[1].length ?? 0);
    const minIndent = indents.length ? Math.min(...indents) : 0;
    if (minIndent === 0) return text;
    return lines.map((line) => line.slice(minIndent)).join("\n");
  };

  // Tables need a blank line before them or they render as text; add spacing.
  const ensureTableSpacing = (text: string) =>
    text.replace(/([^\n])\n(\|)/g, "$1\n\n$2");

  const cleaned = ensureTableSpacing(
    normalizeIndentation(stripCodeFence(plan).replace(/\r/g, "")),
  ).trim();

  const components: Components = {
    h1: ({ node, ...props }) => (
      <h2 className="text-lg font-semibold text-[#1F4E78]" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h3 className="text-base font-semibold text-[#1F4E78]" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h4 className="text-sm font-semibold text-[#1F4E78]" {...props} />
    ),
    p: ({ node, ...props }) => <p className="text-sm text-slate-800" {...props} />,
    ul: ({ node, ...props }) => (
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800" {...props} />
    ),
    li: ({ node, ...props }) => <li {...props} />,
    table: ({ node, ...props }) => (
      <div className="overflow-hidden rounded-md border border-slate-200 shadow-sm">
        <table className="min-w-full border-collapse text-sm" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => <thead className="bg-[#1F4E78] text-white" {...props} />,
    tbody: ({ node, ...props }) => <tbody {...props} />,
    tr: ({ node, ...props }) => <tr className="even:bg-[#F3F6FB]" {...props} />,
    th: ({ node, ...props }) => (
      <th className="border border-[#1F4E78] px-3 py-2 text-left font-semibold" {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className="border border-slate-200 px-3 py-2 align-top text-slate-800" {...props} />
    ),
  };

  return (
    <div className="space-y-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}
/* DUPLICATE BLOCK COMMENTED OUT
/* DUPLICATE BLOCK START
'use client';

import { useState } from "react";

type CarePlanFormState = {
  email: string;
  patientId: string;
  intakeDate: string;
  careCoordinator: string;
  provider: string;
  primaryConditions: string[];
  conditionNotes: string;
  currentMeds: string;
  polypharmacyStatus: string;
  medAdherence: string;
  functionalStatus: string;
  adl: string;
  iadl: string;
  mentalHealth: string;
  socialSupport: string;
  sdohBarriers: string[];
  sdohNotes: string;
  riskFactors: string;
  riskNotes: string;
  goal1: string;
  goal1Target: string;
  goal1Barriers: string;
  goal1Interventions: string;
  goal2: string;
  goal2Target: string;
  goal2Barriers: string;
  goal2Interventions: string;
  preventiveScreenings: string;
  immunizations: string;
  specialists: string;
  portalAccess: string;
  communicationMethod: string;
  access24Review: string;
  advanceDirectives: string;
  proxyDesignated: string;
  nextFollowUp: string;
  nextProviderVisit: string;
  actionItems: string;
  consentObtained: string;
  planCopyProvided: string;
  coordinatorSignature: string;
};

type PatientOption = { id: string; name: string; risk: string };

type FormStatus =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const basePatientOptions: PatientOption[] = [
  { id: "p1", name: "Alex Johnson", risk: "Level 2" },
  { id: "p2", name: "Maria Chen", risk: "Level 1" },
  { id: "p3", name: "Samir Patel", risk: "Level 3" },
];

const chronicConditionOptions = [
  "Hypertension",
  "Type 2 Diabetes",
  "CHF",
  "CKD",
  "COPD/Asthma",
  "Hyperlipidemia",
  "Depression/Anxiety",
  "Other",
];

const sdohBarrierOptions = [
  "Transportation",
  "Housing",
  "Food access",
  "Financial strain",
  "Utilities",
  "Social isolation",
  "Digital literacy/portal",
  "None reported",
];

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not-sure", label: "Not sure" },
];

const communicationOptions = [
  { value: "phone", label: "Phone" },
  { value: "sms", label: "Text/SMS" },
  { value: "email", label: "Email" },
  { value: "mail", label: "Mail" },
];

const initialFormState: CarePlanFormState = {
  email: "",
  patientId: "",
  intakeDate: "",
  careCoordinator: "",
  provider: "",
  primaryConditions: [],
  conditionNotes: "",
  currentMeds: "",
  polypharmacyStatus: "",
  medAdherence: "",
  functionalStatus: "",
  adl: "",
  iadl: "",
  mentalHealth: "",
  socialSupport: "",
  sdohBarriers: [],
  sdohNotes: "",
  riskFactors: "",
  riskNotes: "",
  goal1: "",
  goal1Target: "",
  goal1Barriers: "",
  goal1Interventions: "",
  goal2: "",
  goal2Target: "",
  goal2Barriers: "",
  goal2Interventions: "",
  preventiveScreenings: "",
  immunizations: "",
  specialists: "",
  portalAccess: "",
  communicationMethod: "",
  access24Review: "",
  advanceDirectives: "",
  proxyDesignated: "",
  nextFollowUp: "",
  nextProviderVisit: "",
  actionItems: "",
  consentObtained: "",
  planCopyProvided: "",
  coordinatorSignature: "",
};

const samplePrefill: CarePlanFormState = {
  email: "patient@example.com",
  patientId: "p1",
  intakeDate: "2025-01-08",
  careCoordinator: "RN Smith",
  provider: "Dr. Taylor",
  primaryConditions: ["Hypertension", "Type 2 Diabetes"],
  conditionNotes: "Recent A1c 8.2; home BP 140s/80s; overweight; limited exercise.",
  currentMeds:
    "Metformin 1000 mg BID; Losartan 50 mg daily; Atorvastatin 20 mg qhs; Aspirin 81 mg daily.",
  polypharmacyStatus: "polypharmacy",
  medAdherence: "partial",
  functionalStatus: "needs-some-help",
  adl: "Independent with most ADLs; occasional help with bathing after dizziness.",
  iadl: "Needs help with transportation to appointments; grocery delivery in place.",
  mentalHealth: "phq9-completed",
  socialSupport: "limited",
  sdohBarriers: ["Transportation", "Food access"],
  sdohNotes: "Provide transportation voucher; connect to food pharmacy program.",
  riskFactors:
    "Elevated A1c; hypertension; limited support; transportation barriers; prior ER visit for dizziness.",
  riskNotes: "Fall prevention reviewed; advised to call nurse line for dizziness or glucose <70.",
  goal1: "Lower A1c",
  goal1Target: "Reach A1c 7.0% in 3 months",
  goal1Barriers: "Diet adherence, med cost, forgets evening dose",
  goal1Interventions:
    "RD referral; pillbox and phone reminders; consider GLP-1 coverage check; weekly RN outreach.",
  goal2: "Improve blood pressure control",
  goal2Target: "Home BP <130/80 in 8 weeks",
  goal2Barriers: "Occasional missed doses; high-sodium takeout",
  goal2Interventions:
    "Nurse coaching on low-sodium meals; add BP cuff education; med sync at pharmacy; check adherence in 2 weeks.",
  preventiveScreenings: "AWV done 2024; A1c due Feb 2025; retinal exam due; colon CA up to date.",
  immunizations: "Influenza 2024; COVID booster 2024; needs shingles series; Tdap status unknown.",
  specialists: "Endocrinology — Dr. Gomez, next available TBD; Ophthalmology referral pending.",
  portalAccess: "needs-setup",
  communicationMethod: "phone",
  access24Review: "yes",
  advanceDirectives: "pending",
  proxyDesignated: "yes",
  nextFollowUp: "2025-02-15",
  nextProviderVisit: "2025-03-01",
  actionItems: "Send RD referral; schedule retinal exam; set A1c lab; arrange transportation.",
  consentObtained: "written",
  planCopyProvided: "yes",
  coordinatorSignature: "RS",
};

export default function InitialCarePlanForm() {
  const [form, setForm] = useState<CarePlanFormState>(initialFormState);
  const [patients, setPatients] = useState<PatientOption[]>(basePatientOptions);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [prefillChecked, setPrefillChecked] = useState(false);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleListValue = (key: "primaryConditions" | "sdohBarriers", value: string) => {
    setForm((prev) => {
      const current = prev[key];
      const exists = current.includes(value);
      const updated = exists ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredScalar: (keyof CarePlanFormState)[] = [
      "patientId",
      "intakeDate",
      "careCoordinator",
      "provider",
      "currentMeds",
      "polypharmacyStatus",
      "medAdherence",
      "functionalStatus",
      "mentalHealth",
      "socialSupport",
      "goal1",
      "goal2",
      "portalAccess",
      "communicationMethod",
      "access24Review",
      "advanceDirectives",
      "proxyDesignated",
      "nextFollowUp",
      "consentObtained",
      "planCopyProvided",
      "coordinatorSignature",
    ];

    const missingScalar = requiredScalar.filter((key) => {
      const value = form[key];
      return typeof value === "string" ? value.trim().length === 0 : false;
    });

    const missingLists: string[] = [];
    if (form.primaryConditions.length === 0) {
      missingLists.push("Primary Chronic Conditions");
    }
    if (form.sdohBarriers.length === 0) {
      missingLists.push("SDOH Barriers Identified");
    }

    if (missingScalar.length > 0 || missingLists.length > 0) {
      const missingNames = [
        ...missingScalar.map((field) => friendlyLabel(field)),
        ...missingLists,
      ];
      setStatus({
        type: "error",
        message: `Please complete required fields: ${missingNames.join(", ")}`,
      });
      return;
    }

    setIsSubmitting(true);
    setGeneratedPlan("");
    setStatus({ type: "idle" });

    try {
      console.log("Initial care plan payload", form);
      const response = await fetch("/api/ai-care-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error ?? "Failed to generate care plan");
      }

      const data = (await response.json()) as { plan?: string };
      setGeneratedPlan(data.plan ?? "");
      setStatus({
        type: "success",
        message: "AI-generated APCM care plan ready below.",
      });
    } catch (error) {
      console.error("Care plan generation failed", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate care plan right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialFormState);
    setStatus({ type: "idle" });
  };

  const generateTestPatients = () => {
    const names = [
      "Jordan Lee",
      "Priya Nair",
      "Diego Martinez",
      "Fatima Rahman",
      "Chris O'Connor",
    ];
    const risks = ["Level 1", "Level 2", "Level 3"];
    const now = Date.now();
    const generated: PatientOption[] = names.map((name, idx) => ({
      id: `tp-${now}-${idx}`,
      name,
      risk: risks[idx % risks.length],
    }));

    setPatients((prev) => [...prev, ...generated]);
    if (!form.patientId && generated.length > 0) {
      setForm((prev) => ({ ...prev, patientId: generated[0].id }));
    }
    setStatus({
      type: "success",
      message: `Added ${generated.length} test patients for training.`,
    });
  };

  const handlePrefillToggle = (checked: boolean) => {
    setPrefillChecked(checked);
    if (checked) {
      setForm(samplePrefill);
      setGeneratedPlan("");
      setStatus({
        type: "success",
        message: "Sample data prefilled for quick testing.",
      });
    } else {
      setForm(initialFormState);
      setGeneratedPlan("");
      setStatus({ type: "idle" });
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Create Initial Care Plan
          </h2>
          <p className="text-sm text-slate-600">
            Capture APCM-required intake, assessments, goals, consent, and follow-up details.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={generateTestPatients}
            className="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            Generate test patients
          </button>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-800">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              checked={prefillChecked}
              onChange={(e) => handlePrefillToggle(e.target.checked)}
            />
            Pre-fill required fields (sample data)
          </label>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Required fields marked *
          </span>
        </div>
      </div>

      {status.type === "error" && (
        <div className="mt-4 rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {status.message}
        </div>
      )}
      {status.type === "success" && (
        <div className="mt-4 rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {status.message}
        </div>
      )}

      <form className="mt-6 space-y-10" onSubmit={handleSubmit}>
        <FormSection title="Patient & Intake">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Email Address" description="Optional email for patient copy">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="patient@email.com"
              />
            </FormField>
            <FormField label="Select Patient" required>
              <select
                id="patientId"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                <option value="" disabled>
                  Choose patient
                </option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} — {patient.risk}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Intake Date" required>
              <input
                id="intakeDate"
                name="intakeDate"
                type="date"
                value={form.intakeDate}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </FormField>
            <FormField label="Care Coordinator Name" required>
              <input
                id="careCoordinator"
                name="careCoordinator"
                value={form.careCoordinator}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="RN / Care Coordinator"
              />
            </FormField>
            <FormField label="Provider" required>
              <input
                id="provider"
                name="provider"
                value={form.provider}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Ordering/PCP Provider"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Clinical Overview">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Primary Chronic Conditions (select all that apply)" required>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {chronicConditionOptions.map((condition) => (
                  <label
                    key={condition}
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
                  >
                    <input
                      type="checkbox"
                      name="primaryConditions"
                      checked={form.primaryConditions.includes(condition)}
                      onChange={() => toggleListValue("primaryConditions", condition)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {condition}
                  </label>
                ))}
              </div>
            </FormField>
            <FormField label="Condition Notes">
              <textarea
                id="conditionNotes"
                name="conditionNotes"
                value={form.conditionNotes}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Clinical context, recent exacerbations, care gaps"
              />
            </FormField>
            <FormField label="Current Medications" required>
              <textarea
                id="currentMeds"
                name="currentMeds"
                value={form.currentMeds}
                onChange={handleChange}
                rows={4}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="List meds with dose/frequency; flag high-risk agents"
              />
            </FormField>
            <FormField label="Polypharmacy Status" required>
              <select
                id="polypharmacyStatus"
                name="polypharmacyStatus"
                value={form.polypharmacyStatus}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="none">&lt; 5 active meds</option>
                <option value="polypharmacy">5-9 active meds (polypharmacy)</option>
                <option value="hyperpolypharmacy">10+ active meds (hyperpolypharmacy)</option>
                <option value="unknown">Unknown / pending reconciliation</option>
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Assessments & Functional Status">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Medication Adherence Assessment" required>
              <select
                id="medAdherence"
                name="medAdherence"
                value={form.medAdherence}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Choose assessment
                </option>
                <option value="good">Good adherence</option>
                <option value="partial">Partial / sometimes misses doses</option>
                <option value="poor">Poor adherence / frequent misses</option>
                <option value="unknown">Not assessed</option>
              </select>
            </FormField>
            <FormField label="Overall Functional Status" required>
              <select
                id="functionalStatus"
                name="functionalStatus"
                value={form.functionalStatus}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select functional status
                </option>
                <option value="independent">Independent</option>
                <option value="needs-some-help">Needs some assistance</option>
                <option value="dependent">Dependent for most activities</option>
              </select>
            </FormField>
            <FormField label="ADL Limitations">
              <textarea
                id="adl"
                name="adl"
                value={form.adl}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Bathing, dressing, toileting, feeding, transferring"
              />
            </FormField>
            <FormField label="IADL Limitations">
              <textarea
                id="iadl"
                name="iadl"
                value={form.iadl}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Shopping, cooking, transportation, finances, phone use"
              />
            </FormField>
            <FormField label="Mental Health Screening" required>
              <select
                id="mentalHealth"
                name="mentalHealth"
                value={form.mentalHealth}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select screening
                </option>
                <option value="phq9-completed">PHQ-9 completed</option>
                <option value="gad7-completed">GAD-7 completed</option>
                <option value="negative">Screening negative</option>
                <option value="positive">Positive / referral indicated</option>
                <option value="not-completed">Not completed</option>
              </select>
            </FormField>
            <FormField label="Social Support Assessment" required>
              <select
                id="socialSupport"
                name="socialSupport"
                value={form.socialSupport}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select support level
                </option>
                <option value="strong">Strong support system</option>
                <option value="limited">Limited / inconsistent support</option>
                <option value="none">No reliable support</option>
              </select>
            </FormField>
            <FormField label="SDOH Barriers Identified" required>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {sdohBarrierOptions.map((barrier) => (
                  <label
                    key={barrier}
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
                  >
                    <input
                      type="checkbox"
                      name="sdohBarriers"
                      checked={form.sdohBarriers.includes(barrier)}
                      onChange={() => toggleListValue("sdohBarriers", barrier)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {barrier}
                  </label>
                ))}
              </div>
            </FormField>
            <FormField label="SDOH Notes / Interventions Planned">
              <textarea
                id="sdohNotes"
                name="sdohNotes"
                value={form.sdohNotes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Referrals, community resources, transportation, financial counseling"
              />
            </FormField>
            <FormField label="Risk Factors Identified">
              <textarea
                id="riskFactors"
                name="riskFactors"
                value={form.riskFactors}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Clinical risk drivers, hospitalization risk, safety concerns"
              />
            </FormField>
            <FormField label="Risk Notes / Safety Plan">
              <textarea
                id="riskNotes"
                name="riskNotes"
                value={form.riskNotes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Fall plan, crisis plan, advance escalation steps"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Goals & Interventions">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Goal #1" required>
              <input
                id="goal1"
                name="goal1"
                value={form.goal1}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Primary clinical/behavioral goal"
              />
            </FormField>
            <FormField label="Goal #1 - Specific Target">
              <input
                id="goal1Target"
                name="goal1Target"
                value={form.goal1Target}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g., A1c to 7.0% in 3 months"
              />
            </FormField>
            <FormField label="Goal #1 - Barriers">
              <textarea
                id="goal1Barriers"
                name="goal1Barriers"
                value={form.goal1Barriers}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </FormField>
            <FormField label="Goal #1 - Planned Interventions">
              <textarea
                id="goal1Interventions"
                name="goal1Interventions"
                value={form.goal1Interventions}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </FormField>

            <FormField label="Goal #2" required>
              <input
                id="goal2"
                name="goal2"
                value={form.goal2}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Secondary goal"
              />
            </FormField>
            <FormField label="Goal #2 - Specific Target">
              <input
                id="goal2Target"
                name="goal2Target"
                value={form.goal2Target}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g., BP &lt;130/80 with home monitoring"
              />
            </FormField>
            <FormField label="Goal #2 - Barriers">
              <textarea
                id="goal2Barriers"
                name="goal2Barriers"
                value={form.goal2Barriers}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </FormField>
            <FormField label="Goal #2 - Planned Interventions">
              <textarea
                id="goal2Interventions"
                name="goal2Interventions"
                value={form.goal2Interventions}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Coordination, Access & Logistics">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Preventive Screenings - Current">
              <textarea
                id="preventiveScreenings"
                name="preventiveScreenings"
                value={form.preventiveScreenings}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="AWV, A1c, retinal, colon CA, mammogram, HCC recapture"
              />
            </FormField>
            <FormField label="Immunizations - Current">
              <textarea
                id="immunizations"
                name="immunizations"
                value={form.immunizations}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="COVID, influenza, pneumococcal, zoster, Tdap"
              />
            </FormField>
            <FormField label="Current Specialists">
              <textarea
                id="specialists"
                name="specialists"
                value={form.specialists}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Specialty, contact, next appointment"
              />
            </FormField>
            <FormField label="Patient Portal Access" required>
              <select
                id="portalAccess"
                name="portalAccess"
                value={form.portalAccess}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="active">Active and using</option>
                <option value="needs-setup">Needs help setting up</option>
                <option value="declined">Declined</option>
              </select>
            </FormField>
            <FormField label="Preferred Communication Method" required>
              <select
                id="communicationMethod"
                name="communicationMethod"
                value={form.communicationMethod}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select
                </option>
                {communicationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="24/7 Access Instructions Reviewed" required>
              <select
                id="access24Review"
                name="access24Review"
                value={form.access24Review}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select
                </option>
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Advance Directives Status" required>
              <select
                id="advanceDirectives"
                name="advanceDirectives"
                value={form.advanceDirectives}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="on-file">On file</option>
                <option value="pending">Pending completion</option>
                <option value="not-started">Not started</option>
                <option value="declined">Declined</option>
              </select>
            </FormField>
            <FormField label="Healthcare Proxy Designated" required>
              <select
                id="proxyDesignated"
                name="proxyDesignated"
                value={form.proxyDesignated}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select
                </option>
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Next Coordinator Follow-Up Date" required>
              <input
                id="nextFollowUp"
                name="nextFollowUp"
                type="date"
                value={form.nextFollowUp}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </FormField>
            <FormField label="Next Provider Visit (if scheduled)">
              <input
                id="nextProviderVisit"
                name="nextProviderVisit"
                type="date"
                value={form.nextProviderVisit}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </FormField>
            <FormField label="Action Items / Tasks">
              <textarea
                id="actionItems"
                name="actionItems"
                value={form.actionItems}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Assign tasks, referrals, education, equipment, outreach"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Consent & Attestation">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="APCM Consent Obtained" required>
              <select
                id="consentObtained"
                name="consentObtained"
                value={form.consentObtained}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="written">Yes - written</option>
                <option value="verbal">Yes - verbal</option>
                <option value="pending">Pending</option>
                <option value="declined">Declined</option>
              </select>
            </FormField>
            <FormField label="Care Plan Copy Provided" required>
              <select
                id="planCopyProvided"
                name="planCopyProvided"
                value={form.planCopyProvided}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select
                </option>
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Coordinator Signature/Initials" required>
              <input
                id="coordinatorSignature"
                name="coordinatorSignature"
                value={form.coordinatorSignature}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Type initials to attest"
              />
            </FormField>
          </div>
        </FormSection>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
          disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
          {isSubmitting ? "Generating..." : "Save & Generate Care Plan"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            Reset Form
          </button>
          <p className="text-xs text-slate-500">
            This form calls the AI care plan endpoint; set OPENAI_API_KEY in env.
          </p>
        </div>
      </form>

      {generatedPlan && (
        <div className="mt-6 space-y-3 rounded-lg border border-indigo-100 bg-indigo-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            AI-Generated APCM Care Plan
          </div>
          <div className="rounded-md border border-indigo-100 bg-white/60 p-4 text-sm text-slate-800 shadow-inner">
            {renderPlan(generatedPlan)}
          </div>
        </div>
      )}
    </section>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="h-2 w-2 rounded-full bg-indigo-500" />
        {title}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  required,
  description,
  children,
}: {
  label: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-1 text-sm font-medium text-slate-800">
      <span className="flex items-center gap-1">
        {label}
        {required ? <span className="text-rose-600">*</span> : null}
      </span>
      {children}
      {description ? (
        <span className="text-xs font-normal text-slate-500">{description}</span>
      ) : null}
    </label>
  );
}

function friendlyLabel(field: keyof CarePlanFormState): string {
  const labels: Record<keyof CarePlanFormState, string> = {
    email: "Email Address",
    patientId: "Select Patient",
    intakeDate: "Intake Date",
    careCoordinator: "Care Coordinator Name",
    provider: "Provider",
    primaryConditions: "Primary Chronic Conditions",
    conditionNotes: "Condition Notes",
    currentMeds: "Current Medications",
    polypharmacyStatus: "Polypharmacy Status",
    medAdherence: "Medication Adherence Assessment",
    functionalStatus: "Overall Functional Status",
    adl: "ADL Limitations",
    iadl: "IADL Limitations",
    mentalHealth: "Mental Health Screening",
    socialSupport: "Social Support Assessment",
    sdohBarriers: "SDOH Barriers Identified",
    sdohNotes: "SDOH Notes / Interventions Planned",
    riskFactors: "Risk Factors Identified",
    riskNotes: "Risk Notes / Safety Plan",
    goal1: "Goal #1",
    goal1Target: "Goal #1 - Specific Target",
    goal1Barriers: "Goal #1 - Barriers",
    goal1Interventions: "Goal #1 - Planned Interventions",
    goal2: "Goal #2",
    goal2Target: "Goal #2 - Specific Target",
    goal2Barriers: "Goal #2 - Barriers",
    goal2Interventions: "Goal #2 - Planned Interventions",
    preventiveScreenings: "Preventive Screenings - Current",
    immunizations: "Immunizations - Current",
    specialists: "Current Specialists",
    portalAccess: "Patient Portal Access",
    communicationMethod: "Preferred Communication Method",
    access24Review: "24/7 Access Instructions Reviewed",
    advanceDirectives: "Advance Directives Status",
    proxyDesignated: "Healthcare Proxy Designated",
    nextFollowUp: "Next Coordinator Follow-Up Date",
    nextProviderVisit: "Next Provider Visit",
    actionItems: "Action Items / Tasks",
    consentObtained: "APCM Consent Obtained",
    planCopyProvided: "Care Plan Copy Provided",
    coordinatorSignature: "Coordinator Signature/Initials",
  };
  return labels[field];
}
*/