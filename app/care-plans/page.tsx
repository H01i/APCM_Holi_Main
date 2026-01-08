import InitialCarePlanForm from "@/components/care-plan/InitialCarePlanForm";

export default function CarePlansPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">Care Plans</h1>
        <p className="text-sm text-slate-600">
          Create a patient&apos;s initial APCM care plan with intake, assessments, goals, and consent.
        </p>
      </header>

      <InitialCarePlanForm />
    </div>
  );
}
