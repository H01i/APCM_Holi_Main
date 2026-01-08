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

export default function InitialCarePlanForm() {
  const [form, setForm] = useState<CarePlanFormState>(initialFormState);
  const [patients, setPatients] = useState<PatientOption[]>(basePatientOptions);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

    console.log("Initial care plan payload", form);
    setStatus({
      type: "success",
      message: "Initial care plan draft captured (mock submit).",
    });
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
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            Save Care Plan Draft
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            Reset Form
          </button>
          <p className="text-xs text-slate-500">
            This form is mock-only and does not yet call the care plan API.
          </p>
        </div>
      </form>
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
