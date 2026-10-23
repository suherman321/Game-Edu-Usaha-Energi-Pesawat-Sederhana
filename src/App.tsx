/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Code2,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Heart,
  FileCode,
  ExternalLink,
  Trophy,
  ArrowRight,
  Compass,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

interface QuestionItem {
  typeLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface NpcData {
  x: number;
  y: number;
  name: string;
  colorVest: string;
  introLines: string[];
  questions: QuestionItem[];
}

interface ZoneConfig {
  id: number;
  name: string;
  floorColor: string;
  board: { x: number; y: number; w: number; h: number };
  npc1: NpcData;
  npc2: NpcData;
  material: {
    title: string;
    description: string;
    formulas: { name: string; math: string; desc: string }[];
    hint: string;
  };
}

const ZONES_CONFIG: Record<number, ZoneConfig> = {
  1: {
    id: 1,
    name: "Zona 1: Konstruksi",
    floorColor: "#334155",
    board: { x: 100, y: 120, w: 80, h: 54 },
    npc1: {
      x: 420,
      y: 200,
      name: "Mandor Proyek",
      colorVest: "#f97316",
      introLines: [
        "Halo Teknisi Muda! Selamat datang di proyek konstruksi Kota Mekanika.",
        "Kami butuh bantuanmu. Ada beberapa perhitungan yang harus diselesaikan. Siap?"
      ],
      questions: [
        {
          typeLabel: "Hitungan",
          question: "Pekerja mendorong gerobak dengan gaya 200 N sejauh 5 meter. Berapa usaha yang dilakukan?",
          options: ["40 Joule", "1000 Joule", "200 Joule", "1000 Watt"],
          correctIndex: 1,
          explanation: "Usaha W = F × s = 200 N × 5 m = 1000 Joule (J)."
        },
        {
          typeLabel: "Analisis",
          question: "Seorang pekerja membawa ember berisi air sambil berjalan lurus ke depan. Mengapa usaha pada ember bernilai nol?",
          options: [
            "Karena gaya gravitasi terlalu kecil",
            "Karena arah gaya tegak lurus dengan perpindahan",
            "Karena ember sangat ringan",
            "Karena perpindahannya sangat jauh"
          ],
          correctIndex: 1,
          explanation: "Karena arah gaya angkat (ke atas) tegak lurus (90°) dengan arah perpindahan (ke depan), cos 90° = 0 sehingga Usaha = 0."
        },
        {
          typeLabel: "Penerapan",
          question: "Aktivitas manakah yang termasuk melakukan usaha dalam fisika?",
          options: [
            "Menahan beban berat tanpa bergerak",
            "Mendorong dinding beton yang tidak bergeser",
            "Mengangkat balok kayu ke atas meja",
            "Memikirkan rumus fisika saat duduk"
          ],
          correctIndex: 2,
          explanation: "Mengangkat balok ke atas meja menghasilkan gaya angkat dan perpindahan posisi balok ke atas (W = F × s)."
        }
      ]
    },
    npc2: {
      x: 680,
      y: 420,
      name: "Mesin Derek",
      colorVest: "#a855f7",
      introLines: [
        "Wah, kamu sudah sampai sini! Mesin derek ini butuh perhitungan daya yang tepat.",
        "Ayo bantu saya memastikan mesin ini bekerja dengan efisien!"
      ],
      questions: [
        {
          typeLabel: "Hitungan",
          question: "Mesin derek melakukan usaha 6000 Joule dalam waktu 10 detik. Berapa daya mesin tersebut?",
          options: ["600 Watt", "600 Joule", "60.000 Watt", "60 Watt"],
          correctIndex: 0,
          explanation: "Daya P = W / t = 6000 J / 10 s = 600 Watt (W)."
        },
        {
          typeLabel: "Analisis",
          question: "Pekerja A memindahkan 10 sak semen dalam 5 menit, Pekerja B dalam 10 menit. Siapa yang memiliki daya lebih besar?",
          options: ["Pekerja A", "Pekerja B", "Pekerja A dan B sama besar", "Tidak dapat ditentukan"],
          correctIndex: 0,
          explanation: "Pekerja A melakukan usaha yang sama dalam waktu t lebih singkat, sehingga Dayanya (P = W/t) lebih besar."
        },
        {
          typeLabel: "Penerapan",
          question: "Apa satuan Internasional (SI) untuk Daya?",
          options: ["Joule", "Newton", "Watt", "Pascal"],
          correctIndex: 2,
          explanation: "Satuan SI untuk Daya adalah Watt (W), dinamai menurut ilmuwan James Watt (1 Watt = 1 Joule/detik)."
        }
      ]
    },
    material: {
      title: "Materi Zona 1: Usaha & Daya",
      description: "Di zona konstruksi abu-abu ini, pelajari hubungan gaya, perpindahan, dan daya mekanis:",
      formulas: [
        {
          name: "1. Usaha (Work, W)",
          math: "W = F × s",
          desc: "Gaya F (N) memindahkan benda s (m). Jika tegak lurus/tidak berpindah, W = 0!"
        },
        {
          name: "2. Daya (Power, P)",
          math: "P = W / t",
          desc: "Kelajuan usaha per satuan waktu t (detik). Satuan: Watt (W)."
        }
      ],
      hint: "Dengarkan instruksi Mandor 1 lalu selesaikan kuis untuk membuka Gate 1!"
    }
  },
  2: {
    id: 2,
    name: "Zona 2: Pembangkit Listrik",
    floorColor: "#064e3b",
    board: { x: 900, y: 120, w: 80, h: 54 },
    npc1: {
      x: 1220,
      y: 200,
      name: "Teknisi Turbin",
      colorVest: "#10b981",
      introLines: [
        "Syukurlah kamu datang! Pasokan listrik kota terancam mati.",
        "Kita harus menghitung energi potensial air terjun ini agar turbin bisa menyala kembali."
      ],
      questions: [
        {
          typeLabel: "Hitungan",
          question: "Air terjun setinggi 10 m, massa 500 kg (g = 10 m/s²). Berapa energi potensialnya?",
          options: ["50.000 Joule", "5.000 Joule", "500 Joule", "50.000 Watt"],
          correctIndex: 0,
          explanation: "Energi Potensial Ep = m × g × h = 500 kg × 10 m/s² × 10 m = 50.000 Joule (J)."
        },
        {
          typeLabel: "Analisis",
          question: "Dua bola identik di rak. Bola A di rak atas, Bola B di rak tengah. Mana yang energi potensialnya lebih besar?",
          options: ["Bola A", "Bola B", "Kedua bola sama besar", "Kedua bola tidak punya energi potensial"],
          correctIndex: 0,
          explanation: "Energi potensial sebanding dengan ketinggian (Ep = m·g·h). Bola A berada di rak yang lebih tinggi."
        },
        {
          typeLabel: "Penerapan",
          question: "Faktor apa saja yang mempengaruhi besarnya energi potensial?",
          options: [
            "Massa, gravitasi, dan ketinggian",
            "Kecepatan, waktu, dan massa",
            "Gaya, perpindahan, dan bentuk",
            "Volume, warna, dan suhu"
          ],
          correctIndex: 0,
          explanation: "Berdasarkan rumus Ep = m × g × h, faktor utamanya adalah massa (m), gravitasi (g), dan tinggi (h)."
        }
      ]
    },
    npc2: {
      x: 1480,
      y: 420,
      name: "Teknisi Panel Surya",
      colorVest: "#06b6d4",
      introLines: [
        "Panel surya ini butuh pengecekan energi kinetik dan mekanik.",
        "Dengan bantuanmu, kita bisa pastikan energi kota tersimpan dengan aman. Siap?"
      ],
      questions: [
        {
          typeLabel: "Hitungan",
          question: "Mobil mainan 2 kg bergerak dengan kecepatan 4 m/s. Berapa energi kinetiknya?",
          options: ["16 Joule", "32 Joule", "8 Joule", "16 Watt"],
          correctIndex: 0,
          explanation: "Energi Kinetik Ek = ½ × m × v² = ½ × 2 kg × (4)² = 16 Joule (J)."
        },
        {
          typeLabel: "Analisis",
          question: "Jika kecepatan kendaraan dinaikkan 2 kali lipat, bagaimana pengaruhnya terhadap energi kinetiknya?",
          options: [
            "Menjadi 2 kali lipat",
            "Menjadi 4 kali lipat",
            "Menjadi setengahnya",
            "Tidak mengalami perubahan"
          ],
          correctIndex: 1,
          explanation: "Karena Ek berbanding lurus dengan v² (kuadrat kecepatan), maka (2)² = 4 kali lipat semula."
        },
        {
          typeLabel: "Penerapan",
          question: "Mengapa energi kinetik berbahaya dalam kecelakaan lalu lintas?",
          options: [
            "Karena semakin besar kecepatan, energi kinetik melonjak drastis sehingga gaya benturannya lebih besar",
            "Karena energi kinetik membuat ban mobil aus",
            "Karena energi kinetik menyebabkan mesin cepat panas",
            "Karena energi kinetik membuat mobil berubah warna"
          ],
          correctIndex: 0,
          explanation: "Lonjakan Ek secara kuadratis membutuhkan usaha pengereman dan penyerapan gaya benturan yang sangat besar saat tumbukan."
        }
      ]
    },
    material: {
      title: "Materi Zona 2: Energi Mekanik",
      description: "Di zona pembangkit listrik hijau tua ini, pelajari energi simpanan ketinggian dan energi gerak:",
      formulas: [
        {
          name: "1. Energi Potensial (Ep)",
          math: "Ep = m × g × h",
          desc: "Energi posisi karena ketinggian h (m). m = massa (kg), g = gravitasi (10 m/s²). Satuan: Joule."
        },
        {
          name: "2. Energi Kinetik (Ek)",
          math: "Ek = ½ × m × v²",
          desc: "Energi benda yang bergerak dengan kecepatan v (m/s). Satuan: Joule. Kecepatan dikuadratkan!"
        }
      ],
      hint: "Simak dialog Teknisi Turbin lalu selesaikan kuis untuk membuka Gate 2!"
    }
  },
  3: {
    id: 3,
    name: "Zona 3: Pelabuhan",
    floorColor: "#1e3a8a",
    board: { x: 1700, y: 120, w: 80, h: 54 },
    npc1: {
      x: 2020,
      y: 200,
      name: "Kepala Pelabuhan",
      colorVest: "#f43f5e",
      introLines: [
        "Akhirnya sampai juga! Pelabuhan kita sedang kacau.",
        "Peti-peti kemas ini harus dipindahkan. Kita butuh perhitungan pesawat sederhana yang tepat!"
      ],
      questions: [
        {
          typeLabel: "Hitungan",
          question: "Peti 1000 N dinaikkan ke truk setinggi 1 m menggunakan papan sepanjang 4 m. Berapa gaya dorongnya?",
          options: ["250 Newton", "1000 Newton", "4000 Newton", "250 Joule"],
          correctIndex: 0,
          explanation: "Keuntungan Mekanis KM = s / h = 4 m / 1 m = 4. Maka Gaya F = w / KM = 1000 N / 4 = 250 Newton (N)."
        },
        {
          typeLabel: "Analisis",
          question: "Semakin curam sebuah bidang miring, bagaimana pengaruhnya terhadap gaya kuasa?",
          options: [
            "Gaya kuasa makin kecil",
            "Gaya kuasa makin besar",
            "Gaya kuasa tetap sama",
            "Tidak memerlukan gaya kuasa"
          ],
          correctIndex: 1,
          explanation: "Makin curam bidang miring, panjang s mendekati h (KM makin kecil menuju 1), sehingga gaya dorong F yang diperlukan makin besar."
        },
        {
          typeLabel: "Penerapan",
          question: "Sebutkan contoh alat di pelabuhan yang menggunakan prinsip bidang miring!",
          options: [
            "Papan jalan ke kapal / tanjakan (rampway)",
            "Rantai jangkar kapal",
            "Setir kapal palka",
            "Pelampung penyelamat"
          ],
          correctIndex: 0,
          explanation: "Papan tanjakan (ramp way/gangway) menerapkan prinsip bidang miring untuk memudahkan memindahkan penumpang/barang ke atas kapal."
        }
      ]
    },
    npc2: {
      x: 2280,
      y: 420,
      name: "Operator Katrol",
      colorVest: "#eab308",
      introLines: [
        "Kamu sudah menyelesaikan bagian tersulit! Sekarang tinggal katrol ini.",
        "Ayo kita pastikan peti terakhir bisa diangkat dengan aman!"
      ],
      questions: [
        {
          typeLabel: "Hitungan",
          question: "Untuk mengangkat peti 500 N, digunakan katrol bergerak. Berapa gaya kuasa minimumnya?",
          options: ["250 Newton", "500 Newton", "1000 Newton", "250 Watt"],
          correctIndex: 0,
          explanation: "Katrol bergerak memiliki Keuntungan Mekanis KM = 2. Maka Gaya F = w / KM = 500 N / 2 = 250 Newton (N)."
        },
        {
          typeLabel: "Analisis",
          question: "Apa perbedaan utama antara katrol tetap dan katrol bergerak dalam hal keuntungan mekanis?",
          options: [
            "Katrol tetap KM=1, katrol bergerak KM=2",
            "Katrol tetap KM=2, katrol bergerak KM=1",
            "Katrol tetap KM=0, katrol bergerak tak terhingga",
            "Kedua katrol memiliki KM sama yaitu 1"
          ],
          correctIndex: 0,
          explanation: "Katrol tetap hanya mengubah arah gaya (KM=1), sedangkan katrol bergerak membagi beban ke 2 tali penopang (KM=2)."
        },
        {
          typeLabel: "Penerapan",
          question: "Sebutkan satu contoh penggunaan katrol di kehidupan sehari-hari!",
          options: [
            "Kerekan tiang bendera atau sumur timba",
            "Pisau pemotong kertas",
            "Sapu pembersih lantai",
            "Tang pencabut paku"
          ],
          correctIndex: 0,
          explanation: "Kerekan tiang bendera dan sumur timba memanfaatkan katrol tetap untuk memudahkan memindahkan beban."
        }
      ]
    },
    material: {
      title: "Materi Zona 3: Pesawat Sederhana",
      description: "Di zona pelabuhan biru tua ini, pelajari alat pengganda gaya untuk mengangkat barang kargo:",
      formulas: [
        {
          name: "1. Tuas & Katrol",
          math: "KM = Lk / Lb = w / F",
          desc: "Katrol tetap KM = 1, Katrol bergerak KM = 2."
        },
        {
          name: "2. Bidang Miring",
          math: "KM = s / h = w / F",
          desc: "s = panjang bidang miring, h = tinggi tempat."
        }
      ],
      hint: "Bicara dengan Kepala Pelabuhan lalu jawab kuis untuk menamatkan Game!"
    }
  }
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stats
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('rpg_open_world_score_v4');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lives, setLives] = useState<number>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Zone Progress States
  const [z1Read, setZ1Read] = useState<boolean>(false);
  const [z1Npc1, setZ1Npc1] = useState<boolean>(false);
  const [z1Npc2, setZ1Npc2] = useState<boolean>(false);

