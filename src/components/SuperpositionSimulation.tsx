import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RotateCw, Play, RefreshCw, Layers, Compass, CheckCircle } from 'lucide-react';
import { stateFromAngles, applyGateToQubit, complexMagSq, complexFormat } from '../utils/quantumMath';
import { QubitState } from '../types';

interface SuperpositionProps {
  onExperimentComplete?: (condition: string) => void;
  isDark: boolean;
}

export const SuperpositionSimulation: React.FC<SuperpositionProps> = ({
  onExperimentComplete,
  isDark,
}) => {
  const [theta, setTheta] = useState<number>(Math.PI / 2);
  const [phi, setPhi] = useState<number>(0);
  const [shotsResult, setShotsResult] = useState<{ zero: number; one: number; total: number } | null>(null);
  const [lastMeasured, setLastMeasured] = useState<'0' | '1' | null>(null);
  const [isCollapsing, setIsCollapsing] = useState<boolean>(false);
  const [interferenceMode, setInterferenceMode] = useState<boolean>(true);
  const [detectorObserved, setDetectorObserved] = useState<boolean>(false);

  const blochSvgRef = useRef<SVGSVGElement | null>(null);
  const interferenceSvgRef = useRef<SVGSVGElement | null>(null);

  const currentState: QubitState = stateFromAngles(theta, phi);
  const prob0 = complexMagSq(currentState.alpha);
  const prob1 = complexMagSq(currentState.beta);

  const reportedMilestones = useRef<Set<string>>(new Set());

  // Check educational tasks
  useEffect(() => {
    if (Math.abs(prob0 - 0.5) < 0.04 && Math.abs(prob1 - 0.5) < 0.04) {
      if (!reportedMilestones.current.has('equal_superposition')) {
        reportedMilestones.current.add('equal_superposition');
        onExperimentComplete?.('equal_superposition');
      }
    }
    if (Math.abs(phi - Math.PI) < 0.1) {
      if (!reportedMilestones.current.has('phase_shift_180')) {
        reportedMilestones.current.add('phase_shift_180');
        onExperimentComplete?.('phase_shift_180');
      }
    }
  }, [prob0, prob1, phi, onExperimentComplete]);

  // Render D3 Bloch Sphere
  useEffect(() => {
    if (!blochSvgRef.current) return;
    const svg = d3.select(blochSvgRef.current);
    svg.selectAll('*').remove();

    const width = 340;
    const height = 340;
    const cx = width / 2;
    const cy = height / 2;
    const r = 115;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${cx}, ${cy})`);

    const sphereColor = isDark ? '#1e293b' : '#f1f5f9';
    const wireColor = isDark ? '#334155' : '#cbd5e1';
    const axisColor = isDark ? '#64748b' : '#94a3b8';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Outer sphere circle
    g.append('circle')
      .attr('r', r)
      .attr('fill', sphereColor)
      .attr('fill-opacity', isDark ? 0.35 : 0.6)
      .attr('stroke', wireColor)
      .attr('stroke-width', 1.5);

    // Latitude ellipses (equator and tilted grid)
    g.append('ellipse')
      .attr('rx', r)
      .attr('ry', r * 0.34)
      .attr('fill', 'none')
      .attr('stroke', wireColor)
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '4 4');

    // Axes
    // Z axis (vertical: |0> at top, |1> at bottom)
    g.append('line')
      .attr('x1', 0)
      .attr('y1', -r - 20)
      .attr('x2', 0)
      .attr('y2', r + 20)
      .attr('stroke', axisColor)
      .attr('stroke-width', 1.5);

    // X axis (oblique perspective)
    g.append('line')
      .attr('x1', -r * 0.7)
      .attr('y1', r * 0.25)
      .attr('x2', r * 0.7)
      .attr('y2', -r * 0.25)
      .attr('stroke', axisColor)
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '3 3');

    // Y axis (horizontal)
    g.append('line')
      .attr('x1', -r - 18)
      .attr('y1', 0)
      .attr('x2', r + 18)
      .attr('y2', 0)
      .attr('stroke', axisColor)
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '3 3');

    // Labels
    g.append('text')
      .attr('x', 0)
      .attr('y', -r - 26)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .attr('fill', isDark ? '#38bdf8' : '#0284c7')
      .text('|0>');

    g.append('text')
      .attr('x', 0)
      .attr('y', r + 36)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .attr('fill', isDark ? '#f43f5e' : '#e11d48')
      .text('|1>');

    g.append('text')
      .attr('x', r + 24)
      .attr('y', 4)
      .attr('font-size', '11px')
      .attr('fill', textColor)
      .text('+y');

    g.append('text')
      .attr('x', -r * 0.7 - 16)
      .attr('y', r * 0.25 + 14)
      .attr('font-size', '11px')
      .attr('fill', textColor)
      .text('+x');

    // Calculate 3D to 2D projection for state vector
    // Standard spherical coordinates:
    // x = r * sin(theta) * cos(phi)
    // y = r * sin(theta) * sin(phi)
    // z = r * cos(theta) (where +z is up = |0>)
    // Perspective mapping:
    const x3d = Math.sin(theta) * Math.cos(phi);
    const y3d = Math.sin(theta) * Math.sin(phi);
    const z3d = Math.cos(theta);

    // Projected coordinates:
    const projX = r * (y3d * 0.866 - x3d * 0.45);
    const projY = r * (-z3d + x3d * 0.25 * 0.5);

    // Equatorial projection line
    const eqX = r * (y3d * 0.866 - x3d * 0.45);
    const eqY = r * (x3d * 0.25 * 0.5);

    g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', eqX)
      .attr('y2', eqY)
      .attr('stroke', isDark ? '#475569' : '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 2');

    g.append('line')
      .attr('x1', eqX)
      .attr('y1', eqY)
      .attr('x2', projX)
      .attr('y2', projY)
      .attr('stroke', isDark ? '#475569' : '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 2');

    // Arrow marker definition
    const defs = svg.append('defs');
    defs
      .append('marker')
      .attr('id', 'arrow-head')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 6)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 1 L 9 5 L 0 9 z')
      .attr('fill', '#38bdf8');

    // Animated State Vector Arrow
    const vectorLine = g
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', projX)
      .attr('y2', projY)
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 3.5)
      .attr('marker-end', 'url(#arrow-head)');

    // Vector Tip Node
    g.append('circle')
      .attr('cx', projX)
      .attr('cy', projY)
      .attr('r', 5)
      .attr('fill', '#38bdf8')
      .attr('stroke', isDark ? '#090d16' : '#ffffff')
      .attr('stroke-width', 1.5);

    // Origin Node
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 3.5)
      .attr('fill', axisColor);

    // Label for State vector |psi>
    g.append('text')
      .attr('x', projX + 12)
      .attr('y', projY - 6)
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .attr('fill', '#38bdf8')
      .text('|psi>');
  }, [theta, phi, isDark]);

  // Render D3 Quantum Wave Interference (Double-Slit Analogy)
  useEffect(() => {
    if (!interferenceSvgRef.current) return;
    const svg = d3.select(interferenceSvgRef.current);
    svg.selectAll('*').remove();

    const width = 420;
    const height = 180;
    const g = svg.attr('viewBox', `0 0 ${width} ${height}`).append('g');

    const numPoints = 140;
    const screenX = width - 40;
    const slitX = 90;
    const sourceX = 20;
    const cy = height / 2;

    // Slit barrier
    g.append('line')
      .attr('x1', slitX)
      .attr('y1', 10)
      .attr('x2', slitX)
      .attr('y2', cy - 25)
      .attr('stroke', isDark ? '#475569' : '#94a3b8')
      .attr('stroke-width', 4);

    g.append('line')
      .attr('x1', slitX)
      .attr('y1', cy - 10)
      .attr('x2', slitX)
      .attr('y2', cy + 10)
      .attr('stroke', isDark ? '#475569' : '#94a3b8')
      .attr('stroke-width', 4);

    g.append('line')
      .attr('x1', slitX)
      .attr('y1', cy + 25)
      .attr('x2', slitX)
      .attr('y2', height - 10)
      .attr('stroke', isDark ? '#475569' : '#94a3b8')
      .attr('stroke-width', 4);

    // Labels for slits
    g.append('text')
      .attr('x', slitX - 6)
      .attr('y', cy - 17)
      .attr('text-anchor', 'end')
      .attr('font-size', '10px')
      .attr('fill', isDark ? '#94a3b8' : '#64748b')
      .text('Slit A (|0>)');

    g.append('text')
      .attr('x', slitX - 6)
      .attr('y', cy + 21)
      .attr('text-anchor', 'end')
      .attr('font-size', '10px')
      .attr('fill', isDark ? '#94a3b8' : '#64748b')
      .text('Slit B (|1>)');

    // Detector icon if observed
    if (detectorObserved) {
      g.append('circle')
        .attr('cx', slitX + 15)
        .attr('cy', cy - 18)
        .attr('r', 6)
        .attr('fill', '#f43f5e');

      g.append('text')
        .attr('x', slitX + 26)
        .attr('y', cy - 14)
        .attr('font-size', '10px')
        .attr('fill', '#f43f5e')
        .attr('font-weight', '600')
        .text('Observer Active: Collapse');
    }

    // Detection Screen
    g.append('line')
      .attr('x1', screenX)
      .attr('y1', 10)
      .attr('x2', screenX)
      .attr('y2', height - 10)
      .attr('stroke', isDark ? '#334155' : '#cbd5e1')
      .attr('stroke-width', 2);

    // Calculate intensity distribution on screen
    const points: [number, number][] = [];
    const stepY = (height - 30) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const y = 15 + i * stepY;
      const d1 = Math.sqrt(Math.pow(screenX - slitX, 2) + Math.pow(y - (cy - 18), 2));
      const d2 = Math.sqrt(Math.pow(screenX - slitX, 2) + Math.pow(y - (cy + 18), 2));
      const lambda = 12; // wavelength

      let intensity: number;
      if (detectorObserved) {
        // Classical mixture: sum of probabilities without interference term
        const i1 = prob0 * Math.exp(-Math.pow(y - (cy - 18), 2) / 1200);
        const i2 = prob1 * Math.exp(-Math.pow(y - (cy + 18), 2) / 1200);
        intensity = i1 + i2;
      } else {
        // Coherent quantum superposition with phase difference
        const phaseDiff = ((2 * Math.PI) / lambda) * (d1 - d2) + phi;
        const envelope = Math.exp(-Math.pow(y - cy, 2) / 3200);
        // Intensity = |alpha|^2 + |beta|^2 + 2*|alpha|*|beta|*cos(delta)
        const iInterference =
          prob0 + prob1 + 2 * Math.sqrt(prob0 * prob1) * Math.cos(phaseDiff);
        intensity = iInterference * envelope;
      }

      const barLength = Math.max(0, intensity * 70);
      points.push([screenX + barLength, y]);
    }

    // Render smooth curve on screen
    const lineGenerator = d3
      .line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveBasis);

    const areaGenerator = d3
      .area<[number, number]>()
      .x0(screenX)
      .x1((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveBasis);

    g.append('path')
      .datum(points)
      .attr('d', areaGenerator)
      .attr('fill', detectorObserved ? '#f43f5e' : '#38bdf8')
      .attr('fill-opacity', 0.25);

    g.append('path')
      .datum(points)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', detectorObserved ? '#f43f5e' : '#38bdf8')
      .attr('stroke-width', 2);
  }, [prob0, prob1, phi, detectorObserved, isDark]);

  // Single Projective Measurement
  const handleMeasureOnce = () => {
    setIsCollapsing(true);
    setTimeout(() => {
      const outcome = Math.random() < prob0 ? '0' : '1';
      setLastMeasured(outcome);
      setIsCollapsing(false);
      // Project state
      if (outcome === '0') {
        setTheta(0);
        setPhi(0);
      } else {
        setTheta(Math.PI);
        setPhi(0);
      }
    }, 400);
  };

  // Run 1,000 Monte Carlo Shots
  const handleRunShots = (numShots = 1000) => {
    let count0 = 0;
    for (let i = 0; i < numShots; i++) {
      if (Math.random() < prob0) {
        count0++;
      }
    }
    const result = {
      zero: count0,
      one: numShots - count0,
      total: numShots,
    };
    setShotsResult(result);
    onExperimentComplete?.('measurement_batch_run');
  };

  // Quick Preset Gates
  const handleApplyGate = (gate: string) => {
    const nextState = applyGateToQubit(currentState, gate);
    setTheta(nextState.theta);
    setPhi(nextState.phi);
  };

  return (
    <div id="superposition-module" className="space-y-6">
      {/* Overview Card */}
      <div
        id="superposition-header"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300">
                Core Principle
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Quantum Superposition and Wave Interference
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              In quantum mechanics, a qubit is not confined to being definitely 0 or 1. It occupies a linear combination
              of both states simultaneously: <code className="font-mono text-cyan-600 dark:text-cyan-400">|psi&gt; = alpha|0&gt; + beta|1&gt;</code>.
              Adjust the geometric angles below to manipulate the state amplitudes and observe the corresponding phase interference.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="measure-state-btn"
              onClick={handleMeasureOnce}
              disabled={isCollapsing}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium text-sm flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isCollapsing ? 'animate-spin' : ''}`} />
              Measure Once
            </button>
            <button
              id="run-1000-shots-btn"
              onClick={() => handleRunShots(1000)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-500" />
              Run 1,000 Shots
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Bloch Sphere, Statevector Math, and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive D3 Bloch Sphere */}
        <div
          id="bloch-sphere-panel"
          className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex flex-col items-center justify-center shadow-xs"
        >
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-500" />
              Bloch Sphere Visualisation
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              theta: {(theta * (180 / Math.PI)).toFixed(1)} deg | phi: {(phi * (180 / Math.PI)).toFixed(1)} deg
            </span>
          </div>

          <div className="relative w-full flex justify-center items-center py-2">
            <svg ref={blochSvgRef} className="w-full max-w-[320px] h-[320px] overflow-visible" />
            {isCollapsing && (
              <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/10 backdrop-blur-xs rounded-xl animate-pulse">
                <span className="text-sm font-bold text-cyan-400 tracking-wide">Collapsing Wavefunction...</span>
              </div>
            )}
          </div>

          {lastMeasured && (
            <div className="mt-2 w-full p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">Last Observation: </span>
              <span className="text-sm font-mono font-bold text-cyan-500">
                Collapsed to state |{lastMeasured}&gt;
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Parameters, Gate Operations, and Probabilities */}
        <div className="lg:col-span-7 space-y-5">
          {/* State Formula & Probability Gauges */}
          <div
            id="state-math-panel"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              State Vector Representation
            </h3>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 font-mono text-base text-center overflow-x-auto text-slate-900 dark:text-slate-100">
              |psi&gt; = <span className="text-cyan-600 dark:text-cyan-400 font-bold">{complexFormat(currentState.alpha)}</span> |0&gt; +{' '}
              <span className="text-rose-600 dark:text-rose-400 font-bold">{complexFormat(currentState.beta)}</span> |1&gt;
            </div>

            {/* Probability Bars */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-cyan-600 dark:text-cyan-400">P(|0&gt;) = |alpha|^2</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{(prob0 * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300 rounded-full"
                    style={{ width: `${prob0 * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-600 dark:text-rose-400">P(|1&gt;) = |beta|^2</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{(prob1 * 100).toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-300 rounded-full"
                    style={{ width: `${prob1 * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Spherical Sliders */}
          <div
            id="angle-controls"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Spherical Angle Modulators
            </h3>

            {/* Theta Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Polar Angle (theta) - Amplitude Balance:
                </span>
                <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                  {(theta * (180 / Math.PI)).toFixed(0)} deg ({(theta / Math.PI).toFixed(2)} pi)
                </span>
              </div>
              <input
                id="theta-slider"
                type="range"
                min="0"
                max={Math.PI}
                step="0.01"
                value={theta}
                onChange={(e) => setTheta(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0 deg (|0&gt;)</span>
                <span>90 deg (Equal Superposition)</span>
                <span>180 deg (|1&gt;)</span>
              </div>
            </div>

            {/* Phi Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Azimuthal Angle (phi) - Relative Phase:
                </span>
                <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                  {(phi * (180 / Math.PI)).toFixed(0)} deg ({(phi / Math.PI).toFixed(2)} pi)
                </span>
              </div>
              <input
                id="phi-slider"
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.01"
                value={phi}
                onChange={(e) => setPhi(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0 deg (+x)</span>
                <span>90 deg (+y)</span>
                <span>180 deg (-x)</span>
                <span>270 deg (-y)</span>
                <span>360 deg</span>
              </div>
            </div>

            {/* Instant State Presets */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-medium">
                Apply Single-Qubit Rotation Gates:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {[
                  { label: 'Reset |0>', action: () => { setTheta(0); setPhi(0); } },
                  { label: 'Hadamard', action: () => handleApplyGate('H') },
                  { label: 'Pauli-X', action: () => handleApplyGate('X') },
                  { label: 'Pauli-Y', action: () => handleApplyGate('Y') },
                  { label: 'Pauli-Z', action: () => handleApplyGate('Z') },
                  { label: 'Phase (S)', action: () => handleApplyGate('S') },
                  { label: 'pi/8 (T)', action: () => handleApplyGate('T') },
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={btn.action}
                    className="px-2 py-1.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition cursor-pointer text-center truncate"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave-Particle Duality and Quantum Interference Panel */}
      <div
        id="interference-panel"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" />
              Quantum Double-Slit Wave Interference Simulation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Superposition causes probability amplitudes from Slit A (|0&gt;) and Slit B (|1&gt;) to interfere.
              Toggling detector observation destroys the interference fringes and recovers classical probabilities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                id="detector-observed-toggle"
                type="checkbox"
                checked={detectorObserved}
                onChange={(e) => setDetectorObserved(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-slate-700 cursor-pointer"
              />
              Activate Observer at Slit (Which-Way Measurement)
            </label>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-center overflow-x-auto">
          <svg ref={interferenceSvgRef} className="w-full max-w-[640px] h-[180px]" />
        </div>

        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>
            {detectorObserved
              ? 'Status: Wavefunction collapsed at slit detector. Classical addition of intensities: P_total = P_A + P_B.'
              : 'Status: Pure coherent superposition. Phase interference term active: 2*sqrt(P_A * P_B)*cos(delta).'}
          </span>
          <span className="font-mono text-cyan-600 dark:text-cyan-400">
            Phase delta = {(phi * (180 / Math.PI)).toFixed(0)} deg
          </span>
        </div>
      </div>

      {/* 1,000 Shots Histogram Modal/Panel */}
      {shotsResult && (
        <div
          id="shots-result-box"
          className="rounded-xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50/60 dark:bg-cyan-950/30 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-cyan-900 dark:text-cyan-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-500" />
              Monte Carlo Measurement Results ({shotsResult.total} Experimental Shots)
            </h4>
            <button
              onClick={() => setShotsResult(null)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-cyan-100 dark:border-cyan-900">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">State |0&gt; Measured:</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                  {shotsResult.zero} counts ({((shotsResult.zero / shotsResult.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${(shotsResult.zero / shotsResult.total) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Theoretical Born expectation: {(prob0 * 100).toFixed(1)}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-cyan-100 dark:border-cyan-900">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">State |1&gt; Measured:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
                  {shotsResult.one} counts ({((shotsResult.one / shotsResult.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${(shotsResult.one / shotsResult.total) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Theoretical Born expectation: {(prob1 * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
