import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw, Gamepad2, CheckSquare, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import { PageWrapper } from '../components/PageWrapper';
import { allQuestions } from '../data/questions';

const taskChallenges = [
  "Clear your desk of all non-essential items (Sort).",
  "Label 3 items or drawers in your workspace (Set in Order).",
  "Wipe down your keyboard, mouse, and monitor (Shine).",
  "Document one daily process you do repeatedly (Standardize).",
  "Identify one 'Waste' (e.g., waiting, motion) in your current workflow.",
  "Ask 'Why?' 5 times for a recent minor issue you faced.",
  "Update your personal or team Kanban board.",
  "Suggest one small improvement (Kaizen) to your team lead."
];

export default function Games() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'tasks'>('quiz');
  
  // Quiz State
  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Tasks State
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    startNewQuiz();
  }, []);

  const startNewQuiz = () => {
    // Shuffle and pick 10 random questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleAnswerClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].a) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  const toggleTask = (index: number) => {
    if (completedTasks.includes(index)) {
      setCompletedTasks(completedTasks.filter(i => i !== index));
    } else {
      setCompletedTasks([...completedTasks, index]);
    }
  };

  return (
    <PageWrapper>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Interactive Learning</h1>
        <p className="text-slate-500 mt-2">Test your knowledge and complete practical Lean challenges.</p>
      </div>

      <div className="flex space-x-2 bg-slate-200/50 p-1 rounded-xl max-w-md mx-auto mb-8">
        <button
          onClick={() => setActiveTab('quiz')}
          className={cn(
            'flex items-center justify-center gap-2 flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
            activeTab === 'quiz' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          )}
        >
          <Gamepad2 className="w-4 h-4" />
          Knowledge Quiz
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            'flex items-center justify-center gap-2 flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
            activeTab === 'tasks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          )}
        >
          <Target className="w-4 h-4" />
          Task Challenges
        </button>
      </div>

      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto">
          {questions.length > 0 && showScore ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center"
            >
              <div className="w-20 h-20 mx-auto bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Assessment Complete!</h2>
              <p className="text-lg text-slate-600 mb-8">
                You scored <span className="font-bold text-indigo-600">{score}</span> out of {questions.length}
              </p>
              
              <div className="w-full bg-slate-100 rounded-full h-4 mb-8 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / questions.length) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    score === questions.length ? "bg-emerald-500" : 
                    score >= questions.length / 2 ? "bg-indigo-500" : "bg-amber-500"
                  )}
                />
              </div>

              <button
                onClick={startNewQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Another Set
              </button>
            </motion.div>
          ) : questions.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQuestion}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    Score: {score}
                  </span>
                </div>
                
                <div className="p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">
                    {questions[currentQuestion].q}
                  </h2>
                  
                  <div className="space-y-3">
                    {questions[currentQuestion].o.map((option, index) => {
                      const isCorrect = index === questions[currentQuestion].a;
                      const isSelected = index === selectedAnswer;
                      
                      let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ";
                      
                      if (!isAnswered) {
                        buttonClass += "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:scale-[1.02] active:scale-95";
                      } else if (isCorrect) {
                        buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-900 scale-[1.02] shadow-sm";
                      } else if (isSelected && !isCorrect) {
                        buttonClass += "border-red-500 bg-red-50 text-red-900 scale-95 opacity-80";
                      } else {
                        buttonClass += "border-slate-200 opacity-40 text-slate-500";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerClick(index)}
                          disabled={isAnswered}
                          className={buttonClass}
                        >
                          <span className="font-medium">{option}</span>
                          {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                          {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="mt-8 flex justify-end"
                    >
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 font-medium shadow-md"
                      >
                        {currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Practical Lean Challenges</h2>
            <p className="text-slate-500 text-sm mt-1">Complete these tasks in your actual workspace to practice Lean principles.</p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <span className="font-semibold text-indigo-900">Progress</span>
              <span className="font-bold text-indigo-600">{completedTasks.length} / {taskChallenges.length}</span>
            </div>
            <div className="space-y-3">
              {taskChallenges.map((task, index) => {
                const isCompleted = completedTasks.includes(index);
                return (
                  <div 
                    key={index}
                    onClick={() => toggleTask(index)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                      isCompleted ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      isCompleted ? "bg-emerald-500 text-white" : "border-2 border-slate-300 text-transparent"
                    )}>
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <span className={cn(
                      "font-medium text-slate-700",
                      isCompleted && "line-through text-slate-500"
                    )}>
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
