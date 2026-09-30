import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CaseRecord, 
  PriceListDocument, 
  TeamMember, 
  AuditLogEntry, 
  CalendarEvent,
  StatementItem,
  CashAdvanceItem,
  CaseStatus,
  ServiceType
} from '../types';
import { 
  MOCK_CASES, 
  INITIAL_PRICE_LISTS, 
  MOCK_TEAM, 
  MOCK_AUDIT_LOGS, 
  MOCK_CALENDAR_EVENTS, 
  FUNERAL_HOME_INFO 
} from '../data/mockData';

export type ActiveView = 
  | 'today' 
  | 'cases' 
  | 'case_detail' 
  | 'arrangement_builder' 
  | 'price_lists' 
  | 'calendar' 
  | 'settings';

export type CaseDetailTab = 
  | 'overview' 
  | 'family' 
  | 'statement' 
  | 'documents' 
  | 'payments' 
  | 'notes';

interface AppContextType {
  // Views & navigation
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  caseDetailTab: CaseDetailTab;
  setCaseDetailTab: (tab: CaseDetailTab) => void;
  currentCaseId: string;
  setCurrentCaseId: (id: string) => void;
  currentCase: CaseRecord | undefined;
  navigateToCase: (caseId: string, tab?: CaseDetailTab) => void;
  openArrangementBuilderForCase: (caseId: string) => void;

  // Data
  cases: CaseRecord[];
  priceLists: PriceListDocument[];
  teamMembers: TeamMember[];
  auditLogs: AuditLogEntry[];
  calendarEvents: CalendarEvent[];
  funeralHomeInfo: typeof FUNERAL_HOME_INFO;

  // Modals & Overlays
  isFamilyPortalOpen: boolean;
  setIsFamilyPortalOpen: (open: boolean) => void;
  familyPortalCaseId: string;
  launchFamilyPortal: (caseId?: string) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isNewCaseModalOpen: boolean;
  setIsNewCaseModalOpen: (open: boolean) => void;
  isPriceListModalOpen: boolean;
  setIsPriceListModalOpen: (open: boolean) => void;

  // Accessibility
  isLargeText: boolean;
  toggleLargeText: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;

  // Toast notifications (calm and kind)
  toast: { message: string; type: 'success' | 'info' | 'amber' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'amber') => void;

  // Actions
  addNewCase: (data: Partial<CaseRecord>) => string;
  updateCaseStatus: (caseId: string, status: CaseStatus) => void;
  updateComplianceItem: (caseId: string, key: keyof CaseRecord['compliance'], value: boolean | string) => void;
  signStatement: (caseId: string, signerName: string, signerRelation: string) => void;
  addStatementItemToCase: (caseId: string, item: StatementItem) => void;
  removeStatementItemFromCase: (caseId: string, itemId: string) => void;
  addPaymentToCase: (caseId: string, amount: number, method: 'Credit Card' | 'ACH Bank Transfer' | 'Check' | 'Insurance Assignment' | 'Cash', reference: string) => void;
  updateObituary: (caseId: string, updates: Partial<CaseRecord['obituary']>) => void;
  revealSensitiveField: (caseId: string, fieldName: string) => void;
  logAudit: (action: string, category: AuditLogEntry['category'], details: string, caseNumber?: string, wasSensitive?: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ActiveView>('today');
  const [caseDetailTab, setCaseDetailTab] = useState<CaseDetailTab>('overview');
  const [currentCaseId, setCurrentCaseId] = useState<string>('case-01');
  const [cases, setCases] = useState<CaseRecord[]>(MOCK_CASES);
  const [priceLists, setPriceLists] = useState<PriceListDocument[]>(INITIAL_PRICE_LISTS);
  const [teamMembers] = useState<TeamMember[]>(MOCK_TEAM);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [funeralHomeInfo] = useState(FUNERAL_HOME_INFO);

  // Modals & portal
  const [isFamilyPortalOpen, setIsFamilyPortalOpen] = useState(false);
  const [familyPortalCaseId, setFamilyPortalCaseId] = useState('case-01');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isPriceListModalOpen, setIsPriceListModalOpen] = useState(false);

