// // gameLogic.js

// export const BOARD_SIZE = 20;

// // Kiểm tra chiến thắng
// export const checkWinner = (squares) => {
//   const lines = [
//     [1, 0], // Dọc
//     [0, 1], // Ngang
//     [1, 1], // Chéo chính
//     [1, -1], // Chéo phụ
//   ];

//   for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
//     if (!squares[i]) continue;

//     const x = i % BOARD_SIZE;
//     const y = Math.floor(i / BOARD_SIZE);
//     const player = squares[i];

//     for (let [dx, dy] of lines) {
//       let count = 0;
//       let winPath = [];

//       // Kiểm tra 5 ô liên tiếp
//       for (let k = 0; k < 5; k++) {
//         const nx = x + k * dx;
//         const ny = y + k * dy;
//         const idx = ny * BOARD_SIZE + nx;

//         if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && squares[idx] === player) {
//           count++;
//           winPath.push(idx);
//         } else {
//           break;
//         }
//       }

//       if (count === 5) {
//         return { winner: player, line: winPath };
//       }
//     }
//   }
//   return null;
// };

// // AI Logic (Heuristic Scoring)
// // Thay vì Minimax sâu (chậm trên JS thuần), ta dùng hệ thống điểm số
// export const getBestMove = (squares) => {
//   const availableMoves = [];

//   // 1. Lọc các ô trống có "hàng xóm" (để tối ưu, không xét ô quá xa)
//   for (let i = 0; i < squares.length; i++) {
//     if (squares[i] === null) {
//       if (hasNeighbor(i, squares)) {
//         availableMoves.push(i);
//       }
//     }
//   }

//   if (availableMoves.length === 0) return Math.floor(squares.length / 2); // Đánh giữa nếu bàn trống

//   let bestScore = -Infinity;
//   let bestMove = availableMoves[0];

//   for (let move of availableMoves) {
//     // Giả lập nước đi
//     squares[move] = "O";
//     const score = evaluateBoard(squares, move);
//     squares[move] = null; // Hoàn tác

//     if (score > bestScore) {
//       bestScore = score;
//       bestMove = move;
//     }
//   }

//   return bestMove;
// };

// // Kiểm tra xem ô i có quân cờ nào xung quanh không (phạm vi 2 ô)
// const hasNeighbor = (index, squares) => {
//   const x = index % BOARD_SIZE;
//   const y = Math.floor(index / BOARD_SIZE);
//   const range = 2;

//   for (let dy = -range; dy <= range; dy++) {
//     for (let dx = -range; dx <= range; dx++) {
//       if (dx === 0 && dy === 0) continue;
//       const nx = x + dx;
//       const ny = y + dy;
//       if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
//         if (squares[ny * BOARD_SIZE + nx] !== null) return true;
//       }
//     }
//   }
//   return false;
// };

// // Hàm chấm điểm thế trận
// const evaluateBoard = (squares, moveIdx) => {
//   let score = 0;

//   // Tấn công (AI = O)
//   score += evaluateLine(squares, moveIdx, "O") * 1.2;

//   // Phòng thủ (Human = X) - Giả lập nếu Human đánh vào ô này thì mạnh thế nào -> chặn nó
//   squares[moveIdx] = "X"; // Giả sử Human đánh
//   score += evaluateLine(squares, moveIdx, "X") * 1.0;
//   squares[moveIdx] = "O"; // Trả lại để loop ngoài xử lý

//   return score;
// };

// const evaluateLine = (squares, index, player) => {
//   const lines = [
//     [1, 0],
//     [0, 1],
//     [1, 1],
//     [1, -1],
//   ];
//   let totalScore = 0;

//   const x = index % BOARD_SIZE;
//   const y = Math.floor(index / BOARD_SIZE);

//   for (let [dx, dy] of lines) {
//     let count = 1;
//     let blocked = 0;

//     // Check hướng dương
//     for (let k = 1; k < 5; k++) {
//       const nx = x + k * dx;
//       const ny = y + k * dy;
//       const idx = ny * BOARD_SIZE + nx;
//       if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) {
//         blocked++;
//         break;
//       }
//       if (squares[idx] === player) count++;
//       else if (squares[idx] !== null) {
//         blocked++;
//         break;
//       } else break;
//     }

//     // Check hướng âm
//     for (let k = 1; k < 5; k++) {
//       const nx = x - k * dx;
//       const ny = y - k * dy;
//       const idx = ny * BOARD_SIZE + nx;
//       if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) {
//         blocked++;
//         break;
//       }
//       if (squares[idx] === player) count++;
//       else if (squares[idx] !== null) {
//         blocked++;
//         break;
//       } else break;
//     }

