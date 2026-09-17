import React, { useState } from 'react';
import { Team, TeamId, Question } from '../types';
import { Scale, Check, Eye, EyeOff, Award } from 'lucide-react';

interface TieBreakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiedTeams: Team[];
  tieQuestion: Question;
  onAwardTieWinner: (winnerTeamId: TeamId) => void;
}

export const TieBreakerModal: React.FC<TieBreakerModalProps> = ({
  isOpen,
  onClose,
  tiedTeams,
  tieQuestion,
  onAwardTieWinner,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-2xl w-full p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-amber-400">
                CÂU PHỤ PHÂN HẠNG (XỬ LÝ HÒA)
              </h2>
              <p className="text-xs text-slate-400">
                Không chọn đội thắng ngẫu nhiên. Các đội đang hòa cùng thi đua trả lời câu hỏi phụ.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* Tied Teams Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Các tổ đang bằng điểm / cùng vị trí:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {tiedTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-sm"
                style={{
                  backgroundColor: `${team.colorHex}20`,
                  borderColor: team.colorHex,
                  color: team.colorHex,
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.colorHex }} />
                <span>{team.name}</span>
                <span className="text-xs opacity-80">({team.score}đ • Chặng {team.position})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tie Breaker Question */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-400">
            CÂU HỎI THI ĐẤU: {tieQuestion.title}
          </span>
          <h3 className="text-lg md:text-xl font-extrabold text-slate-100 leading-snug">
            {tieQuestion.text}
          </h3>

          {tieQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1">
              {tieQuestion.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-2.5 rounded-lg border text-sm font-medium flex items-center gap-2 ${
                    showExplanation && opt.id === tieQuestion.correctAnswer
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-slate-800 font-bold flex items-center justify-center text-xs">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {showExplanation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showExplanation ? 'Ẩn đáp án' : 'Xem đáp án (Giáo viên)'}
            </button>
            {showExplanation && (
              <span className="text-emerald-400 font-bold">
                Đáp án: {tieQuestion.correctAnswer} - {tieQuestion.explanation}
              </span>
            )}
          </div>
        </div>

        {/* Teacher Awards the Winning Team */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xs font-bold text-slate-300">
            Tổ nào đã bấm chuông/giơ tay và trả lời ĐÚNG trước?
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tiedTeams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => onAwardTieWinner(team.id)}
                className="py-3 px-3 rounded-xl border font-black text-sm text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  backgroundColor: team.colorHex,
                  borderColor: team.borderHex,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{team.name}</span>
                </div>
                <span className="text-[10px] opacity-90">+5đ thắng thế</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