  // Accessibility
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'amber' } | null>(null);

  // Current selected case
  const currentCase = cases.find(c => c.id === currentCaseId) || cases[0];

  const showToast = (message: string, type: 'success' | 'info' | 'amber' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleLargeText = () => {
    setIsLargeText(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('large-text');
      } else {
        document.documentElement.classList.remove('large-text');
      }
      return next;
    });
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return next;
    });
  };

  const navigateToCase = (caseId: string, tab: CaseDetailTab = 'overview') => {
    setCurrentCaseId(caseId);
    setCaseDetailTab(tab);
    setCurrentView('case_detail');
  };

  const openArrangementBuilderForCase = (caseId: string) => {
    setCurrentCaseId(caseId);
    setCurrentView('arrangement_builder');
  };

  const launchFamilyPortal = (caseId?: string) => {
    setFamilyPortalCaseId(caseId || currentCaseId);
    setIsFamilyPortalOpen(true);
  };

  const logAudit = (
    action: string, 
    category: AuditLogEntry['category'], 
    details: string, 
    caseNumber?: string, 
    wasSensitive: boolean = false
  ) => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Eleanor Vance (FD #4912)',
      role: 'Owner & Licensee',
      action,
      category,
      details,
      caseNumber,
      wasSensitiveRevealed: wasSensitive,
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const revealSensitiveField = (caseId: string, fieldName: string) => {
    const target = cases.find(c => c.id === caseId);
    logAudit(
      'Sensitive Record Revealed',
      'security',
      `Revealed ${fieldName} for deceased ${target?.lovedOne.firstName} ${target?.lovedOne.lastName}.`,
      target?.caseNumber,
      true
    );
    showToast(`Access to ${fieldName} was unmasked and logged for state audit compliance.`, 'amber');
  };

  const updateCaseStatus = (caseId: string, status: CaseStatus) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return { ...c, status, lastUpdated: new Date().toISOString() };
      }
      return c;
    }));
    logAudit('Case Status Changed', 'case_edit', `Status changed to ${status.replace('_', ' ')}`, currentCase?.caseNumber);
    showToast(`Case status updated to ${status.replace('_', ' ')}.`, 'info');
  };

  const updateComplianceItem = (caseId: string, key: keyof CaseRecord['compliance'], value: boolean | string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedCompliance = { ...c.compliance, [key]: value, lastCheckedDate: new Date().toISOString().split('T')[0] };
        
        // Recalculate status
        const checks = [
          updatedCompliance.phoneGplOffered,
          updatedCompliance.inPersonGplHandedOut,
          updatedCompliance.casketPriceListPresentedBeforeSelection,
          updatedCompliance.embalmingDisclosureAcknowledged,
          updatedCompliance.noHandlingFeeDisclosed,
        ];
        const allGood = checks.every(Boolean);
        updatedCompliance.status = allGood ? 'compliant' : 'attention_needed';

        return { ...c, compliance: updatedCompliance };
      }
      return c;
    }));
    logAudit('Compliance Item Verified', 'compliance', `Updated FTC compliance item: ${String(key)}`, currentCase?.caseNumber);
    showToast('FTC compliance checklist updated and recorded.', 'success');
  };

  const signStatement = (caseId: string, signerName: string, signerRelation: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          statement: {
            ...c.statement,
            isSigned: true,
            signedBy: signerName,
            signedAt: now,
            signerRelation,
            directorSignature: 'Eleanor Vance, Licensed Funeral Director #4912',
          },
          compliance: {
            ...c.compliance,
            itemizedStatementSigned: true,
            status: 'compliant',
          },
          documents: c.documents.map(d => 
            d.category === 'ftc' ? { ...d, status: 'completed', lastUpdated: 'Today' } : d
          ),
          nextStep: {
            title: 'Prepare Facilities and Memorial Tribute',
            description: 'Itemized statement signed. Proceed with scheduled service setup.',
            targetTab: 'overview',
            actionLabel: 'View Service Logistics',
            dueDate: c.serviceDate,
            isUrgent: false,
          }
        };
      }
      return c;
    }));
    logAudit(
      'Statement of Goods Signed',
      'compliance',
      `Itemized Statement countersigned by ${signerName} (${signerRelation}) & Eleanor Vance, FD.`,
      currentCase?.caseNumber
    );
    showToast('Statement of Funeral Goods & Services successfully signed and sealed.', 'success');
  };

  const addStatementItemToCase = (caseId: string, item: StatementItem) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const items = [...c.statement.items, item];
        const totalGoodsAndServices = items.reduce((sum, i) => sum + (i.selected ? i.price : 0), 0);
        const grandTotal = totalGoodsAndServices + c.statement.totalCashAdvances;
        return {
          ...c,
          statement: {
            ...c.statement,
            items,
            totalGoodsAndServices,
            grandTotal,
            isSigned: false, // requires resign if modified
          },
          payments: {
            ...c.payments,
            totalCharges: grandTotal,
            balanceDue: grandTotal - c.payments.amountPaid,
          }
        };
      }
      return c;
    }));
    logAudit('Statement Item Added', 'compliance', `Added ${item.name} ($${item.price.toLocaleString()}) to statement`, currentCase?.caseNumber);
    showToast(`Added ${item.name} to statement.`, 'info');
  };

  const removeStatementItemFromCase = (caseId: string, itemId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const itemToRemove = c.statement.items.find(i => i.id === itemId);
        if (itemToRemove?.category === 'basic_services' && itemToRemove.ftcMandatoryNotice) {
          showToast('Basic Services of Funeral Director cannot be removed under FTC Funeral Rule.', 'amber');
          return c;
        }
        const items = c.statement.items.filter(i => i.id !== itemId);
        const totalGoodsAndServices = items.reduce((sum, i) => sum + (i.selected ? i.price : 0), 0);
        const grandTotal = totalGoodsAndServices + c.statement.totalCashAdvances;
        return {
          ...c,
          statement: {
            ...c.statement,
            items,
            totalGoodsAndServices,
            grandTotal,
            isSigned: false,
          },
          payments: {
            ...c.payments,
            totalCharges: grandTotal,
            balanceDue: grandTotal - c.payments.amountPaid,
          }
        };
      }
      return c;
    }));
    showToast('Statement recalculated.', 'info');
  };

  const addPaymentToCase = (
    caseId: string, 
    amount: number, 
    method: 'Credit Card' | 'ACH Bank Transfer' | 'Check' | 'Insurance Assignment' | 'Cash', 
    reference: string
  ) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const newTx = {
          id: `tx-${Date.now()}`,
          date: 'Sep 28, 2026',
          amount,
          method,
          reference,
          receivedBy: 'Eleanor Vance',
          status: 'processed' as const,
        };
        const newPaid = c.payments.amountPaid + amount;
        return {
          ...c,
          payments: {
            ...c.payments,
            amountPaid: newPaid,
            balanceDue: Math.max(0, c.payments.totalCharges - newPaid),
            transactions: [newTx, ...c.payments.transactions],
          }
        };
      }
      return c;
    }));
    logAudit('Payment Received', 'financial', `Received $${amount.toLocaleString()} via ${method} (Ref: ${reference})`, currentCase?.caseNumber);
    showToast(`Payment of $${amount.toLocaleString()} recorded and receipt created.`, 'success');
  };

  const updateObituary = (caseId: string, updates: Partial<CaseRecord['obituary']>) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          obituary: {
            ...c.obituary,
            ...updates,
          }
        };
      }
      return c;
    }));
    showToast('Obituary draft updated gently.', 'info');
  };

  const addNewCase = (data: Partial<CaseRecord>): string => {
    const count = cases.length + 1;
    const caseNum = `CAS-2026-${String(816 + count).padStart(4, '0')}`;
    const newId = `case-${Date.now()}`;

    const newCase: CaseRecord = {
      id: newId,
      caseNumber: caseNum,
      lovedOne: {
        firstName: data.lovedOne?.firstName || 'Unnamed',
        lastName: data.lovedOne?.lastName || 'Record',
        dateOfBirth: data.lovedOne?.dateOfBirth || '1950-01-01',
        dateOfDeath: data.lovedOne?.dateOfDeath || '2026-09-28',
        age: data.lovedOne?.age || 76,
        gender: data.lovedOne?.gender || 'Not specified',
        maritalStatus: data.lovedOne?.maritalStatus || 'Married',
        placeOfDeath: data.lovedOne?.placeOfDeath || 'Local Medical Center',
        residenceCity: data.lovedOne?.residenceCity || 'Portland',
        residenceState: data.lovedOne?.residenceState || 'OR',
        veteranStatus: data.lovedOne?.veteranStatus || false,
        ssnMasked: '***-**-' + (Math.floor(1000 + Math.random() * 9000)),
        ssnFull: '540-00-' + (Math.floor(1000 + Math.random() * 9000)),
        birthCity: 'Portland',
        birthState: 'OR',
      },
      status: data.status || 'first_call',
      serviceType: data.serviceType || 'traditional_burial',
      primaryCounselor: 'Eleanor Vance, FD #4912',
      serviceDate: data.serviceDate || '2026-10-05',
      serviceTime: '11:00 AM',
      serviceLocation: 'Pinecrest Memorial Chapel',
      familyContacts: data.familyContacts || [
        {
          name: 'Family Representative',
          relationship: 'Next of Kin',
          phone: '(503) 555-0100',
          email: 'family@example.com',
          address: 'Portland, OR',
          isPrimary: true,
          portalAccessGranted: true,
        }
      ],
      compliance: {
        status: 'in_progress',
        phoneGplOffered: true,
        inPersonGplHandedOut: false,
        casketPriceListPresentedBeforeSelection: false,
        outerBurialPriceListPresented: false,
        embalmingDisclosureAcknowledged: false,
        noHandlingFeeDisclosed: true,
        itemizedStatementProvided: false,
        itemizedStatementSigned: false,
        lastCheckedDate: '2026-09-28',
        notes: 'Initial first call taken. GPL offered. Awaiting family arrangement conference.',
      },
      statement: {
        caseId: newId,
        effectiveDate: '2026-09-28',
        items: [
          {
            id: `item-${Date.now()}-1`,
            category: 'basic_services',
            categoryLabel: 'Basic Services of Funeral Director & Staff',
            name: 'Basic Services of Funeral Director and Staff',
            price: 2450,
            selected: true,
            ftcMandatoryNotice: 'Non-declinable basic services fee.',
          }
        ],
        cashAdvances: [],
        totalGoodsAndServices: 2450,
        totalCashAdvances: 0,
        grandTotal: 2450,
        isSigned: false,
      },
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          title: 'Initial Intake & Vitals Worksheet',
          category: 'vital_records',
          status: 'draft',
          lastUpdated: 'Today',
          size: '52 KB',
          description: 'Basic statistics for state health division vital statistics filing.',
        }
      ],
      payments: {
        totalCharges: 2450,
        amountPaid: 0,
        balanceDue: 2450,
        transactions: [],
      },
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          title: 'First Call Intake Recorded',
          subtitle: 'Case created in Aurel platform',
          date: 'Sep 28, 2026',
          time: 'Just now',
          status: 'completed',
          assignee: 'Eleanor Vance',
        }
      ],
      obituary: {
        headline: `${data.lovedOne?.firstName || ''} ${data.lovedOne?.lastName || ''}`,
        body: 'Memorial tribute pending family review.',
        survivedBy: '',
        serviceDetails: 'Services in the care of Pinecrest Memorial.',
        memorialDonations: '',
        isApprovedByFamily: false,
        isPublished: false,
      },
      nextStep: {
        title: 'Provide General Price List & Schedule Conference',
        description: 'Meet with family to review selections and deliver printed or digital GPL.',
        targetTab: 'overview',
        actionLabel: 'Open Arrangement Builder',
        dueDate: 'Tomorrow',
        isUrgent: true,
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    setCases(prev => [newCase, ...prev]);
    logAudit('New Case Created', 'case_edit', `Created case ${caseNum} for ${newCase.lovedOne.firstName} ${newCase.lovedOne.lastName}`, caseNum);
    showToast(`Case ${caseNum} gently initialized.`, 'success');
    return newId;
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        caseDetailTab,
        setCaseDetailTab,
        currentCaseId,
        setCurrentCaseId,
        currentCase,
        navigateToCase,
        openArrangementBuilderForCase,
        cases,
        priceLists,
        teamMembers,
        auditLogs,
        calendarEvents,
        funeralHomeInfo,
        isFamilyPortalOpen,
        setIsFamilyPortalOpen,
        familyPortalCaseId,
        launchFamilyPortal,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isNewCaseModalOpen,
        setIsNewCaseModalOpen,
        isPriceListModalOpen,
        setIsPriceListModalOpen,
        isLargeText,
        toggleLargeText,
        isHighContrast,
        toggleHighContrast,
        toast,
        showToast,
        addNewCase,
        updateCaseStatus,
        updateComplianceItem,
        signStatement,
        addStatementItemToCase,
        removeStatementItemFromCase,
        addPaymentToCase,
        updateObituary,
        revealSensitiveField,
        logAudit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
