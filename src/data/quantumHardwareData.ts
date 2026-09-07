import { HardwareStage, SignalPathPoint } from '../types';

export const HARDWARE_STAGES: HardwareStage[] = [
  {
    id: 'stage_300k',
    name: 'Room Temperature Flange & Control Racks',
    temperatureKelvin: 300,
    temperatureDisplay: '300 K (27 deg C)',
    description:
      'The classical boundary containing FPGA control electronics, arbitrary waveform generators (AWG), and high-frequency microwave pulse synthesisers. Converts classical software instructions into microsecond-calibrated gigahertz microwave pulses.',
    engineeringRole:
      'Generates qubit control and readout pulses (4 to 8 GHz) and digitises returning reflected microwave signals after computational operations.',
    keyComponents: [
      'FPGA Control Module Units',
      'Arbitrary Waveform Generators (AWG)',
      'Microwave Local Oscillators (LO)',
      'High-speed Analogue-to-Digital Digitiser Racks',
      'Helium-3 / Helium-4 Gas Handling System (GHS)',
    ],
    materials: ['Gold-plated Aluminium', 'Stainless Steel Bellows', 'O-Ring Vacuum Seals'],
    thermalLoadWatts: 'Ambient Room Environment',
    heightRatio: 0.16,
    widthRatio: 1.0,
  },
  {
    id: 'stage_50k',
    name: '50 Kelvin Thermal Shield & Outer Stage',
    temperatureKelvin: 50,
    temperatureDisplay: '50 K (-223 deg C)',
    description:
      'First cryogenic interception barrier cooled by the 1st stage of the closed-cycle Pulse Tube Cryocooler. Absorbs blackbody thermal radiation entering from room temperature.',
    engineeringRole:
      'Intercepts conductive and radiative heat loads. Thermal anchoring for outer coaxial transmission lines.',
    keyComponents: [
      'Pulse Tube 1st Stage Cold Head',
      'Polished Gold-plated Thermal Radiation Shields',
      'Cryogenic Beryllium-Copper Wiring Looms',
      '30 dB Thermal Attenuators (Initial Stage)',
    ],
    materials: ['Oxygen-Free High Conductivity (OFHC) Copper', 'Gold Plating', 'Stainless Steel Flanges'],
    thermalLoadWatts: '40 Watts cooling capacity',
    heightRatio: 0.14,
    widthRatio: 0.88,
  },
  {
    id: 'stage_4k',
    name: '4 Kelvin Intercept Plate',
    temperatureKelvin: 4.2,
    temperatureDisplay: '4.2 K (-269 deg C)',
    description:
      'Second stage of the Pulse Tube Cryocooler, bringing the refrigerator down to the liquid helium boiling point. At this temperature, standard copper cables transition into superconducting wiring.',
    engineeringRole:
      'Powers the High Electron Mobility Transistor (HEMT) low-noise amplifiers. Pre-cools incoming helium mixture before condensation.',
    keyComponents: [
      'Pulse Tube 2nd Stage Refrigerator',
      'Cryogenic HEMT Low-Noise Amplifiers (+40 dB gain)',
      'Superconducting Niobium-Titanium (NbTi) Coaxial Leads',
      'Primary Condensation Capillaries & Flow Impedance Needles',
    ],
    materials: ['High Purity OFHC Copper', 'Niobium-Titanium Superconducting Alloys', 'Beryllium-Copper'],
    thermalLoadWatts: '1.5 Watts cooling capacity',
    heightRatio: 0.15,
    widthRatio: 0.76,
  },
  {
    id: 'stage_still',
    name: 'Still Stage (Distillation Chamber)',
    temperatureKelvin: 0.8,
    temperatureDisplay: '800 mK (-272.35 deg C)',
    description:
      'The Still stage distils pure Helium-3 from the concentrated phase of the Helium-3/Helium-4 mixture. An electric heater selectively vaporises Helium-3 due to its higher vapour pressure at sub-Kelvin temperatures.',
    engineeringRole:
      'Drives the continuous circulation loop of the dilution refrigerator by boiling off and pumping Helium-3 gas back up to the room-temperature compressor.',
    keyComponents: [
      'Still Distillation Vessel & Sintered Heat Exchanger',
      'Electric Still Joule-Heating Element (1 to 5 mW)',
      'Continuous Concentric Tube Heat Exchangers',
      'Cryogenic Coaxial Attenuator Blocks (-10 dB)',
    ],
    materials: ['Sintered Silver Powder', 'OFHC Copper', 'Cupronickel Capillaries'],
    thermalLoadWatts: '10 to 20 milliWatts',
    heightRatio: 0.14,
    widthRatio: 0.65,
  },
  {
    id: 'stage_coldplate',
    name: '100 mK Cold Plate & Heat Exchanger',
    temperatureKelvin: 0.1,
    temperatureDisplay: '100 mK (-273.05 deg C)',
    description:
      'Intermediate temperature staging plate utilising sintered silver step heat exchangers. Further suppresses thermal microwave photons traveling down the control lines before reaching the qubits.',
    engineeringRole:
      'Absorbs residual Johnson-Nyquist thermal noise. Employs Eccosorb infrared attenuation filters to protect sensitive quantum coherence.',
    keyComponents: [
      'Step Heat Exchangers with Ultra-Fine Silver Matrix',
      'Eccosorb Infrared Low-Pass Filters (blocking > 10 GHz radiation)',
      'Thermal Clamping Brackets for Coaxial Lines',
      'Calibrated Ruthenium Oxide Cryogenic Thermometers',
    ],
    materials: ['Sintered Sub-Micron Silver', 'Gold-plated OFHC Copper', 'Eccosorb CR-110 Resin'],
    thermalLoadWatts: '100 to 200 microWatts',
    heightRatio: 0.13,
    widthRatio: 0.54,
  },
  {
    id: 'stage_mxc',
    name: 'Mixing Chamber Stage (15 mK Base)',
    temperatureKelvin: 0.015,
    temperatureDisplay: '15 mK (-273.135 deg C)',
    description:
      'The coldest point in the entire apparatus, colder than the 2.7 K cosmic microwave background of deep interstellar space. The quantum phase separation occurs here: Helium-3 atoms dissolve across the phase boundary into dilute Helium-4, producing endothermic cooling.',
    engineeringRole:
      'Provides the stable ultra-cold base platform for the Quantum Processor Unit. Eliminates thermal thermal excitations (k_B * T << h * f_qubit) so qubits stay in their ground state.',
    keyComponents: [
      'Phase Separation Mixing Chamber Vessel',
      'Traveling Wave Parametric Amplifier (TWPA) with Quantum-Limited Noise',
      'Circulators & Cryogenic Isolators (preventing back-action reflection)',
      'Thermal Straps of 99.999% Pure Annealed Copper',
    ],
    materials: ['Ultra-Pure Annealed OFHC Copper', 'Sintered Platinum/Silver', 'Superconducting Niobium'],
    thermalLoadWatts: '10 to 25 microWatts at 15 mK',
    heightRatio: 0.14,
    widthRatio: 0.44,
  },
  {
    id: 'stage_qpu',
    name: 'Superconducting Quantum Processor (QPU) Package',
    temperatureKelvin: 0.012,
    temperatureDisplay: '12 mK (-273.138 deg C)',
    description:
      'The heart of the quantum computer. Enclosed inside a multi-layer magnetic shielding canister (Cryoperm and Aluminium) that shields qubits from Earth magnetic field and stray cosmic rays.',
    engineeringRole:
      'Hosts the silicon/sapphire microchip with superconducting transmon qubits and coplanar waveguide resonators where superposition and entanglement calculations are executed.',
    keyComponents: [
      'Multi-Layer Cryoperm & High-Permeability Mu-Metal Shields',
      'Superconducting Aluminium / Niobium Transmon Qubits',
      'Josephson Junctions (Aluminium - Aluminium Oxide - Aluminium barriers)',
      'Coplanar Waveguide (CPW) Readout Resonators',
      'Purcell Noise Filters and Inter-Qubit Coupler SQUIDs',
    ],
    materials: ['High-Resistivity Silicon', 'Aluminium Superconductor', 'Mu-Metal Alloy', 'Aluminium Oxide (Al2O3)'],
    thermalLoadWatts: 'Negligible (sub-microwatt dissipation)',
    heightRatio: 0.14,
    widthRatio: 0.34,
  },
];

