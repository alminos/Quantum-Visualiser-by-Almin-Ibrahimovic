import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Play, Pause, RotateCw, Activity, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { computeQuantumCorrelation, computeCHSH } from '../utils/quantumMath';

interface EntanglementProps {
  onExperimentComplete?: (condition: string) => void;
  isDark: boolean;
}

export const EntanglementSimulation: React.FC<EntanglementProps> = ({
  onExperimentComplete,
  isDark,
}) => {
  const [bellState, setBellState] = useState<string>('phi_plus');
  const [angleA, setAngleA] = useState<number>(0); // radians
  const [angleB, setAngleB] = useState<number>(Math.PI / 4); // 45 degrees
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [emissionCount, setEmissionCount] = useState<number>(0);
  const [coincidenceHistory, setCoincidenceHistory] = useState<
    Array<{ aOutcome: number; bOutcome: number; match: boolean }>
  >([]);

  const animSvgRef = useRef<SVGSVGElement | null>(null);
  const particlesRef = useRef<Array<{ id: number; x1: number; x2: number; progress: number }>>([]);
  const animFrameId = useRef<number | null>(null);

  // CHSH test angles for maximum quantum violation:
  // a1 = 0, a2 = pi/2 (90 deg), b1 = pi/4 (45 deg), b2 = -pi/4 (-45 deg)
  const chshResult = computeCHSH(bellState, 0, Math.PI / 2, Math.PI / 4, -Math.PI / 4);
  const currentCorrelation = computeQuantumCorrelation(bellState, angleA, angleB);

  const reportedMilestones = useRef<Set<string>>(new Set());

  // Trigger task milestones
  useEffect(() => {
    if (bellState === 'phi_plus' && !reportedMilestones.current.has('bell_phi_plus_selected')) {
      reportedMilestones.current.add('bell_phi_plus_selected');
      onExperimentComplete?.('bell_phi_plus_selected');
    }
    if (chshResult.S > 2.05 && !reportedMilestones.current.has('chsh_violation_demonstrated')) {
      reportedMilestones.current.add('chsh_violation_demonstrated');
      onExperimentComplete?.('chsh_violation_demonstrated');
    }
  }, [bellState, chshResult.S, onExperimentComplete]);

  // Smooth D3 animation for entangled pair propagation
  useEffect(() => {
    if (!animSvgRef.current) return;
    const svg = d3.select(animSvgRef.current);
    svg.selectAll('*').remove();

    const width = 640;
    const height = 180;
    const sourceX = width / 2;
    const sourceY = height / 2;
    const aliceX = 60;
    const bobX = width - 60;

    const g = svg.attr('viewBox', `0 0 ${width} ${height}`).append('g');

    // Central Entanglement Source (BBO non-linear crystal)
    const crystalColor = isDark ? '#38bdf8' : '#0284c7';
    g.append('rect')
      .attr('x', sourceX - 22)
      .attr('y', sourceY - 22)
      .attr('width', 44)
      .attr('height', 44)
      .attr('rx', 8)
      .attr('fill', crystalColor)
      .attr('fill-opacity', 0.15)
      .attr('stroke', crystalColor)
      .attr('stroke-width', 2);

    g.append('text')
      .attr('x', sourceX)
      .attr('y', sourceY - 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('fill', isDark ? '#e2e8f0' : '#1e293b')
      .text('EPR Source');

    // Alice Detector
    g.append('circle')
      .attr('cx', aliceX)
      .attr('cy', sourceY)
      .attr('r', 32)
      .attr('fill', isDark ? '#1e293b' : '#f1f5f9')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 2);

    // Alice orientation indicator
    const aliceLineX = 26 * Math.cos(angleA);
    const aliceLineY = -26 * Math.sin(angleA);
    g.append('line')
      .attr('x1', aliceX - aliceLineX)
      .attr('y1', sourceY - aliceLineY)
      .attr('x2', aliceX + aliceLineX)
      .attr('y2', sourceY + aliceLineY)
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 3.5);

    g.append('text')
      .attr('x', aliceX)
      .attr('y', sourceY + 48)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', isDark ? '#38bdf8' : '#0284c7')
      .text(`Alice (${(angleA * (180 / Math.PI)).toFixed(0)} deg)`);

    // Bob Detector
    g.append('circle')
      .attr('cx', bobX)
      .attr('cy', sourceY)
      .attr('r', 32)
      .attr('fill', isDark ? '#1e293b' : '#f1f5f9')
      .attr('stroke', '#f43f5e')
      .attr('stroke-width', 2);

    // Bob orientation indicator
    const bobLineX = 26 * Math.cos(angleB);
    const bobLineY = -26 * Math.sin(angleB);
    g.append('line')
      .attr('x1', bobX - bobLineX)
      .attr('y1', sourceY - bobLineY)
      .attr('x2', bobX + bobLineX)
      .attr('y2', sourceY + bobLineY)
      .attr('stroke', '#f43f5e')
      .attr('stroke-width', 3.5);

    g.append('text')
      .attr('x', bobX)
      .attr('y', sourceY + 48)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', isDark ? '#f43f5e' : '#e11d48')
      .text(`Bob (${(angleB * (180 / Math.PI)).toFixed(0)} deg)`);

    // Propagation paths
    g.append('line')
      .attr('x1', aliceX + 32)
      .attr('y1', sourceY)
      .attr('x2', sourceX - 22)
      .attr('y2', sourceY)
      .attr('stroke', isDark ? '#334155' : '#cbd5e1')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-width', 1.5);

    g.append('line')
      .attr('x1', sourceX + 22)
      .attr('y1', sourceY)
      .attr('x2', bobX - 32)
      .attr('y2', sourceY)
      .attr('stroke', isDark ? '#334155' : '#cbd5e1')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-width', 1.5);

    // Particle rendering group
    const particleGroup = g.append('g').attr('class', 'particles');

    let lastTick = performance.now();
    let spawnTimer = 0;

    const renderLoop = (time: number) => {
      const dt = (time - lastTick) / 1000;
      lastTick = time;

      if (isStreaming) {
        spawnTimer += dt;
        if (spawnTimer > 0.8) {
          spawnTimer = 0;
          particlesRef.current.push({
            id: Date.now() + Math.random(),
            x1: sourceX - 22,
            x2: sourceX + 22,
            progress: 0,
          });
        }
      }

      // Update particle positions
      particlesRef.current.forEach((p) => {
        p.progress += dt * 0.9;
        p.x1 = sourceX - 22 - p.progress * (sourceX - 22 - (aliceX + 32));
        p.x2 = sourceX + 22 + p.progress * (bobX - 32 - (sourceX + 22));
      });

      // Filter particles that reached detectors
      const arrived = particlesRef.current.filter((p) => p.progress >= 1.0);
      if (arrived.length > 0) {
        // Record measurement coincidence
        arrived.forEach(() => {
          // Alice measures +1 or -1 randomly (50/50 Born probability for single qubit)
          const a = Math.random() < 0.5 ? 1 : -1;
          // Joint probability P(same) = (1 + correlation)/2
          const pSame = (1 + currentCorrelation) / 2;
          const b = Math.random() < pSame ? a : -a;
          setCoincidenceHistory((prev) => [
            { aOutcome: a, bOutcome: b, match: a === b },
            ...prev.slice(0, 7),
          ]);
          setEmissionCount((c) => c + 1);
        });
        particlesRef.current = particlesRef.current.filter((p) => p.progress < 1.0);
      }

      // Render particles in D3
      const circles = particleGroup
        .selectAll<SVGCircleElement, { id: number; x1: number; x2: number; progress: number }>(
          'circle.particle'
        )
        .data(
          particlesRef.current.flatMap((p) => [
            { id: p.id, x: p.x1, type: 'alice' },
            { id: p.id + 1, x: p.x2, type: 'bob' },
          ]),
          (d: any) => d.id
        );

      circles
        .enter()
        .append('circle')
        .attr('class', 'particle')
        .attr('cy', sourceY)
        .attr('r', 7)
        .merge(circles as any)
        .attr('cx', (d) => d.x)
        .attr('fill', (d) => (d.type === 'alice' ? '#38bdf8' : '#f43f5e'))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5);

      circles.exit().remove();

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [angleA, angleB, currentCorrelation, isStreaming, isDark]);

  const emitSinglePair = () => {
    particlesRef.current.push({
      id: Date.now() + Math.random(),
      x1: 640 / 2 - 22,
      x2: 640 / 2 + 22,
      progress: 0,
    });
  };

  return (
    <div id="entanglement-module" className="space-y-6">
      {/* Header */}
      <div
        id="entanglement-header"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                Non-Local Correlations
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Quantum Entanglement and Bell's Theorem
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Two entangled qubits exhibit instantaneous correlations that defy classical local realism.
              Configure the Bell state and detector angles to observe how quantum mechanics directly violates
              the classical CHSH bound of <code className="font-mono text-indigo-600 dark:text-indigo-400">S &lt;= 2.0</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="stream-toggle-btn"
              onClick={() => setIsStreaming(!isStreaming)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isStreaming ? 'Pause Stream' : 'Resume Stream'}
            </button>
            <button
              id="emit-single-pair-btn"
              onClick={emitSinglePair}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Emit Single Pair
            </button>
          </div>
        </div>
      </div>

      {/* Main D3 Interactive Visualisation Stage */}
      <div
        id="entanglement-stage"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Real-Time D3 Entangled Photon Transmission
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Total Pairs Measured: {emissionCount}
          </span>
        </div>

        <div className="w-full flex justify-center bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg p-2 overflow-x-auto">
          <svg ref={animSvgRef} className="w-full max-w-[640px] h-[180px]" />
        </div>

        {/* Bell State Selection Chips */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
            Select Entangled Bell State:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'phi_plus', label: '|Phi+>', formula: '(|00> + |11>) / sqrt(2)', desc: 'Correlated in Z and X bases' },
              { id: 'phi_minus', label: '|Phi->', formula: '(|00> - |11>) / sqrt(2)', desc: 'Phase-flipped correlation' },
              { id: 'psi_plus', label: '|Psi+>', formula: '(|01> + |10>) / sqrt(2)', desc: 'Symmetric anti-correlated' },
              { id: 'psi_minus', label: '|Psi->', formula: '(|01> - |10>) / sqrt(2)', desc: 'EPR Singlet (isotropic anti-correlation)' },
            ].map((state) => (
              <button
                key={state.id}
                onClick={() => setBellState(state.id)}
                className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                  bellState === state.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  {state.label}
                </div>
                <div className="font-mono text-xs text-slate-800 dark:text-slate-200 mt-0.5">
                  {state.formula}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {state.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Detector Angle Modulation and CHSH Inequality Test */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Detector Angle Controls */}
        <div
          id="detector-controls"
          className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Detector Polariser Angles
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-cyan-600 dark:text-cyan-400">
                Alice Measurement Polariser Angle (theta_A):
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {(angleA * (180 / Math.PI)).toFixed(0)} deg
              </span>
            </div>
            <input
              id="alice-angle-slider"
              type="range"
              min="0"
              max={Math.PI}
              step="0.02"
              value={angleA}
              onChange={(e) => setAngleA(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex gap-2 mt-1.5">
              {[0, 45, 90].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setAngleA((deg * Math.PI) / 180)}
                  className="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-mono"
                >
                  {deg} deg
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-rose-600 dark:text-rose-400">
                Bob Measurement Polariser Angle (theta_B):
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {(angleB * (180 / Math.PI)).toFixed(0)} deg
              </span>
            </div>
            <input
              id="bob-angle-slider"
              type="range"
              min="0"
              max={Math.PI}
              step="0.02"
              value={angleB}
              onChange={(e) => setAngleB(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex gap-2 mt-1.5">
              {[0, 45, 90].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setAngleB((deg * Math.PI) / 180)}
                  className="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-mono"
                >
                  {deg} deg
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Correlation Expectation E(theta_A, theta_B):</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {currentCorrelation.toFixed(3)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              When angles align, correlation is 1.0 (strict match). When orthogonal, correlation is 0.0 (independent).
            </p>
          </div>
        </div>

        {/* Right: CHSH Bell Inequality Real-time Violation Meter */}
        <div
          id="chsh-panel"
          className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-500" />
              CHSH Bell Inequality Test
            </h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                chshResult.S > 2.0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {chshResult.S > 2.0 ? 'Quantum Violation Confirmed' : 'Classical Realm'}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              Calculated Bell Correlation Parameter S:
            </span>
            <div className="font-mono text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              S = {chshResult.S.toFixed(3)}
            </div>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400">
                Classical Limit: <strong className="text-amber-600 dark:text-amber-400">&lt;= 2.000</strong>
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Tsirelson Bound: <strong className="text-indigo-600 dark:text-indigo-400">2.828</strong>
              </span>
            </div>
          </div>

          {/* Meter bar */}
          <div>
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
              {/* Classical boundary marker at 2.0 / 3.0 = 66.6% */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
                style={{ left: `${(2.0 / 3.0) * 100}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (chshResult.S / 3.0) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>S = 0</span>
              <span>S = 2.0 (Classical Limit)</span>
              <span>S = 2.828 (Max Quantum)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300">
            <strong>Key Physical Consequence:</strong> Because S &gt; 2, this experiment conclusively refutes
            local hidden-variable theories. Nature is fundamentally non-local or non-counterfactually definite.
          </div>
        </div>
      </div>

      {/* Recent Coincidence Detections Table */}
      <div
        id="coincidence-table"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Coincident Measurement Stream (Last 8 Arrivals)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2 px-3">Arrival</th>
                <th className="py-2 px-3 text-cyan-600 dark:text-cyan-400">Alice Detector Outcome</th>
                <th className="py-2 px-3 text-rose-600 dark:text-rose-400">Bob Detector Outcome</th>
                <th className="py-2 px-3">Correlation Match</th>
              </tr>
            </thead>
            <tbody>
              {coincidenceHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500">
                    Waiting for initial pairs... Ensure stream is running or click 'Emit Single Pair'.
                  </td>
                </tr>
              ) : (
                coincidenceHistory.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono"
                  >
                    <td className="py-2 px-3 text-slate-500">#{emissionCount - idx}</td>
                    <td className="py-2 px-3 font-bold text-cyan-600 dark:text-cyan-400">
                      {item.aOutcome > 0 ? '+1 (Spin Up)' : '-1 (Spin Down)'}
                    </td>
                    <td className="py-2 px-3 font-bold text-rose-600 dark:text-rose-400">
                      {item.bOutcome > 0 ? '+1 (Spin Up)' : '-1 (Spin Down)'}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.match
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.match ? 'Correlated Match' : 'Anti-Match'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
