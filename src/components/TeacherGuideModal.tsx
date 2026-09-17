import React from 'react';
import { HelpCircle, CheckCircle2, Zap, Gift, AlertTriangle, Flame, Flag, Scale, RotateCcw, GraduationCap, Phone } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 shadow-2xl text-slate-100 flex flex-col gap-4 my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-amber-400">
              HƯỚNG DẪN VẬN HÀNH GAME “ĐƯỜNG ĐUA 4 TỔ” TRÊN LỚP
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
          >
            Đóng
          </button>
        </div>

        <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
          {/* Quy trình câu hỏi */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-300 text-sm mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. Quy trình mỗi câu hỏi trong lớp học
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Giáo viên bấm <strong>“CÂU HỎI TIẾP THEO”</strong> để hiển thị câu hỏi trên màn chiếu lớn.</li>
              <li>Học sinh đọc và chuẩn bị câu trả lời.</li>
              <li>Giáo viên chọn tổ trả lời (Tổ 1 / Tổ 2 / Tổ 3 / Tổ 4).</li>
              <li>Học sinh đại diện trả lời miệng hoặc giải trình.</li>
              <li>Giáo viên bấm <strong>ĐÚNG</strong> hoặc <strong>SAI</strong>.</li>
              <li><strong>Nếu Đúng:</strong> Xe tiến 1 chặng, cộng 10 điểm, tăng combo, chạy animation xe đua.</li>
              <li><strong>Nếu Sai:</strong> Xe đứng yên, ngắt combo. Giáo viên bấm <strong>“CHUYỂN QUYỀN”</strong> để tổ khác giành quyền trả lời.</li>
            </ol>
          </div>

          {/* Ô đặc biệt & Luật chơi */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-300 text-sm mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              2. Các ô đặc biệt và cơ chế thưởng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-amber-300 flex items-center gap-1">⚡ TĂNG TỐC (Chặng 4, 8):</strong>
                <span>Tổ trả lời đúng câu bonus sẽ được tiến 2 chặng liên tiếp!</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-purple-300 flex items-center gap-1">🎁 HỘP QUÀ (Chặng 6):</strong>
                <span>Nhận ngay +20 điểm thưởng khích lệ tinh thần đồng đội.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-rose-300 flex items-center gap-1">🚨 CHƯỚNG NGẠI VẬT (Chặng 10):</strong>
                <span>Cần trả lời chính xác câu hỏi thử thách để bứt tốc về đích.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-orange-400 flex items-center gap-1">🔥 COMBO:</strong>
                <span>Trả lời đúng 3 câu liên tiếp sẽ kích hoạt Combo thưởng +15 điểm!</span>
              </div>
            </div>
          </div>

          {/* Chống cộng điểm trùng & Hoàn tác */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-300 text-sm mb-2 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              3. Cơ chế bảo vệ & HOÀN TÁC (Undo)
            </h3>
            <p>
              Hệ thống tự động khóa nút Đúng/Sai sau khi đã xác nhận một kết quả, đảm bảo <strong>không bao giờ bị cộng trùng điểm hay nhảy xe 2 lần do double-click</strong>. Nếu bấm nhầm tổ hoặc nhầm kết quả, thầy/cô chỉ cần bấm nút <strong>HOÀN TÁC</strong> ở góc trên bên phải để quay lại trạng thái trước đó.
            </p>
          </div>

          {/* Cú nước rút & Xử lý hòa */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-300 text-sm mb-2 flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-purple-400" />
              4. Cú Nước Rút 4 Tổ & Câu Phụ Phân Hạng
            </h3>
            <p>
              • Khi các xe tiến gần đích, giáo viên kích hoạt <strong>“CÚ NƯỚC RÚT 4 TỔ”</strong>: Mỗi tổ nhận 1 câu hỏi bí mật riêng có độ khó tương đương để mở lần lượt.<br />
              • Nếu có hai hay nhiều tổ chạm đích cùng lúc hoặc bằng điểm: Hệ thống sẽ bật <strong>“CÂU PHỤ PHÂN HẠNG”</strong> để thi đấu loại trực tiếp, tuyệt đối không chọn đội thắng ngẫu nhiên.
            </p>
          </div>

          {/* Thông tin giáo viên biên soạn */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/40 to-slate-950 rounded-xl border border-purple-500/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-purple-200">
                  Giáo viên biên soạn & phụ trách: Cô Eliza Tâm Dương
                </h4>
                <p className="text-xs text-slate-400">
                  Bài học: Bài 2. Tập hợp và các phép toán trên tập hợp (Toán 10 - KNTT)
                </p>
              </div>
            </div>
            <a
              href="tel:0962571826"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>0962571826</span>
            </a>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Đã hiểu và sẵn sàng giảng dạy
          </button>
        </div>
      </div>
    </div>
  );
};
