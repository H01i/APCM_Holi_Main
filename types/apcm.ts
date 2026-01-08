export type RiskLevel = "Level 1" | "Level 2" | "Level 3";

export interface Patient {
  patientId: string;
  name: string;
  dateOfBirth: string; // ISO date string
  medicareNumber: string;
  riskLevel: RiskLevel;
  chronicConditions: string[];
  consentStatus: boolean;
}

export interface CarePlanRevision {
  version: number;
  updatedAt: string; // ISO date string
  updatedBy: string;
  summary: string;
}

export interface CarePlan {
  planId: string;
  patientId: string;
  goals: string[];
  needs: string[];
  selfManagementActivities: string[];
  revisionHistory: CarePlanRevision[];
}

export type ConsentMethod = "written" | "verbal";

export interface Consent {
  consentId: string;
  patientId: string;
  consentDate: string; // ISO date string
  method: ConsentMethod;
}

