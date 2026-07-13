const questionBank = {
  Maths: {
    easy: [
      { question: "What is 15% of 200?", options: ["20", "25", "30", "35"], answer: "30" },
      { question: "Which of the following is a prime number?", options: ["9", "15", "17", "21"], answer: "17" },
      { question: "What is the value of √144?", options: ["11", "12", "13", "14"], answer: "12" },
      { question: "What is 2³ × 3?", options: ["18", "24", "16", "12"], answer: "24" },
      { question: "The HCF of 12 and 18 is:", options: ["3", "4", "6", "9"], answer: "6" },
      { question: "What is the area of a circle with radius 7?", options: ["154", "144", "132", "176"], answer: "154" },
      { question: "0.25 × 0.4 = ?", options: ["0.01", "0.001", "0.1", "1"], answer: "0.1" },
      { question: "What is 20% of 500?", options: ["50", "80", "100", "120"], answer: "100" },
    ],
    medium: [
      { question: "If log₂(x) = 5, then x = ?", options: ["10", "25", "32", "64"], answer: "32" },
      { question: "The sum of interior angles of a hexagon is:", options: ["540°", "720°", "600°", "480°"], answer: "720°" },
      { question: "A train 100m long passes a pole in 10 seconds. Speed (km/h)?", options: ["36", "60", "72", "40"], answer: "36" },
      { question: "If 3x + 7 = 22, what is x?", options: ["3", "4", "5", "6"], answer: "5" },
      { question: "Which is the formula for compound interest?", options: ["P(1+r/n)^nt", "P+rt", "Prt", "P(1+rt)"], answer: "P(1+r/n)^nt" },
      { question: "Arithmetic mean of 10, 20, 30, 40, 50 is:", options: ["25", "30", "35", "40"], answer: "30" },
      { question: "What is the LCM of 4, 6 and 9?", options: ["18", "36", "12", "24"], answer: "36" },
      { question: "sin 30° + cos 60° = ?", options: ["0", "0.5", "1", "√2"], answer: "1" },
    ],
    hard: [
      { question: "The number of ways to arrange 5 different books on a shelf is:", options: ["100", "60", "120", "25"], answer: "120" },
      { question: "If f(x) = x² – 3x + 2, find f(4):", options: ["6", "8", "10", "12"], answer: "6" },
      { question: "What is the derivative of e^(2x)?", options: ["e^(2x)", "2e^(x)", "2e^(2x)", "e^x"], answer: "2e^(2x)" },
      { question: "If A = {1,2,3} and B = {2,3,4}, then A∩B = ?", options: ["{2}", "{3}", "{2,3}", "{1,4}"], answer: "{2,3}" },
      { question: "∫ 2x dx = ?", options: ["x²+C", "2x²+C", "x+C", "x²"], answer: "x²+C" },
      { question: "What is the rank of identity matrix of order 3?", options: ["1", "2", "3", "0"], answer: "3" },
    ],
  },
  Physics: {
    easy: [
      { question: "SI unit of force is:", options: ["Joule", "Newton", "Pascal", "Watt"], answer: "Newton" },
      { question: "Speed of light is approximately:", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], answer: "3×10⁸ m/s" },
      { question: "What does an ammeter measure?", options: ["Voltage", "Resistance", "Current", "Power"], answer: "Current" },
      { question: "Which law relates voltage, current and resistance?", options: ["Newton's Law", "Ohm's Law", "Boyle's Law", "Faraday's Law"], answer: "Ohm's Law" },
      { question: "What type of energy does a stretched spring have?", options: ["Kinetic", "Chemical", "Potential", "Thermal"], answer: "Potential" },
    ],
    medium: [
      { question: "A body of mass 5kg moves at 2 m/s. Its kinetic energy is:", options: ["5 J", "10 J", "20 J", "25 J"], answer: "10 J" },
      { question: "Which phenomenon explains the formation of rainbows?", options: ["Reflection", "Diffraction", "Dispersion", "Polarization"], answer: "Dispersion" },
      { question: "The time period of a simple pendulum depends on:", options: ["Mass", "Amplitude", "Length", "Colour"], answer: "Length" },
      { question: "What is the unit of electric potential?", options: ["Ampere", "Coulomb", "Volt", "Ohm"], answer: "Volt" },
      { question: "Fleming's Left Hand Rule applies to:", options: ["Generators", "Motors", "Capacitors", "Transformers"], answer: "Motors" },
    ],
    hard: [
      { question: "The escape velocity from Earth's surface is approximately:", options: ["7.9 km/s", "11.2 km/s", "15 km/s", "3 km/s"], answer: "11.2 km/s" },
      { question: "Which type of radiation has the highest penetrating power?", options: ["Alpha", "Beta", "Gamma", "X-rays"], answer: "Gamma" },
      { question: "Heisenberg's uncertainty principle relates:", options: ["Energy and time", "Position and momentum", "Mass and velocity", "Force and acceleration"], answer: "Position and momentum" },
    ],
  },
  Chemistry: {
    easy: [
      { question: "Chemical symbol for Gold is:", options: ["Go", "Gd", "Au", "Ag"], answer: "Au" },
      { question: "pH of pure water at 25°C is:", options: ["5", "6", "7", "8"], answer: "7" },
      { question: "The atomic number of Carbon is:", options: ["5", "6", "7", "8"], answer: "6" },
      { question: "NaCl is commonly known as:", options: ["Baking soda", "Table salt", "Washing soda", "Bleach"], answer: "Table salt" },
      { question: "Which gas is released during photosynthesis?", options: ["CO₂", "H₂", "N₂", "O₂"], answer: "O₂" },
    ],
    medium: [
      { question: "What is the valency of Nitrogen?", options: ["2", "3", "4", "5"], answer: "3" },
      { question: "Which is the lightest noble gas?", options: ["Neon", "Argon", "Helium", "Krypton"], answer: "Helium" },
      { question: "Avogadro's number is:", options: ["6.022×10²³", "6.022×10²²", "3.14×10²³", "9.8×10²³"], answer: "6.022×10²³" },
      { question: "The process of conversion of liquid to gas is called:", options: ["Condensation", "Sublimation", "Evaporation", "Deposition"], answer: "Evaporation" },
    ],
    hard: [
      { question: "Which quantum number describes the shape of an orbital?", options: ["Principal", "Azimuthal", "Magnetic", "Spin"], answer: "Azimuthal" },
      { question: "The hybridization of carbon in CH₄ is:", options: ["sp", "sp²", "sp³", "sp³d"], answer: "sp³" },
      { question: "Le Chatelier's principle is related to:", options: ["Equilibrium", "Kinetics", "Thermodynamics", "Electrochemistry"], answer: "Equilibrium" },
    ],
  },
  "Computer Science": {
    easy: [
      { question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Power Unit", "Core Processing Utility", "Central Power Unit"], answer: "Central Processing Unit" },
      { question: "Which is NOT a programming language?", options: ["Python", "Java", "HTML", "Linux"], answer: "Linux" },
      { question: "1 byte = ? bits", options: ["4", "6", "8", "16"], answer: "8" },
      { question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Tree"], answer: "Stack" },
      { question: "What is an IP Address?", options: ["Internet Processor", "Unique network identifier", "Internet Program", "Input Protocol"], answer: "Unique network identifier" },
    ],
    medium: [
      { question: "What does SQL stand for?", options: ["Simple Query Language", "Structured Query Language", "Standard Query Logic", "Sequential Query Language"], answer: "Structured Query Language" },
      { question: "Big O notation O(log n) describes:", options: ["Constant time", "Linear time", "Logarithmic time", "Quadratic time"], answer: "Logarithmic time" },
      { question: "Which protocol is used for secure web browsing?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], answer: "HTTPS" },
      { question: "In OOP, what is encapsulation?", options: ["Inheriting properties", "Bundling data and methods", "Overloading functions", "Hiding implementation"], answer: "Bundling data and methods" },
    ],
    hard: [
      { question: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"], answer: "O(log n)" },
      { question: "Which sorting algorithm has the best average-case complexity?", options: ["Bubble Sort", "Merge Sort", "Insertion Sort", "Selection Sort"], answer: "Merge Sort" },
      { question: "In networking, what does DNS stand for?", options: ["Data Node System", "Domain Name System", "Digital Network Service", "Dynamic Node Server"], answer: "Domain Name System" },
    ],
  },
  "General Knowledge": {
    easy: [
      { question: "What is the capital of India?", options: ["Mumbai", "Kolkata", "New Delhi", "Chennai"], answer: "New Delhi" },
      { question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
      { question: "Which planet is closest to the sun?", options: ["Venus", "Mars", "Earth", "Mercury"], answer: "Mercury" },
    ],
    medium: [
      { question: "Who wrote 'The Discovery of India'?", options: ["M.K. Gandhi", "B.R. Ambedkar", "J. Nehru", "S.C. Bose"], answer: "J. Nehru" },
      { question: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
    ],
    hard: [
      { question: "Which MCA CET exam is conducted for admission to MCA in Maharashtra?", options: ["NIMCET", "MAH-MCA-CET", "TANCET", "OJEE"], answer: "MAH-MCA-CET" },
      { question: "How many states are there in India (as of 2024)?", options: ["28", "29", "30", "27"], answer: "28" },
    ],
  },
};

export function getQuestions(subject, difficulty) {
  const normalizedSubject = subject?.toLowerCase();
  const foundKey = Object.keys(questionBank).find(
    (k) => k.toLowerCase() === normalizedSubject
  );
  const subjectData = questionBank[foundKey] || questionBank['General Knowledge'];
  
  const level = difficulty?.toLowerCase();
  const levelMap = { easy: 'easy', low: 'easy', medium: 'medium', hard: 'hard', high: 'hard' };
  const key = levelMap[level] || 'medium';
  return subjectData[key] || subjectData.medium || [];
}

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default questionBank;
