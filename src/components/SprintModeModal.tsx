import React, { useState } from 'react';
import { Team, TeamId, Question } from '../types';
import { Flag, Eye, EyeOff, Check, X, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface SprintModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Record<TeamId, Team>;
  sprintQuestions: Question[];
  onSprintResult: (teamId: TeamId, isCorrect: boolean) => void;
  sprintResults: Record<TeamId, boolean | null>;
}

export const SprintModeModal: React.FC<SprintModeModalProps> = ({
  isOpen,
  onClose,
  teams,
  sprintQuestions,
  onSprintResult,
  sprintResults,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  if (!isOpen) return null;

  const teamIds: TeamId[] = ['team1', 'team2', 'team3', 'team4'];
  const currentTeamId = teamIds[activeStep];
  const currentTeam = teams[currentTeamId];
  const currentQuestion = sprintQuestions[activeStep] || sprintQuestions[0];
  const isAnswered = sprintResults[currentTeamId] !== null && sprintResults[currentTeamId] !== undefined;

  const handleReveal = () => {
    setRevealed((prev) => ({ ...prev, [activeStep]: true }));
  };

  const handleResult = (isCorrect: boolean) => {
    onSprintResult(currentTeamId, isCorrect);
  };

  const handleNextSprintTeam = () => {
    setShowAnswer(false);
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-purple-500/50 rounded-2xl max-w-3xl w-full p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-purple-300">
                CÚ NƯỚC RÚT 4 TỔ (VÒNG QUYẾT ĐỊNH)
              </h2>
              <p className="text-xs text-slate-400">
                Mỗi tổ nhận 1 câu hỏi độc lập cùng độ khó. Mở lần lượt để đảm bảo công bằng tuyệt đối.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
          >
            Quay lại đường đua
          </button>
        </div>

        {/* 4 Teams Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {teamIds.map((tId, idx) => {
            const t = teams[tId];
            const res = sprintResults[tId];
            const isCurrent = activeStep === idx;

            return (
              <button
                key={tId}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                  setShowAnswer(false);
                }}
                className={`p-2.5 rounded-xl border text-center font-bold text-xs md:text-sm flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-white ring-2 ring-purple-400 bg-slate-800 text-white'
                    : 'border-slate-800 bg-slate-950/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: t.colorHex }}
                  />
                  <span className="truncate">{t.name}</span>
                </div>
                <div>
                  {res === true && (
                    <span className="text-[10px] text-emerald-400 font-bold">✓ ĐÚNG (+1 Chặng)</span>
                  )}
                  {res === false && (
                    <span className="text-[10px] text-rose-400 font-bold">✗ SAI</span>
                  )}
                  {res === null || res === undefined ? (
                    <span className="text-[10px] text-slate-500 font-normal">Chưa mở</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Team Target Box */}
        <div
          className="p-4 rounded-xl border flex items-center justify-between"
          style={{
            backgroundColor: `${currentTeam.colorHex}15`,
            borderColor: `${currentTeam.colorHex}60`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full ring-2 ring-white"
              style={{ backgroundColor: currentTeam.colorHex }}
            />
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Lượt câu hỏi dành riêng cho:
              </span>
              <h3 className="text-lg md:text-xl font-black text-slate-100">
                {currentTeam.name}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Vị trí hiện tại:</span>
            <p className="font-mono font-bold text-amber-300">
              Chặng {currentTeam.position} • {currentTeam.score} điểm
            </p>
          </div>
        </div>

        {/* Question Hidden or Revealed */}
        {!revealed[activeStep] ? (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4">
            <ShieldAlert className="w-12 h-12 text-purple-400 animate-pulse" />
            <div>
              <h4 className="text-lg font-bold text-slate-200">
                Câu hỏi của {currentTeam.name} đang được che bí mật
              </h4>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Các tổ khác không được nhìn thấy trước. Giáo viên bấm nút bên dưới khi {currentTeam.name} đã sẵn sàng trả lời!
              </p>
            </div>
            <button
              type="button"
              onClick={handleReveal}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-base shadow-lg shadow-purple-950/60 cursor-pointer flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              MỞ CÂU HỎI CHO {currentTeam.name.toUpperCase()}
            </button>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold text-purple-300">
                Chuyên đề: {currentQuestion.lessonSection}
              </span>
              <span>SGK Trang {currentQuestion.pageRef}</span>
            </div>

            <h4 className="text-lg md:text-xl font-extrabold text-slate-100 leading-snug">
              {currentQuestion.text}
            </h4>

            {/* Options */}
            {currentQuestion.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-2">
                {currentQuestion.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-lg border text-sm font-medium flex items-center gap-2.5 ${
                      showAnswer && opt.id === currentQuestion.correctAnswer
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="w-6 h-6 rounded bg-slate-800 text-slate-200 font-bold flex items-center justify-center text-xs">
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Teacher Answer Peek */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setShowAnswer(!showAnswer)}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án (Giáo viên)'}
              </button>
              {showAnswer && (
                <span className="text-emerald-400 font-mono font-bold">
                  Đáp án: {currentQuestion.correctAnswer} - {currentQuestion.explanation}
                </span>
              )}
            </div>

            {/* Teacher Decision for Sprint */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-bold">
                Giáo viên xác nhận câu trả lời miệng của {currentTeam.name}:
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleResult(true)}
                  className={`px-4 py-2 rounded-xl font-black text-sm flex items-center gap-1.5 transition-all ${
                    sprintResults[currentTeamId] === true
                      ? 'bg-emerald-600 text-white border border-emerald-400'
                      : isAnswered
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>ĐÚNG (+10đ, Tiến 1 chặng)</span>
                </button>
                <button
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleResult(false)}
                  className={`px-4 py-2 rounded-xl font-black text-sm flex items-center gap-1.5 transition-all ${
                    sprintResults[currentTeamId] === false
                      ? 'bg-rose-600 text-white border border-rose-400'
                      : isAnswered
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md'
                  }`}
                >
                  <X className="w-4 h-4 stroke-[3]" />
                  <span>SAI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Tiến trình: Tổ {activeStep + 1} / 4
          </span>
          <button
            type="button"
            onClick={handleNextSprintTeam}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>{activeStep < 3 ? 'Chuyển sang tổ kế tiếp' : 'Hoàn thành Cú Nước Rút'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
