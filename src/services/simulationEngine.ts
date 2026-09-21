import { 
  IntersectionAgent, 
  EmergencyVehicle, 
  AIDecisionLog, 
  TrafficMetricPoint, 
  SimulationConfig,
  TrafficDensityLevel,
  AgentStatus
} from '../types/traffic';

export const INITIAL_AGENTS: IntersectionAgent[] = [
  {
    id: "AGENT-01",
    numId: 1,
    name: "Downtown Hub & 5th Ave",
    lat: 37.7749,
    lng: -122.4194,
    canvasX: 200,
    canvasY: 200,
    status: "ACTIVE",
    currentSignal: "GREEN",
    signalTimer: 18,
    totalVehicles: 24,
    queueLength: 12,
    avgSpeedKmH: 32,
    trafficDensity: "MODERATE",
    neighbors: ["AGENT-02", "AGENT-04", "AGENT-07"],
    lastDecision: {
      timestamp: "10:42:15",
      action: "Extend green phase by 8 seconds",
      reason: "Northbound queue spike detected (12 vehicles)",
      extendedSeconds: 8
    },
    directionalFlow: { north: 8, south: 6, east: 5, west: 5 },
    signalDurations: { green: 30, yellow: 5, red: 25 },
    healthPercent: 99,
    latencyMs: 4
  },
  {
    id: "AGENT-02",
    numId: 2,
    name: "Tech Corridor & Innovation Way",
    lat: 37.7833,
    lng: -122.4167,
    canvasX: 450,
    canvasY: 150,
    status: "ACTIVE",
    currentSignal: "RED",
    signalTimer: 12,
    totalVehicles: 38,
    queueLength: 19,
    avgSpeedKmH: 22,
    trafficDensity: "HIGH",
    neighbors: ["AGENT-01", "AGENT-03", "AGENT-05"],
    lastDecision: {
      timestamp: "10:42:17",
      action: "Coordinating signal sync with AGENT-01",
      reason: "Inbound traffic surge from West corridor"
    },
    directionalFlow: { north: 14, south: 10, east: 8, west: 6 },
    signalDurations: { green: 35, yellow: 5, red: 20 },
    healthPercent: 98,
    latencyMs: 6
  },
  {
    id: "AGENT-03",
    numId: 3,
    name: "Financial District Central",
    lat: 37.7885,
    lng: -122.4014,
    canvasX: 700,
    canvasY: 180,
    status: "ACTIVE",
    currentSignal: "GREEN",
    signalTimer: 24,
    totalVehicles: 15,
    queueLength: 4,
    avgSpeedKmH: 42,
    trafficDensity: "LOW",
    neighbors: ["AGENT-02", "AGENT-06"],
    lastDecision: {
      timestamp: "10:42:19",
      action: "Optimized eco-wave timing",
      reason: "Low queue length, priority flow maintained"
    },
    directionalFlow: { north: 4, south: 5, east: 3, west: 3 },
    signalDurations: { green: 25, yellow: 5, red: 25 },
    healthPercent: 100,
    latencyMs: 3
  },
  {
    id: "AGENT-04",
    numId: 4,
    name: "Port Expressway & Cargo Way",
    lat: 37.7690,
    lng: -122.3980,
    canvasX: 750,
    canvasY: 420,
    status: "ACTIVE",
    currentSignal: "YELLOW",
    signalTimer: 3,
    totalVehicles: 48,
    queueLength: 26,
    avgSpeedKmH: 18,
    trafficDensity: "SEVERE",
    neighbors: ["AGENT-01", "AGENT-05", "AGENT-08"],
    lastDecision: {
      timestamp: "10:42:20",
      action: "Broadcasted congestion alert to AGENT-01 & 05",
      reason: "Expressway merge bottleneck"
    },
    directionalFlow: { north: 18, south: 14, east: 10, west: 6 },
    signalDurations: { green: 40, yellow: 5, red: 15 },
    healthPercent: 96,
    latencyMs: 8
  },
  {
    id: "AGENT-05",
    numId: 5,
    name: "University Ave & Research Blvd",
    lat: 37.7610,
    lng: -122.4250,
    canvasX: 480,
    canvasY: 450,
    status: "ACTIVE",
    currentSignal: "RED",
    signalTimer: 16,
    totalVehicles: 29,
    queueLength: 14,
    avgSpeedKmH: 28,
    trafficDensity: "MODERATE",
    neighbors: ["AGENT-02", "AGENT-04", "AGENT-08"],
    lastDecision: {
      timestamp: "10:42:21",
      action: "Pre-clearing Eastbound lane",
      reason: "Predictive flow recommendation from AGENT-04"
    },
    directionalFlow: { north: 8, south: 7, east: 9, west: 5 },
    signalDurations: { green: 30, yellow: 5, red: 25 },
    healthPercent: 99,
    latencyMs: 5
  },
  {
    id: "AGENT-06",
    numId: 6,
    name: "Waterfront Plaza & Pier 39",
    lat: 37.8080,
    lng: -122.4100,
    canvasX: 850,
    canvasY: 220,
    status: "ACTIVE",
    currentSignal: "GREEN",
    signalTimer: 21,
    totalVehicles: 18,
    queueLength: 6,
    avgSpeedKmH: 38,
    trafficDensity: "LOW",
    neighbors: ["AGENT-03", "AGENT-07"],
    lastDecision: {
      timestamp: "10:42:10",
      action: "Pedestrian priority window active",
      reason: "Scheduled tourist walkway interval"
    },
    directionalFlow: { north: 5, south: 4, east: 4, west: 5 },
    signalDurations: { green: 25, yellow: 5, red: 25 },
    healthPercent: 97,
    latencyMs: 7
  },
  {
    id: "AGENT-07",
    numId: 7,
    name: "Midtown Center & 10th St",
    lat: 37.7780,
    lng: -122.4310,
    canvasX: 180,
    canvasY: 400,
    status: "ACTIVE",
    currentSignal: "RED",
    signalTimer: 8,
    totalVehicles: 22,
    queueLength: 9,
    avgSpeedKmH: 34,
    trafficDensity: "MODERATE",
    neighbors: ["AGENT-01", "AGENT-06"],
    lastDecision: {
      timestamp: "10:42:12",
      action: "Synchronized with AGENT-01",
      reason: "Cross-town green wave setup"
    },
    directionalFlow: { north: 7, south: 6, east: 5, west: 4 },
    signalDurations: { green: 30, yellow: 5, red: 20 },
    healthPercent: 99,
    latencyMs: 4
  },
  {
    id: "AGENT-08",
    numId: 8,
    name: "Airport Bypass & South Arterial",
    lat: 37.7550,
    lng: -122.4110,
    canvasX: 300,
    canvasY: 580,
    status: "ACTIVE",
    currentSignal: "GREEN",
    signalTimer: 27,
    totalVehicles: 31,
    queueLength: 11,
    avgSpeedKmH: 45,
    trafficDensity: "MODERATE",
    neighbors: ["AGENT-04", "AGENT-05"],
    lastDecision: {
      timestamp: "10:42:14",
      action: "High-speed corridor priority",
      reason: "Bypass arterial flow optimization"
    },
    directionalFlow: { north: 10, south: 9, east: 7, west: 5 },
    signalDurations: { green: 35, yellow: 5, red: 15 },
    healthPercent: 100,
    latencyMs: 3
  }
];

