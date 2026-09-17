import React from 'react';
import { TeamId, Team } from '../types';
import {
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Zap,
  Flag,
  Share2,
  Trophy,
  Play,
  RotateCw,
  HelpCircle,
  Flame,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';

interface ControlPanelProps {
  teams: Record<TeamId, Team>;
  activeTeamId: TeamId | null;
  onSelectTeam: (teamId: TeamId) => void;
  onAnswerResult: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onPassTurn: () => void;
  onTriggerBoost: () => void;
  onUndo: () => void;
  canUndo: boolean;
  undoCount: number;
  questionStatus: 'unanswered' | 'answered_correct' | 'answered_wrong' | 'passed';
  onStartSprint: () => void;
  onFinishGame: () => void;
  onRestartGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  onOpenQuestionBank: () => void;
  onOpenGuide: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onAnswerResult,
  onNextQuestion,
  onPassTurn,
  onTriggerBoost,
  onUndo,
  canUndo,
  undoCount,
  questionStatus,
  onStartSprint,
  onFinishGame,
  onRestartGame,
  soundEnabled,
  onToggleSound,
  onToggleFullscreen,
  onOpenQuestionBank,
  onOpenGuide,
}) => {
  const isQuestionAnswered = questionStatus === 'answered_correct' || questionStatus === 'answered_wrong';
  const isCorrect = questionStatus === 'answered_correct';
  const isWrong = questionStatus === 'answered_wrong';

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col gap-4">
      {/* Top Toolbar: Quick Utilities */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Bảng điều khiển giáo viên
          </span>
          <button
            type="button"
            onClick={onOpenGuide}
            className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Luật chơi & Hướng dẫn
          </button>
          <button
            type="button"
            onClick={onOpenQuestionBank}
            className="text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
          >
            Ngân hàng câu hỏi
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition-colors cursor-pointer text-xs flex items-center gap-1 ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
            title="Bật/Tắt âm thanh hiệu ứng"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Âm thanh: Bật' : 'Tắt'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="Toàn màn hình (Thích hợp máy chiếu)"
          >
            <Maximize2 className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Toàn màn hình</span>
          </button>

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
              canUndo
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30 cursor-pointer'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Hoàn tác thao tác trước"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>HOÀN TÁC</span>
            {undoCount > 0 && (
              <span className="bg-amber-400 text-slate-950 rounded-full px-1.5 text-[10px] font-black">
                {undoCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Action Rows */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Left Section: Team Selector Buttons */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>BƯỚC 1: CHỌN TỔ TRẢ LỜI</span>
            {activeTeamId && (
              <span className="text-amber-400 font-mono">
                Đang chọn: {teams[activeTeamId].name}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['team1', 'team2', 'team3', 'team4'] as TeamId[]).map((tId) => {
              const team = teams[tId];
              const isSelected = activeTeamId === tId;

              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() => onSelectTeam(tId)}
                  className={`py-3 px-2 rounded-xl font-black text-sm md:text-base border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'ring-2 ring-white shadow-lg scale-[1.02] text-white'
                      : 'opacity-80 hover:opacity-100 hover:scale-[1.01] text-slate-200'
                  }`}
                  style={{
                    backgroundColor: isSelected ? team.colorHex : `${team.colorHex}25`,
                    borderColor: team.colorHex,
                  }}
                >
                  <span className="truncate max-w-[95%]">{team.name}</span>
                  <span className="text-[11px] font-mono opacity-90">
                    {team.score} đ • Chặng {team.position}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle Section: Teacher Judgment (ĐÚNG / SAI) with Anti-Double Lock */}
        <div className="flex flex-col gap-2 min-w-[240px] md:min-w-[280px]">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>BƯỚC 2: XÁC NHẬN KẾT QUẢ</span>
            {isQuestionAnswered && (
              <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                🔒 Đã khóa (Chống cộng trùng)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 h-full">
            {/* Button ĐÚNG */}
            <button
              type="button"
              disabled={!activeTeamId || isQuestionAnswered}
              onClick={() => onAnswerResult(true)}
              className={`py-3 px-4 rounded-xl font-black text-base md:text-lg flex flex-col items-center justify-center gap-1 border transition-all shadow-lg ${
                isCorrect
                  ? 'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-300'
                  : !activeTeamId || isQuestionAnswered
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-600/90 hover:bg-emerald-500 border-emerald-400 text-white cursor-pointer active:scale-95 shadow-emerald-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 md:w-6 md:h-6 stroke-[3]" />
                <span>ĐÚNG</span>
              </div>
              <span className="text-[11px] font-normal opacity-90">+10đ • Tiến 1 chặng</span>
            </button>

            {/* Button SAI */}
            <button
              type="button"
              disabled={!activeTeamId || isQuestionAnswered}
              onClick={() => onAnswerResult(false)}
              className={`py-3 px-4 rounded-xl font-black text-base md:text-lg flex flex-col items-center justify-center gap-1 border transition-all shadow-lg ${
                isWrong
                  ? 'bg-rose-600 border-rose-400 text-white ring-2 ring-rose-300'
                  : !activeTeamId || isQuestionAnswered
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-rose-600/90 hover:bg-rose-500 border-rose-400 text-white cursor-pointer active:scale-95 shadow-rose-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 md:w-6 md:h-6 stroke-[3]" />
                <span>SAI</span>
              </div>
              <span className="text-[11px] font-normal opacity-90">Đứng yên • Ngắt Combo</span>
            </button>
          </div>
        </div>

        {/* Right Section: Flow Control (Chuyển quyền / Câu hỏi tiếp theo) */}
        <div className="flex flex-col gap-2 min-w-[240px]">
          <div className="text-xs font-bold text-slate-300">
            BƯỚC 3: TIẾP TỤC
          </div>

          <div className="flex flex-col gap-2 h-full">
            {/* Chuyển quyền (Active when a team answered wrong) */}
            {isWrong && (
              <button
                type="button"
                onClick={onPassTurn}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm md:text-base border border-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-950/40 animate-pulse"
              >
                <Share2 className="w-4 h-4" />
                <span>CHUYỂN QUYỀN TỔ KHÁC</span>
              </button>
            )}

            {/* Câu hỏi tiếp theo */}
            <button
              type="button"
              onClick={onNextQuestion}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base md:text-lg border border-blue-400 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg shadow-blue-900/40"
            >
              <span>CÂU HỎI TIẾP THEO</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Game Modes & Special Functions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tăng tốc bonus manual trigger */}
          <button
            type="button"
            onClick={onTriggerBoost}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Thưởng Tăng tốc +2 chặng cho đội đang chọn"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>TĂNG TỐC (+2 Chặng)</span>
          </button>

          {/* Cú nước rút 4 tổ */}
          <button
            type="button"
            onClick={onStartSprint}
            className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Chế độ Cú Nước Rút 4 Tổ (mỗi tổ 1 câu riêng)"
          >
            <Flag className="w-4 h-4 text-purple-400" />
            <span>CÚ NƯỚC RÚT 4 TỔ</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Kết thúc cuộc đua */}
          <button
            type="button"
            onClick={onFinishGame}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Trophy className="w-4 h-4" />
            <span>KẾT THÚC & XẾP HẠNG</span>
          </button>

          {/* Chơi lại */}
          <button
            type="button"
            onClick={onRestartGame}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>CHƠI LẠI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
