import { Patient } from "@/types/apcm";

export type ADTEvent = {
  patientId: string;
  eventType: "admission" | "discharge" | "transfer";
  dischargeDate?: string;
  facility?: string;
};

const roster: Patient[] = [
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
    patientId: "p3",
    name: "Samir Patel",
    dateOfBirth: "1959-11-21",
    medicareNumber: "1357-246-802",
    riskLevel: "Level 3",
    chronicConditions: ["CHF", "CKD", "Type 2 Diabetes"],
    consentStatus: true,
  },
];

export function identifyPatientsNeedingFollowUp(event: ADTEvent): Patient[] {
  // Mock logic: outreach if discharge event or patient is high risk.
  return roster.filter(
    (patient) =>
      patient.patientId === event.patientId &&
      (event.eventType === "discharge" || patient.riskLevel === "Level 3"),
  );
}

export async function triggerOutreach(event: ADTEvent) {
  const patients = identifyPatientsNeedingFollowUp(event);

  patients.forEach((patient) => {
    const message = `Would send SMS/email to ${patient.name} for ${event.eventType} follow-up`;
    console.log("[Outreach]", message);
  });

  return { matchedPatients: patients.length };
}

