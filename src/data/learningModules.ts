import { LearningModule, Badge } from '../types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod_superposition',
    title: 'Superposition and Wave-Particle Duality',
    category: 'Foundations',
    durationMinutes: 12,
    summary:
      'Discover how quantum systems exist in linear combinations of orthogonal states simultaneously until an irreversible measurement occurs.',
    checkpoints: [
      {
        id: 'cp_1_1',
        title: 'The Classical Bit versus The Qubit',
        content:
          'In classical computation, a bit is deterministically 0 or 1, like a light switch. A quantum bit (qubit) is a two-level quantum system represented mathematically as a normalized vector in a two-dimensional complex Hilbert space: |psi> = alpha|0> + beta|1>. The complex numbers alpha and beta are probability amplitudes satisfying the Born normalisation rule: |alpha|^2 + |beta|^2 = 1.',
        interactiveTask: {
          type: 'superposition',
          instruction: 'Adjust the superposition slider so probability P(|0>) equals 50% and P(|1>) equals 50%.',
          targetCondition: 'equal_superposition',
        },
      },
      {
        id: 'cp_1_2',
        title: 'Wave Function and Phase Interference',
        content:
          'Unlike classical probabilities, quantum amplitudes possess an internal phase angle phi. When two quantum pathways interfere, amplitudes can add constructively (reinforcing probability) or destructively (cancelling probability to zero). This wave-like phase interference is the foundational engine powering quantum speedup in algorithms.',
        interactiveTask: {
          type: 'superposition',
          instruction: 'Rotate the azimuthal phase angle phi to 180 degrees (pi radians) to observe quantum phase shift.',
          targetCondition: 'phase_shift_180',
        },
      },
      {
        id: 'cp_1_3',
        title: 'Measurement and Wavefunction Collapse',
        content:
          'Prior to observation, a qubit remains in a coherent superposition. The instant a projective measurement is performed in the computational basis {|0>, |1>}, the wavefunction collapses instantaneously to either state |0> with probability |alpha|^2 or state |1> with probability |beta|^2. The previous superposition state is irrecoverably destroyed.',
        interactiveTask: {
          type: 'superposition',
          instruction: 'Execute a batch of 100 quantum measurement shots in the simulator to verify the Born rule.',
          targetCondition: 'measurement_batch_run',
        },
      },
    ],
    quiz: [
      {
        id: 'q_1_1',
        question: 'If a qubit is in state |psi> = (1/2)|0> + (sqrt(3)/2)|1>, what is the probability of measuring state |0>?',
        options: ['25% (1/4)', '50% (1/2)', '75% (3/4)', '100%'],
        correctIndex: 0,
        explanation: 'According to the Born rule, probability P(|0>) = |alpha|^2 = (1/2)^2 = 1/4 = 25%.',
      },
      {
        id: 'q_1_2',
        question: 'What fundamental condition must the probability amplitudes alpha and beta satisfy?',
        options: ['alpha + beta = 1', '|alpha|^2 + |beta|^2 = 1', 'alpha * beta = 0', '|alpha| + |beta| = 2'],
        correctIndex: 1,
        explanation: 'Quantum state vectors must be normalized to unit length: |alpha|^2 + |beta|^2 = 1.',
      },
      {
        id: 'q_1_3',
        question: 'What happens to a qubit in superposition when a measurement is conducted?',
        options: [
          'It continues in superposition unchanged',
          'It collapses randomly to one basis state according to its probability amplitudes',
          'It splits into two physical qubits',
          'Its quantum information is duplicated into memory',
        ],
        correctIndex: 1,
        explanation: 'Wavefunction collapse projects the continuous state vector onto an eigenstate of the measurement operator.',
      },
    ],
  },
  {
    id: 'mod_bloch',
    title: 'The Bloch Sphere and State Geometry',
    category: 'Visualisation',
    durationMinutes: 10,
    summary:
      'Learn how any arbitrary single-qubit pure state maps onto the surface of a unit three-dimensional sphere.',
    checkpoints: [
      {
        id: 'cp_2_1',
        title: 'Spherical Parameterisation of a Qubit',
        content:
          'Ignoring an irrelevant global phase, any single qubit state can be parameterised using two geometric angles: polar angle theta (0 to pi) and azimuthal angle phi (0 to 2*pi). The state vector is: |psi> = cos(theta/2)|0> + e^(i*phi) * sin(theta/2)|1>. The north pole represents |0>, the south pole represents |1>, and points along the equator represent equal superpositions with differing relative phases.',
      },
      {
        id: 'cp_2_2',
        title: 'Single-Qubit Gate Rotations',
        content:
          'Quantum logic gates acting on a single qubit correspond directly to rotations of the state vector around axes of the Bloch sphere. For instance, the Pauli-X gate corresponds to a pi rotation around the X-axis (flipping |0> to |1>), while the Hadamard gate rotates by pi around the (X + Z)/sqrt(2) diagonal axis.',
      },
    ],
    quiz: [
      {
        id: 'q_2_1',
        question: 'Which quantum state is located precisely at the North Pole of the Bloch Sphere?',
        options: ['State |0>', 'State |1>', 'State (|0> + |1>)/sqrt(2)', 'State (|0> - i|1>)/sqrt(2)'],
        correctIndex: 0,
        explanation: 'When theta = 0, cos(0/2) = 1 and sin(0/2) = 0, giving state |0> at the North Pole.',
      },
      {
        id: 'q_2_2',
        question: 'Where do equal-weight superpositions lie on the Bloch sphere?',
        options: ['At the South Pole', 'On the Equator (theta = pi/2)', 'At the centre of the sphere', 'Only on the X-axis'],
        correctIndex: 1,
        explanation: 'When theta = pi/2, cos(pi/4) = 1/sqrt(2) and sin(pi/4) = 1/sqrt(2), forming the equatorial plane.',
      },
    ],
  },
  {
    id: 'mod_entanglement',
    title: 'Quantum Entanglement and Bell Inequality',
    category: 'Quantum Phenomena',
    durationMinutes: 15,
    summary:
      'Explore non-local quantum correlations, Einstein-Podolsky-Rosen pairs, and the experimental violation of Bell inequalities.',
    checkpoints: [
      {
        id: 'cp_3_1',
        title: 'Non-Separable Quantum States',
        content:
          'Entanglement occurs when the joint quantum state of two or more particles cannot be factored into product states of the individual particles: |psi_AB> != |psi_A> (x) |psi_B>. For example, in the Bell state (|00> + |11>)/sqrt(2), neither qubit possesses a definite individual state, yet their joint state is strictly correlated.',
        interactiveTask: {
          type: 'entanglement',
          instruction: 'Select the Bell state |Phi+> and trigger an entangled pair emission.',
          targetCondition: 'bell_phi_plus_selected',
        },
      },
      {
        id: 'cp_3_2',
        title: 'Einstein, Podolsky, Rosen (EPR) and Local Realism',
        content:
          'In 1935, Einstein termed this non-local correlation "spooky action at a distance", arguing quantum mechanics was incomplete and hidden variables must pre-determine measurement results. In 1964, Northern Irish physicist John Stewart Bell proved that any local hidden-variable theory must satisfy mathematical bounds known as Bell inequalities.',
      },
      {
        id: 'cp_3_3',
        title: 'CHSH Inequality and Quantum Violation',
        content:
          'The Clauser-Horne-Shimony-Holt (CHSH) form of Bell inequality states that for any local realistic system, the correlation parameter S cannot exceed 2 (|S| <= 2). Quantum entanglement yields maximum theoretical correlations up to S = 2*sqrt(2) ~ 2.828 (Tsirelson bound), definitively refuting local realism.',
        interactiveTask: {
          type: 'entanglement',
          instruction: 'Set detector angles to Alice = 0 deg and Bob = 45 deg, then observe the CHSH test score.',
          targetCondition: 'chsh_violation_demonstrated',
        },
      },
    ],
    quiz: [
      {
        id: 'q_3_1',
        question: 'What is the classical upper limit for the CHSH inequality parameter S in local hidden-variable theories?',
        options: ['S <= 1.0', 'S <= 2.0', 'S <= 2.828', 'S <= 4.0'],
        correctIndex: 1,
        explanation: 'Local realism strictly limits the CHSH parameter to S <= 2. Quantum mechanics violates this limit.',
      },
      {
        id: 'q_3_2',
        question: 'Can quantum entanglement be exploited to transmit faster-than-light classical messages?',
        options: [
          'Yes, instant messages can be sent globally',
          'No, because individual measurement outcomes remain completely random locally (No-Signalling Theorem)',
          'Yes, but only between superconducting processors',
          'Only when using three or more entangled particles',
        ],
        correctIndex: 1,
        explanation: 'The No-Signalling Theorem guarantees that Alice cannot send information to Bob without a classical communication channel.',
      },
    ],
  },
  {
    id: 'mod_gates',
    title: 'Quantum Logic Gates and Circuit Design',
    category: 'Quantum Computing',
    durationMinutes: 16,
    summary:
      'Master reversible quantum gates: Hadamard, Pauli operators, Phase shifts, and Controlled-NOT entangling gates.',
    checkpoints: [
      {
        id: 'cp_4_1',
        title: 'Reversibility and Unitary Matrices',
        content:
          'Every quantum logic gate (except measurement) is represented by a unitary matrix U satisfying U^dagger * U = I. This ensures quantum transformations preserve total probability and are reversible without information dissipation.',
      },
      {
        id: 'cp_4_2',
        title: 'The Hadamard Gate: Superposition Creator',
        content:
          'The Hadamard gate (H) transforms the computational basis states into symmetric equal superpositions: H|0> = (|0> + |1>)/sqrt(2) and H|1> = (|0> - |1>)/sqrt(2). Applying H twice returns the qubit to its original state (H^2 = I).',
      },
      {
        id: 'cp_4_3',
        title: 'Controlled-NOT (CNOT) and Entangling Operations',
        content:
          'The CNOT gate acts on two qubits: if the control qubit is |1>, it flips the target qubit via Pauli-X. Combined with a single Hadamard gate on the control qubit, a CNOT creates a maximally entangled Bell pair from initial state |00>.',
        interactiveTask: {
          type: 'gate',
          instruction: 'Place an H gate on Qubit 0 and a CNOT gate with control on Qubit 0 and target on Qubit 1.',
          targetCondition: 'bell_circuit_built',
        },
      },
    ],
    quiz: [
      {
        id: 'q_4_1',
        question: 'What is the outcome of applying a Hadamard gate to state |0>?',
        options: ['State |1>', 'State (|0> + |1>)/sqrt(2)', 'State |0> with 50% probability', 'State 0'],
        correctIndex: 1,
        explanation: 'The Hadamard gate creates an equal superposition: H|0> = (|0> + |1>)/sqrt(2).',
      },
      {
        id: 'q_4_2',
        question: 'What mathematical property ensures all quantum logic gates preserve total probability?',
        options: ['Orthogonality', 'Unitary property (U^dagger * U = I)', 'Determinant equals zero', 'Hermitian eigenvalues'],
        correctIndex: 1,
        explanation: 'Unitary matrices preserve the norm of vectors, ensuring probabilities sum to 1.',
      },
    ],
  },
  {
    id: 'mod_hardware',
    title: 'Anatomy of a Working Quantum Computer',
    category: 'Cryogenic Hardware',
    durationMinutes: 18,
    summary:
      'Tour every cryogenic stage, microwave attenuation chain, and superconducting transmon processor component inside a dilution refrigerator.',
    checkpoints: [
      {
        id: 'cp_5_1',
        title: 'The Dilution Refrigerator Chandelier',
        content:
          'Superconducting qubits require an environment near absolute zero (-273.15 deg C) to prevent thermal excitations from destroying fragile quantum states. A multi-stage dilution refrigerator uses continuous closed-cycle Helium-3/Helium-4 phase separation to cool the QPU down to 15 milliKelvin.',
      },
      {
        id: 'cp_5_2',
        title: 'Superconducting Transmon Qubits and Josephson Junctions',
        content:
          'A transmon qubit is an artificial atom formed by an LC circuit where the inductor is replaced by a non-linear Josephson junction (two superconducting aluminium electrodes separated by a 1-nanometre aluminium oxide tunnel barrier). The non-linearity separates energy level transitions, isolating |0> and |1>.',
      },
      {
        id: 'cp_5_3',
        title: 'Microwave Attenuation and Cryogenic Amplification',
        content:
          'Control signals from room temperature pass through successive cryogenic attenuator blocks (-20 dB, -40 dB, -70 dB) to extinguish thermal noise. Returning readout signals are amplified at 15 mK by quantum-limited Traveling Wave Parametric Amplifiers (TWPA) and at 4 K by High Electron Mobility Transistors (HEMT).',
      },
    ],
    quiz: [
      {
        id: 'q_5_1',
        question: 'Why must superconducting transmon processors be cooled to 15 milliKelvin?',
        options: [
          'To make the silicon chip run faster',
          'To ensure thermal energy (k_B * T) is much lower than the qubit transition energy (h * f)',
          'To eliminate electrical resistance in copper wires',
          'To create vacuum pressure inside the chamber',
        ],
        correctIndex: 1,
        explanation: 'At 15 mK, thermal photons are extinguished, keeping qubits in their ground state without thermal decoherence.',
      },
      {
        id: 'q_5_2',
        question: 'What critical component provides the non-linear inductance needed to isolate the |0> and |1> quantum states in a transmon?',
        options: ['Copper waveguide', 'Josephson junction', 'Pulse Tube cryocooler', 'Gold plate'],
        correctIndex: 1,
        explanation: 'The Josephson junction acts as a non-linear inductor, making the energy levels an-harmonic.',
      },
    ],
  },
];