export const INITIAL_EMERGENCY_VEHICLE: EmergencyVehicle = {
  id: "EV-901",
  type: "AMBULANCE",
  callsign: "MEDIC-01 (St. Mary Hospital)",
  currentIntersectionId: "AGENT-01",
  targetIntersectionId: "AGENT-08",
  priorityRoute: ["AGENT-01", "AGENT-02", "AGENT-05", "AGENT-08"],
  etaSeconds: 45,
  active: false
};

export const INITIAL_LOGS: AIDecisionLog[] = [
  {
    id: "log-1",
    timestamp: "10:42:15",
    agentId: "AGENT-01",
    agentName: "Downtown Hub",
    type: "CONGESTION_ALERT",
    message: "Agent 01 detected high traffic on Northbound approach.",
    severity: "warning"
  },
  {
    id: "log-2",
    timestamp: "10:42:17",
    agentId: "AGENT-01",
    agentName: "Downtown Hub",
    type: "STATE_SHARE",
    message: "Agent 01 shared congestion state with neighboring Agent 02 & Agent 04.",
    severity: "info"
  },
  {
    id: "log-3",
    timestamp: "10:42:19",
    agentId: "AGENT-02",
    agentName: "Tech Corridor",
    type: "TIMING_ADJUST",
    message: "Agent 02 adjusted signal timing (+8s Green) based on Agent 01 recommendation.",
    severity: "success"
  },
  {
    id: "log-4",
    timestamp: "10:42:22",
    agentId: "AGENT-04",
    agentName: "Port Expressway",
    type: "CONGESTION_ALERT",
    message: "Expressway merge bottleneck detected (26 vehicles queuing).",
    severity: "warning"
  },
  {
    id: "log-5",
    timestamp: "10:42:25",
    agentId: "AGENT-05",
    agentName: "University Ave",
    type: "STATE_SHARE",
    message: "Peer handshake verified with Agent 02 & Agent 08.",
    severity: "info"
  }
];

export const INITIAL_HISTORY: TrafficMetricPoint[] = [
  { time: "10:15", avgWaitTimeSec: 42, totalVehicles: 180, flowEfficiencyPercent: 74, congestionIndex: 58, throughputVehiclesPerMin: 120 },
  { time: "10:20", avgWaitTimeSec: 39, totalVehicles: 195, flowEfficiencyPercent: 78, congestionIndex: 52, throughputVehiclesPerMin: 135 },
  { time: "10:25", avgWaitTimeSec: 35, totalVehicles: 210, flowEfficiencyPercent: 82, congestionIndex: 45, throughputVehiclesPerMin: 148 },
  { time: "10:30", avgWaitTimeSec: 31, totalVehicles: 226, flowEfficiencyPercent: 86, congestionIndex: 38, throughputVehiclesPerMin: 160 },
  { time: "10:35", avgWaitTimeSec: 28, totalVehicles: 215, flowEfficiencyPercent: 88, congestionIndex: 34, throughputVehiclesPerMin: 165 },
  { time: "10:40", avgWaitTimeSec: 26, totalVehicles: 227, flowEfficiencyPercent: 91, congestionIndex: 29, throughputVehiclesPerMin: 172 }
];

export const INITIAL_SIM_CONFIG: SimulationConfig = {
  vehicleDensity: 50,
  activeIntersections: 8,
  trafficFlowSpeed: 45,
  emergencyFrequency: 2,
  simulationSpeed: 1,
  isRunning: true
};

export function computeDensityLevel(totalVehicles: number): TrafficDensityLevel {
  if (totalVehicles < 18) return 'LOW';
  if (totalVehicles < 30) return 'MODERATE';
  if (totalVehicles < 42) return 'HIGH';
  return 'SEVERE';
}

export function getCurrentTimeFormatted(): string {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}