  const [z2Read, setZ2Read] = useState<boolean>(false);
  const [z2Npc1, setZ2Npc1] = useState<boolean>(false);
  const [z2Npc2, setZ2Npc2] = useState<boolean>(false);

  const [z3Read, setZ3Read] = useState<boolean>(false);
  const [z3Npc1, setZ3Npc1] = useState<boolean>(false);
  const [z3Npc2, setZ3Npc2] = useState<boolean>(false);

  const [gateToastMsg, setGateToastMsg] = useState<string | null>(null);

  // Dialog State Machine
  const [activeZone, setActiveZone] = useState<number>(1);
  const [showMaterialModal, setShowMaterialModal] = useState<boolean>(false);
  const [showQuizDialog, setShowQuizDialog] = useState<boolean>(false);
  const [activeNpcNum, setActiveNpcNum] = useState<1 | 2>(1);

  // 'intro' (Conversation Mode) vs 'quiz' (Question Mode)
  const [dialogPhase, setDialogPhase] = useState<'intro' | 'quiz'>('intro');
  const [introLineIndex, setIntroLineIndex] = useState<number>(0);
  const [currentQStep, setCurrentQStep] = useState<number>(0);

  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnsSubmitted, setIsAnsSubmitted] = useState<boolean>(false);
  const [endModal, setEndModal] = useState<boolean>(false);
  const [isGameWin, setIsGameWin] = useState<boolean>(false);

  // Code Inspector Modal
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [fullCodeString, setFullCodeString] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const gameStateRef = useRef({
    worldWidth: 2400,
    worldHeight: 600,
    zone1MaxX: 800,
    zone2MaxX: 1600,
    camera: { x: 0, y: 0, width: 800, height: 500 },
    player: {
      x: 180,
      y: 300,
      radius: 16,
      speed: 3.8,
      direction: 'down',
      isMoving: false,
      stepCount: 0,
      colorShirt: '#2563eb',
      colorSkin: '#fed7aa',
      colorCap: '#dc2626'
    },
    keys: { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false },
    isPaused: false
  });

  const playSound = (type: 'correct' | 'wrong' | 'step' | 'open' | 'blocked') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'wrong' || type === 'blocked') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'step') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {}
  };

  useEffect(() => {
    fetch('/game-edukasi-rpg.html')
      .then((res) => res.text())
      .then((text) => setFullCodeString(text))
      .catch(() => {});
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      const keys = gameStateRef.current.keys;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.ArrowUp = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.ArrowDown = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.ArrowLeft = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.ArrowRight = true;

      if (e.code === 'Space' || e.code === 'Enter') {
        handleSpaceAction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = gameStateRef.current.keys;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.ArrowUp = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.ArrowDown = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.ArrowLeft = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.ArrowRight = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [showMaterialModal, showQuizDialog, dialogPhase, introLineIndex, isAnsSubmitted, currentQStep, z1Npc1, z1Npc2, z2Npc1, z2Npc2, z3Npc1, z3Npc2]);

  // Space Action Logic
  const handleSpaceAction = () => {
    if (showMaterialModal) {
      setShowMaterialModal(false);
      gameStateRef.current.isPaused = false;
      return;
    }

    if (showQuizDialog) {
      if (dialogPhase === 'intro') {
        const npcData = activeNpcNum === 1 ? ZONES_CONFIG[activeZone].npc1 : ZONES_CONFIG[activeZone].npc2;
        if (introLineIndex + 1 < npcData.introLines.length) {
          playSound('open');
          setIntroLineIndex((prev) => prev + 1);
        } else {
          // Transition from intro conversation to quiz mode!
          setDialogPhase('quiz');
          setCurrentQStep(0);
          setSelectedOpt(null);
          setIsAnsSubmitted(false);
        }
      } else if (dialogPhase === 'quiz' && isAnsSubmitted) {
        handleContinueQuiz();
      }
      return;
    }

    if (gameStateRef.current.isPaused) return;

    const { player } = gameStateRef.current;

    for (let z = 1; z <= 3; z++) {
      const zd = ZONES_CONFIG[z];

      const distBoard = Math.hypot(player.x - (zd.board.x + zd.board.w / 2), player.y - (zd.board.y + zd.board.h / 2));
      if (distBoard < 75) {
        gameStateRef.current.isPaused = true;
        setActiveZone(z);
        setShowMaterialModal(true);
        if (z === 1) setZ1Read(true);
        else if (z === 2) setZ2Read(true);
        else setZ3Read(true);
        playSound('open');
        return;
      }

      const distN1 = Math.hypot(player.x - zd.npc1.x, player.y - zd.npc1.y);
      const isN1Done = z === 1 ? z1Npc1 : z === 2 ? z2Npc1 : z3Npc1;
      if (distN1 < 75 && !isN1Done) {
        gameStateRef.current.isPaused = true;
        setActiveZone(z);
        setActiveNpcNum(1);
        setDialogPhase('intro');
        setIntroLineIndex(0);
        setShowQuizDialog(true);
        setIsAnsSubmitted(false);
        setSelectedOpt(null);
        playSound('open');
        return;
      }

      const distN2 = Math.hypot(player.x - zd.npc2.x, player.y - zd.npc2.y);
      const isN2Done = z === 1 ? z1Npc2 : z === 2 ? z2Npc2 : z3Npc2;
      if (isN1Done && distN2 < 75 && !isN2Done) {
        gameStateRef.current.isPaused = true;
        setActiveZone(z);
        setActiveNpcNum(2);
        setDialogPhase('intro');
        setIntroLineIndex(0);
        setShowQuizDialog(true);
        setIsAnsSubmitted(false);
        setSelectedOpt(null);
        playSound('open');
        return;
      }
    }
  };

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let animTimer = 0;

    const render = () => {
      animTimer += 0.04;
      const state = gameStateRef.current;
      const { player, camera, keys, zone1MaxX, zone2MaxX, worldWidth, worldHeight } = state;

      if (!state.isPaused) {
        let dx = 0; let dy = 0;
        if (keys.ArrowUp) { dy -= 1; player.direction = 'up'; }
        if (keys.ArrowDown) { dy += 1; player.direction = 'down'; }
        if (keys.ArrowLeft) { dx -= 1; player.direction = 'left'; }
        if (keys.ArrowRight) { dx += 1; player.direction = 'right'; }

        if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

        if (dx !== 0 || dy !== 0) {
          player.x += dx * player.speed;
          player.y += dy * player.speed;
          player.isMoving = true;
          player.stepCount++;
          if (player.stepCount % 18 === 0) playSound('step');
        } else {
          player.isMoving = false; player.stepCount = 0;
        }

        player.x = Math.max(player.radius + 10, Math.min(worldWidth - player.radius - 10, player.x));
        player.y = Math.max(player.radius + 35, Math.min(worldHeight - player.radius - 18, player.y));

        if (player.x > zone1MaxX - 25 && player.x < zone1MaxX + 25 && !z1Npc2) {
          player.x = zone1MaxX - 25;
          setGateToastMsg("🔒 Gate 1 Terkunci! Selesaikan tugas Mesin Derek di Zona 1 dulu!");
          playSound('blocked');
          setTimeout(() => setGateToastMsg(null), 2500);
        }

        if (player.x > zone2MaxX - 25 && player.x < zone2MaxX + 25 && !z2Npc2) {
          player.x = zone2MaxX - 25;
          setGateToastMsg("🔒 Gate 2 Terkunci! Selesaikan tugas Panel Surya di Zona 2 dulu!");
          playSound('blocked');
          setTimeout(() => setGateToastMsg(null), 2500);
        }

        camera.x = Math.max(0, Math.min(worldWidth - camera.width, player.x - camera.width / 2));
        camera.y = Math.max(0, Math.min(worldHeight - camera.height, player.y - camera.height / 2));
      }

      ctx.clearRect(0, 0, 800, 500);
      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // Floors
      ctx.fillStyle = ZONES_CONFIG[1].floorColor; ctx.fillRect(0, 0, 800, worldHeight);
      ctx.fillStyle = ZONES_CONFIG[2].floorColor; ctx.fillRect(800, 0, 800, worldHeight);
      ctx.fillStyle = ZONES_CONFIG[3].floorColor; ctx.fillRect(1600, 0, 800, worldHeight);

      // Road
      ctx.fillStyle = '#1e293b'; ctx.fillRect(50, 260, 2300, 80);
      ctx.fillStyle = '#334155'; ctx.fillRect(54, 264, 2292, 72);
      ctx.fillStyle = '#facc15';
      for (let x = 70; x < 2320; x += 40) ctx.fillRect(x, 298, 20, 4);

      // Gates
      const drawGateBarrier = (gx: number, isUnlocked: boolean, label: string) => {
        ctx.fillStyle = '#0f172a'; ctx.fillRect(gx - 10, 80, 20, 440);
        ctx.fillStyle = isUnlocked ? '#10b981' : '#ef4444'; ctx.fillRect(gx - 6, 84, 12, 432);

        ctx.fillStyle = '#1e293b'; ctx.fillRect(gx - 45, 90, 90, 30);
        ctx.strokeStyle = isUnlocked ? '#10b981' : '#ef4444'; ctx.lineWidth = 2; ctx.strokeRect(gx - 45, 90, 90, 30);

        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(label, gx, 108);

        if (!isUnlocked) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.45)'; ctx.fillRect(gx - 8, 120, 16, 390);
          ctx.fillStyle = '#dc2626';
          for (let y = 140; y < 500; y += 30) ctx.fillRect(gx - 12, y, 24, 6);
          ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(gx, 300, 16, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.font = '14px sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText('🔒', gx, 300);
        } else {
          ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(gx, 300, 14, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText('OPEN', gx, 300);
        }
        ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
      };

      drawGateBarrier(zone1MaxX, z1Npc2, "GATE 1");
      drawGateBarrier(zone2MaxX, z2Npc2, "GATE 2");

      // Whiteboards
      for (let z = 1; z <= 3; z++) {
        const board = ZONES_CONFIG[z].board;
        const isRead = z === 1 ? z1Read : z === 2 ? z2Read : z3Read;

        ctx.fillStyle = '#78350f'; ctx.fillRect(board.x - 3, board.y - 3, board.w + 6, board.h + 6);
        ctx.fillStyle = '#064e3b'; ctx.fillRect(board.x, board.y, board.w, board.h);

        ctx.fillStyle = '#34d399'; ctx.font = 'bold 9px sans-serif'; ctx.fillText(`RUANG BACA Z${z}`, board.x + 5, board.y + 14);
        ctx.fillStyle = '#fef08a'; ctx.font = '8px monospace';
        if (z === 1) { ctx.fillText("W = F × s", board.x + 5, board.y + 28); ctx.fillText("P = W / t", board.x + 5, board.y + 42); }
        else if (z === 2) { ctx.fillText("Ep = m·g·h", board.x + 5, board.y + 28); ctx.fillText("Ek = ½·m·v²", board.x + 5, board.y + 42); }
        else { ctx.fillText("KM = Lk/Lb", board.x + 5, board.y + 28); ctx.fillText("KM = s / h", board.x + 5, board.y + 42); }

        const bounce = Math.sin(animTimer * 2.5 + z) * 4;
        const ix = board.x + board.w / 2; const iy = board.y - 15 + bounce;

        ctx.fillStyle = isRead ? '#0284c7' : '#eab308'; ctx.beginPath(); ctx.arc(ix, iy, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(isRead ? '✔' : '📖', ix, iy);
        ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
      }

      // NPCs
      const drawNpcEntity = (npcData: NpcData, npcNum: 1 | 2, isCompleted: boolean, isUnlocked: boolean) => {
        const nx = npcData.x; const ny = npcData.y;
        if (!isUnlocked) {
          ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(nx, ny + 15, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(30, 41, 59, 0.75)'; ctx.beginPath(); ctx.arc(nx, ny - 10, 16, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('🔒', nx, ny - 9); ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
          return;
        }

        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(nx, ny + 17, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1e3a5f'; ctx.fillRect(nx - 8, ny + 7, 6, 10); ctx.fillRect(nx + 2, ny + 7, 6, 10);
        ctx.fillStyle = '#451a03'; ctx.fillRect(nx - 9, ny + 15, 8, 4); ctx.fillRect(nx + 1, ny + 15, 8, 4);

        ctx.fillStyle = npcData.colorVest || '#f97316';
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(nx - 11, ny - 5, 22, 16, 3); ctx.fill(); }
        else { ctx.fillRect(nx - 11, ny - 5, 22, 16); }

        ctx.fillStyle = '#e2e8f0'; ctx.fillRect(nx - 9, ny - 2, 4, 12); ctx.fillRect(nx + 5, ny - 2, 4, 12);

        ctx.fillStyle = '#fed7aa'; ctx.beginPath(); ctx.arc(nx, ny - 14, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(nx - 4, ny - 14, 1.8, 0, Math.PI * 2); ctx.arc(nx + 4, ny - 14, 1.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(nx, ny - 18, 11, Math.PI, Math.PI * 2); ctx.fill(); ctx.fillRect(nx - 14, ny - 18, 28, 4);

        const bounce = Math.sin(animTimer * 2.2 + npcNum) * 4;
        const exX = nx; const exY = ny - 42 + bounce;

        if (!isCompleted) {
          ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(exX, exY + 5, 10, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#facc15'; ctx.lineWidth = 1.6; ctx.stroke();
          ctx.fillStyle = '#facc15'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('!', exX, exY + 5);
        } else {
          ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(exX, exY + 5, 10, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('✔', exX, exY + 5);
        }
        ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
      };

      drawNpcEntity(ZONES_CONFIG[1].npc1, 1, z1Npc1, true);
      drawNpcEntity(ZONES_CONFIG[1].npc2, 2, z1Npc2, z1Npc1);

      drawNpcEntity(ZONES_CONFIG[2].npc1, 1, z2Npc1, true);
      drawNpcEntity(ZONES_CONFIG[2].npc2, 2, z2Npc2, z2Npc1);

      drawNpcEntity(ZONES_CONFIG[3].npc1, 1, z3Npc1, true);
      drawNpcEntity(ZONES_CONFIG[3].npc2, 2, z3Npc2, z3Npc1);

      // Player
      const px = player.x; const py = player.y;
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(px, py + 16, 14, 6, 0, 0, Math.PI * 2); ctx.fill();

      const legOffset = player.isMoving ? Math.sin(player.stepCount * 0.25) * 4 : 0;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(px - 7, py + 6 + legOffset, 5, 10); ctx.fillRect(px + 2, py + 6 - legOffset, 5, 10);
      ctx.fillStyle = '#713f12'; ctx.fillRect(px - 8, py + 14 + legOffset, 7, 4); ctx.fillRect(px + 1, py + 14 - legOffset, 7, 4);

      ctx.fillStyle = player.colorShirt;
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(px - 9, py - 4, 18, 14, 3); ctx.fill(); }
      else { ctx.fillRect(px - 9, py - 4, 18, 14); }

      ctx.fillStyle = player.colorSkin; ctx.beginPath(); ctx.arc(px, py - 12, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = player.colorCap; ctx.beginPath(); ctx.arc(px, py - 16, 9.5, Math.PI, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#b91c1c';
      if (player.direction === 'right') ctx.fillRect(px - 2, py - 16, 14, 3);
      else if (player.direction === 'left') ctx.fillRect(px - 12, py - 16, 14, 3);
      else ctx.fillRect(px - 10, py - 16, 20, 3);

      ctx.fillStyle = '#0f172a';
      if (player.direction === 'left') { ctx.beginPath(); ctx.arc(px - 6, py - 12, 1.8, 0, Math.PI * 2); ctx.fill(); }
      else if (player.direction === 'right') { ctx.beginPath(); ctx.arc(px + 6, py - 12, 1.8, 0, Math.PI * 2); ctx.fill(); }
      else if (player.direction === 'up') { ctx.fillStyle = '#451a03'; ctx.beginPath(); ctx.arc(px, py - 11, 8, 0, Math.PI); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(px - 3.5, py - 12, 1.8, 0, Math.PI * 2); ctx.arc(px + 3.5, py - 12, 1.8, 0, Math.PI * 2); ctx.fill(); }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [soundEnabled, z1Npc2, z2Npc2, z1Npc1, z2Npc1, z3Npc1, z3Npc2, z1Read, z2Read, z3Read]);

  // Active NPC & Question Data
  const activeNpcData = activeNpcNum === 1 ? ZONES_CONFIG[activeZone].npc1 : ZONES_CONFIG[activeZone].npc2;
  const currentQData = activeNpcData.questions[currentQStep];

  const handleAnswerSubmit = (idx: number) => {
    if (isAnsSubmitted) return;
    setSelectedOpt(idx);
    setIsAnsSubmitted(true);

    if (idx === currentQData.correctIndex) {
      playSound('correct');
      const newScore = score + 50;
      setScore(newScore);
      localStorage.setItem('rpg_open_world_score_v4', newScore.toString());
    } else {
      playSound('wrong');
      const newLives = lives - 1;
      setLives(newLives);
    }
  };

  const handleContinueQuiz = () => {
    if (lives <= 0) {
      setShowQuizDialog(false);
      gameStateRef.current.isPaused = true;
      setIsGameWin(false);
      setEndModal(true);
      return;
    }

    if (currentQStep < 2) {
      setCurrentQStep((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnsSubmitted(false);
    } else {
      setShowQuizDialog(false);

      if (activeZone === 1) {
        if (activeNpcNum === 1) setZ1Npc1(true);
        else setZ1Npc2(true);
      } else if (activeZone === 2) {
        if (activeNpcNum === 1) setZ2Npc1(true);
        else setZ2Npc2(true);
      } else {
        if (activeNpcNum === 1) setZ3Npc1(true);
        else setZ3Npc2(true);
      }

      if (activeZone === 3 && activeNpcNum === 2) {
        gameStateRef.current.isPaused = true;
        setIsGameWin(true);
        setEndModal(true);
      } else {
        gameStateRef.current.isPaused = false;
      }
    }
  };

  const handleRestartOpenWorld = () => {
    setEndModal(false);
    setLives(3);
    setScore(0);
    localStorage.setItem('rpg_open_world_score_v4', '0');

    setZ1Read(false); setZ1Npc1(false); setZ1Npc2(false);
    setZ2Read(false); setZ2Npc1(false); setZ2Npc2(false);
    setZ3Read(false); setZ3Npc1(false); setZ3Npc2(false);

    gameStateRef.current.player.x = 180;
    gameStateRef.current.player.y = 300;
    gameStateRef.current.isPaused = false;
  };

  const handleVirtualKey = (key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight', isPressed: boolean) => {
    gameStateRef.current.keys[key] = isPressed;
  };

  const handleDownloadSingleFile = () => {
    const link = document.createElement('a');
    link.href = '/game-edukasi-rpg.html';
    link.download = 'game-edukasi-rpg.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = async () => {
    try {
      const response = await fetch('/game-edukasi-rpg.html');
      const code = await response.text();
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {}
  };

  const px = gameStateRef.current.player.x;
  let currentZoneId = 1;
  if (px >= 1600) currentZoneId = 3;
  else if (px >= 800) currentZoneId = 2;

  const getMissionText = () => {
    if (currentZoneId === 1) {
      if (!z1Read) return "Tugas: Pelajari Papan Tulis di Zona Konstruksi (Kiri)";
      if (!z1Npc1) return "Tugas: Temui Mandor Proyek (Bicara & Jawab 3 Soal)";
      if (!z1Npc2) return "Tugas: Temui Mesin Derek (Bicara & Jawab 3 Soal untuk Buka Gate 1)";
      return "Tugas: Gate 1 Terbuka! Berjalanlah ke Kanan menuju Zona 2 →";
    } else if (currentZoneId === 2) {
      if (!z2Read) return "Tugas: Pelajari Papan Tulis di Zona Pembangkit Listrik";
      if (!z2Npc1) return "Tugas: Temui Teknisi Turbin (Bicara & Jawab 3 Soal)";
      if (!z2Npc2) return "Tugas: Temui Teknisi Panel Surya (Bicara & Jawab 3 Soal untuk Buka Gate 2)";
      return "Tugas: Gate 2 Terbuka! Berjalanlah ke Kanan menuju Zona 3 →";
    } else {
      if (!z3Read) return "Tugas: Pelajari Papan Tulis di Zona Pelabuhan";
      if (!z3Npc1) return "Tugas: Temui Kepala Pelabuhan (Bicara & Jawab 3 Soal)";
      if (!z3Npc2) return "Tugas: Temui Operator Katrol (Bicara & Jawab 3 Soal Terakhir)";
      return "Tugas: SELAMAT! Seluruh Misi Open World Berhasil Tamat!";
    }
  };

  const activeZoneConfig = ZONES_CONFIG[activeZone];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-3 select-none">
      
      {/* Top Bar Header */}
      <header className="w-full max-w-[800px] flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-amber-400 leading-tight">
                Open World Fisika RPG (Mode Percakapan)
              </h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded text-white ${
                currentZoneId === 1 ? 'bg-slate-600' : currentZoneId === 2 ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
                {ZONES_CONFIG[currentZoneId].name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Percakapan Sapaan Bertahap &bull; 3 Soal per NPC &bull; Single-File HTML
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 transition text-slate-300"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setShowCodeModal(true)}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-md transition font-medium text-slate-200"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Lihat Kode</span>
          </button>

          <button
            onClick={handleDownloadSingleFile}
            className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-md shadow-md shadow-amber-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh .HTML</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Viewport 800x500 */}
      <div className="relative w-full max-w-[800px] aspect-[800/500] rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-black">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full block bg-slate-950 select-none cursor-default"
        />

        {/* HUD Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-sm border border-slate-700/80 rounded-lg px-2.5 py-1.5 shadow-lg">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Nyawa:</span>
              <div className="flex gap-0.5 ml-1">
                {[1, 2, 3].map((val) => (
                  <span key={val} className={`text-sm ${val <= lives ? 'opacity-100' : 'opacity-20'}`}>
                    ❤️
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-sm border border-slate-700/80 rounded-lg px-2.5 py-1.5 shadow-lg">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400 font-medium">Skor:</span>
              <span className="text-sm font-bold text-amber-400 font-mono tabular-nums">
                {score}
              </span>
            </div>
          </div>

          <div className="bg-slate-950/90 backdrop-blur-sm border-2 border-amber-500/80 rounded-lg px-3 py-1.5 shadow-xl flex items-center gap-2 max-w-[440px]">
            <Compass className="w-4 h-4 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-bold text-amber-200">
              {getMissionText()}
            </span>
          </div>
        </div>

        {/* GATE LOCKED TOAST ALERT */}
        {gateToastMsg && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-rose-600/95 border-2 border-rose-300 text-white font-black text-xs px-4 py-2 rounded-xl shadow-2xl z-30 animate-bounce flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{gateToastMsg}</span>
          </div>
        )}

        {/* MATERIAL DIALOG (PAPAN TULIS) */}
        {showMaterialModal && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-sky-400 w-full max-w-xl rounded-xl p-5 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-sky-500/30">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>{activeZoneConfig.material.title}</span>
                </div>
                <span className="text-[11px] text-slate-400">{activeZoneConfig.name}</span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {activeZoneConfig.material.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {activeZoneConfig.material.formulas.map((item, i) => (
                  <div key={i} className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
                    <div className="text-xs font-bold text-amber-400 mb-1">{item.name}</div>
                    <div className="font-mono text-sm font-bold text-emerald-400 bg-slate-900 px-2 py-1 rounded inline-block mb-1 border border-slate-800">
                      {item.math}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded text-xs text-amber-300 mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{activeZoneConfig.material.hint}</span>
              </div>

              <button
                onClick={() => {
                  setShowMaterialModal(false);
                  gameStateRef.current.isPaused = false;
                }}
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg shadow transition"
              >
                Tutup Materi (Lanjut Eksplorasi)
              </button>
            </div>
          </div>
        )}

        {/* DIALOG MAIN CONTAINER: CONVERSATION INTRO PHASE -> QUIZ PHASE */}
        {showQuizDialog && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-[760px] bg-slate-900/95 border-2 border-amber-500/80 rounded-xl p-4 shadow-2xl backdrop-blur-md z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">👷‍♂️</span>
                <span className="font-bold text-amber-400 text-sm">{activeNpcData.name}</span>
              </div>

              {dialogPhase === 'intro' ? (
                <div className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full shadow border border-blue-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Percakapan NPC</span>
                </div>
              ) : (
                <div className="text-xs font-bold text-white bg-emerald-600 px-3 py-1 rounded-full shadow border border-emerald-400">
                  Soal {currentQStep + 1} dari 3 ({currentQData.typeLabel})
                </div>
              )}
            </div>

            {/* MODE DIALOG INTRO SAPAAN BERTAHAP */}
            {dialogPhase === 'intro' ? (
              <div className="py-2">
                <p className="text-sm sm:text-base font-semibold text-white leading-relaxed mb-4 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  "{activeNpcData.introLines[introLineIndex]}"
                </p>
                <div
                  onClick={handleSpaceAction}
                  className="text-right text-xs font-bold text-amber-400 animate-pulse cursor-pointer hover:underline flex items-center justify-end gap-1"
                >
                  <span>💬 Lanjut [Tekan Spasi atau Klik]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              /* MODE KUIS SOAL A-D */
              <div>
                <p className="text-sm font-semibold text-white mb-3 leading-relaxed">
                  {currentQData.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {currentQData.options.map((opt, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedOpt === idx;
                    const isCorrect = idx === currentQData.correctIndex;

                    let btnStyle = "bg-slate-800/90 border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-slate-200";
                    if (isAnsSubmitted) {
                      if (isCorrect) btnStyle = "bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold";
                      else if (isSelected && !isCorrect) btnStyle = "bg-rose-950/90 border-rose-500 text-rose-200";
                      else btnStyle = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnsSubmitted}
                        onClick={() => handleAnswerSubmit(idx)}
                        className={`flex items-center gap-2.5 p-2.5 text-left rounded-lg border text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
                          {letters[idx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isAnsSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {isAnsSubmitted && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed border flex items-start gap-2 ${
                    selectedOpt === currentQData.correctIndex
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                  }`}>
                    <div className="mt-0.5 shrink-0">
                      {selectedOpt === currentQData.correctIndex ? (
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm mb-0.5">
                        {selectedOpt === currentQData.correctIndex ? 'Jawaban Benar! (+50 Skor)' : 'Kurang Tepat! (Nyawa -1)'}
                      </div>
                      <div className="text-slate-300">
                        {selectedOpt !== currentQData.correctIndex && (
                          <span className="font-semibold text-amber-300 block mb-1">
                            Kunci: {currentQData.options[currentQData.correctIndex]}
                          </span>
                        )}
                        {currentQData.explanation}
                      </div>
                    </div>
                    <button
                      onClick={handleContinueQuiz}
                      className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs shadow transition flex items-center gap-1 self-end"
                    >
                      <span>
                        {lives <= 0
                          ? 'Lihat Hasil'
                          : currentQStep < 2
                          ? `Lanjut Soal ${currentQStep + 2} [Spasi]`
                          : 'Selesaikan NPC Ini [Spasi]'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GAME OVER / TAMAT MODAL */}
        {endModal && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-3xl shadow-lg border border-slate-700 bg-slate-900">
              {isGameWin ? '🏆' : '💀'}
            </div>
            <h2 className={`text-2xl font-black mb-1 ${isGameWin ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isGameWin ? 'SELAMAT! OPEN WORLD FISIKA TAMAT!' : 'Permainan Berakhir!'}
            </h2>
            <p className="text-sm text-slate-400 max-w-md mb-4 leading-relaxed">
              {isGameWin
                ? 'Luar biasa! Kamu berhasil mendengarkan semua motivasi NPC dan menyelesaikan 18 Soal Fisika di seluruh Zona!'
                : 'Nyawamu habis! Pelajari materi di papan tulis di setiap zona untuk memahami rumus Usaha, Daya, Energi, dan Pesawat Sederhana.'}
            </p>
            <div className="bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-lg mb-5 flex items-center gap-3">
              <span className="text-xs text-slate-400">Total Skor Open World:</span>
              <span className="text-xl font-bold font-mono text-amber-400">{score}</span>
            </div>
            <button
              onClick={handleRestartOpenWorld}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-amber-500/25 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Ulang dari Awal</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile D-Pad */}
      <div className="w-full max-w-[800px] mt-2 flex items-center justify-between px-2 text-xs text-slate-400">
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-slate-300">WASD / Panah</span>
            <span>Jelajah Open World</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-slate-300">Spasi / Enter</span>
            <span>Dialog Percakapan &amp; Kuis</span>
          </div>
        </div>

        <div className="flex sm:hidden items-center justify-between w-full">
          <div className="grid grid-cols-3 gap-1 w-32">
            <div></div>
            <button
              onMouseDown={() => handleVirtualKey('ArrowUp', true)}
              onMouseUp={() => handleVirtualKey('ArrowUp', false)}
              onTouchStart={() => handleVirtualKey('ArrowUp', true)}
              onTouchEnd={() => handleVirtualKey('ArrowUp', false)}
              className="bg-slate-800 active:bg-amber-500 active:text-slate-950 p-2 rounded text-center font-bold"
            >
              ▲
            </button>
            <div></div>
            <button
              onMouseDown={() => handleVirtualKey('ArrowLeft', true)}
              onMouseUp={() => handleVirtualKey('ArrowLeft', false)}
              onTouchStart={() => handleVirtualKey('ArrowLeft', true)}
              onTouchEnd={() => handleVirtualKey('ArrowLeft', false)}
              className="bg-slate-800 active:bg-amber-500 active:text-slate-950 p-2 rounded text-center font-bold"
            >
              ◀
            </button>
            <button
              onMouseDown={() => handleVirtualKey('ArrowDown', true)}
              onMouseUp={() => handleVirtualKey('ArrowDown', false)}
              onTouchStart={() => handleVirtualKey('ArrowDown', true)}
              onTouchEnd={() => handleVirtualKey('ArrowDown', false)}
              className="bg-slate-800 active:bg-amber-500 active:text-slate-950 p-2 rounded text-center font-bold"
            >
              ▼
            </button>
            <button
              onMouseDown={() => handleVirtualKey('ArrowRight', true)}
              onMouseUp={() => handleVirtualKey('ArrowRight', false)}
              onTouchStart={() => handleVirtualKey('ArrowRight', true)}
              onTouchEnd={() => handleVirtualKey('ArrowRight', false)}
              className="bg-slate-800 active:bg-amber-500 active:text-slate-950 p-2 rounded text-center font-bold"
            >
              ▶
            </button>
          </div>

          <button
            onClick={handleSpaceAction}
            className="bg-amber-500 active:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg text-sm"
          >
            💬 Aksi / Spasi
          </button>
        </div>

        <div className="hidden sm:block text-slate-500 text-[11px]">
          100% Offline Single-File HTML5 Canvas
        </div>
      </div>

      {/* Code Inspector Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-200">
                  Source Code Open World Single-File (game-edukasi-rpg.html)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
                <button
                  onClick={handleDownloadSingleFile}
                  className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh .HTML</span>
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="text-slate-400 hover:text-white px-2 py-1 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 text-xs text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                File ini memuat sistem percakapan sapaan bertahap sebelum soal, 18 soal kuis, dan peta open world 2400x600 dalam 1 file HTML murni.
              </span>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed max-h-[60vh]">
              <pre className="select-text whitespace-pre overflow-x-auto text-[11px] text-amber-200/90">
                {fullCodeString || "Memuat berkas kode..."}
              </pre>
            </div>

            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>Path: <code>/public/game-edukasi-rpg.html</code></span>
              <a
                href="/game-edukasi-rpg.html"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Buka langsung di tab baru</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
