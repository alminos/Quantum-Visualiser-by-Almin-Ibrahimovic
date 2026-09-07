import React, { useState, useMemo } from 'react';
import { Trash2, RotateCcw, Play, Sparkles, BookOpen, Layers, Check } from 'lucide-react';
import { CircuitGate, GateType } from '../types';
import { simulateCircuit, sampleMeasurements, complexFormat } from '../utils/quantumMath';
import { PRESET_CIRCUITS } from '../data/quantumHardwareData';

interface CircuitBuilderProps {
  onCircuitChanged?: (condition: string) => void;
  isDark: boolean;
}

const AVAILABLE_GATES: Array<{
  type: GateType;
  name: string;
  description: string;
  matrix: string;
  isTwoQubit?: boolean;
}> = [
  { type: 'H', name: 'Hadamard', description: 'Creates equal superposition (|0> + |1>)/sqrt(2)', matrix: '1/sqrt(2) [[1, 1], [1, -1]]' },
  { type: 'X', name: 'Pauli-X (NOT)', description: 'Bit-flip operator: swaps |0> and |1>', matrix: '[[0, 1], [1, 0]]' },
  { type: 'Y', name: 'Pauli-Y', description: 'Bit and phase flip: Y|0> = i|1>, Y|1> = -i|0>', matrix: '[[0, -i], [i, 0]]' },
  { type: 'Z', name: 'Pauli-Z', description: 'Phase-flip operator: Z|0> = |0>, Z|1> = -|1>', matrix: '[[1, 0], [0, -1]]' },
  { type: 'S', name: 'Phase (S)', description: 'pi/2 Phase rotation around Z axis', matrix: '[[1, 0], [0, i]]' },
  { type: 'T', name: 'pi/8 (T)', description: 'pi/4 Phase rotation around Z axis', matrix: '[[1, 0], [0, e^(i*pi/4)]]' },
  { type: 'CNOT', name: 'Controlled-NOT', description: 'Flips target qubit if control qubit is |1>', matrix: '4x4 Permutation', isTwoQubit: true },
  { type: 'CZ', name: 'Controlled-Z', description: 'Applies phase flip if both qubits are |1>', matrix: '4x4 Phase', isTwoQubit: true },
  { type: 'SWAP', name: 'SWAP', description: 'Exchanges quantum states between two qubits', matrix: '4x4 Swap', isTwoQubit: true },
];

