function getMatrixDimensions(matrix) {
  return [matrix.length, matrix[0].length];
}

function round(number, eps) {
  return Math.round(number / eps) * eps;
}

function roundCol(matrix, fractionDigits) {
  return matrix.map(([el]) => Number(el.toFixed(fractionDigits)));
}

function getCol(matrix, i) {
  return matrix.map(row => row[i]);
}

function isEqualMatrix(A, B, eps) {
  const [rowsA, colsA] = getMatrixDimensions(A);
  const [rowsB, colsB] = getMatrixDimensions(B);

  if (rowsA !== rowsB || colsA !== colsB) {
    return false;
  }

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      if (round(A[i][j], eps) !== round(B[i][j], eps)) {
        return false;
      }
    }
  }

  return true;
}

function MultiplyMatrix(A,B) {
  const [rowsA, colsA] = getMatrixDimensions(A);
  const [rowsB, colsB] = getMatrixDimensions(B);
  const C = [];

  if (colsA !== rowsB) {
    return;
  }

  for (let i = 0; i < rowsA; i++) {
    C[ i ] = [];
  }
  for (let k = 0; k < colsB; k++) {
    for (let i = 0; i < rowsA; i++) {
      let t = 0;
      for (let j = 0; j < rowsB; j++) {
        t += A[ i ][j]*B[j][k];
      }
      C[ i ][k] = t;
    }
  }

  return C;
}

function pageRank(M, v) {
  const eps = 0.00001;
  const fractionDigits = Math.log10(eps) * -1;

  let i = 0;
  let oldV;

  do {
    console.log(roundCol(v, fractionDigits));
    i++;
    oldV = v;
    v = MultiplyMatrix(M, v);
  } while (!isEqualMatrix(v, oldV, eps) && i < 10000);

  return roundCol(v, fractionDigits);
}
