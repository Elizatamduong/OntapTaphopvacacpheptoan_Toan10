import React, { useState, useEffect, useCallback } from 'react';
import { Team, TeamId, Question, GameActionHistory, WrongQuestionReview } from './types';
import { QUESTIONS_DATABASE, SPECIAL_TILES, LESSON_TITLE, LESSON_SUBTITLE } from './data/questions';
import { sound } from './utils/sound';
import { RaceTrack } from './components/RaceTrack';
import { TeamScoreboard } from './components/TeamScoreboard';
import { QuestionCard } from './components/QuestionCard';
import { ControlPanel } from './components/ControlPanel';
import { SprintModeModal } from './components/SprintModeModal';
import { TieBreakerModal } from './components/TieBreakerModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { EditTeamNameModal } from './components/EditTeamNameModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { Trophy, HelpCircle, Sparkles, Rocket, Zap, GraduationCap, Phone } from 'lucide-react';

const MAX_STEPS = 12;

const INITIAL_TEAMS: Record<TeamId, Team> = {
  team1: {
    id: 'team1',
    name: 'Tổ 1 (Xe Đỏ)',
    colorName: 'Đỏ',
    colorHex: '#ef4444',
    borderHex: '#dc2626',
    bgHex: '#450a0a',
    accentHex: '#f87171',
    position: 0,
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    turnsCount: 0,
    currentCombo: 0,
    maxCombo: 0,
    boostCount: 0,
  },
  team2: {
    id: 'team2',
    name: 'Tổ 2 (Xe Xanh)',
    colorName: 'Xanh dương',
    colorHex: '#3b82f6',
    borderHex: '#2563eb',
    bgHex: '#082f49',
    accentHex: '#60a5fa',
    position: 0,
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    turnsCount: 0,
    currentCombo: 0,
    maxCombo: 0,
    boostCount: 0,
  },
  team3: {
    id: 'team3',
    name: 'Tổ 3 (Xe Vàng)',
    colorName: 'Vàng',
    colorHex: '#eab308',
    borderHex: '#ca8a04',
    bgHex: '#422006',
    accentHex: '#fde047',
    position: 0,
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    turnsCount: 0,
    currentCombo: 0,
    maxCombo: 0,
    boostCount: 0,
  },
  team4: {
    id: 'team4',
    name: 'Tổ 4 (Xe Xanh Lá)',
    colorName: 'Xanh lá',
    colorHex: '#22c55e',
    borderHex: '#16a34a',
    bgHex: '#052e16',
    accentHex: '#4ade80',
    position: 0,
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    turnsCount: 0,
    currentCombo: 0,
    maxCombo: 0,
    boostCount: 0,
  },
};

