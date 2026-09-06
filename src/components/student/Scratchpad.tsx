import React, { useRef, useState, useEffect } from 'react';
import { Edit3, Eraser, Trash2, Grid, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface ScratchpadProps {
  onClose?: () => void;
  className?: string;
}

export const Scratchpad: React.FC<ScratchpadProps> = ({ onClose, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#2563eb'); // blue
  const [penSize, setPenSize] = useState(3);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    soundEffects.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const colors = [
    { name: '파랑', color: '#2563eb' },
    { name: '빨강', color: '#dc2626' },
    { name: '초록', color: '#16a34a' },
    { name: '검정', color: '#1e293b' },
  ];

  return (
    <div className={`bg-[#0A0A0A] rounded-2xl border border-[#222222] shadow-md flex flex-col overflow-hidden ${className}`}>
      {/* Scratchpad Toolbar */}
      <div className="bg-[#121212] px-3 py-2 border-b border-[#1F1F1F] flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#E0E0E0]">
          <Edit3 className="w-4 h-4 text-[#D4AF37]" />
          <span>계산 연습장</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Pen Tool */}
          <button
            type="button"
            onClick={() => {
              setTool('pen');
              soundEffects.playClick();
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              tool === 'pen' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#181818] text-[#CCCCCC] border-[#2A2A2A]'
            }`}
            title="펜"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Color palette */}
          {tool === 'pen' && (
            <div className="flex items-center gap-1">
              {colors.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setPenColor(c.color)}
                  className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                    penColor === c.color ? 'scale-125 border-white ring-1 ring-[#D4AF37]' : 'border-[#333333]'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {/* Eraser Tool */}
          <button
            type="button"
            onClick={() => {
              setTool('eraser');
              soundEffects.playClick();
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              tool === 'eraser' ? 'bg-[#F6D860] text-black border-[#F6D860]' : 'bg-[#181818] text-[#CCCCCC] border-[#2A2A2A]'
            }`}
            title="지우개"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowGrid(!showGrid);
              soundEffects.playClick();
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              showGrid ? 'bg-[#D4AF37]/20 text-[#F6D860] border-[#D4AF37]/40' : 'bg-[#181818] text-[#666666] border-[#2A2A2A]'
            }`}
            title="세로셈 모눈 격자 토글"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#2A1215] text-[#CCCCCC] hover:text-[#FB7185] border border-[#2A2A2A] transition-colors cursor-pointer"
            title="전체 지우기"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className={`relative flex-1 min-h-[160px] sm:min-h-[220px] cursor-crosshair ${
          showGrid
            ? 'bg-[#080808] bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:20px_20px]'
            : 'bg-[#080808]'
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full touch-none"
        />
        <div className="absolute bottom-1 right-2 text-[10px] text-[#444444] pointer-events-none select-none">
          자유롭게 세로셈 필기
        </div>
      </div>
    </div>
  );
};