//     // Quy tắc điểm số (Quan trọng)
//     if (count >= 5) totalScore += 100000; // Thắng ngay
//     else if (count === 4 && blocked === 0) totalScore += 10000; // 4 ô thoáng
//     else if (count === 4 && blocked === 1) totalScore += 1000; // 4 ô bị chặn 1 đầu
//     else if (count === 3 && blocked === 0) totalScore += 500; // 3 ô thoáng
//     else if (count === 3 && blocked === 1) totalScore += 50;
//     else if (count === 2 && blocked === 0) totalScore += 10;
//   }
//   return totalScore;
// };
export const BOARD_SIZE = 20;

// --- PHẦN 1: CÁC HÀM CƠ BẢN ---

// Kiểm tra người thắng (giữ nguyên logic cũ nhưng tối ưu tốc độ)
export const checkWinner = (squares) => {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  // Chỉ quét những ô có quân cờ để tối ưu
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) continue;

    const x = i % BOARD_SIZE;
    const y = Math.floor(i / BOARD_SIZE);
    const player = squares[i];

    for (let [dx, dy] of directions) {
      let count = 0;
      let winPath = [];

      // Kiểm tra đủ 5 quân
      for (let k = 0; k < 5; k++) {
        const nx = x + k * dx;
        const ny = y + k * dy;
        const idx = ny * BOARD_SIZE + nx;

        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && squares[idx] === player) {
          count++;
          winPath.push(idx);
        } else {
          break;
        }
      }

      if (count === 5) return { winner: player, line: winPath };
    }
  }
  return null;
};

// --- PHẦN 2: TRÍ TUỆ NHÂN TẠO (MINIMAX + ALPHA BETA) ---

// Hàm chính để App.jsx gọi
export const getBestMove = (squares) => {
  // Bước 1: Lấy danh sách các ô khả thi (chỉ xét ô gần các quân đã đánh)
  const candidates = getCandidateMoves(squares);

  // Nếu bàn cờ trống, đánh vào giữa
  if (candidates.length === 0) return Math.floor((BOARD_SIZE * BOARD_SIZE) / 2);

  // Bước 2: Chạy thuật toán Minimax
  let bestScore = -Infinity;
  let move = -1;

  // Duyệt qua các nước đi khả thi
  for (let i of candidates) {
    squares[i] = "O"; // Máy thử đi
    // Depth = 2 nghĩa là nhìn trước: Máy đi -> Người đi -> Chấm điểm
    const score = minimax(squares, 2, -Infinity, Infinity, false);
    squares[i] = null; // Hoàn tác

    if (score > bestScore) {
      bestScore = score;
      move = i;
    }
  }

  return move;
};

// Thuật toán Minimax có cắt tỉa Alpha-Beta
const minimax = (squares, depth, alpha, beta, isMaximizing) => {
  // Kiểm tra xem nước đi trước đó có ai thắng không
  const win = checkWinSimple(squares);
  if (win === "O") return 1000000; // Máy thắng
  if (win === "X") return -1000000; // Người thắng (Máy thua)

  // Nếu hết độ sâu hoặc bàn cờ đầy
  if (depth === 0) {
    return evaluateBoard(squares, "O");
  }

  const candidates = getCandidateMoves(squares);
  if (candidates.length === 0) return 0;

  if (isMaximizing) {
    // Lượt của Máy (O)
    let maxEval = -Infinity;
    for (let i of candidates) {
      squares[i] = "O";
      const evalScore = minimax(squares, depth - 1, alpha, beta, false);
      squares[i] = null;
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Cắt tỉa
    }
    return maxEval;
  } else {
    // Lượt của Người (X) - Giả định người chơi thông minh nhất
    let minEval = Infinity;
    for (let i of candidates) {
      squares[i] = "X";
      const evalScore = minimax(squares, depth - 1, alpha, beta, true);
      squares[i] = null;
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Cắt tỉa
    }
    return minEval;
  }
};

// --- PHẦN 3: HÀM HỖ TRỢ & CHẤM ĐIỂM ---

