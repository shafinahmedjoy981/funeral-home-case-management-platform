import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Car, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CrystalCard } from '../common/CrystalCard';

export const CalendarView: React.FC = () => {
  const { calendarEvents, navigateToCase } = useApp();
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('all');

  const daysOfWeek = [
    { name: 'Mon', date: 'Sep 28', isToday: true, fullDate: '2026-09-28' },
    { name: 'Tue', date: 'Sep 29', isToday: false, fullDate: '2026-09-29' },
    { name: 'Wed', date: 'Sep 30', isToday: false, fullDate: '2026-09-30' },
    { name: 'Thu', date: 'Oct 01', isToday: false, fullDate: '2026-10-01' },
    { name: 'Fri', date: 'Oct 02', isToday: false, fullDate: '2026-10-02' },
    { name: 'Sat', date: 'Oct 03', isToday: false, fullDate: '2026-10-03' },
    { name: 'Sun', date: 'Oct 04', isToday: false, fullDate: '2026-10-04' },
  ];

  const filteredEvents = calendarEvents.filter(evt => {
    const matchesStaff = selectedStaffFilter === 'all' || evt.staffLead.includes(selectedStaffFilter);
    const matchesRoom = selectedRoomFilter === 'all' || evt.room.includes(selectedRoomFilter);
    return matchesStaff && matchesRoom;
  });

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-[#1F2F3E]">
            Services & Facilities Schedule
          </h1>
          <p className="text-xs text-[#2B3946]/70 mt-0.5">
            Week of September 28 – October 04, 2026 · Pinecrest Memorial Chapel & Fleet
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="bg-white border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
          >
            <option value="all">All Staff Leads</option>
            <option value="Eleanor">Eleanor Vance, FD</option>
            <option value="Julian">Julian Hayes</option>
            <option value="Marcus">Marcus Reed</option>
          </select>

          <select
            value={selectedRoomFilter}
            onChange={(e) => setSelectedRoomFilter(e.target.value)}
            className="bg-white border border-[#E3EBF2] rounded-xl px-3 py-2 text-xs"
          >
            <option value="all">All Rooms & Fleet</option>
            <option value="Chapel">Pinecrest Chapel</option>
            <option value="Atrium">Atrium & Courtyard</option>
            <option value="Suite A">Arrangement Suite A</option>
            <option value="Cemetery">Willamette National</option>
          </select>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {daysOfWeek.map((day) => {
          const dayEvents = filteredEvents.filter(e => e.startDateTime.startsWith(day.fullDate));

          return (
            <div 
              key={day.fullDate} 
              className={`rounded-2xl p-3 space-y-3 min-h-[360px] flex flex-col justify-between transition-colors ${
                day.isToday 
                  ? 'bg-white border-2 border-[#C4A35A]/50 shadow-sm' 
                  : 'crystal-card'
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E3EBF2]">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#3E5C76]">
                      {day.name}
                    </span>
                    <p className={`font-serif text-base font-bold ${day.isToday ? 'text-[#C4A35A]' : 'text-[#1F2F3E]'}`}>
                      {day.date}
                    </p>
                  </div>
                  {day.isToday && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#C4A35A]/20 text-[#C4A35A]">
                      Today
                    </span>
                  )}
                </div>

                {/* Day's Events List */}
                <div className="mt-3 space-y-2">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => navigateToCase(evt.caseId, 'overview')}
                      className="p-2.5 rounded-xl bg-[#F4F7FA] hover:bg-[#FBF9F4] border border-[#E3EBF2] hover:border-[#C4A35A]/40 transition-colors cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#3E5C76] font-mono">
                        <span>
                          {new Date(evt.startDateTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                        <span className="capitalize">{evt.type.replace('_', ' ')}</span>
                      </div>

                      <p className="font-semibold text-xs text-[#1F2F3E] leading-snug line-clamp-2">
                        {evt.title}
                      </p>

                      <p className="text-[11px] text-[#2B3946]/70 truncate">
                        {evt.lovedOneName}
                      </p>

                      <div className="pt-1 border-t border-[#E3EBF2]/60 text-[10px] text-[#2B3946]/60 space-y-0.5">
                        <p className="flex items-center gap-1 truncate">
                          <MapPin className="w-2.5 h-2.5 text-[#3E5C76] shrink-0" />
                          <span className="truncate">{evt.room}</span>
                        </p>
                        {evt.vehicleAssigned && (
                          <p className="flex items-center gap-1 text-[#5E8C7A] truncate">
                            <Car className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{evt.vehicleAssigned}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {dayEvents.length === 0 && (
                    <div className="py-8 text-center text-xs text-[#2B3946]/30">
                      No scheduled services
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-[#2B3946]/50">
                {dayEvents.length} event{dayEvents.length === 1 ? '' : 's'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
