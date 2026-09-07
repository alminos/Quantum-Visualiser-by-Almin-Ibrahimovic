import React, { useState } from 'react';
import { GLOSSARY_TERMS, FORMULA_REFERENCE } from '../data/learningModules';
import {
  BookOpen,
  Search,
  FileText,
  Shield,
  Download,
  Check,
  ExternalLink,
  Info,
} from 'lucide-react';

interface ReferenceProps {
  isDark: boolean;
}

export const ReferenceAndAbout: React.FC<ReferenceProps> = ({ isDark }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyCheatSheet = () => {
    const text = [
      'QUANTUM MECHANICS AND COMPUTING REFERENCE CHEAT SHEET',
      'Hosted at: almin.co.uk/quantum/',
      'Copyright (C) Almin Ibrahimovic. All knowledge used and any code under MIT License.',
      '=====================================================================',
      '',
      '1. CORE FORMULAE AND POSTULATES',
      ...FORMULA_REFERENCE.map(
        (f) => `* ${f.name}\n  Formula: ${f.formula}\n  Condition: ${f.condition}\n  Notes: ${f.description}\n`
      ),
      '=====================================================================',
      '2. GLOSSARY OF QUANTUM TERMINOLOGY',
      ...GLOSSARY_TERMS.map((g) => `* ${g.term}: ${g.definition}\n`),
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopiedCheatSheet(true);
      setTimeout(() => setCopiedCheatSheet(false), 3000);
    });
  };

  return (
    <div id="reference-about-module" className="space-y-6">
      {/* Header */}
      <div
        id="reference-header"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                Offline Reference Library
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Quantum Theory Reference, Formulas, and About
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Complete offline-cached educational compendium. Includes quantum physics formulas, mathematical postulates,
              an interactive glossary, and licensing details for the platform.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-cheatsheet-btn"
              onClick={handleCopyCheatSheet}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-medium text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              {copiedCheatSheet ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
              {copiedCheatSheet ? 'Copied Revision Notes' : 'Copy Full Revision Notes'}
            </button>
          </div>
        </div>
      </div>

      {/* Formula Cheat Sheet */}
      <div
        id="formula-cheatsheet"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-500" />
            Fundamental Quantum Mechanics Formula Sheet
          </h3>
          <span className="text-xs text-slate-400 font-mono">Dirac & Matrix Notation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORMULA_REFERENCE.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2"
            >
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                {item.name}
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-cyan-600 dark:text-cyan-400 overflow-x-auto">
                {item.formula}
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Condition: {item.condition}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Searchable Glossary */}
      <div
        id="quantum-glossary"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-500" />
            Quantum Computing Glossary ({filteredGlossary.length} Definitions)
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="glossary-search-input"
              type="text"
              placeholder="Search terms or concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
            >
              <div className="font-bold text-xs text-purple-600 dark:text-purple-400 mb-1">
                {item.term}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* About and Legal License Card */}
      <div
        id="about-license-section"
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            About This Educational Platform and Open Source Licensing
          </h3>
        </div>

        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            This interactive quantum computing educational system has been engineered to provide rigorous, intuitive
            visualisations of quantum superposition, non-local entanglement, reversible logic gates, and the physical
            cryogenic engineering of a dilution refrigerator quantum computer.
          </p>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white">
              Host Destination:
            </div>
            <div className="font-mono text-indigo-600 dark:text-indigo-400">
              almin.co.uk/quantum/
            </div>

            <div className="font-semibold text-slate-900 dark:text-white pt-2">
              Copyright Notice:
            </div>
            <div className="font-mono text-slate-800 dark:text-slate-200">
              Copyright (C) Almin Ibrahimovic
            </div>

            <div className="font-semibold text-slate-900 dark:text-white pt-2">
              Licensing Terms:
            </div>
            <div className="font-mono text-slate-800 dark:text-slate-200">
              All knowledge used and any code under MIT License.
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400">
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
            documentation files, to deal in the Software without restriction, including without limitation the rights to
            use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the
            retention of the copyright notice and permission notice.
          </p>
        </div>
      </div>
    </div>
  );
};