export const SIGNAL_PATH_STEPS: SignalPathPoint[] = [
  {
    id: 'sp_1',
    label: 'Pulse Generation',
    stageName: '300 K Control Electronics',
    temperature: '300 K',
    role: 'Arbitrary Waveform Generator creates microwave pulse envelope at 5.0 GHz with nanosecond resolution.',
    powerLevel: '0 dBm (1 mW)',
  },
  {
    id: 'sp_2',
    label: 'First Stage Attenuation',
    stageName: '50 K Shield',
    temperature: '50 K',
    role: 'Attenuator reduces incoming thermal blackbody noise and stabilizes signal amplitude.',
    powerLevel: '-20 dBm (0.01 mW)',
  },
  {
    id: 'sp_3',
    label: 'Thermal Noise Suppression',
    stageName: '4 K Plate',
    temperature: '4.2 K',
    role: 'Superconducting NbTi line passes signal through -20 dB attenuator, matching cryogenic impedance.',
    powerLevel: '-40 dBm',
  },
  {
    id: 'sp_4',
    label: 'Infrared Filtering',
    stageName: '100 mK Cold Plate',
    temperature: '100 mK',
    role: 'Eccosorb low-pass filter eliminates stray infrared photons that break Cooper pairs in superconductors.',
    powerLevel: '-50 dBm',
  },
  {
    id: 'sp_5',
    label: 'Base Attenuation & Qubit Drive',
    stageName: '15 mK Mixing Chamber',
    temperature: '15 mK',
    role: 'Final -20 dB attenuator brings power down to single-photon microwave quantum level for transmon gate control.',
    powerLevel: '-70 dBm (~single photon per pulse)',
  },
  {
    id: 'sp_6',
    label: 'Qubit State Manipulation',
    stageName: 'Superconducting QPU',
    temperature: '12 mK',
    role: 'Microwave photon enters coplanar resonator. Superconducting transmon rotates on the Bloch sphere.',
    powerLevel: 'Quantum coherent interaction',
  },
  {
    id: 'sp_7',
    label: 'Quantum-Limited TWPA Amplification',
    stageName: '15 mK Mixing Chamber',
    temperature: '15 mK',
    role: 'Readout pulse carries qubit state information. TWPA amplifies signal by +20 dB with minimal quantum noise.',
    powerLevel: '-50 dBm',
  },
  {
    id: 'sp_8',
    label: 'HEMT Cryogenic Amplification',
    stageName: '4 K Plate',
    temperature: '4.2 K',
    role: 'High Electron Mobility Transistor boosts returning signal by +40 dB to overcome room-temperature cable losses.',
    powerLevel: '-10 dBm',
  },
  {
    id: 'sp_9',
    label: 'Classical Digitisation & Readout',
    stageName: '300 K Control Electronics',
    temperature: '300 K',
    role: 'Demodulation and high-speed analog-to-digital converter determines final state: |0> or |1>.',
    powerLevel: 'Readout classification complete',
  },
];