export const BADGES: Badge[] = [
  {
    id: 'badge_first_superposition',
    title: 'Superposition Pioneer',
    description: 'Explored quantum state amplitudes and configured an equal superposition.',
    category: 'Theory',
  },
  {
    id: 'badge_entanglement_master',
    title: 'Entanglement Master',
    description: 'Generated Bell states and confirmed the violation of the classical CHSH inequality.',
    category: 'Phenomena',
  },
  {
    id: 'badge_circuit_architect',
    title: 'Circuit Architect',
    description: 'Constructed and simulated a multi-qubit quantum logic circuit.',
    category: 'Computing',
  },
  {
    id: 'badge_cryo_engineer',
    title: 'Cryogenic Engineer',
    description: 'Inspected all 7 thermal stages of the dilution refrigerator and traced microwave signal paths.',
    category: 'Hardware',
  },
  {
    id: 'badge_scholar',
    title: 'Quantum Scholar',
    description: 'Completed all core learning modules and passed knowledge check quizzes with high scores.',
    category: 'Curriculum',
  },
];

export const GLOSSARY_TERMS = [
  {
    term: 'Bloch Sphere',
    definition:
      'A geometrical representation of the pure state space of a two-level quantum mechanical system (qubit) as points on the surface of a unit three-dimensional sphere.',
  },
  {
    term: 'Born Rule',
    definition:
      'A key postulate of quantum mechanics giving the probability that a measurement on a quantum system will yield a given result: probability equals the squared magnitude of the probability amplitude (|alpha|^2).',
  },
  {
    term: 'CHSH Inequality',
    definition:
      'A generalised formulation of Bell inequality formulated by Clauser, Horne, Shimony, and Holt. Classical local hidden-variable theories bound the parameter |S| <= 2, while quantum mechanics allows up to 2*sqrt(2) ~ 2.828.',
  },
  {
    term: 'Coherence Time (T1 and T2)',
    definition:
      'T1 is the energy relaxation time for an excited state |1> to decay to ground state |0>. T2 is the dephasing time over which the relative phase angle between |0> and |1> is preserved before being disrupted by noise.',
  },
  {
    term: 'Dilution Refrigerator',
    definition:
      'A cryogenic cooling system that provides continuous cooling down to 10 to 15 milliKelvin using the heat of mixing of two liquid isotopes of helium: Helium-3 and Helium-4.',
  },
  {
    term: 'Hadamard Gate (H)',
    definition:
      'A single-qubit quantum logic gate that maps the computational basis states |0> and |1> into symmetric equal superpositions (|0> + |1>)/sqrt(2) and (|0> - |1>)/sqrt(2).',
  },
  {
    term: 'Josephson Junction',
    definition:
      'A quantum device consisting of two superconducting electrodes separated by a thin non-superconducting barrier (typically 1 nm of Aluminium Oxide), behaving as a non-dissipative non-linear inductor.',
  },
  {
    term: 'No-Cloning Theorem',
    definition:
      'A fundamental principle of quantum mechanics stating that it is impossible to create an identical copy of an arbitrary unknown quantum state.',
  },
  {
    term: 'Qubit (Quantum Bit)',
    definition:
      'The basic unit of quantum information, represented as a linear combination of two orthogonal quantum basis states: |psi> = alpha|0> + beta|1>.',
  },
  {
    term: 'Transmon Qubit',
    definition:
      'A design of superconducting charge qubit engineered to have significantly reduced sensitivity to charge noise by shunting the Josephson junction with a large capacitor.',
  },
  {
    term: 'TWPA (Traveling Wave Parametric Amplifier)',
    definition:
      'A wide-bandwidth, ultra-low-noise microwave amplifier operating at the quantum limit of sensitivity at 15 milliKelvin, amplifying single-photon microwave readout signals.',
  },
  {
    term: 'Unitary Transformation',
    definition:
      'A linear transformation represented by a matrix U such that U^dagger * U = I. Unitary operations preserve the inner product and the total probability of quantum states.',
  },
];

