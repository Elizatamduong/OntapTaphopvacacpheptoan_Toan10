import React, { useState } from 'react';
import { Question } from '../types';
import { QUESTIONS_DATABASE } from '../data/questions';
import { BookOpen, Search, CheckCircle, ArrowUpRight, X } from 'lucide-react';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (questionIndex: number) => void;
  currentIndex: number;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
  currentIndex,
}) => {
  const [filterSection, setFilterSection] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const sections = [
    { id: 'all', name: 'Tất cả câu hỏi' },
    { id: '1. Khái niệm cơ bản về tập hợp', name: '1. Khái niệm cơ bản' },
    { id: 'Tập hợp con & Hai tập hợp bằng nhau', name: 'Tập con & Tập bằng nhau' },
    { id: '2. Các tập hợp số', name: '2. Các tập hợp số' },
    { id: 'Các tập con thường dùng của ℝ', name: 'Khoảng, đoạn của ℝ' },
    { id: '3. Các phép toán trên tập hợp: Giao', name: 'Phép Giao' },
    { id: '3. Các phép toán trên tập hợp: Hợp', name: 'Phép Hợp' },
    { id: '3. Các phép toán trên tập hợp: Hiệu & Phần bù', name: 'Hiệu & Phần bù' },
    { id: 'Vận dụng thực tiễn (Biểu đồ Ven)', name: 'Bài toán thực tế Ven' },
  ];

  const filteredQuestions = QUESTIONS_DATABASE.filter((q, idx) => {
    const matchSection = filterSection === 'all' || q.lessonSection === filterSection;
    const matchSearch =
      searchTerm === '' ||
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSection && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-5 md:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                NGÂN HÀNG CÂU HỎI SGK TOÁN 10 (BÀI 2)
              </h2>
              <p className="text-xs text-slate-400">
                30+ câu hỏi bám sát chuẩn từng ví dụ, luyện tập và hoạt động trong 7 trang SGK.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nội dung câu hỏi..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setFilterSection(sec.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  filterSection === sec.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-2.5 overflow-y-auto max-h-[55vh] pr-1">
          {filteredQuestions.map((q) => {
            const actualIndex = QUESTIONS_DATABASE.findIndex((item) => item.id === q.id);
            const isCurrent = actualIndex === currentIndex;

            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                  isCurrent
                    ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-bold text-amber-400 font-mono">#{actualIndex + 1}</span>
                    <span className="text-blue-300 font-medium">{q.lessonSection}</span>
                    <span>• Trang {q.pageRef}</span>
                    {isCurrent && (
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded text-[10px] font-bold">
                        Đang chiếu
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-200 leading-snug">
                    {q.text}
                  </p>
                  <p className="text-xs text-emerald-400 mt-1">
                    <strong>Đáp án:</strong> {q.correctAnswer} - {q.explanation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectQuestion(actualIndex);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer"
                >
                  <span>Chiếu câu này</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