export const PRESET_CIRCUITS = [
  {
    id: 'bell_phi_plus',
    name: 'Bell State |Phi+>',
    formula: '(|00> + |11>) / sqrt(2)',
    description: 'Generates maximum two-qubit entanglement. Measuring qubit 0 immediately forces qubit 1 into the identical state.',
    numQubits: 2,
    gates: [
      { id: 'g1', type: 'H' as const, targetQubit: 0, step: 0 },
      { id: 'g2', type: 'CNOT' as const, targetQubit: 1, controlQubit: 0, step: 1 },
    ],
  },
  {
    id: 'bell_psi_minus',
    name: 'Bell Singlet State |Psi->',
    formula: '(|01> - |10>) / sqrt(2)',
    description: 'The famous EPR singlet state exhibiting anti-correlated measurements in any basis and maximum Bell inequality violation.',
    numQubits: 2,
    gates: [
      { id: 'g1', type: 'X' as const, targetQubit: 0, step: 0 },
      { id: 'g2', type: 'X' as const, targetQubit: 1, step: 0 },
      { id: 'g3', type: 'H' as const, targetQubit: 0, step: 1 },
      { id: 'g4', type: 'CNOT' as const, targetQubit: 1, controlQubit: 0, step: 2 },
    ],
  },
  {
    id: 'teleportation_core',
    name: 'Quantum Teleportation (Entanglement Protocol)',
    formula: 'Transfers state |psi> from q0 to q2 using pre-shared entanglement',
    description: 'Demonstrates protocol where quantum information is transferred without transmitting physical qubits, using 1 Bell pair and 2 classical bits.',
    numQubits: 3,
    gates: [
      { id: 'g1', type: 'H' as const, targetQubit: 1, step: 0 },
      { id: 'g2', type: 'CNOT' as const, targetQubit: 2, controlQubit: 1, step: 1 },
      { id: 'g3', type: 'CNOT' as const, targetQubit: 1, controlQubit: 0, step: 2 },
      { id: 'g4', type: 'H' as const, targetQubit: 0, step: 3 },
    ],
  },
  {
    id: 'superdense_coding',
    name: 'Superdense Coding Protocol',
    formula: 'Sends 2 classical bits of information using only 1 physical qubit',
    description: 'Utilises a pre-entangled pair between Alice and Bob to transmit 2 classical bits by sending a single entangled qubit.',
    numQubits: 2,
    gates: [
      { id: 'g1', type: 'H' as const, targetQubit: 0, step: 0 },
      { id: 'g2', type: 'CNOT' as const, targetQubit: 1, controlQubit: 0, step: 1 },
      { id: 'g3', type: 'X' as const, targetQubit: 0, step: 2 },
      { id: 'g4', type: 'Z' as const, targetQubit: 0, step: 3 },
      { id: 'g5', type: 'CNOT' as const, targetQubit: 1, controlQubit: 0, step: 4 },
      { id: 'g6', type: 'H' as const, targetQubit: 0, step: 5 },
    ],
  },
];
