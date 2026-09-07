import React, { useState } from 'react';
import { HARDWARE_STAGES, SIGNAL_PATH_STEPS } from '../data/quantumHardwareData';
import { HardwareStage } from '../types';
import {
  Thermometer,
  Layers,
  Cpu,
  Radio,
  Eye,
  Minimize2,
  Maximize2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface HardwareViewerProps {
  onStageInspected?: (stageId: string) => void;
  isDark: boolean;
}

export const QuantumHardwareViewer: React.FC<HardwareViewerProps> = ({
  onStageInspected,
  isDark,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('stage_qpu');
  const [isExplodedView, setIsExplodedView] = useState<boolean>(true);
  const [activeSignalStep, setActiveSignalStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'refrigerator' | 'qpu_chip' | 'signal_path'>('refrigerator');

  const selectedStage: HardwareStage =
    HARDWARE_STAGES.find((s) => s.id === selectedStageId) || HARDWARE_STAGES[6];

  const handleStageSelect = (id: string) => {
    setSelectedStageId(id);
    onStageInspected?.(id);
  };

  // Temperature color scale
  const getTempColor = (kelvin: number) => {
    if (kelvin >= 200) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    if (kelvin >= 40) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800';
    if (kelvin >= 3) return 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800';
    if (kelvin >= 0.5) return 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
    return 'text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800';
  };

  return (
    <div id="quantum-hardware-module" className="space-y-6">
      {/* Header */}
      <div
        id="hardware-header"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                Cryogenic Architecture
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Working Quantum Computer Hardware and Dilution Refrigerator
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Superconducting quantum computing relies on a multi-stage dilution refrigerator (the "golden chandelier")
              to isolate qubits at 15 milliKelvin, colder than the 2.7 Kelvin cosmic background of deep outer space.
              Inspect every structural layer, microwave line, and transmon chip element below.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              id="exploded-view-toggle"
              onClick={() => setIsExplodedView(!isExplodedView)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center gap-2 transition cursor-pointer"
            >
              {isExplodedView ? <Minimize2 className="w-4 h-4 text-amber-500" /> : <Maximize2 className="w-4 h-4 text-amber-500" />}
              {isExplodedView ? 'Assemble Chandelier' : 'Disassemble / Explode Stages'}
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('refrigerator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'refrigerator'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Dilution Refrigerator Stages ({HARDWARE_STAGES.length} Levels)
          </button>
          <button
            onClick={() => setActiveTab('qpu_chip')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qpu_chip'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            QPU Silicon Microchip Architecture
          </button>
          <button
            onClick={() => setActiveTab('signal_path')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'signal_path'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Microwave Pulse Signal Path Tracer
          </button>
        </div>
      </div>

      {activeTab === 'refrigerator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Dilution Refrigerator Visualiser */}
          <div
            id="fridge-diagram"
            className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isExplodedView ? 'Exploded / Disassembled View' : 'Assembled Working Configuration'}
              </span>
              <span className="text-xs text-slate-400">Click any stage to inspect</span>
            </div>

            {/* Schematic Chandelier SVG / Layered Layout */}
            <div className="w-full max-w-[420px] flex flex-col items-center py-2 space-y-2">
              {HARDWARE_STAGES.map((stage, idx) => {
                const isSelected = stage.id === selectedStageId;
                const widthPercent = Math.max(38, Math.round(stage.widthRatio * 100));
                const spacingClass = isExplodedView ? 'my-2.5' : 'my-0.5';

                return (
                  <div
                    key={stage.id}
                    onClick={() => handleStageSelect(stage.id)}
                    className={`w-full flex flex-col items-center transition-all duration-300 cursor-pointer ${spacingClass}`}
                  >
                    {/* Connecting Cryogenic Rods / Superconducting Cables */}
                    {idx > 0 && isExplodedView && (
                      <div className="h-4 flex items-center justify-center gap-6">
                        <div className="w-0.5 h-full bg-amber-400/80" title="Superconducting RF Coaxial Lines" />
                        <div className="w-1 h-full bg-slate-400 dark:bg-slate-600" title="Structural Titanium Truss Rod" />
                        <div className="w-0.5 h-full bg-amber-400/80" title="Superconducting RF Coaxial Lines" />
                      </div>
                    )}

                    {/* Stage Bulkhead Plate */}
                    <div
                      style={{ width: `${widthPercent}%` }}
                      className={`relative rounded-xl p-3 border text-center transition-all shadow-xs ${
                        isSelected
                          ? 'border-amber-500 bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 ring-2 ring-amber-500 scale-102'
                          : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 hover:border-amber-400 dark:hover:border-amber-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-100 truncate pr-1">
                          {stage.name}
                        </span>
                        <span className="font-mono font-bold text-[11px] text-amber-600 dark:text-amber-400 shrink-0">
                          {stage.temperatureDisplay.split(' ')[0]}
                        </span>
                      </div>

                      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {stage.keyComponents[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Stage Deep Technical Inspector */}
          <div
            id="stage-detail-panel"
            className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Stage Engineering Analysis
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedStage.name}
                </h3>
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-sm ${getTempColor(
                  selectedStage.temperatureKelvin
                )}`}
              >
                {selectedStage.temperatureDisplay}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Functional Overview
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedStage.description}
              </p>
            </div>

            {/* Role in Quantum Computing */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Cryogenic and Computational Objective
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {selectedStage.engineeringRole}
              </p>
            </div>

            {/* Sub-Components List */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                Key Cryogenic and Microwave Hardware
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedStage.keyComponents.map((comp, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials and Thermal Dissipation */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Materials Used:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedStage.materials.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Cooling / Thermal Load:</span>
                <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
                  {selectedStage.thermalLoadWatts}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QPU Silicon Microchip View */}
      {activeTab === 'qpu_chip' && (
        <div
          id="qpu-chip-view"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-6"
        >
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-500" />
              Microscopic Architecture of a Superconducting Transmon QPU
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              At 15 milliKelvin, the silicon chip operates in a dissipation-free superconducting regime.
              Qubits are planar circuits composed of Josephson junctions, shunt capacitors, and coplanar waveguide resonators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm mb-3">
                JJ
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Josephson Junction (Al/AlOx/Al)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Two aluminium superconducting films separated by a 1-nanometre aluminium oxide tunnel barrier.
                Provides non-linear inductance that separates the |0&gt; to |1&gt; transition frequency (5 GHz) from higher energy transitions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-sm mb-3">
                CPW
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Coplanar Waveguide (CPW) Resonator
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Superconducting transmission line curved into serpentine meanders on the chip. Acts as a microwave cavity
                to read out qubit states non-destructively through dispersive frequency shifts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm mb-3">
                TWPA
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Traveling Wave Parametric Amp (TWPA)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Chained array of thousands of Josephson junctions operating at 15 mK. Amplifies single-photon microwave
                readout signals by +20 dB with quantum-limited noise before routing to 4 K HEMT amplifiers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-slate-700 dark:text-slate-300">
            <strong>Magnetic Shielding:</strong> The QPU is enclosed in nested mu-metal (Cryoperm) cylinders and superconducting
            lead/aluminium cans to attenuate Earth's magnetic field and prevent stray flux vortices from piercing the junctions.
          </div>
        </div>
      )}

      {/* Microwave Signal Path Tracer */}
      {activeTab === 'signal_path' && (
        <div
          id="signal-path-view"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-5"
        >
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-500" />
              Microwave Control & Readout Signal Flow Path
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Follow how an arbitrary waveform generator pulse travels down through progressive cryogenic attenuators to manipulate
              the qubit, and how the returning microwave readout reflection is amplified back to classical electronics.
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3">
            {SIGNAL_PATH_STEPS.map((step, idx) => {
              const isActive = activeSignalStep === idx;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveSignalStep(idx)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {step.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {step.stageName} ({step.temperature})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      {step.powerLevel}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <strong>Selected Step Action:</strong> {SIGNAL_PATH_STEPS[activeSignalStep].role}
          </div>
        </div>
      )}
    </div>
  );
};
