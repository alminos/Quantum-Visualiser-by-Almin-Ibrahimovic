import { Complex, QubitState } from '../types';

export const complexAdd = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const complexSub = (a: Complex, b: Complex): Complex => ({
  re: a.re - b.re,
  im: a.im - b.im,
});

export const complexMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const complexMagSq = (a: Complex): number => a.re * a.re + a.im * a.im;

export const complexMag = (a: Complex): number => Math.sqrt(complexMagSq(a));

export const complexFormat = (c: Complex, decimals = 3): string => {
  const r = Number(c.re.toFixed(decimals));
  const i = Number(c.im.toFixed(decimals));
  if (Math.abs(i) < 1e-4) return `${r}`;
  if (Math.abs(r) < 1e-4) return `${i}i`;
  const sign = i >= 0 ? '+' : '-';
  return `${r} ${sign} ${Math.abs(i)}i`;
};

// Compute Qubit State from Bloch angles theta (0 to pi) and phi (0 to 2pi)
export const stateFromAngles = (theta: number, phi: number): QubitState => {
  const halfTheta = theta / 2;
  const alpha: Complex = {
    re: Math.cos(halfTheta),
    im: 0,
  };
  const beta: Complex = {
    re: Math.sin(halfTheta) * Math.cos(phi),
    im: Math.sin(halfTheta) * Math.sin(phi),
  };
  return {
    alpha,
    beta,
    theta,
    phi,
  };
};

// Single Qubit 2x2 Unitary Matrices
export type Matrix2x2 = [[Complex, Complex], [Complex, Complex]];

export const GATE_MATRICES: Record<string, Matrix2x2> = {
  H: [
    [{ re: 1 / Math.SQRT2, im: 0 }, { re: 1 / Math.SQRT2, im: 0 }],
    [{ re: 1 / Math.SQRT2, im: 0 }, { re: -1 / Math.SQRT2, im: 0 }],
  ],
  X: [
    [{ re: 0, im: 0 }, { re: 1, im: 0 }],
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
  ],
  Y: [
    [{ re: 0, im: 0 }, { re: 0, im: -1 }],
    [{ re: 0, im: 1 }, { re: 0, im: 0 }],
  ],
  Z: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: -1, im: 0 }],
  ],
  S: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: 0, im: 1 }],
  ],
  T: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: Math.SQRT1_2, im: Math.SQRT1_2 }],
  ],
};

// Apply 1-qubit matrix to single qubit state
export const applyGateToQubit = (state: QubitState, gate: string): QubitState => {
  const mat = GATE_MATRICES[gate];
  if (!mat) return state;

  const newAlpha = complexAdd(
    complexMul(mat[0][0], state.alpha),
    complexMul(mat[0][1], state.beta)
  );
  const newBeta = complexAdd(
    complexMul(mat[1][0], state.alpha),
    complexMul(mat[1][1], state.beta)
  );

  // Derive new Bloch coordinates
  const p0 = complexMagSq(newAlpha);
  const p1 = complexMagSq(newBeta);
  const norm = Math.sqrt(p0 + p1);
  const normAlpha = { re: newAlpha.re / (norm || 1), im: newAlpha.im / (norm || 1) };
  const normBeta = { re: newBeta.re / (norm || 1), im: newBeta.im / (norm || 1) };

  const theta = 2 * Math.acos(Math.min(1, Math.max(0, complexMag(normAlpha))));
  let phi = 0;
  if (complexMag(normBeta) > 1e-6) {
    const phaseAlpha = Math.atan2(normAlpha.im, normAlpha.re);
    const phaseBeta = Math.atan2(normBeta.im, normBeta.re);
    phi = (phaseBeta - phaseAlpha + 2 * Math.PI) % (2 * Math.PI);
  }

  return {
    alpha: normAlpha,
    beta: normBeta,
    theta,
    phi,
  };
};

// Multi-qubit circuit simulation for up to 3 qubits (2^3 = 8 state amplitudes)
export interface CircuitSimulationResult {
  stateVector: Complex[];
  probabilities: number[];
  labels: string[];
}

