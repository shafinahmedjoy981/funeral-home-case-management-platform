import React, { useState } from 'react';
import { X, Heart, ShieldCheck, UserCheck, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceType } from '../../types';

export const NewCaseModal: React.FC = () => {
  const { isNewCaseModalOpen, setIsNewCaseModalOpen, addNewCase, navigateToCase } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('2026-09-28');
  const [placeOfDeath, setPlaceOfDeath] = useState('Providence Medical Center, Portland, OR');
  const [serviceType, setServiceType] = useState<ServiceType>('traditional_burial');
  const [familyName, setFamilyName] = useState('');
  const [familyPhone, setFamilyPhone] = useState('(503) 555-0199');
  const [familyEmail, setFamilyEmail] = useState('');
  const [relationship, setRelationship] = useState('Spouse');

  if (!isNewCaseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const newCaseId = addNewCase({
      lovedOne: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: '1948-04-12',
        dateOfDeath,
        age: 78,
        gender: 'Not specified',
        maritalStatus: 'Married',
        placeOfDeath,
        residenceCity: 'Portland',
        residenceState: 'OR',
        veteranStatus: false,
        ssnMasked: '***-**-2918',
        ssnFull: '540-22-2918',
        birthCity: 'Portland',
        birthState: 'OR',
      },
      serviceType,
      familyContacts: [
        {
          name: familyName.trim() || 'Next of Kin',
          relationship,
          phone: familyPhone,
          email: familyEmail || 'family@example.com',
          address: 'Portland, OR',
          isPrimary: true,
          portalAccessGranted: true,
        }
      ]
    });

    setIsNewCaseModalOpen(false);
    navigateToCase(newCaseId, 'overview');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1F2F3E]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="crystal-card max-w-lg w-full p-6 space-y-5 rounded-2xl bg-white shadow-2xl relative">
        <button
          onClick={() => setIsNewCaseModalOpen(false)}
          className="absolute top-5 right-5 text-[#2B3946]/40 hover:text-[#1F2F3E]"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-semibold text-[#3E5C76] uppercase tracking-wider">
            First Call Intake
          </span>
          <h2 className="font-serif text-2xl font-medium text-[#1F2F3E] mt-0.5">
            Record New Case Intake
          </h2>
          <p className="text-xs text-[#2B3946]/70 mt-1">
            Gently log the initial notification of passing. Vitals and selections can be refined with the family.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Deceased details */}
          <div className="space-y-3">
            <p className="font-semibold text-[#1F2F3E] text-xs pb-1 border-b border-[#E3EBF2]">
              Deceased Loved One
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#2B3946]/70 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[#2B3946]/70 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gallagher"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#2B3946]/70 mb-1">Date of Passing</label>
                <input
                  type="date"
                  value={dateOfDeath}
                  onChange={(e) => setDateOfDeath(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#2B3946]/70 mb-1">Intended Service</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                >
                  <option value="traditional_burial">Traditional Burial</option>
                  <option value="direct_cremation">Direct Cremation</option>
                  <option value="memorial_service">Memorial Service</option>
                  <option value="graveside">Graveside Committal</option>
                  <option value="celebration_of_life">Celebration of Life</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#2B3946]/70 mb-1">Place of Passing / Current Facility</label>
              <input
                type="text"
                value={placeOfDeath}
                onChange={(e) => setPlaceOfDeath(e.target.value)}
                className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Family Contact */}
          <div className="space-y-3 pt-2">
            <p className="font-semibold text-[#1F2F3E] text-xs pb-1 border-b border-[#E3EBF2]">
              Primary Contact / Next of Kin
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#2B3946]/70 mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Susan Gallagher"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#2B3946]/70 mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Daughter"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#2B3946]/70 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={familyPhone}
                  onChange={(e) => setFamilyPhone(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#2B3946]/70 mb-1">Contact Email</label>
                <input
                  type="email"
                  placeholder="susan@example.com"
                  value={familyEmail}
                  onChange={(e) => setFamilyEmail(e.target.value)}
                  className="w-full bg-[#F4F7FA] border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FBF9F4] rounded-xl border border-[#C4A35A]/30 text-[11px] text-[#2B3946]/80 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5E8C7A] shrink-0 mt-0.5" />
            <p>
              FTC Funeral Rule Reminder: General Price List will automatically be initialized and ready to print or email to the family.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E3EBF2]">
            <button
              type="button"
              onClick={() => setIsNewCaseModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#2B3946] hover:bg-[#F4F7FA] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#3E5C76] hover:bg-[#2d4559] rounded-xl shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Case Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
