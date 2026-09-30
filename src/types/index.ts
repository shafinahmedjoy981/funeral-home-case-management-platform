export type CaseStatus = 
  | 'first_call' 
  | 'arrangement' 
  | 'preparing' 
  | 'service' 
  | 'aftercare' 
  | 'closed';

export type ServiceType = 
  | 'traditional_burial' 
  | 'direct_cremation' 
  | 'memorial_service' 
  | 'celebration_of_life' 
  | 'graveside';

export interface FamilyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  isPrimary: boolean;
  portalAccessGranted: boolean;
  portalLastActive?: string;
}

export interface LovedOne {
  firstName: string;
  middleName?: string;
  lastName: string;
  maidenName?: string;
  preferredName?: string;
  dateOfBirth: string;
  dateOfDeath: string;
  age: number;
  gender: string;
  maritalStatus: string;
  placeOfDeath: string;
  residenceCity: string;
  residenceState: string;
  veteranStatus: boolean;
  ssnMasked: string; // e.g. '***-**-4819'
  ssnFull: string;
  birthCity: string;
  birthState: string;
  fatherName?: string;
  motherMaidenName?: string;
}

export interface ComplianceRecord {
  status: 'compliant' | 'attention_needed' | 'in_progress';
  phoneGplOffered: boolean;
  inPersonGplHandedOut: boolean;
  casketPriceListPresentedBeforeSelection: boolean;
  outerBurialPriceListPresented: boolean;
  embalmingDisclosureAcknowledged: boolean;
  noHandlingFeeDisclosed: boolean;
  itemizedStatementProvided: boolean;
  itemizedStatementSigned: boolean;
  lastCheckedDate: string;
  notes: string;
}

export interface StatementItem {
  id: string;
  category: 'basic_services' | 'preparation' | 'facilities_staff' | 'automotive' | 'merchandise' | 'cash_advance';
  categoryLabel: string;
  name: string;
  description?: string;
  price: number;
  ftcMandatoryNotice?: string;
  selected: boolean;
  isDeclinedAllowed?: boolean;
}

export interface CashAdvanceItem {
  id: string;
  name: string;
  payee: string;
  amount: number;
  isEstimated: boolean;
}

export interface StatementOfServices {
  caseId: string;
  effectiveDate: string;
  items: StatementItem[];
  cashAdvances: CashAdvanceItem[];
  totalGoodsAndServices: number;
  totalCashAdvances: number;
  grandTotal: number;
  isSigned: boolean;
  signedBy?: string;
  signedAt?: string;
  signerRelation?: string;
  directorSignature?: string;
}

export interface CaseDocument {
  id: string;
  title: string;
  category: 'legal' | 'vital_records' | 'ftc' | 'memorial';
  status: 'completed' | 'pending_signature' | 'draft' | 'filed';
  lastUpdated: string;
  size: string;
  description: string;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  method: 'Credit Card' | 'ACH Bank Transfer' | 'Check' | 'Insurance Assignment' | 'Cash';
  reference: string;
  receivedBy: string;
  status: 'processed' | 'pending';
}

export interface CasePayment {
  totalCharges: number;
  amountPaid: number;
  balanceDue: number;
  transactions: PaymentTransaction[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time?: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  assignee: string;
  notes?: string;
}

export interface ObituaryDraft {
  headline: string;
  body: string;
  survivedBy: string;
  precededBy?: string;
  serviceDetails: string;
  memorialDonations: string;
  isApprovedByFamily: boolean;
  isPublished: boolean;
  publishedDate?: string;
  photoUrl?: string;
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  lovedOne: LovedOne;
  status: CaseStatus;
  serviceType: ServiceType;
  primaryCounselor: string;
  serviceDate: string;
  serviceTime: string;
  serviceLocation: string;
  cemeteryLocation?: string;
  familyContacts: FamilyContact[];
  compliance: ComplianceRecord;
  statement: StatementOfServices;
  documents: CaseDocument[];
  payments: CasePayment;
  timeline: TimelineEvent[];
  obituary: ObituaryDraft;
  nextStep: {
    title: string;
    description: string;
    targetTab: 'overview' | 'family' | 'statement' | 'documents' | 'payments';
    actionLabel: string;
    dueDate: string;
    isUrgent?: boolean;
  };
  createdAt: string;
  lastUpdated: string;
}

export interface PriceListItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isRange?: boolean;
  priceRangeMax?: number;
  ftcNotice?: string;
  isMandatoryBasic?: boolean;
}

export interface PriceListDocument {
  id: string;
  title: string;
  type: 'gpl' | 'cpl' | 'opl';
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  updatedBy: string;
  preambleDisclaimer: string;
  items: PriceListItem[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  category: 'compliance' | 'security' | 'financial' | 'case_edit' | 'export';
  details: string;
  caseNumber?: string;
  wasSensitiveRevealed?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner & Licensee' | 'Funeral Director' | 'Arrangement Counselor' | 'Apprentice / Assistant' | 'Read-only Auditor';
  licenseNumber?: string;
  phone: string;
  status: 'active' | 'invited';
  permissions: {
    canEditGPL: boolean;
    canSignStatement: boolean;
    canViewSSN: boolean;
    canProcessPayments: boolean;
    canExportAudit: boolean;
  };
}

export interface CalendarEvent {
  id: string;
  caseId: string;
  caseNumber: string;
  lovedOneName: string;
  title: string;
  type: 'visitation' | 'funeral_service' | 'cremation' | 'graveside' | 'family_conference';
  startDateTime: string;
  endDateTime: string;
  room: string;
  staffLead: string;
  vehicleAssigned?: string;
}
