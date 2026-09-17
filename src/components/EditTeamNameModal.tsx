import React, { useState } from 'react';
import { Team, TeamId } from '../types';
import { Edit3, Check } from 'lucide-react';

interface EditTeamNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Record<TeamId, Team>;
  onSaveNames: (newNames: Record<TeamId, string>) => void;
  targetTeamId?: TeamId | null;
}

export const EditTeamNameModal: React.FC<EditTeamNameModalProps> = ({
  isOpen,
  onClose,
  teams,
  onSaveNames,
}) => {
  const [names, setNames] = useState<Record<TeamId, string>>({
    team1: teams.team1.name,
    team2: teams.team2.name,
    team3: teams.team3.name,
    team4: teams.team4.name,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNames(names);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Edit3 className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">Đổi tên 4 Tổ thi đua</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {(['team1', 'team2', 'team3', 'team4'] as TeamId[]).map((tId) => {
            const team = teams[tId];
            return (
              <div key={tId} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full ring-2 ring-white/30 flex-shrink-0"
                  style={{ backgroundColor: team.colorHex }}
                />
                <label className="text-xs font-bold text-slate-300 w-16">
                  {team.colorName}:
                </label>
                <input
                  type="text"
                  value={names[tId]}
                  onChange={(e) => setNames({ ...names, [tId]: e.target.value })}
                  maxLength={25}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  placeholder={`Tên ${team.name}`}
                />
              </div>
            );
          })}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