export const FORMULA_REFERENCE = [
  {
    name: 'General Qubit State',
    formula: '|psi> = alpha|0> + beta|1>',
    condition: '|alpha|^2 + |beta|^2 = 1',
    description: 'Linear combination of computational basis states with complex amplitudes.',
  },
  {
    name: 'Bloch Sphere Coordinates',
    formula: '|psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>',
    condition: '0 <= theta <= pi, 0 <= phi < 2*pi',
    description: 'Mapping of arbitrary single qubit state to spherical polar coordinates.',
  },
  {
    name: 'Hadamard Matrix (H)',
    formula: 'H = (1 / sqrt(2)) * [[1,  1], [1, -1]]',
    condition: 'H * |0> = |+>, H * |1> = |->',
    description: 'Creates symmetric superposition states with zero and pi relative phase.',
  },
  {
    name: 'Pauli Matrices',
    formula: 'X = [[0, 1], [1, 0]], Y = [[0, -i], [i, 0]], Z = [[1, 0], [0, -1]]',
    condition: 'X^2 = Y^2 = Z^2 = I,  X*Y = i*Z',
    description: 'Fundamental generators of single-qubit rotations.',
  },
  {
    name: 'Bell States (EPR Pairs)',
    formula: '|Phi(+/-)> = (|00> +/- |11>)/sqrt(2), |Psi(+/-)> = (|01> +/- |10>)/sqrt(2)',
    condition: 'Maximally entangled two-qubit orthonormal basis',
    description: 'The four maximally entangled quantum states.',
  },
  {
    name: 'CHSH Correlation Parameter S',
    formula: 'S = |E(a, b) - E(a, b\') + E(a\', b) + E(a\', b\')|',
    condition: 'Classical bound: S <= 2 | Quantum maximum: S = 2*sqrt(2) ~ 2.828',
    description: 'Quantifies violation of local realistic hidden-variable theories.',
  },
  {
    name: 'Thermal Qubit Condition',
    formula: 'k_B * T << h * f_qubit',
    condition: 'T ~ 15 mK, f ~ 5 GHz => h*f / k_B ~ 240 mK >> 15 mK',
    description: 'Ensures thermal energy does not accidentally excite qubits out of ground state.',
  },
];
