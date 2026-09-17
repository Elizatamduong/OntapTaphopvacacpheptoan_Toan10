import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Team, TeamId, Question, WrongQuestionReview } from '../types';
import { Trophy, Medal, RotateCcw, AlertTriangle, BookOpen, CheckCircle, RefreshCw, Flame, Zap, GraduationCap, Phone } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Record<TeamId, Team>;
  onRestartGame: () => void;
  wrongQuestionsReview: WrongQuestionReview[];
  onOpenTieBreaker?: () => void;
  hasTies: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  teams,
  onRestartGame,
  wrongQuestionsReview,
  onOpenTieBreaker,
  hasTies,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore if confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Rank teams by position, then score, then correctCount
  const sortedTeams = (Object.values(teams) as Team[]).sort((a, b) => {
    if (b.position !== a.position) return b.position - a.position;
    if (b.score !== a.score) return b.score - a.score;
    return b.correctCount - a.correctCount;
  });

  const medals = ['🥇 HẠNG NHẤT', '🥈 HẠNG NHÌ', '🥉 HẠNG BA', '🏅 HẠNG TƯ'];
  const medalColors = ['text-amber-300', 'text-slate-300', 'text-amber-600', 'text-blue-300'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-5 md:p-8 shadow-2xl flex flex-col gap-6 text-slate-100 my-auto">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="inline-flex p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-300">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight">
            BẢNG XẾP HẠNG CHUNG CUỘC - ĐƯỜNG ĐUA 4 TỔ
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl">
            Chúc mừng tất cả 4 tổ đã nỗ lực hoàn thành xuất sắc các chặng đua kiến thức Bài 2: Tập hợp và các phép toán trên tập hợp!
          </p>

          {hasTies && onOpenTieBreaker && (
            <div className="mt-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Đang có các tổ bằng điểm hoặc cùng vị trí.</span>
              <button
                type="button"
                onClick={onOpenTieBreaker}
                className="bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-md hover:bg-amber-300 cursor-pointer"
              >
                Mở Câu Phụ Phân Hạng Ngay
              </button>
            </div>
          )}
        </div>

        {/* Podium Top 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sortedTeams.map((team, index) => {
            const accuracy = team.turnsCount > 0 ? Math.round((team.correctCount / team.turnsCount) * 100) : 0;
            const isWinner = index === 0;

            return (
              <div
                key={team.id}
                className={`relative rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                  isWinner
                    ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-400/80 ring-2 ring-amber-400/40 shadow-xl'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`font-black text-xs md:text-sm ${medalColors[index]}`}>
                      {medals[index]}
                    </span>
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-white/30"
                      style={{ backgroundColor: team.colorHex }}
                    />
                  </div>

                  <h3 className="text-xl font-black text-slate-100 mb-1 truncate">
                    {team.name}
                  </h3>

                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-3xl font-black font-mono text-amber-300">
                      {team.score}
                    </span>
                    <span className="text-xs text-slate-400">điểm</span>
                    <span className="text-xs text-slate-500">• Chặng {team.position}</span>
                  </div>
                </div>

                {/* Stats list */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Đúng / Sai:</span>
                    <span className="font-mono">
                      <strong className="text-emerald-400">{team.correctCount}</strong> /{' '}
                      <strong className="text-rose-400">{team.incorrectCount}</strong>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tỷ lệ chính xác:</span>
                    <span className="font-mono font-bold text-cyan-300">{accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Combo cao nhất:</span>
                    <span className="font-mono text-orange-400 font-bold">x{team.maxCombo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số lần Tăng tốc:</span>
                    <span className="font-mono text-amber-300 font-bold">{team.boostCount} lần</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tổng lượt trả lời:</span>
                    <span className="font-mono text-slate-400">{team.turnsCount} lượt</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* KIẾN THỨC CẢ LỚP CẦN ÔN LẠI (Section XIII) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-base md:text-lg font-black text-rose-400">
            <BookOpen className="w-5 h-5 text-rose-400" />
            <span>KIẾN THỨC CẢ LỚP CẦN ÔN LẠI (TỔNG HỢP TỪ LỖI SAI)</span>
          </div>

          {wrongQuestionsReview.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Tuyệt vời! Cả lớp không gặp sai sót đáng kể trong các câu hỏi vừa qua. Các em đã nắm rất chắc kiến thức bài học!</span>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Dưới đây là các câu hỏi học sinh đã trả lời sai trong trận đấu. Thầy/Cô hãy dành 2–3 phút củng cố lại các điểm này cho cả lớp:
              </p>
              {wrongQuestionsReview.map((item, idx) => (
                <div
                  key={item.question.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2 text-xs md:text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 text-slate-400">
                    <span className="font-bold text-amber-400">
                      {idx + 1}. {item.question.lessonSection} (SGK Trang {item.question.pageRef})
                    </span>
                    <span className="text-rose-400 font-medium">
                      Tổ trả lời sai: {item.wrongTeams.join(', ')} ({item.count} lần)
                    </span>
                  </div>

                  <p className="font-bold text-slate-100">
                    {item.question.text}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 text-xs">
                    <strong className="text-amber-400">Kiến thức chuẩn SGK: </strong>
                    {item.question.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teacher Acknowledgment Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs">
          <div className="flex items-center gap-2 text-purple-200">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>Giáo viên hướng dẫn & giảng dạy: <strong>Cô Eliza Tâm Dương</strong></span>
          </div>
          <a
            href="tel:0962571826"
            className="flex items-center gap-1.5 text-amber-300 font-mono font-bold hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>SĐT/Zalo: 0962571826</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm cursor-pointer transition-colors"
          >
            Quay lại xem màn hình đường đua
          </button>

          <button
            type="button"
            onClick={onRestartGame}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base shadow-lg shadow-amber-950/60 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>BẮT ĐẦU CHƠI LẠI TRẬN MỚI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
