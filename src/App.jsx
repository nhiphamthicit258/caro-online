import React, { useState, useEffect } from "react";
import { checkWinner, getBestMove, BOARD_SIZE } from "./gameLogic";

// --- PHẦN ICON (ĐÃ CHỈNH TO VÀ ĐẬM) ---
const IconX = () => (
  <svg
    className="w-full h-full text-blue-600 drop-shadow-sm"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4" // Nét đậm
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconO = () => (
  <svg
    className="w-full h-full text-red-600 drop-shadow-sm"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4" // Nét đậm
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

// --- COMPONENT CHÍNH ---
const App = () => {
  // State quản lý màn hình và game
  const [screen, setScreen] = useState("home"); // 'home' | 'game'
  const [mode, setMode] = useState("pvc"); // 'pvc': Máy | 'pvp': Bạn
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);

  // Hàm reset game
  const resetGame = () => {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setIsXNext(true);
    setWinnerInfo(null);
  };

  // Hàm quay về trang chủ
  const goHome = () => {
    resetGame();
    setScreen("home");
  };

  // Xử lý khi click vào ô
  const handleSquareClick = (index) => {
    // Nếu ô đã đánh hoặc đã có người thắng thì chặn
    if (board[index] || winnerInfo) return;

    // Nếu đang chơi với máy mà tới lượt máy thì chặn người click
    if (mode === "pvc" && !isXNext) return;

    // Logic đánh cờ
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);

    // Kiểm tra thắng
    const win = checkWinner(newBoard);
    if (win) {
      setWinnerInfo(win);
    } else {
      setIsXNext(!isXNext);
    }
  };

  // AI Logic (Tự động đánh)
  useEffect(() => {
    if (mode === "pvc" && !isXNext && !winnerInfo) {
      const timer = setTimeout(() => {
        const aiMoveIndex = getBestMove(board);
        if (aiMoveIndex !== -1) {
          const newBoard = [...board];
          newBoard[aiMoveIndex] = "O";
          setBoard(newBoard);

          const win = checkWinner(newBoard);
          if (win) {
            setWinnerInfo(win);
          } else {
            setIsXNext(true);
          }
        }
      }, 200); // Delay 200ms cho phản ứng nhanh
      return () => clearTimeout(timer);
    }
  }, [isXNext, mode, winnerInfo, board]);

  // --- RENDER MÀN HÌNH HOME ---
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-4 select-none">
        <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-2 tracking-tighter">CARO PRO</h1>
        <p className="text-slate-500 mb-10 text-lg">Thử thách trí tuệ 20x20</p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => {
              setMode("pvc");
              setScreen("game");
            }}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-5 rounded-2xl text-xl font-bold shadow-lg transition-transform"
          >
            Đấu với Máy 🤖
          </button>
          <button
            onClick={() => {
              setMode("pvp");
              setScreen("game");
            }}
            className="bg-white border-2 border-slate-200 hover:border-slate-400 active:scale-95 text-slate-700 py-5 rounded-2xl text-xl font-bold shadow-sm transition-transform"
          >
            Đấu với Bạn 👥
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER MÀN HÌNH GAME ---

  // Xác định text hiển thị trạng thái
  let statusText = "";
  let statusColor = "text-slate-700";

  if (winnerInfo) {
    statusText = winnerInfo.winner === "X" ? "BẠN ĐÃ THẮNG!" : "MÁY ĐÃ THẮNG!";
    if (mode === "pvp") statusText = `${winnerInfo.winner === "X" ? "X" : "O"} CHIẾN THẮNG!`;
    statusColor = "text-green-600 animate-bounce"; // Nhảy nhảy khi thắng
  } else {
    if (mode === "pvc") {
      statusText = isXNext ? "Lượt của bạn (X)" : "Máy đang tính...";
    } else {
      statusText = isXNext ? "Lượt người chơi X" : "Lượt người chơi O";
    }
  }

  return (
    // Container chính: Chặn cuộn (overflow-hidden), full màn hình
    <div className="fixed inset-0 bg-slate-100 flex flex-col font-sans overflow-hidden select-none touch-manipulation">
      {/* 1. Header: Cố định chiều cao */}
      <div className="flex-none h-16 bg-white shadow-sm flex items-center justify-between px-4 z-10 border-b border-slate-200">
        <button onClick={goHome} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
          ⬅ Thoát
        </button>

        <div className={`font-black text-lg md:text-xl uppercase truncate px-2 ${statusColor}`}>{statusText}</div>

        <button onClick={resetGame} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
          🔄 Chơi lại
        </button>
      </div>

      {/* 2. Khu vực bàn cờ: Tự động co giãn để vừa khít màn hình */}
      <div className="flex-grow flex items-center justify-center p-2 bg-slate-200">
        <div
          className="bg-white shadow-2xl border border-slate-400 grid"
          style={{
            // Logic kích thước:
            // Lấy 98% chiều ngang hoặc 85% chiều dọc (trừ header), cái nào nhỏ hơn thì lấy.
            // Đảm bảo bàn cờ luôn vuông vức và nằm trọn trong màn hình.
            width: "min(98vw, 85vh)",
            height: "min(98vw, 85vh)",
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          }}
        >
          {board.map((cell, idx) => {
            const isWinningCell = winnerInfo?.line.includes(idx);

            return (
              <div
                key={idx}
                onClick={() => handleSquareClick(idx)}
                className={`
                  relative flex items-center justify-center border-r border-b border-slate-300
                  ${!cell && !winnerInfo ? "cursor-pointer active:bg-slate-100" : ""} 
                  ${isWinningCell ? "bg-yellow-300" : "bg-white"}
                `}
                // active:bg-slate-100: Chỉ đổi màu nền nhẹ khi bấm, KHÔNG thay đổi kích thước
              >
                {/* Render X hoặc O */}
                {/* p-[5%] để icon to sát viền nhưng không bị cắt */}
                {cell === "X" && (
                  <div className="w-full h-full p-[5%]">
                    <IconX />
                  </div>
                )}
                {cell === "O" && (
                  <div className="w-full h-full p-[5%]">
                    <IconO />
                  </div>
                )}

                {/* Dấu chấm gợi ý hover (chỉ hiện trên PC) */}
                {!cell && !winnerInfo && isXNext && <div className="hidden md:block w-2 h-2 rounded-full bg-slate-200 opacity-0 hover:opacity-100 transition-opacity" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer nhỏ */}
      <div className="flex-none h-6 bg-slate-200 text-slate-400 text-[10px] flex items-center justify-center">Caro 20x20 • React & Tailwind</div>
    </div>
  );
};

export default App;