export default function App() {
  const [teams, setTeams] = useState<Record<TeamId, Team>>(INITIAL_TEAMS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [activeTeamId, setActiveTeamId] = useState<TeamId | null>(null);
  const [questionStatus, setQuestionStatus] = useState<
    'unanswered' | 'answered_correct' | 'answered_wrong' | 'passed'
  >('unanswered');
  const [attemptedTeams, setAttemptedTeams] = useState<TeamId[]>([]);
  const [movingTeamId, setMovingTeamId] = useState<TeamId | null>(null);
  const [boostingTeamId, setBoostingTeamId] = useState<TeamId | null>(null);
  const [historyStack, setHistoryStack] = useState<GameActionHistory[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Wrong questions tracker for class review
  const [wrongQuestionsLog, setWrongQuestionsLog] = useState<
    { questionId: string; teamId: TeamId; timestamp: number }[]
  >([]);

  // Special notification toast
  const [notification, setNotification] = useState<{ message: string; type: 'boost' | 'gift' | 'combo' | 'sprint' } | null>(null);

  // Modals
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showQuestionBank, setShowQuestionBank] = useState<boolean>(false);
  const [showSprintModal, setShowSprintModal] = useState<boolean>(false);
  const [showTieBreakerModal, setShowTieBreakerModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showEditNameModal, setShowEditNameModal] = useState<boolean>(false);

  // Sprint mode dedicated state
  const [sprintResults, setSprintResults] = useState<Record<TeamId, boolean | null>>({
    team1: null,
    team2: null,
    team3: null,
    team4: null,
  });

  const currentQuestion = QUESTIONS_DATABASE[currentQuestionIndex] || QUESTIONS_DATABASE[0];

  // Save state snapshot for UNDO
  const pushHistorySnapshot = useCallback(
    (desc: string) => {
      const snapshot: GameActionHistory = {
        id: `hist_${Date.now()}`,
        timestamp: Date.now(),
        description: desc,
        teams: JSON.parse(JSON.stringify(teams)),
        currentQuestionIndex,
        currentQuestionId: currentQuestion.id,
        activeAnsweringTeamId: activeTeamId,
        questionStatus,
        sprintActive: showSprintModal,
        sprintTeamIndex: 0,
        isGameOver: showLeaderboardModal,
        consecutiveWrongCount: 0,
        attemptedTeamsForCurrentQuestion: [...attemptedTeams],
        wrongQuestionsLog: [...wrongQuestionsLog],
      };
      setHistoryStack((prev) => [...prev, snapshot]);
    },
    [teams, currentQuestionIndex, currentQuestion.id, activeTeamId, questionStatus, showSprintModal, showLeaderboardModal, attemptedTeams, wrongQuestionsLog]
  );

  // Perform multi-step UNDO
  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const lastSnapshot = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));

    // Restore exact state
    setTeams(lastSnapshot.teams);
    setCurrentQuestionIndex(lastSnapshot.currentQuestionIndex);
    setActiveTeamId(lastSnapshot.activeAnsweringTeamId);
    setQuestionStatus(lastSnapshot.questionStatus);
    setAttemptedTeams(lastSnapshot.attemptedTeamsForCurrentQuestion);
    setWrongQuestionsLog(lastSnapshot.wrongQuestionsLog);
    sound.playClick();
  };

  // Select team to answer
  const handleSelectTeam = (teamId: TeamId) => {
    // If question is already confirmed as correct or wrong, don't allow reselecting without pass
    if (questionStatus === 'answered_correct' || questionStatus === 'answered_wrong') {
      return;
    }
    sound.playClick();
    setActiveTeamId(teamId);
  };

  // Teacher marks answer as ĐÚNG or SAI (Guarded against double click)
  const handleAnswerResult = (isCorrect: boolean) => {
    if (!activeTeamId) return;
    if (questionStatus === 'answered_correct' || questionStatus === 'answered_wrong') {
      return; // Protected: Already confirmed!
    }

    pushHistorySnapshot(`Xác nhận ${teams[activeTeamId].name}: ${isCorrect ? 'ĐÚNG' : 'SAI'}`);

    const targetTeam = { ...teams[activeTeamId] };
    const updatedAttempted = [...attemptedTeams, activeTeamId];
    setAttemptedTeams(updatedAttempted);

    if (isCorrect) {
      sound.playCorrect();

      // Check special tiles: Chặng 4, 8 is speed_boost (+2 steps)
      let stepsToAdvance = 1;
      let scoreToAdd = 10;
      let isBoosted = false;

      const nextPos = targetTeam.position + 1;
      const tile = SPECIAL_TILES[nextPos];

      if (tile?.type === 'speed_boost') {
        stepsToAdvance = 2;
        isBoosted = true;
        setNotification({
          message: `⚡ ${targetTeam.name} đã chạm ô TĂNG TỐC! Được tiến 2 chặng liên tiếp!`,
          type: 'boost',
        });
      } else if (tile?.type === 'gift') {
        scoreToAdd += 20;
        setNotification({
          message: `🎁 ${targetTeam.name} mở HỘP QUÀ và nhận thêm +20 điểm thưởng!`,
          type: 'gift',
        });
      }

      // Combo management
      const newCombo = targetTeam.currentCombo + 1;
      let comboBonus = 0;
      if (newCombo >= 3) {
        comboBonus = 15;
        sound.playCombo();
        setNotification({
          message: `🔥 COMBO x${newCombo}! ${targetTeam.name} trả lời đúng liên tiếp, thưởng +15 điểm!`,
          type: 'combo',
        });
      }

      const finalPos = Math.min(MAX_STEPS, targetTeam.position + stepsToAdvance);

      targetTeam.score += scoreToAdd + comboBonus;
      targetTeam.position = finalPos;
      targetTeam.correctCount += 1;
      targetTeam.turnsCount += 1;
      targetTeam.currentCombo = newCombo;
      targetTeam.maxCombo = Math.max(targetTeam.maxCombo, newCombo);
      if (isBoosted) targetTeam.boostCount += 1;

      // Animate moving car
      setMovingTeamId(activeTeamId);
      if (isBoosted) {
        setBoostingTeamId(activeTeamId);
        sound.playBoost();
      } else {
        sound.playCarMove();
      }

      setTimeout(() => {
        setMovingTeamId(null);
        setBoostingTeamId(null);
      }, 700);

      // Check finish line
      if (finalPos >= MAX_STEPS) {
        sound.playVictory();
      }

      setTeams((prev) => ({ ...prev, [activeTeamId]: targetTeam }));
      setQuestionStatus('answered_correct');
    } else {
      // Wrong answer
      sound.playWrong();
      targetTeam.incorrectCount += 1;
      targetTeam.turnsCount += 1;
      targetTeam.currentCombo = 0; // Reset combo

      setTeams((prev) => ({ ...prev, [activeTeamId]: targetTeam }));
      setQuestionStatus('answered_wrong');

      // Log wrong question for teacher end-of-game review
      setWrongQuestionsLog((prev) => [
        ...prev,
        { questionId: currentQuestion.id, teamId: activeTeamId, timestamp: Date.now() },
      ]);
    }
  };

  // Pass turn to another team when previous team was wrong
  const handlePassTurn = () => {
    pushHistorySnapshot('Chuyển quyền trả lời');
    sound.playClick();
    setActiveTeamId(null);
    setQuestionStatus('unanswered');
  };

  // Next Question
  const handleNextQuestion = () => {
    pushHistorySnapshot('Chuyển câu hỏi tiếp theo');
    sound.playClick();
    const nextIdx = (currentQuestionIndex + 1) % QUESTIONS_DATABASE.length;
    setCurrentQuestionIndex(nextIdx);
    setActiveTeamId(null);
    setQuestionStatus('unanswered');
    setAttemptedTeams([]);
    setNotification(null);
  };

  // Manual Trigger Speed Boost for active team
  const handleTriggerBoost = () => {
    if (!activeTeamId) return;
    pushHistorySnapshot(`Thưởng Tăng tốc cho ${teams[activeTeamId].name}`);
    sound.playBoost();

    const targetTeam = { ...teams[activeTeamId] };
    const newPos = Math.min(MAX_STEPS, targetTeam.position + 2);
    targetTeam.position = newPos;
    targetTeam.boostCount += 1;
    targetTeam.score += 15;

    setMovingTeamId(activeTeamId);
    setBoostingTeamId(activeTeamId);
    setTimeout(() => {
      setMovingTeamId(null);
      setBoostingTeamId(null);
    }, 800);

    setTeams((prev) => ({ ...prev, [activeTeamId]: targetTeam }));
    setNotification({
      message: `⚡ Giáo viên đã kích hoạt TĂNG TỐC cho ${targetTeam.name}! Xe tiến 2 chặng!`,
      type: 'boost',
    });
  };

  // Sprint Mode handler
  const handleSprintResult = (teamId: TeamId, isCorrect: boolean) => {
    pushHistorySnapshot(`Cú nước rút: ${teams[teamId].name} ${isCorrect ? 'ĐÚNG' : 'SAI'}`);
    setSprintResults((prev) => ({ ...prev, [teamId]: isCorrect }));

    const targetTeam = { ...teams[teamId] };
    targetTeam.turnsCount += 1;

    if (isCorrect) {
      sound.playCorrect();
      targetTeam.correctCount += 1;
      targetTeam.score += 10;
      targetTeam.position = Math.min(MAX_STEPS, targetTeam.position + 1);

      setMovingTeamId(teamId);
      sound.playCarMove();
      setTimeout(() => setMovingTeamId(null), 600);
    } else {
      sound.playWrong();
      targetTeam.incorrectCount += 1;
    }

    setTeams((prev) => ({ ...prev, [teamId]: targetTeam }));
  };

  // Handle Tie Breaker Winner Award
  const handleAwardTieWinner = (winnerId: TeamId) => {
    pushHistorySnapshot(`Thắng câu phụ phân hạng: ${teams[winnerId].name}`);
    sound.playVictory();

    const targetTeam = { ...teams[winnerId] };
    targetTeam.score += 5; // Decisive tie-breaker point
    setTeams((prev) => ({ ...prev, [winnerId]: targetTeam }));
    setShowTieBreakerModal(false);
  };

  // Check if there are ties
  const teamList = Object.values(teams) as Team[];
  const teamPositions = teamList.map((t) => t.position);
  const teamScores = teamList.map((t) => t.score);
  const maxPos = Math.max(...teamPositions);
  const tiedAtFinish = teamList.filter((t) => t.position >= MAX_STEPS);
  const tiedTeamsForBreak =
    tiedAtFinish.length >= 2
      ? tiedAtFinish
      : teamList.filter((t, _, arr) => arr.filter((other) => other.score === t.score).length >= 2);
  const hasTies = tiedTeamsForBreak.length >= 2;

  // Breakthrough opportunity for trailing team
  const minPos = Math.min(...teamPositions);
  const trailingTeam = teamList.find((t) => t.position === minPos && maxPos - minPos >= 2);

  // Restart game cleanly while preserving team names
  const handleRestartGame = () => {
    const freshTeams: Record<TeamId, Team> = {
      team1: { ...INITIAL_TEAMS.team1, name: teams.team1.name },
      team2: { ...INITIAL_TEAMS.team2, name: teams.team2.name },
      team3: { ...INITIAL_TEAMS.team3, name: teams.team3.name },
      team4: { ...INITIAL_TEAMS.team4, name: teams.team4.name },
    };
    setTeams(freshTeams);
    setCurrentQuestionIndex(0);
    setActiveTeamId(null);
    setQuestionStatus('unanswered');
    setAttemptedTeams([]);
    setMovingTeamId(null);
    setBoostingTeamId(null);
    setHistoryStack([]);
    setWrongQuestionsLog([]);
    setNotification(null);
    setShowLeaderboardModal(false);
    setShowSprintModal(false);
    setShowTieBreakerModal(false);
    setSprintResults({ team1: null, team2: null, team3: null, team4: null });
    sound.playClick();
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Format wrong questions review list
  const wrongQuestionsReview: WrongQuestionReview[] = React.useMemo(() => {
    const map = new Map<string, { wrongTeams: Set<string>; count: number }>();
    wrongQuestionsLog.forEach((item) => {
      const existing = map.get(item.questionId) || { wrongTeams: new Set(), count: 0 };
      existing.wrongTeams.add(teams[item.teamId].name);
      existing.count += 1;
      map.set(item.questionId, existing);
    });

    const reviews: WrongQuestionReview[] = [];
    map.forEach((value, qId) => {
      const q = QUESTIONS_DATABASE.find((item) => item.id === qId);
      if (q) {
        reviews.push({
          question: q,
          wrongTeams: Array.from(value.wrongTeams),
          count: value.count,
        });
      }
    });
    return reviews;
  }, [wrongQuestionsLog, teams]);

  // Sprint Questions (4 distinct questions with equivalent difficulty)
  const sprintQuestions = QUESTIONS_DATABASE.filter((q) => q.difficulty === 'sprint');
  // Tie-breaker question
  const tieQuestion = QUESTIONS_DATABASE.find((q) => q.difficulty === 'tie_breaker') || QUESTIONS_DATABASE[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      {/* Top Banner & Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Logo & Subject Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center font-black text-xl shadow-lg shadow-red-950/40 select-none">
              🏁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base md:text-lg tracking-tight text-white">
                  ĐƯỜNG ĐUA 4 TỔ
                </h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                  Toán 10 KNTT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs md:max-w-md">
                {LESSON_TITLE} • {LESSON_SUBTITLE}
              </p>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-2">
            {/* Teacher Badge: Eliza Tâm Dương */}
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 px-3 py-1 rounded-xl shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-extrabold text-purple-200">Cô Eliza Tâm Dương</div>
                <div className="text-purple-300/80 flex items-center gap-1 font-mono">
                  <Phone className="w-2.5 h-2.5" />
                  <span>0962571826</span>
                </div>
              </div>
            </div>

            {/* Trailing Team Breakthrough Banner */}
            {trailingTeam && (
              <div className="hidden xl:flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs px-2.5 py-1 rounded-full">
                <Rocket className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>
                  <strong>Cơ hội bứt phá:</strong> {trailingTeam.name} đang ở cuối bảng, sẵn sàng bứt tốc!
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowEditNameModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Đổi tên 4 tổ
            </button>

            <button
              type="button"
              onClick={() => setShowLeaderboardModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Bảng xếp hạng</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 w-full pt-2">
          <div className="bg-gradient-to-r from-amber-600/90 to-orange-600/90 border border-amber-300 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between gap-2 text-xs md:text-sm font-bold animate-bounce">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-white/80 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Classroom Projection View */}
      <main className="max-w-7xl mx-auto px-3 md:px-4 py-3 flex-1 flex flex-col gap-4 w-full">
        {/* 1. Race Track (Always clearly visible with 4 lanes) */}
        <section aria-label="Đường đua 4 làn">
          <RaceTrack
            teams={teams}
            maxSteps={MAX_STEPS}
            movingTeamId={movingTeamId}
            boostingTeamId={boostingTeamId}
            onEditTeamName={() => setShowEditNameModal(true)}
          />
        </section>

        {/* 2. Team Scoreboard (Live scores, correct, wrong, combo, turns) */}
        <section aria-label="Bảng điểm 4 tổ">
          <TeamScoreboard
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectTeam={handleSelectTeam}
            disabledSelection={questionStatus === 'answered_correct' || questionStatus === 'answered_wrong'}
            currentRoundNumber={currentQuestionIndex + 1}
            totalQuestions={QUESTIONS_DATABASE.length}
          />
        </section>

        {/* 3. Question Card (Very large, crisp math symbols, projector optimized) */}
        <section aria-label="Câu hỏi bài học">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={QUESTIONS_DATABASE.length}
            activeTeam={activeTeamId ? teams[activeTeamId] : null}
            questionStatus={questionStatus}
            attemptedTeams={attemptedTeams}
            teams={teams}
          />
        </section>

        {/* 4. Teacher Control Console */}
        <section aria-label="Bảng điều khiển giáo viên" className="sticky bottom-2 z-20">
          <ControlPanel
            teams={teams}
            activeTeamId={activeTeamId}
            onSelectTeam={handleSelectTeam}
            onAnswerResult={handleAnswerResult}
            onNextQuestion={handleNextQuestion}
            onPassTurn={handlePassTurn}
            onTriggerBoost={handleTriggerBoost}
            onUndo={handleUndo}
            canUndo={historyStack.length > 0}
            undoCount={historyStack.length}
            questionStatus={questionStatus}
            onStartSprint={() => setShowSprintModal(true)}
            onFinishGame={() => setShowLeaderboardModal(true)}
            onRestartGame={handleRestartGame}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onToggleFullscreen={handleToggleFullscreen}
            onOpenQuestionBank={() => setShowQuestionBank(true)}
            onOpenGuide={() => setShowGuideModal(true)}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-2.5 px-4 text-center text-xs text-slate-400 border-t border-slate-900 bg-slate-950/90 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 select-none">
        <span>
          Phần mềm hỗ trợ giảng dạy tương tác <strong>“ĐƯỜNG ĐUA 4 TỔ”</strong> • Bám sát SGK Toán 10 KNTT
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <div className="flex items-center gap-2 text-purple-300 font-medium">
          <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
          <span>Biên soạn & Giảng dạy: <strong>Eliza Tâm Dương</strong></span>
          <a
            href="tel:0962571826"
            className="flex items-center gap-1 font-mono text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>0962571826</span>
          </a>
        </div>
      </footer>

      {/* Modals */}
      <SprintModeModal
        isOpen={showSprintModal}
        onClose={() => setShowSprintModal(false)}
        teams={teams}
        sprintQuestions={sprintQuestions}
        onSprintResult={handleSprintResult}
        sprintResults={sprintResults}
      />

      <TieBreakerModal
        isOpen={showTieBreakerModal}
        onClose={() => setShowTieBreakerModal(false)}
        tiedTeams={tiedTeamsForBreak}
        tieQuestion={tieQuestion}
        onAwardTieWinner={handleAwardTieWinner}
      />

      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        teams={teams}
        onRestartGame={handleRestartGame}
        wrongQuestionsReview={wrongQuestionsReview}
        onOpenTieBreaker={() => {
          setShowLeaderboardModal(false);
          setShowTieBreakerModal(true);
        }}
        hasTies={hasTies}
      />

      <EditTeamNameModal
        isOpen={showEditNameModal}
        onClose={() => setShowEditNameModal(false)}
        teams={teams}
        onSaveNames={(newNames) => {
          setTeams((prev) => ({
            team1: { ...prev.team1, name: newNames.team1 },
            team2: { ...prev.team2, name: newNames.team2 },
            team3: { ...prev.team3, name: newNames.team3 },
            team4: { ...prev.team4, name: newNames.team4 },
          }));
        }}
      />

      <TeacherGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      <QuestionBankModal
        isOpen={showQuestionBank}
        onClose={() => setShowQuestionBank(false)}
        onSelectQuestion={(qIndex) => {
          setCurrentQuestionIndex(qIndex);
          setActiveTeamId(null);
          setQuestionStatus('unanswered');
          setAttemptedTeams([]);
        }}
        currentIndex={currentQuestionIndex}
      />
    </div>
  );
}
