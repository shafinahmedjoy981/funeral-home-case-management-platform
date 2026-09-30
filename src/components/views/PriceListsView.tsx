import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Search, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  User, 
  History, 
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CrystalCard } from '../common/CrystalCard';
import { ComplianceLegalNotice } from '../common/ComplianceBadge';

export const PriceListsView: React.FC = () => {
  const { priceLists, showToast } = useApp();
  const [selectedListType, setSelectedListType] = useState<'gpl' | 'cpl' | 'opl'>('gpl');
  const [searchQuery, setSearchQuery] = useState('');

  const currentPriceList = priceLists.find(p => p.type === selectedListType) || priceLists[0];

  const filteredItems = currentPriceList.items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
    showToast('Print layout prepared with required FTC preambles.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* View Header with Version & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#3E5C76] uppercase tracking-wider">
              FTC Funeral Rule Compliance
            </span>
            <span>·</span>
            <span className="text-[#2B3946]/60">16 CFR Part 453 Mandated Pricing</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-[#1F2F3E] mt-0.5">
            Price List Manager (GPL / CPL / OPL)
          </h1>
          <p className="text-xs text-[#2B3946]/70 mt-0.5">
            Effective: {currentPriceList.effectiveDate} · Last updated {currentPriceList.lastUpdated} by {currentPriceList.updatedBy}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#1F2F3E] bg-white border border-[#E3EBF2] hover:bg-[#F4F7FA] rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Publish / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs: GPL, CPL, OPL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3EBF2] pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'gpl', label: 'General Price List (GPL)' },
            { id: 'cpl', label: 'Casket Price List (CPL)' },
            { id: 'opl', label: 'Outer Burial Container (OPL)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedListType(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                selectedListType === tab.id
                  ? 'bg-[#3E5C76] text-white shadow-xs'
                  : 'bg-white/80 text-[#2B3946]/70 hover:text-[#1F2F3E] hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter within current list */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#2B3946]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search price list items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#E3EBF2] focus:border-[#C4A35A] focus-visible:outline-none"
          />
        </div>
      </div>

      {/* Mandatory Statutory Preamble Notice Card */}
      <CrystalCard ivory className="p-5 border-l-4 border-l-[#C4A35A]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#C4A35A] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1F2F3E] uppercase tracking-wide text-[11px]">
                Statutory Federal Preamble Notice
              </span>
              <span className="font-mono text-[11px] text-[#2B3946]/60">
                Version {currentPriceList.version}
              </span>
            </div>
            <p className="text-[#2B3946]/80 leading-relaxed italic">
              "{currentPriceList.preambleDisclaimer}"
            </p>
            <ComplianceLegalNotice className="pt-1" />
          </div>
        </div>
      </CrystalCard>

      {/* Items Table */}
      <div className="crystal-card rounded-2xl overflow-hidden border border-[#E3EBF2]/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F4F7FA] border-b border-[#E3EBF2] text-[#2B3946]/70 font-medium">
            <tr>
              <th className="py-3.5 px-4 font-normal">Service / Merchandise Item</th>
              <th className="py-3.5 px-4 font-normal">Category</th>
              <th className="py-3.5 px-4 font-normal text-right">Standard Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3EBF2]/60">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-[#FBF9F4]/40 transition-colors">
                <td className="py-4 px-4 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1F2F3E]">
                      {item.name}
                    </span>
                    {item.isMandatoryBasic && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C4A35A]/20 text-[#C4A35A]">
                        Basic / Non-declinable
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#2B3946]/80 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  {item.ftcNotice && (
                    <div className="mt-2 p-2 bg-[#F4F7FA] rounded-lg border-l-2 border-l-[#3E5C76] text-[11px] text-[#2B3946]/80 italic">
                      <span className="font-semibold not-italic text-[#3E5C76]">FTC Notice: </span>
                      {item.ftcNotice}
                    </div>
                  )}
                </td>

                <td className="py-4 px-4 text-[#2B3946]/70 align-top">
                  <span className="px-2.5 py-1 rounded-md bg-[#F4F7FA] text-[#2B3946]/80 text-[11px] font-medium">
                    {item.category}
                  </span>
                </td>

                <td className="py-4 px-4 font-mono font-bold text-base text-[#1F2F3E] text-right align-top tabular-nums">
                  ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-[#2B3946]/50">
                  No price items matched your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Version History Footer */}
      <CrystalCard className="p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#2B3946]/70">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#3E5C76]" />
          <span>Version History: v2026.2 (Current) · v2026.1 (Archived Jan 15) · v2025.4 (Archived Oct 2025)</span>
        </div>
        <span className="text-[11px] font-mono">
          Audit check completed: Sep 28, 2026
        </span>
      </CrystalCard>
    </div>
  );
};
