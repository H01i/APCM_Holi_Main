import { CarePlan, Consent } from "@/types/apcm";

type CommunicationLog = { date: string; channel: "sms" | "email" | "call"; note: string };

const mockConsent: Consent = {
  consentId: "consent-001",
  patientId: "p1",
  consentDate: "2025-01-08T10:00:00Z",
  method: "written",
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

const mockCommunications: CommunicationLog[] = [
  {
    date: "2025-01-18T15:35:00Z",
    channel: "sms",
    note: "Sent discharge follow-up reminder",
  },
  {
    date: "2025-01-19T18:10:00Z",
    channel: "call",
    note: "Nurse navigator reviewed medications",
  },
  {
    date: "2025-01-25T12:00:00Z",
    channel: "email",
    note: "Shared self-management education packet",
  },
];

export function generatePatientReport(patientId: string): string {
  const consent = mockConsent.patientId === patientId ? mockConsent : null;
  const carePlan = mockCarePlan.patientId === patientId ? mockCarePlan : null;

  const reportLines: string[] = [
    `# APCM Audit Report: ${patientId}`,
    "",
    "## Consent",
    consent
      ? `- Status: On file (${consent.method}) on ${consent.consentDate}`
      : "- Status: No consent on file",
    "",
    "## Care Plan",
  ];

  if (carePlan) {
    reportLines.push(
      `- Plan ID: ${carePlan.planId}`,
      "- Goals:",
      ...carePlan.goals.map((goal) => `  - ${goal}`),
      "- Needs:",
      ...carePlan.needs.map((need) => `  - ${need}`),
      "- Self-management:",
      ...carePlan.selfManagementActivities.map((item) => `  - ${item}`),
      "- Revision history:",
      ...carePlan.revisionHistory.map(
        (rev) =>
          `  - v${rev.version} on ${rev.updatedAt} by ${rev.updatedBy}: ${rev.summary}`,
      ),
    );
  } else {
    reportLines.push("- No care plan on file.");
  }

  reportLines.push("", "## Communication Log");
  mockCommunications.forEach((comm) => {
    reportLines.push(
      `- ${comm.date} [${comm.channel.toUpperCase()}] ${comm.note}`,
    );
  });

  return reportLines.join("\n");
}

