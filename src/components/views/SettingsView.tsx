import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  CreditCard, 
  Building2, 
  FileText, 
  Download, 
  Check, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CrystalCard } from '../common/CrystalCard';

export const SettingsView: React.FC = () => {
  const { 
    teamMembers, 
    auditLogs, 
    funeralHomeInfo, 
    showToast,
    logAudit 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'billing' | 'team' | 'security' | 'branding' | 'audit'>('billing');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(15);
  const [auditFilter, setAuditFilter] = useState('all');

  const handleExportAudit = () => {
    logAudit('Audit Log Exported', 'export', 'Exported comprehensive CSV audit trail for state licensing board.');
    showToast('Audit log CSV generated and exported.', 'success');
  };

  const filteredLogs = auditFilter === 'all' 
    ? auditLogs 
    : auditLogs.filter(l => l.category === auditFilter);

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-[#1F2F3E]">
            Settings & Compliance Controls
          </h1>
          <p className="text-xs text-[#2B3946]/70 mt-0.5">
            Configure funeral home details, flat $49 subscription, staff permissions, and security.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3EBF2] pb-3 overflow-x-auto">
        {[
          { id: 'billing', label: 'Flat Billing ($49/mo)', icon: CreditCard },
          { id: 'team', label: 'Team & Permissions Matrix', icon: Users },
          { id: 'security', label: 'Security & Access', icon: Shield },
          { id: 'branding', label: 'Funeral Home Profile', icon: Building2 },
          { id: 'audit', label: 'State Audit Log', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#3E5C76] text-white shadow-xs'
                  : 'bg-white/70 text-[#2B3946]/70 hover:text-[#1F2F3E] hover:bg-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BILLING ($49/MO FLAT CARD) */}
      {activeTab === 'billing' && (
        <div className="space-y-5 max-w-4xl">
          <CrystalCard ivory className="p-8 border-2 border-[#C4A35A]/50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#C4A35A] uppercase tracking-wider">
                  Transparent Flat Membership
                </span>
                <h2 className="font-serif text-3xl font-medium text-[#1F2F3E]">
                  $49 / month flat
                </h2>
                <p className="text-sm font-semibold text-[#5E8C7A]">
                  Unlimited cases. No per-case fees. No contracts.
                </p>
                <p className="text-xs text-[#2B3946]/80 max-w-lg leading-relaxed pt-1">
                  Unlike legacy funeral software that charges hundreds per decedent record, Aurel operates with utter price transparency. Every feature—FTC compliance engine, Family Portal, document vault, and calendar—is fully unlocked.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E3EBF2] shadow-xs text-xs space-y-2 min-w-[240px]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3EBF2]">
                  <span className="text-[#2B3946]/60">Status</span>
                  <span className="font-semibold text-[#5E8C7A] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Member
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2B3946]/60">Renews</span>
                  <span className="font-mono text-[#1F2F3E]">Oct 1, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2B3946]/60">Payment Method</span>
                  <span className="font-mono text-[#1F2F3E]">VISA ···· 4182</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#C4A35A]/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5E8C7A] shrink-0 mt-0.5" />
                <span>Unlimited case management and digital archive</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5E8C7A] shrink-0 mt-0.5" />
                <span>Elder-friendly Family Portal for all clients</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#5E8C7A] shrink-0 mt-0.5" />
                <span>Automated FTC Funeral Rule compliance checks</span>
              </div>
            </div>
          </CrystalCard>

          {/* Invoice History */}
          <CrystalCard className="p-5 space-y-3">
            <h3 className="font-serif text-sm font-semibold text-[#1F2F3E]">
              Subscription Invoice History
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="border-b border-[#E3EBF2] text-[#2B3946]/60">
                  <tr>
                    <th className="py-2 px-3 font-normal">Invoice Date</th>
                    <th className="py-2 px-3 font-normal">Plan Description</th>
                    <th className="py-2 px-3 font-normal">Amount</th>
                    <th className="py-2 px-3 font-normal">Status</th>
                    <th className="py-2 px-3 font-normal text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3EBF2]/60 font-mono">
                  <tr>
                    <td className="py-2.5 px-3">Sep 01, 2026</td>
                    <td className="py-2.5 px-3 font-sans">Aurel Independent Flat - September</td>
                    <td className="py-2.5 px-3 font-bold text-[#1F2F3E]">$49.00</td>
                    <td className="py-2.5 px-3 font-sans text-[#5E8C7A]">Paid</td>
                    <td className="py-2.5 px-3 text-right">
                      <button className="text-[#3E5C76] font-sans hover:underline">PDF</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Aug 01, 2026</td>
                    <td className="py-2.5 px-3 font-sans">Aurel Independent Flat - August</td>
                    <td className="py-2.5 px-3 font-bold text-[#1F2F3E]">$49.00</td>
                    <td className="py-2.5 px-3 font-sans text-[#5E8C7A]">Paid</td>
                    <td className="py-2.5 px-3 text-right">
                      <button className="text-[#3E5C76] font-sans hover:underline">PDF</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CrystalCard>
        </div>
      )}

      {/* TAB 2: TEAM & PERMISSIONS MATRIX */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="pb-2">
            <h3 className="font-serif text-base font-medium text-[#1F2F3E]">
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs text-[#2B3946]/70">
              Granular controls to protect sensitive decedent vitals and ensure only licensed directors execute FTC statements.
            </p>
          </div>

          <div className="crystal-card rounded-2xl overflow-hidden border border-[#E3EBF2]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FA] border-b border-[#E3EBF2] text-[#2B3946]/70">
                <tr>
                  <th className="py-3 px-4 font-normal">Team Member</th>
                  <th className="py-3 px-4 font-normal">Assigned Role</th>
                  <th className="py-3 px-4 font-normal text-center">Edit GPL Pricing</th>
                  <th className="py-3 px-4 font-normal text-center">Countersign Statement</th>
                  <th className="py-3 px-4 font-normal text-center">Reveal SSN/Vitals</th>
                  <th className="py-3 px-4 font-normal text-center">Process Payments</th>
                  <th className="py-3 px-4 font-normal text-center">Export Audit Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EBF2]/60">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#FBF9F4]/40">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#1F2F3E]">{member.name}</p>
                      <p className="text-[11px] text-[#2B3946]/60">
                        {member.licenseNumber || member.email}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#3E5C76]">
                      {member.role}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {member.permissions.canEditGPL ? (
                        <Check className="w-4 h-4 text-[#5E8C7A] mx-auto" />
                      ) : (
                        <span className="text-[#2B3946]/30">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {member.permissions.canSignStatement ? (
                        <Check className="w-4 h-4 text-[#5E8C7A] mx-auto" />
                      ) : (
                        <span className="text-[#2B3946]/30">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {member.permissions.canViewSSN ? (
                        <Check className="w-4 h-4 text-[#5E8C7A] mx-auto" />
                      ) : (
                        <span className="text-[#2B3946]/30">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {member.permissions.canProcessPayments ? (
                        <Check className="w-4 h-4 text-[#5E8C7A] mx-auto" />
                      ) : (
                        <span className="text-[#2B3946]/30">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {member.permissions.canExportAudit ? (
                        <Check className="w-4 h-4 text-[#5E8C7A] mx-auto" />
                      ) : (
                        <span className="text-[#2B3946]/30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & DATA PRIVACY */}
      {activeTab === 'security' && (
        <div className="space-y-4 max-w-3xl">
          <CrystalCard className="p-6 space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#1F2F3E]">
              Account Authentication & Vault Security
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3EBF2]">
                <div>
                  <p className="font-semibold text-[#1F2F3E]">
                    Multi-Factor Authentication (MFA)
                  </p>
                  <p className="text-[#2B3946]/70 mt-0.5">
                    Requires hardware key or authenticator app for staff logins.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMfaEnabled(!mfaEnabled);
                    showToast(`MFA was ${!mfaEnabled ? 'enabled' : 'disabled'}.`, 'info');
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    mfaEnabled ? 'bg-[#5E8C7A]' : 'bg-[#E3EBF2]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      mfaEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#E3EBF2]">
                <div>
                  <p className="font-semibold text-[#1F2F3E]">
                    Automatic Session Timeout Warning
                  </p>
                  <p className="text-[#2B3946]/70 mt-0.5">
                    Locks workstation screen if left unattended during arrangement meetings.
                  </p>
                </div>
                <select
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                  className="bg-white border border-[#E3EBF2] rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes (Standard)</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>

              <div className="p-4 bg-[#F4F7FA] rounded-xl space-y-2">
                <span className="font-semibold text-[#1F2F3E]">
                  Cryptographic Verification Status:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#2B3946]/80">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8C7A]" />
                    <span>AES-256 Cloud Vault Encryption (At rest)</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8C7A]" />
                    <span>TLS 1.3 Strict HTTPS Protocol (In transit)</span>
                  </p>
                </div>
                <p className="text-[10px] text-[#2B3946]/50 italic pt-1">
                  Aurel enforces zero data sharing with 3rd-party ad exchanges or lead brokers.
                </p>
              </div>
            </div>
          </CrystalCard>
        </div>
      )}

      {/* TAB 4: FUNERAL HOME BRANDING */}
      {activeTab === 'branding' && (
        <div className="space-y-4 max-w-3xl">
          <CrystalCard className="p-6 space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#1F2F3E]">
              Funeral Home Profile & Family Portal Appearance
            </h3>
            <p className="text-xs text-[#2B3946]/70">
              The Family Portal displays your funeral home name, license, and contact details with quiet dignity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#2B3946]/70 mb-1 font-medium">Funeral Home Name</label>
                <input
                  type="text"
                  defaultValue={funeralHomeInfo.name}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[#2B3946]/70 mb-1 font-medium">State Mortuary License #</label>
                <input
                  type="text"
                  defaultValue={funeralHomeInfo.licenseNumber}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#2B3946]/70 mb-1 font-medium">Public Phone</label>
                <input
                  type="text"
                  defaultValue={funeralHomeInfo.phone}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#2B3946]/70 mb-1 font-medium">Care Facility Address</label>
                <input
                  type="text"
                  defaultValue={funeralHomeInfo.address}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3EBF2] flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Funeral home branding profile saved.', 'success')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </CrystalCard>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-medium text-[#1F2F3E]">
                State Regulatory Audit Log
              </h3>
              <p className="text-xs text-[#2B3946]/70">
                Permanent, unalterable ledger of compliance events, sensitive record unmasking, and financial entries.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportAudit}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1F2F3E] bg-white border border-[#E3EBF2] hover:bg-[#F4F7FA] rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV for Inspector</span>
            </button>
          </div>

          <div className="crystal-card rounded-2xl overflow-hidden border border-[#E3EBF2]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FA] border-b border-[#E3EBF2] text-[#2B3946]/70 font-medium">
                <tr>
                  <th className="py-3 px-4 font-normal">Timestamp</th>
                  <th className="py-3 px-4 font-normal">Actor</th>
                  <th className="py-3 px-4 font-normal">Category</th>
                  <th className="py-3 px-4 font-normal">Action</th>
                  <th className="py-3 px-4 font-normal">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EBF2]/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FBF9F4]/40">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#2B3946]/70 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1F2F3E] whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        log.category === 'security'
                          ? 'bg-[#C98A2B]/15 text-[#C98A2B]'
                          : log.category === 'compliance'
                          ? 'bg-[#5E8C7A]/15 text-[#5E8C7A]'
                          : 'bg-[#E3EBF2] text-[#3E5C76]'
                      }`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1F2F3E]">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-[#2B3946]/80 leading-relaxed">
                      {log.details}
                      {log.wasSensitiveRevealed && (
                        <span className="ml-2 font-mono text-[10px] text-[#C98A2B] font-bold">
                          [SENSITIVE UNMASKED]
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