export const QuantumCircuitBuilder: React.FC<CircuitBuilderProps> = ({
  onCircuitChanged,
  isDark,
}) => {
  const [numQubits, setNumQubits] = useState<number>(3);
  const [numSteps, setNumSteps] = useState<number>(6);
  const [selectedGateType, setSelectedGateType] = useState<GateType>('H');
  const [selectedControlQubit, setSelectedControlQubit] = useState<number>(0);
  const [gates, setGates] = useState<CircuitGate[]>([
    { id: 'g0', type: 'H', targetQubit: 0, step: 0 },
    { id: 'g1', type: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 },
  ]);
  const [shotCounts, setShotCounts] = useState<Record<string, number> | null>(null);

  // Simulate circuit statevector
  const simulation = useMemo(() => {
    return simulateCircuit(numQubits, gates);
  }, [numQubits, gates]);

  const reportedMilestones = React.useRef<Set<string>>(new Set());

  // Check educational condition
  React.useEffect(() => {
    const hasH0 = gates.some((g) => g.type === 'H' && g.targetQubit === 0);
    const hasCnot10 = gates.some((g) => g.type === 'CNOT' && g.targetQubit === 1 && g.controlQubit === 0);
    if (hasH0 && hasCnot10 && !reportedMilestones.current.has('bell_circuit_built')) {
      reportedMilestones.current.add('bell_circuit_built');
      onCircuitChanged?.('bell_circuit_built');
    }
  }, [gates, onCircuitChanged]);

  const handleCellClick = (wireIdx: number, stepIdx: number) => {
    // Check if cell already has a gate
    const existingIndex = gates.findIndex((g) => g.targetQubit === wireIdx && g.step === stepIdx);
    if (existingIndex >= 0) {
      // Remove existing gate
      setGates((prev) => prev.filter((_, i) => i !== existingIndex));
      setShotCounts(null);
      return;
    }

    // Add new gate
    const isTwoQubit = selectedGateType === 'CNOT' || selectedGateType === 'CZ' || selectedGateType === 'SWAP';
    const control = isTwoQubit
      ? selectedControlQubit === wireIdx
        ? (wireIdx + 1) % numQubits
        : selectedControlQubit
      : undefined;

    const newGate: CircuitGate = {
      id: `gate_${Date.now()}_${Math.random()}`,
      type: selectedGateType,
      targetQubit: wireIdx,
      controlQubit: control,
      step: stepIdx,
    };

    setGates((prev) => [...prev, newGate]);
    setShotCounts(null);
    onCircuitChanged?.('circuit_created');
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESET_CIRCUITS.find((p) => p.id === presetId);
    if (!preset) return;
    setNumQubits(preset.numQubits);
    setGates(
      preset.gates.map((g) => ({
        ...g,
        id: `p_${Math.random()}`,
      }))
    );
    setShotCounts(null);
    onCircuitChanged?.('circuit_created');
  };

  const handleRunShots = (shots = 1024) => {
    const counts = sampleMeasurements(simulation.probabilities, simulation.labels, shots);
    setShotCounts(counts);
  };

  const clearCircuit = () => {
    setGates([]);
    setShotCounts(null);
  };

  return (
    <div id="logic-gates-module" className="space-y-6">
      {/* Header */}
      <div
        id="gates-header"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                Quantum Logic
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Interactive Quantum Circuit Builder and Logic Gates
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Unlike irreversible classical logic gates (like AND, OR), quantum gates are reversible unitary transformations.
              Select a gate from the toolbox below and click on any circuit wire to compose quantum algorithms and inspect the statevector in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="run-circuit-shots-btn"
              onClick={() => handleRunShots(1024)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-sm flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Play className="w-4 h-4" />
              Sample 1,024 Shots
            </button>
            <button
              id="clear-circuit-btn"
              onClick={clearCircuit}
              className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Preset Algorithm Loader & Qubit Count selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Algorithm Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CIRCUITS.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 font-medium transition cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="font-semibold text-slate-700 dark:text-slate-300">Register Size:</label>
          <div className="flex gap-1">
            {[2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setNumQubits(n)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                  numQubits === n
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {n} Qubits
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gate Toolbox */}
      <div
        id="gate-toolbox"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-xs"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
          Quantum Gate Toolbox (Select Gate, Then Click Circuit Wire)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {AVAILABLE_GATES.map((gate) => {
            const isSelected = selectedGateType === gate.type;
            return (
              <button
                key={gate.type}
                onClick={() => setSelectedGateType(gate.type)}
                className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm ${
                    gate.isTwoQubit
                      ? 'bg-indigo-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {gate.type}
                </div>
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-1.5 truncate max-w-full">
                  {gate.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-full">
                  {gate.matrix}
                </div>
              </button>
            );
          })}
        </div>

        {/* Control Qubit Selector if 2-qubit gate is selected */}
        {(selectedGateType === 'CNOT' || selectedGateType === 'CZ' || selectedGateType === 'SWAP') && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs">
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              Two-Qubit Operator Control Wire:
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: numQubits }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedControlQubit(idx)}
                  className={`px-2.5 py-1 rounded font-mono font-bold transition cursor-pointer ${
                    selectedControlQubit === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  |q{idx}&gt; Control
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Circuit Canvas Grid */}
      <div
        id="circuit-canvas-container"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs overflow-x-auto"
      >
        <div className="min-w-[620px]">
          {/* Circuit Column Headers (Steps) */}
          <div className="flex items-center mb-2 pl-24 pr-4">
            {Array.from({ length: numSteps }).map((_, stepIdx) => (
              <div
                key={stepIdx}
                className="flex-1 text-center font-mono text-xs text-slate-400 dark:text-slate-500 font-semibold"
              >
                Step {stepIdx + 1}
              </div>
            ))}
          </div>

          {/* Qubit Wires */}
          <div className="space-y-6 my-4">
            {Array.from({ length: numQubits }).map((_, wireIdx) => {
              return (
                <div key={wireIdx} className="relative flex items-center">
                  {/* Qubit Label */}
                  <div className="w-24 shrink-0 flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                      |q{wireIdx}&gt;
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      |0&gt;
                    </span>
                  </div>

                  {/* Horizontal Wire Line */}
                  <div className="relative flex-1 flex items-center h-12">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-300 dark:bg-slate-700 z-0" />

                    {/* Step Slots */}
                    <div className="relative z-10 w-full flex items-center justify-between">
                      {Array.from({ length: numSteps }).map((_, stepIdx) => {
                        // Find if there is a gate on this wire & step
                        const targetGate = gates.find(
                          (g) => g.targetQubit === wireIdx && g.step === stepIdx
                        );
                        const isControl = gates.some(
                          (g) => g.controlQubit === wireIdx && g.step === stepIdx
                        );
                        const controlGate = gates.find(
                          (g) => g.controlQubit === wireIdx && g.step === stepIdx
                        );

                        return (
                          <div
                            key={stepIdx}
                            onClick={() => handleCellClick(wireIdx, stepIdx)}
                            className="flex-1 flex justify-center items-center py-2 group cursor-pointer"
                          >
                            {targetGate ? (
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-sm transition hover:scale-105 active:scale-95 ${
                                  targetGate.controlQubit !== undefined
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-emerald-600 text-white'
                                }`}
                                title={`Click to remove ${targetGate.type} gate`}
                              >
                                {targetGate.type}
                              </div>
                            ) : isControl ? (
                              <div
                                className="w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-200 dark:ring-indigo-950 shadow-sm"
                                title={`Control node for gate on |q${controlGate?.targetQubit}>`}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded border border-transparent group-hover:border-dashed group-hover:border-slate-400 dark:group-hover:border-slate-600 transition flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 font-mono">
                                  +
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-right">
            Click any gate to remove it. Click an empty slot to place the active gate.
          </div>
        </div>
      </div>

      {/* Statevector Amplitudes and Probability Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statevector Dirac Output */}
        <div
          id="statevector-display"
          className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-500" />
              Calculated Statevector Amplitudes
            </h3>
            <span className="text-xs font-mono text-slate-500">Dimension 2^{numQubits} = {1 << numQubits}</span>
          </div>

          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {simulation.labels.map((label, idx) => {
              const amp = simulation.stateVector[idx];
              const prob = simulation.probabilities[idx];
              return (
                <div
                  key={label}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{label}</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      amp: {complexFormat(amp, 3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {(prob * 100).toFixed(1)}%
                    </span>
                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Measurement Shot Histogram */}
        <div
          id="measurement-histogram"
          className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-emerald-500" />
              Measurement Statistics (1,024 Shots)
            </h3>
            {shotCounts && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                Simulation Finished
              </span>
            )}
          </div>

          {shotCounts ? (
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {simulation.labels.map((label) => {
                const count = shotCounts[label] || 0;
                const pct = (count / 1024) * 100;
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{label}</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {count} counts ({pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click "Sample 1,024 Shots" above to simulate realistic quantum measurement projective collapse.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
