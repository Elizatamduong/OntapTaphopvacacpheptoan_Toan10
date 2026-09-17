import React from 'react';
import { motion } from 'motion/react';
import { Team, TeamId } from '../types';
import { SPECIAL_TILES } from '../data/questions';
import { RaceCar } from './RaceCar';
import { Zap, Gift, AlertTriangle, Flag, Flame } from 'lucide-react';

interface RaceTrackProps {
  teams: Record<TeamId, Team>;
  maxSteps: number;
  movingTeamId: TeamId | null;
  boostingTeamId: TeamId | null;
  onEditTeamName?: (teamId: TeamId) => void;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({
  teams,
  maxSteps,
  movingTeamId,
  boostingTeamId,
  onEditTeamName,
}) => {
  const teamList = [teams.team1, teams.team2, teams.team3, teams.team4];
  const steps = Array.from({ length: maxSteps + 1 }, (_, i) => i);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 md:p-5 shadow-2xl overflow-hidden relative">
      {/* Header Track Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800 text-xs md:text-sm text-slate-400">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span>Đường Đua 4 Làn Song Song ({maxSteps} Chặng)</span>
        </div>

        {/* Legend of Special Tiles */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
            <Zap className="w-3.5 h-3.5" /> Chặng 4 & 8: Tăng tốc (+2 chặng)
          </span>
          <span className="inline-flex items-center gap-1 text-purple-400 font-medium">
            <Gift className="w-3.5 h-3.5" /> Chặng 6: Hộp quà (+20 đ)
          </span>
          <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" /> Chặng 10: Chướng ngại vật
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
            <Flag className="w-3.5 h-3.5" /> Chặng {maxSteps}: Về đích
          </span>
        </div>
      </div>

      {/* Checkpoints Ruler Header */}
      <div className="hidden md:flex ml-36 lg:ml-44 mr-16 relative mb-1 text-[11px] text-slate-400 font-mono select-none">
        {steps.map((step) => {
          const special = SPECIAL_TILES[step];
          const isFinish = step === maxSteps;
          const leftPercent = (step / maxSteps) * 100;

          return (
            <div
              key={step}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${leftPercent}%` }}
            >
              <span className={`font-bold ${isFinish ? 'text-emerald-400' : special ? 'text-amber-300' : 'text-slate-400'}`}>
                {step === 0 ? 'Start' : isFinish ? '🏁 ĐÍCH' : `${step}`}
              </span>
              <div className={`w-0.5 h-2 ${isFinish ? 'bg-emerald-500' : special ? 'bg-amber-400' : 'bg-slate-700'}`} />
            </div>
          );
        })}
      </div>

      {/* The 4 Lanes */}
      <div className="flex flex-col gap-2.5">
        {teamList.map((team, idx) => {
          const isMoving = movingTeamId === team.id;
          const isBoosting = boostingTeamId === team.id;
          const progressPercent = Math.min(100, Math.max(0, (team.position / maxSteps) * 100));
          const isLeader = team.position === Math.max(...teamList.map((t) => t.position)) && team.position > 0;
          const isAtFinish = team.position >= maxSteps;

          return (
            <div
              key={team.id}
              className={`relative flex items-center rounded-xl p-2 transition-colors duration-300 border ${
                isAtFinish
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Left Team Info Badge */}
              <div
                className="w-32 md:w-36 lg:w-44 flex-shrink-0 flex items-center justify-between pr-3 border-r border-slate-800 z-10 cursor-pointer group"
                onClick={() => onEditTeamName?.(team.id)}
                title="Bấm để đổi tên tổ"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-2 ring-white/30 shadow-md"
                    style={{ backgroundColor: team.colorHex }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm md:text-base text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                        {team.name}
                      </span>
                      {isLeader && !isAtFinish && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-bold">
                          Dẫn đầu
                        </span>
                      )}
                      {isAtFinish && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1 py-0.2 rounded font-bold animate-pulse">
                          Cán đích!
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-bold">{team.score} đ</span>
                      <span>•</span>
                      <span>Chặng {team.position}/{maxSteps}</span>
                    </div>
                  </div>
                </div>

                {/* Combo Fire Pill */}
                {team.currentCombo >= 2 && (
                  <div className="hidden sm:flex items-center gap-0.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                    <Flame className="w-3 h-3 animate-bounce" />
                    <span>x{team.currentCombo}</span>
                  </div>
                )}
              </div>

              {/* Asphalt Race Track Strip */}
              <div className="relative flex-1 h-16 md:h-18 mx-2 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-lg border border-slate-800/80 overflow-hidden flex items-center px-3">
                {/* Track Texture Grid & Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:calc(100%/12)_100%] opacity-40 pointer-events-none" />
                
                {/* Center Road Dash Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-slate-700/60 pointer-events-none" />

                {/* Special Checkpoint Visual Markers on Track */}
                {steps.map((step) => {
                  const special = SPECIAL_TILES[step];
                  const isFinish = step === maxSteps;
                  const leftPercent = (step / maxSteps) * 100;

                  if (!special && !isFinish && step !== 0) return null;

                  return (
                    <div
                      key={step}
                      className="absolute top-0 bottom-0 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none z-0 opacity-80"
                      style={{ left: `${leftPercent}%` }}
                    >
                      {isFinish ? (
                        <div className="h-full w-4 bg-[repeating-conic-gradient(#ffffff_0_90deg,#000000_0_180deg)] [background-size:8px_8px] opacity-40 border-l border-r border-white/50" />
                      ) : special ? (
                        <div className="flex flex-col items-center opacity-70">
                          <span className="text-xs md:text-sm">{special.icon}</span>
                          <span className="text-[9px] font-mono text-slate-400">{step}</span>
                        </div>
                      ) : (
                        <div className="w-0.5 h-full bg-slate-700/50" />
                      )}
                    </div>
                  );
                })}

                {/* Moving Animated Car */}
                <motion.div
                  className="absolute z-20"
                  animate={{
                    left: `calc(${progressPercent}% - ${progressPercent > 85 ? '75px' : progressPercent > 50 ? '45px' : '5px'})`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 90,
                    damping: 14,
                    mass: 0.8,
                  }}
                >
                  <RaceCar
                    color={team.colorHex}
                    accentColor={team.accentHex}
                    teamNumber={idx + 1}
                    teamName={team.name}
                    isMoving={isMoving}
                    isBoosting={isBoosting}
                  />
                </motion.div>
              </div>

              {/* Right Finish Distance Counter */}
              <div className="w-14 md:w-16 flex-shrink-0 flex flex-col items-end pr-1 text-right">
                <span className="font-mono font-black text-sm md:text-base text-slate-100">
                  {Math.round(progressPercent)}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {team.position >= maxSteps ? 'Về đích' : `Còn ${maxSteps - team.position}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
