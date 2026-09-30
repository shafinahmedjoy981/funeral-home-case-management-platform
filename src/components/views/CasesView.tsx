import React, { useState } from 'react';
import { 
  Search, 
  LayoutList, 
  Columns, 
  Plus, 
  Calendar, 
  User, 
  ExternalLink, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CrystalCard } from '../common/CrystalCard';
import { ComplianceBadge } from '../common/ComplianceBadge';
import { StatusChip } from '../common/StatusChip';
import { CaseStatus, CaseRecord } from '../../types';

export const CasesView: React.FC = () => {
  const { 
    cases, 
    navigateToCase, 
    openArrangementBuilderForCase,
    launchFamilyPortal,
    setIsNewCaseModalOpen 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  const statusCategories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Cases' },
    { id: 'first_call', label: 'First Call' },
    { id: 'arrangement', label: 'Arrangement' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'service', label: 'Service' },
    { id: 'aftercare', label: 'Aftercare' },
    { id: 'closed', label: 'Closed' },
  ];

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      search.trim() === '' ||
      c.lovedOne.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lovedOne.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.familyContacts.some(f => f.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* View Header with Search, Filter & View Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-[#1F2F3E]">
            Case Management
          </h1>
          <p className="text-xs text-[#2B3946]/70 mt-0.5">
            {cases.length} total records ({cases.filter(c => c.status !== 'closed').length} active, {cases.filter(c => c.status === 'closed').length} archived)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* List / Board Toggle */}
          <div className="flex items-center bg-[#F4F7FA] p-1 rounded-xl border border-[#E3EBF2]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-[#1F2F3E] shadow-xs'
                  : 'text-[#2B3946]/70 hover:text-[#1F2F3E]'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'board'
                  ? 'bg-white text-[#1F2F3E] shadow-xs'
                  : 'text-[#2B3946]/70 hover:text-[#1F2F3E]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          {/* New Case Button */}
          <button
            type="button"
            onClick={() => setIsNewCaseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C4A35A]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Case Intake</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#2B3946]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by loved one, case #, or next of kin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#E3EBF2] focus:border-[#C4A35A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A35A]"
          />
        </div>

        {/* Status segmented filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedStatus(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedStatus === cat.id
                  ? 'bg-[#3E5C76] text-white shadow-xs'
                  : 'text-[#2B3946]/70 hover:text-[#1F2F3E] hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: List or Board */}
      {viewMode === 'list' ? (
        <div className="crystal-card rounded-2xl overflow-hidden border border-[#E3EBF2]/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FA]/70 border-b border-[#E3EBF2] text-[#2B3946]/70 font-medium">
                <tr>
                  <th className="py-3.5 px-4 font-normal">Loved One</th>
                  <th className="py-3.5 px-4 font-normal">Case #</th>
                  <th className="py-3.5 px-4 font-normal">Status</th>
                  <th className="py-3.5 px-4 font-normal">Service Type</th>
                  <th className="py-3.5 px-4 font-normal">Next Step</th>
                  <th className="py-3.5 px-4 font-normal">Compliance</th>
                  <th className="py-3.5 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EBF2]/60">
                {filteredCases.map((c) => (
                  <tr 
                    key={c.id}
                    onClick={() => navigateToCase(c.id, 'overview')}
                    className="hover:bg-[#FBF9F4]/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-sm text-[#1F2F3E] group-hover:text-[#3E5C76]">
                          {c.lovedOne.firstName} {c.lovedOne.lastName}
                        </p>
                        <p className="text-[11px] text-[#2B3946]/60">
                          Age {c.lovedOne.age} · Passed {c.lovedOne.dateOfDeath}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-[#2B3946]/80">
                      {c.caseNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusChip status={c.status} />
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-xs font-medium text-[#1F2F3E] capitalize">
                        {c.serviceType.replace('_', ' ')}
                      </p>
                      <p className="text-[11px] text-[#2B3946]/60">
                        {c.serviceDate}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-[#1F2F3E] font-medium truncate">
                        {c.nextStep?.title}
                      </p>
                      <p className="text-[11px] text-[#2B3946]/60 truncate">
                        Due {c.nextStep?.dueDate}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <ComplianceBadge status={c.compliance.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div 
                        className="inline-flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openArrangementBuilderForCase(c.id)}
                          title="Arrangement Builder"
                          className="p-1.5 rounded-lg text-[#3E5C76] hover:bg-[#E3EBF2] transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => launchFamilyPortal(c.id)}
                          title="Launch Family Portal"
                          className="p-1.5 rounded-lg text-[#C4A35A] hover:bg-[#FBF9F4] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigateToCase(c.id, 'overview')}
                          className="px-2.5 py-1 text-xs font-medium text-[#3E5C76] hover:bg-[#E3EBF2] rounded-lg transition-colors"
                        >
                          View →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Board View (Kanban Columns) */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {(['first_call', 'arrangement', 'preparing', 'service', 'aftercare', 'closed'] as CaseStatus[]).map((statusKey) => {
            const columnCases = filteredCases.filter(c => c.status === statusKey);
            return (
              <div key={statusKey} className="space-y-3 min-w-[220px]">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E3EBF2]">
                  <StatusChip status={statusKey} />
                  <span className="text-xs font-mono text-[#2B3946]/50">
                    {columnCases.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {columnCases.map((c) => (
                    <CrystalCard
                      key={c.id}
                      hoverEffect
                      onClick={() => navigateToCase(c.id, 'overview')}
                      className="p-3.5 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#2B3946]/60">
                        <span className="font-mono">{c.caseNumber}</span>
                        <span>Age {c.lovedOne.age}</span>
                      </div>

                      <h4 className="font-serif text-sm font-semibold text-[#1F2F3E]">
                        {c.lovedOne.firstName} {c.lovedOne.lastName}
                      </h4>

                      <p className="text-[11px] text-[#2B3946]/70 truncate">
                        {c.serviceType.replace('_', ' ')}
                      </p>

                      <div className="pt-2 border-t border-[#E3EBF2]/60 flex items-center justify-between text-[11px]">
                        <ComplianceBadge status={c.compliance.status} />
                        <span className="text-[#3E5C76] font-medium">View</span>
                      </div>
                    </CrystalCard>
                  ))}

                  {columnCases.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-[#E3EBF2] text-center text-xs text-[#2B3946]/40">
                      No cases
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