export const simulateCircuit = (
  numQubits: number,
  gates: Array<{ type: string; targetQubit: number; controlQubit?: number; step: number }>
): CircuitSimulationResult => {
  const dim = 1 << numQubits;
  let stateVector: Complex[] = Array.from({ length: dim }, (_, i) =>
    i === 0 ? { re: 1, im: 0 } : { re: 0, im: 0 }
  );

  // Sort gates by step sequence
  const sortedGates = [...gates].sort((a, b) => a.step - b.step);

  for (const gate of sortedGates) {
    if (gate.type === 'M') continue; // Measurement is analysed separately

    if (GATE_MATRICES[gate.type]) {
      // 1-qubit gate
      const mat = GATE_MATRICES[gate.type];
      const target = gate.targetQubit;
      const nextVector: Complex[] = Array.from({ length: dim }, () => ({ re: 0, im: 0 }));

      for (let i = 0; i < dim; i++) {
        const bit = (i >> (numQubits - 1 - target)) & 1;
        const paired = i ^ (1 << (numQubits - 1 - target));

        if (bit === 0) {
          const v0 = stateVector[i];
          const v1 = stateVector[paired];

          nextVector[i] = complexAdd(
            complexMul(mat[0][0], v0),
            complexMul(mat[0][1], v1)
          );
          nextVector[paired] = complexAdd(
            complexMul(mat[1][0], v0),
            complexMul(mat[1][1], v1)
          );
        }
      }
      stateVector = nextVector;
    } else if (gate.type === 'CNOT' && gate.controlQubit !== undefined) {
      const ctrl = gate.controlQubit;
      const tgt = gate.targetQubit;
      const nextVector = [...stateVector];

      for (let i = 0; i < dim; i++) {
        const ctrlBit = (i >> (numQubits - 1 - ctrl)) & 1;
        if (ctrlBit === 1) {
          const flipped = i ^ (1 << (numQubits - 1 - tgt));
          if (i < flipped) {
            const temp = nextVector[i];
            nextVector[i] = nextVector[flipped];
            nextVector[flipped] = temp;
          }
        }
      }
      stateVector = nextVector;
    } else if (gate.type === 'CZ' && gate.controlQubit !== undefined) {
      const ctrl = gate.controlQubit;
      const tgt = gate.targetQubit;
      const nextVector = [...stateVector];

      for (let i = 0; i < dim; i++) {
        const ctrlBit = (i >> (numQubits - 1 - ctrl)) & 1;
        const tgtBit = (i >> (numQubits - 1 - tgt)) & 1;
        if (ctrlBit === 1 && tgtBit === 1) {
          nextVector[i] = { re: -nextVector[i].re, im: -nextVector[i].im };
        }
      }
      stateVector = nextVector;
    } else if (gate.type === 'SWAP' && gate.controlQubit !== undefined) {
      const q1 = gate.controlQubit;
      const q2 = gate.targetQubit;
      const nextVector = [...stateVector];

      for (let i = 0; i < dim; i++) {
        const b1 = (i >> (numQubits - 1 - q1)) & 1;
        const b2 = (i >> (numQubits - 1 - q2)) & 1;
        if (b1 !== b2 && b1 === 0) {
          const swapped = i ^ (1 << (numQubits - 1 - q1)) ^ (1 << (numQubits - 1 - q2));
          const temp = nextVector[i];
          nextVector[i] = nextVector[swapped];
          nextVector[swapped] = temp;
        }
      }
      stateVector = nextVector;
    }
  }

  const probabilities = stateVector.map((c) => Math.max(0, Math.min(1, complexMagSq(c))));
  const labels = Array.from({ length: dim }, (_, i) => {
    return '|' + i.toString(2).padStart(numQubits, '0') + '>';
  });

  return {
    stateVector,
    probabilities,
    labels,
  };
};

// Simulate Monte Carlo measurement shots
export const sampleMeasurements = (
  probabilities: number[],
  labels: string[],
  shots = 1024
): Record<string, number> => {
  const counts: Record<string, number> = {};
  labels.forEach((l) => (counts[l] = 0));

  for (let s = 0; s < shots; s++) {
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (r <= cumulative || i === probabilities.length - 1) {
        counts[labels[i]] = (counts[labels[i]] || 0) + 1;
        break;
      }
    }
  }

  return counts;
};

// Quantum Entanglement correlation calculations
export const computeQuantumCorrelation = (
  bellStateId: string,
  angleA: number,
  angleB: number
): number => {
  // angles in radians
  const diff = angleA - angleB;
  switch (bellStateId) {
    case 'phi_plus':
      // (|00> + |11>)/sqrt(2): E = cos(a + b)
      return Math.cos(angleA + angleB);
    case 'phi_minus':
      // (|00> - |11>)/sqrt(2): E = cos(a - b)
      return Math.cos(diff);
    case 'psi_plus':
      // (|01> + |10>)/sqrt(2): E = cos(a - b)
      return Math.cos(diff);
    case 'psi_minus':
    default:
      // (|01> - |10>)/sqrt(2) Singlet state: E = -cos(a - b)
      return -Math.cos(diff);
  }
};

// CHSH test parameter calculation
export const computeCHSH = (
  bellStateId: string,
  a1: number,
  a2: number,
  b1: number,
  b2: number
): { S: number; e11: number; e12: number; e21: number; e22: number } => {
  const e11 = computeQuantumCorrelation(bellStateId, a1, b1);
  const e12 = computeQuantumCorrelation(bellStateId, a1, b2);
  const e21 = computeQuantumCorrelation(bellStateId, a2, b1);
  const e22 = computeQuantumCorrelation(bellStateId, a2, b2);
  const S = Math.abs(e11 - e12 + e21 + e22);
  return { S, e11, e12, e21, e22 };
};
