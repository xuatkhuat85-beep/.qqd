import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Microscope, 
  RotateCw, 
  Monitor, 
  LayoutGrid, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  FlaskConical,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Play,
  Trophy,
  Dna,
  X,
  ExternalLink
} from "lucide-react";

interface Resource {
  type: 'exercise' | 'video' | 'document' | 'experiment';
  title: string;
  link: string;
  description?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TopicCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  content: string;
  resources: Resource[];
  quiz?: QuizQuestion[];
  iconBg: string;
  delay: number;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const TopicCard = ({ icon, title, subtitle, content, resources, quiz, iconBg, delay }: TopicCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [testResult, setTestResult] = useState<'none' | 'pass' | 'fail'>('none');
  const [isTesting, setIsTesting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  
  const [activeVideo, setActiveVideo] = useState<Resource | null>(null);
  const [activeLab, setActiveLab] = useState<Resource | null>(null);

  const toggleTest = () => {
    if (quiz) {
      const shuffledQuiz = shuffleArray(quiz).map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      const finalQuiz = shuffledQuiz.map(q => {
        const originalQuestion = quiz.find(oq => oq.question === q.question);
        const originalCorrectOption = originalQuestion!.options[originalQuestion!.answer];
        const newCorrectIndex = q.options.indexOf(originalCorrectOption);
        return { ...q, answer: newCorrectIndex };
      });

      setCurrentQuiz(finalQuiz.slice(0, 5));
      setSelectedAnswers(new Array(5).fill(-1));
      setShowQuiz(true);
      setTestResult('none');
    }
  };

  const submitQuiz = () => {
    setIsTesting(true);
    setTimeout(() => {
      let correctCount = 0;
      selectedAnswers.forEach((ans, idx) => {
        if (ans === currentQuiz[idx].answer) correctCount++;
      });
      
      const finalScore = (correctCount / currentQuiz.length) * 100;
      setScore(finalScore);
      setTestResult(finalScore >= 70 ? 'pass' : 'fail');
      setIsTesting(false);
      setShowQuiz(false);
    }, 1200);
  };

  const handleResourceClick = (res: Resource) => {
    if (res.type === 'video') {
      setActiveVideo(res);
    } else if (res.type === 'experiment') {
      setActiveLab(res);
    } else {
      window.open(res.link, '_blank');
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'exercise': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'experiment': return <FlaskConical className="w-4 h-4" />;
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col gap-4 shadow-sm h-fit overflow-hidden"
      >
        <div className="flex gap-4 items-start focus:outline-none">
          <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{title}</h3>
            <p className="text-gray-500 text-sm leading-snug">{subtitle}</p>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-6 pt-4 border-t border-gray-50"
            >
              <div className="text-gray-600 text-sm leading-relaxed p-4 bg-gray-50/50 rounded-xl border border-gray-100 italic">
                <h4 className="font-semibold text-gray-900 mb-2 not-italic underline decoration-indigo-200">Kiến thức trọng tâm:</h4>
                {content}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Học liệu & Thí nghiệm 3D</h4>
                  <span className="text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full">ACTIVE LAB</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resources.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => handleResourceClick(res)}
                      className="flex items-center gap-3 p-3 text-left rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                        {getResourceIcon(res.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-900 block truncate">
                          {res.title}
                        </span>
                        {res.type === 'experiment' && <span className="text-[10px] text-orange-500 font-bold">Mô phỏng tương tác</span>}
                        {res.type === 'video' && <span className="text-[10px] text-blue-500 font-bold">Video bài giảng</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-gray-900">Đánh giá kiến thức</h4>
                  </div>
                  {testResult !== 'none' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Điểm: {score}</span>
                      {testResult === 'pass' ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                          Đạt
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wider">
                          Lại
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {!showQuiz ? (
                  <button
                    onClick={toggleTest}
                    disabled={isTesting}
                    className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${
                      isTesting 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
                    }`}
                  >
                    {isTesting ? "Chờ kết quả..." : "Kiểm tra chủ đề (5 câu)"}
                  </button>
                ) : (
                  <div className="space-y-6">
                    {currentQuiz.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2">
                         <p className="text-sm font-bold text-gray-800">{qIdx + 1}. {q.question}</p>
                         <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => {
                                const newAns = [...selectedAnswers];
                                newAns[qIdx] = oIdx;
                                setSelectedAnswers(newAns);
                              }}
                              className={`text-left p-3 text-xs rounded-xl border transition-all ${
                                selectedAnswers[qIdx] === oIdx 
                                ? "border-indigo-500 bg-indigo-500 text-white" 
                                : "border-gray-200 bg-white"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={submitQuiz}
                      disabled={selectedAnswers.includes(-1)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
                    >
                      Xác nhận nộp bài
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors mt-2 self-start py-1.5 px-3 rounded-lg hover:bg-indigo-50"
        >
          {isExpanded ? "Thu gọn bài học" : "Vào bài học & Thí nghiệm"}
        </button>
      </motion.div>

      {/* Video Player Modal */}
      <Modal 
        isOpen={!!activeVideo} 
        onClose={() => setActiveVideo(null)} 
        title={activeVideo?.title || "Video Bài Giảng"}
      >
        <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative group">
          <iframe 
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${activeVideo?.link || ""}?autoplay=1`}
            title="Lecture video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-6">
          <h4 className="font-bold text-gray-900 mb-2">Mô tả bài giảng:</h4>
          <p className="text-gray-600 text-sm whitespace-pre-line">{activeVideo?.description || "Nội dung video tập trung vào các nguyên lý cốt lõi và ứng dụng thực tế của chủ đề học tập."}</p>
        </div>
      </Modal>

      {/* Lab Modal */}
      <Modal 
        isOpen={!!activeLab} 
        onClose={() => setActiveLab(null)} 
        title={activeLab?.title || "Thí nghiệm ảo tương tác"}
      >
        <div className="h-[60vh] w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <FlaskConical className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
          <div className="max-w-md">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Đang kết nối tới trạm thí nghiệm ảo</h4>
            <p className="text-gray-500 text-sm italic mb-4">
              {activeLab?.description || "Đang khởi tạo môi trường thực hành..."}
            </p>
            <p className="text-gray-500 text-xs mb-8">
              Lưu ý: Bạn sẽ được chuyển hướng tới trang mô phỏng 3D uy tín để thực hiện các thao tác lắp đặt và đo đạc.
            </p>
          </div>
          <a 
            href={activeLab?.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Mở trạm thực hành ngay <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </Modal>
    </>
  );
};

export default function App() {
  const topics: TopicCardProps[] = [
    {
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      title: "Mạch điện DC / AC",
      subtitle: "Định luật Ohm, Kirchhoff, RLC",
      content: "Nắm vững cách tính toán dòng điện trong mạch. Định luật Ohm (U=IR), Kirchhoff 1 (Tổng dòng nút bằng 0), Kirchhoff 2 (Tổng áp vòng bằng 0). Với mạch AC, cần hiểu về trở kháng (Z), góc lệch pha và công suất P, Q, S.",
      resources: [
        { type: 'video', title: 'Bài giảng: Phân tích mạch xoay chiều RLC', link: '95t1jFshD_Y', description: "Video cung cấp phương pháp sử dụng số phức để giải nhanh các mạch RLC mắc nối tiếp và song song." },
        { type: 'experiment', title: 'Thí nghiệm: Xây dựng mạch DC/AC Phet', link: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-ac/latest/circuit-construction-kit-ac_vi.html', description: "Thực hành lắp đặt các điện trở, tụ điện, cuộn cảm và đo đạc bằng ampe kế, vôn kế ảo." },
        { type: 'document', title: 'Tài liệu: Tổng hợp công thức mạch AC', link: '#' }
      ],
      quiz: [
        { question: "Đơn vị của điện trở là gì?", options: ["Ampe (A)", "Vôn (V)", "Ôm (Ω)", "Oat (W)"], answer: 2, difficulty: 'easy' },
        { question: "Định luật Kirchhoff 1 nói về gì?", options: ["Tổng áp", "Tổng dòng tại nút", "Công suất", "Trở kháng"], answer: 1, difficulty: 'easy' },
        { question: "Trong mạch xoay chiều, công suất phản kháng đơn vị là?", options: ["W", "VA", "VAr", "J"], answer: 2, difficulty: 'medium' },
        { question: "Công thức Ohm I=U/R đúng khi nào?", options: ["Luôn đúng", "Đúng cho mạch thuần trở", "Đúng cho tụ điện", "Chỉ đúng mạch DC"], answer: 1, difficulty: 'easy' },
        { question: "Biểu thức dung kháng Zc là?", options: ["Lω", "1/Cω", "R/ω", "C/ω"], answer: 1, difficulty: 'medium' }
      ],
      iconBg: "bg-orange-50",
      delay: 0.1,
    },
    {
      icon: <Microscope className="w-6 h-6 text-blue-500" />,
      title: "Điện tử cơ bản",
      subtitle: "Diode, Transistor, Op-Amp",
      content: "Diode chỉ cho dòng điện đi qua một chiều. Transistor (BJT, MOSFET) hoạt động như một công tắc hoặc bộ khuếch đại. Op-Amp có thể thực hiện các phép toán cộng, trừ, tích phân ứng dụng trong xử lý tín hiệu.",
      resources: [
        { type: 'video', title: 'Bài giảng: Cách transistor NPN hoạt động', link: '7-vV_D7N3S8', description: "Giải thích cơ chế dòng điện chạy qua lớp tiếp giáp P-N và cách điều khiển dòng lớn bằng dòng nhỏ." },
        { type: 'experiment', title: 'Virtual Lab: Mô phỏng mạch khuếch đại', link: 'https://www.tinkercad.com/circuits', description: "Sử dụng Tinkercad để lắp mạch khuếch đại dùng Transistor và đo đồ thị dao động bằng Oscilloscope." },
        { type: 'document', title: 'Tài liệu: Bảng thông số linh kiện BJT', link: '#' }
      ],
      quiz: [
        { question: "Linh kiện nào dùng để chỉnh lưu dòng điện?", options: ["Điện trở", "Tụ điện", "Diode", "Cuộn cảm"], answer: 2, difficulty: 'easy' },
        { question: "Transistor BJT có bao nhiêu cực?", options: ["2", "3", "4", "5"], answer: 1, difficulty: 'easy' },
        { question: "Op-Amp lý tưởng có trở kháng vào bao nhiêu?", options: ["0", "100", "Vô cùng", "1k"], answer: 2, difficulty: 'medium' },
        { question: "Linh kiện tích cực là gì?", options: ["Điện trở", "Tụ điện", "Transistor", "Dây dẫn"], answer: 2, difficulty: 'easy' },
        { question: "Mạch khuếch đại đảo có hệ số khuếch đại tính bằng?", options: ["R2/R1", "-R2/R1", "1+R2/R1", "R1/R2"], answer: 1, difficulty: 'hard' }
      ],
      iconBg: "bg-blue-50",
      delay: 0.2,
    },
    {
      icon: <RotateCw className="w-6 h-6 text-indigo-500" />,
      title: "Máy điện",
      subtitle: "Động cơ, máy biến áp, máy phát",
      content: "Máy biến áp thay đổi điện áp dựa trên hiện tượng cảm ứng điện từ. Động cơ điện biến điện năng thành cơ năng. Máy phát điện biến cơ năng thành điện năng. Học về từ trường quay và hệ số trượt (s).",
      resources: [
        { type: 'video', title: '3D Lecture: Động cơ cảm ứng 3 pha', link: 'Mle7v_9Zozs', description: "Mô phỏng 3D giúp bạn nhìn xuyên thấu vào trong rotor và stator khi có dòng điện chạy qua." },
        { type: 'experiment', title: 'Thực hành: Định luật Faraday ảo', link: 'https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_vi.html', description: "Hiểu về mối liên hệ giữa từ trường biến thiên và dòng điện cảm ứng trong cuộn dây." },
        { type: 'document', title: 'Hướng dẫn quấn dây động cơ', link: '#' }
      ],
      quiz: [
        { question: "Máy biến áp hoạt động dựa trên nguyên lý nào?", options: ["Cảm ứng điện từ", "Lực Loren", "Hiệu ứng nhiệt", "Tự cảm"], answer: 0, difficulty: 'easy' },
        { question: "Hệ số trượt s của động cơ không đồng bộ luôn?", options: ["s < 0", "0 < s < 1", "s = 1", "s = 0"], answer: 1, difficulty: 'medium' },
        { question: "Từ trường quay được tạo ra bởi?", options: ["Dòng điện DC", "Dòng AC 3 pha lệch 120 độ", "Dòng điện 1 pha", "Nam châm vĩnh cửu"], answer: 1, difficulty: 'easy' },
        { question: "Bộ phận nào đứng yên trong máy điện?", options: ["Rotor", "Stator", "Trục máy", "Cả 3"], answer: 1, difficulty: 'easy' },
        { question: "Máy điện xoay chiều đồng bộ có tốc độ rotor?", options: ["Bằng tốc độ từ trường", "Nhỏ hơn tốc độ từ trường", "Lớn hơn", "Bằng 0"], answer: 0, difficulty: 'medium' }
      ],
      iconBg: "bg-indigo-50",
      delay: 0.3,
    },
    {
      icon: <Monitor className="w-6 h-6 text-cyan-500" />,
      title: "Vi điều khiển",
      subtitle: "Arduino, ESP32, STM32, PLC",
      content: "Xử lý tín hiệu số và tương tự (ADC/DAC). Lập trình nhúng sử dụng ngôn ngữ C/C++. PLC ứng dụng trong tự động hóa công nghiệp với ngôn ngữ Ladder hoặc SCL.",
      resources: [
        { type: 'video', title: 'Tutorial: Lập trình PLC Ladder cơ bản', link: 'z-mP9hYg5L4', description: "Hướng dẫn các lệnh logic căn bản AND, OR, NOT trong lập trình PLC công nghiệp." },
        { type: 'experiment', title: 'Wokwi Simulator: Lập trình Arduino/ESP32', link: 'https://wokwi.com/', description: "Trình giả lập mạch vi điều khiển mạnh mẽ không cần mua linh kiện thật." },
        { type: 'exercise', title: 'Dự án: Xe tự hành tránh vật cản', link: '#' }
      ],
      quiz: [
        { question: "Ngôn ngữ nào thường dùng nhất trong PLC?", options: ["Python", "Ladder Logic", "Java", "Assembly"], answer: 1, difficulty: 'easy' },
        { question: "Vi điều khiển khác gì Microprocessor?", options: ["Nhanh hơn", "Tích hợp sẵn RAM/Flash/Ngoại vi", "Tiết kiệm điện", "Đắt hơn"], answer: 1, difficulty: 'medium' },
        { question: "PWM dùng để làm gì?", options: ["Điều khiển tốc độ/độ sáng", "Đọc dữ liệu cảm biến", "Nạp phần mềm", "Giao tiếp WiFi"], answer: 0, difficulty: 'easy' },
        { question: "Chân 'Analog In' có tác dụng gì?", options: ["Đọc mức 0/1", "Đọc giá trị điện áp thay đổi liên tục", "Cấp nguồn", "Xuất âm thanh"], answer: 1, difficulty: 'easy' },
        { question: "Baud rate là gì?", options: ["Tốc độ CPU", "Tốc độ truyền dữ liệu qua Serial", "Dung lượng bộ nhớ", "Độ phân giải ADC"], answer: 1, difficulty: 'medium' }
      ],
      iconBg: "bg-cyan-50",
      delay: 0.4,
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-purple-500" />,
      title: "Điều khiển tự động",
      subtitle: "PID, phản hồi, ổn định hệ thống",
      content: "Hệ thống vòng kín giúp tự điều chỉnh sai số. Bộ điều khiển PID (Proportional-Integral-Derivative) là tiêu chuẩn trong công nghiệp giúp ổn định tốc độ, nhiệt độ, áp suất.",
      resources: [
        { type: 'video', title: 'Kiến thức: Bộ điều khiển PID hoạt động thế nào?', link: 'fUSZ_v0Hl-s', description: "Giải thích trực quan về các tham số Kp, Ki, Kd qua các ví dụ thiết thực." },
        { type: 'experiment', title: 'Interactive: Mô phỏng PID cho nhiệt độ', link: 'https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_vi.html', description: "Sử dụng các mô phỏng vật lý để hiểu về sự trao đổi năng lượng và điều khiển nhiệt." },
        { type: 'document', title: 'Tài liệu: Phân tích ổn định Routh-Hurwitz', link: '#' }
      ],
      quiz: [
        { question: "Trong PID, chữ 'P' đại diện cho gì?", options: ["Power", "Proportional (Tỉ lệ)", "Project", "Phase"], answer: 1, difficulty: 'easy' },
        { question: "Khâu I giúp giảm đại lượng nào?", options: ["Độ vọt lố", "Sai số xác lập (tĩnh)", "Thời gian quá độ", "Dòng điện"], answer: 1, difficulty: 'medium' },
        { question: "Hệ thống phản hồi âm dùng để?", options: ["Làm hệ thống chạy nhanh", "Tăng tính ổn định và chính xác", "Gây dao động", "Tăng nhiễu"], answer: 1, difficulty: 'easy' },
        { question: "PID thường được dùng ở đâu?", options: ["Lò sưởi", "Tên lửa", "Cánh tay robot", "Tất cả các đáp án"], answer: 3, difficulty: 'easy' },
        { question: "Khi Kp quá lớn, hệ thống sẽ?", options: ["Ổn định hơn", "Chạy chậm lại", "Bị dao động", "Không thay đổi"], answer: 2, difficulty: 'medium' }
      ],
      iconBg: "bg-purple-50",
      delay: 0.5,
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-red-500" />,
      title: "An toàn điện",
      subtitle: "Tiêu chuẩn IEC, quy trình làm việc",
      content: "Quy tắc '5 ngón tay' và quy trình cắt điện an toàn. Hiểu về các loại CB (MCB, MCCB, RCD) và tầm quan trọng của hệ thống nối đất (Earthing) để bảo vệ tính mạng.",
      resources: [
        { type: 'video', title: 'Skill: Hướng dẫn sơ cứu người bị điện giật', link: 'w4U9vY3kI2E', description: "Các bước cần thiết và quy tắc an toàn khi cứu hộ người gặp nạn vì điện." },
        { type: 'experiment', title: 'Simulation: Phân tích dòng điện rò', link: 'https://www.hse.gov.uk/electricity/index.htm', description: "Tìm hiểu về các tiêu chuẩn an toàn điện quốc tế và các lỗi nguy hiểm thường gặp." },
        { type: 'document', title: 'Cẩm nang An toàn lao động kĩ sư điện', link: '#' }
      ],
      quiz: [
        { question: "Thiết bị bảo vệ dòng rò là?", options: ["Ampe kế", "MCB", "RCD / ELCB", "Vôn kế"], answer: 2, difficulty: 'easy' },
        { question: "Ngưỡng dòng điện gây nguy hiểm tính mạng là?", options: ["10mA", "30mA trở lên", "100A", "1A"], answer: 1, difficulty: 'medium' },
        { question: "Nối đất bảo vệ có mục đích gì?", options: ["Để tản nhiệt", "Dẫn điện rò xuống đất tránh giật người", "Tiết kiệm điện", "Đỡ tốn dây"], answer: 1, difficulty: 'easy' },
        { question: "Ký hiệu 'Ground' (Tiếp địa) chuẩn là?", options: ["Hình tam giác", "3 vạch ngang ngắn dần", "Chữ G", "Hình tròn"], answer: 1, difficulty: 'easy' },
        { question: "Cần làm gì khi thấy dây điện bị đứt rơi xuống?", options: ["Lại gần kiểm tra", "Báo cơ quan chức năng và giữ khoảng cách", "Dùng tay nhặt lên", "Đổ nước vào"], answer: 1, difficulty: 'easy' }
      ],
      iconBg: "bg-red-50",
      delay: 0.6,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F7] font-sans text-gray-900 p-4 md:p-8" id="app-container">
      <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
        
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left" id="header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">Trường ĐH Công nghiệp Việt Trì</h2>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">Khoa Điện</h1>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 shadow-sm uppercase tracking-wider italic">Hệ thống học tập chuyên sâu</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: "100%" }} 
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
               ></motion.div>
            </div>
          </motion.div>
        </header>

        <main className="flex-grow">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-2xl shadow-md border border-gray-100">
                 <Dna className="w-5 h-5 text-indigo-500 animate-spin-slow" />
              </div>
              Lộ trình Học tập Thực hành
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="topics-grid">
            {topics.map((topic, index) => (
              <TopicCard key={index} {...topic} />
            ))}
          </div>
        </main>

        <footer className="mt-20 py-12 border-t border-gray-200" id="footer">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center font-bold text-indigo-600 text-xl">K</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Sinh viên hướng dẫn</p>
                  <p className="text-2xl font-black text-gray-900">Khuất Ngọc Xuất</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 rounded-full text-white shadow-lg shadow-indigo-100">
                <span className="text-xs font-black uppercase tracking-wider">Lớp: ĐT1Đ25</span>
              </div>
            </div>
            
            <div className="space-y-2 md:text-right">
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">ĐH Công nghiệp Việt Trì</p>
              <p className="text-sm text-gray-400 max-w-[300px]">Cổng thông tin đào tạo kỹ thuật điện, cung cấp học liệu số và phòng thí nghiệm thực hành ảo cho sinh viên.</p>
              <div className="pt-4 flex gap-4 md:justify-end">
                <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"><Zap className="w-4 h-4" /></div>
                <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"><RotateCw className="w-4 h-4" /></div>
              </div>
            </div>
          </motion.div>
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center">
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">Integrated Learning Environment V2.5</p>
          </div>
        </footer>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
