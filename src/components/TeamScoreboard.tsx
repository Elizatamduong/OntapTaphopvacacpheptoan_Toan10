import React from 'react';
import { Team, TeamId } from '../types';
import { Flame, CheckCircle2, XCircle, RefreshCw, AlertCircle, Trophy } from 'lucide-react';

interface TeamScoreboardProps {
  teams: Record<TeamId, Team>;
  activeTeamId: TeamId | null;
  onSelectTeam: (teamId: TeamId) => void;
  disabledSelection?: boolean;
  currentRoundNumber: number;
  totalQuestions: number;
}

export const TeamScoreboard: React.FC<TeamScoreboardProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  disabledSelection = false,
  currentRoundNumber,
  totalQuestions,
}) => {
  const teamList = [teams.team1, teams.team2, teams.team3, teams.team4];

  // Calculate turns balancing
  const turns = teamList.map((t) => t.turnsCount);
  const minTurns = Math.min(...turns);
  const maxTurns = Math.max(...turns);
  const overRepresentedTeam = teamList.find((t) => t.turnsCount >= minTurns + 3 && t.turnsCount > 2);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between px-1 text-xs md:text-sm text-slate-300">
        <div className="flex items-center gap-3">
          <span className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full font-bold text-amber-400">
            Câu {currentRoundNumber} / {totalQuestions}
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Chọn một tổ để trả lời câu hỏi:
          </span>
        </div>

        {/* Turn Balancing Reminder */}
        {overRepresentedTeam && (
          <div className="flex items-center gap-1.5 text-xs bg-amber-500/15 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              <strong>Nhắc nhở công bằng:</strong> {overRepresentedTeam.name} đã trả lời {overRepresentedTeam.turnsCount} lượt. Hãy ưu tiên một tổ khác!
            </span>
          </div>
        )}
      </div>

      {/* 4 Teams Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
        {teamList.map((team, idx) => {
          const isSelected = activeTeamId === team.id;
          const accuracy = team.turnsCount > 0 ? Math.round((team.correctCount / team.turnsCount) * 100) : 0;

          return (
            <button
              key={team.id}
              type="button"
              disabled={disabledSelection}
              onClick={() => onSelectTeam(team.id)}
              className={`relative flex flex-col p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-amber-950/40 scale-[1.02]'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              } ${disabledSelection ? 'opacity-85 cursor-default' : ''}`}
            >
              {/* Header: Badge & Name */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-white/40"
                    style={{ backgroundColor: team.colorHex }}
                  />
                  <span className="font-extrabold text-sm md:text-base text-slate-100 truncate">
                    {team.name}
                  </span>
                </div>

                {isSelected && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Đang chọn
                  </span>
                )}
              </div>

              {/* Big Score */}
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-black font-mono text-amber-300">
                    {team.score}
                  </span>
                  <span className="text-xs text-slate-400">điểm</span>
                </div>

                {/* Combo Badge */}
                {team.currentCombo > 1 && (
                  <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[11px] font-bold px-1.5 py-0.5 rounded">
                    <Flame className="w-3 h-3 text-orange-400 animate-bounce" />
                    <span>Combo {team.currentCombo}</span>
                  </div>
                )}
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-1" title="Số câu đúng">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="font-mono font-bold text-emerald-300">{team.correctCount}</span>
                </div>
                <div className="flex items-center gap-1" title="Số câu sai">
                  <XCircle className="w-3 h-3 text-rose-400 flex-shrink-0" />
                  <span className="font-mono font-bold text-rose-300">{team.incorrectCount}</span>
                </div>
                <div className="flex items-center gap-1 justify-end" title="Tổng số lượt trả lời">
                  <RefreshCw className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="font-mono">{team.turnsCount} lượt</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
