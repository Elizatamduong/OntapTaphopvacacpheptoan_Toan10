import React, { useState } from 'react';
import { Question, Team, TeamId } from '../types';
import { BookOpen, HelpCircle, Eye, EyeOff, CheckCircle, XCircle, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  activeTeam: Team | null;
  questionStatus: 'unanswered' | 'answered_correct' | 'answered_wrong' | 'passed';
  attemptedTeams: TeamId[];
  teams: Record<TeamId, Team>;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  activeTeam,
  questionStatus,
  attemptedTeams,
  teams,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden">
      {/* Top Meta Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {question.lessonSection}
          </span>
          <span className="text-slate-400">
            • SGK Kết nối tri thức (Trang {question.pageRef})
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {questionStatus === 'unanswered' && activeTeam && (
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold text-xs flex items-center gap-1 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Đang giao cho: {activeTeam.name}
            </span>
          )}
          {questionStatus === 'answered_correct' && activeTeam && (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold text-xs flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {activeTeam.name} trả lời ĐÚNG (+10đ)
            </span>
          )}
          {questionStatus === 'answered_wrong' && activeTeam && (
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full font-bold text-xs flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              {activeTeam.name} trả lời SAI (Hãy bấm Chuyển quyền)
            </span>
          )}
        </div>
      </div>

      {/* Main Question Text (Projector Optimized Size) */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-black flex-shrink-0 text-base md:text-lg">
            Q{questionIndex + 1}
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-100 leading-snug tracking-tight">
              {question.text}
            </h2>
            {question.diagramNote && (
              <p className="mt-2 text-sm text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Gợi ý hình ảnh SGK: {question.diagramNote}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Options Grid */}
      {question.options && question.options.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {question.options.map((opt) => {
            const isCorrect = showExplanation && opt.id === question.correctAnswer;

            return (
              <div
                key={opt.id}
                className={`flex items-start gap-3 p-3.5 md:p-4 rounded-xl border transition-all duration-200 ${
                  isCorrect
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md ring-1 ring-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <span
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 text-sm md:text-base ${
                    isCorrect
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-base md:text-lg font-medium pt-0.5 leading-relaxed">
                  {opt.text}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Teacher Assistance & Explanation Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
          >
            {showExplanation ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-400" />
                Ẩn đáp án & giải thích
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-amber-400" />
                Hiện đáp án & giải thích (Dành cho giáo viên)
              </>
            )}
          </button>
        </div>

        {/* History of attempts on this question */}
        {attemptedTeams.length > 0 && (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Đã trả lời:</span>
            {attemptedTeams.map((tId) => {
              const team = teams[tId];
              return (
                <span
                  key={tId}
                  className="px-2 py-0.5 rounded font-bold"
                  style={{ backgroundColor: `${team.colorHex}25`, color: team.colorHex }}
                >
                  {team.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Explanation Box when Revealed */}
      {showExplanation && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-slate-200">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-sm mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Đáp án chính xác: {question.correctAnswer}</span>
          </div>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