// Lấy các ô trống xung quanh các quân cờ đã có (Phạm vi 2 ô)
// Giúp giảm số lượng ô cần tính toán từ 400 xuống còn khoảng 10-20
const getCandidateMoves = (squares) => {
  const candidates = new Set();
  const range = 1; // Chỉ xét ô kề sát (tăng lên 2 sẽ thông minh hơn nhưng chậm hơn)

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] !== null) {
      // Nếu ô có quân
      const x = i % BOARD_SIZE;
      const y = Math.floor(i / BOARD_SIZE);

      for (let dy = -range; dy <= range; dy++) {
        for (let dx = -range; dx <= range; dx++) {
          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
            const idx = ny * BOARD_SIZE + nx;
            if (squares[idx] === null) {
              candidates.add(idx);
            }
          }
        }
      }
    }
  }
  return Array.from(candidates);
};

// Hàm check thắng nhanh (chỉ trả về X hoặc O) dùng cho Minimax
const checkWinSimple = (squares) => {
  // Logic tương tự checkWinner nhưng return nhanh
  // Để code gọn, ta dùng lại logic checkWinner ở trên nhưng lược giản
  const res = checkWinner(squares);
  return res ? res.winner : null;
};

// Hàm chấm điểm thế trận (Heuristic)
// Máy (O) muốn điểm cao, Người (X) muốn điểm thấp
const evaluateBoard = (squares, playerTurn) => {
  let score = 0;

  // Tấn công: Máy có bao nhiêu chuỗi tiềm năng
  score += getScore(squares, "O");

  // Phòng thủ: Người có bao nhiêu chuỗi nguy hiểm (Trừ điểm nặng để máy sợ)
  score -= getScore(squares, "X") * 1.2; // Nhân hệ số 1.2 để ưu tiên chặn địch hơn tấn công

  return score;
};

// Tính điểm cho từng người chơi
const getScore = (squares, player) => {
  let score = 0;
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  // Duyệt qua bàn cờ (để tối ưu có thể chỉ duyệt các ô candidates)
  // Ở đây duyệt full board cho chính xác nhưng có thể chậm nếu board quá to
  // Ta sẽ duyệt theo các đường

  // (Phần này logic khá dài, để đơn giản hoá ta dùng logic đếm chuỗi liên tiếp)
  // Quy tắc điểm:
  // 5 ô: 100,000 (Thắng)
  // 4 ô thoáng 2 đầu: 10,000
  // 4 ô bị chặn 1 đầu: 1,000
  // 3 ô thoáng 2 đầu: 1,000
  // 3 ô bị chặn 1 đầu: 100
  // 2 ô thoáng: 10

  // Lưu ý: Code dưới đây là phiên bản đơn giản hoá để chạy mượt trên Browser
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] !== player) continue;

    const x = i % BOARD_SIZE;
    const y = Math.floor(i / BOARD_SIZE);

    for (let [dx, dy] of directions) {
      // Chỉ tính điểm nếu đây là ô bắt đầu của chuỗi (tránh trùng lặp)
      const prevX = x - dx;
      const prevY = y - dy;
      if (prevX >= 0 && prevX < BOARD_SIZE && prevY >= 0 && prevY < BOARD_SIZE && squares[prevY * BOARD_SIZE + prevX] === player) {
        continue;
      }

      let count = 0;
      let blocked = 0;

      // Check đầu bên kia
      if (prevX < 0 || prevX >= BOARD_SIZE || prevY < 0 || prevY >= BOARD_SIZE || (squares[prevY * BOARD_SIZE + prevX] !== null && squares[prevY * BOARD_SIZE + prevX] !== player)) {
        blocked++;
      }

      // Đếm chuỗi
      let tempX = x;
      let tempY = y;
      while (true) {
        tempX += dx;
        tempY += dy;
        const idx = tempY * BOARD_SIZE + tempX;
        if (tempX >= 0 && tempX < BOARD_SIZE && tempY >= 0 && tempY < BOARD_SIZE && squares[idx] === player) {
          count++;
        } else {
          // Check chặn đầu này
          if (tempX < 0 || tempX >= BOARD_SIZE || tempY < 0 || tempY >= BOARD_SIZE || (squares[idx] !== null && squares[idx] !== player)) {
            blocked++;
          }
          break;
        }
      }

      // Tính tổng độ dài chuỗi (bao gồm ô gốc)
      const totalLen = count + 1;

      if (totalLen >= 5) score += 100000;
      else if (totalLen === 4) score += blocked === 0 ? 10000 : 1000;
      else if (totalLen === 3) score += blocked === 0 ? 1000 : 100;
      else if (totalLen === 2) score += blocked === 0 ? 100 : 10;
    }
  }
  return score;
};
