export type SignalColor = 'RED' | 'YELLOW' | 'GREEN';
export type TrafficDensityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
export type AgentStatus = 'ACTIVE' | 'WARNING' | 'OFFLINE' | 'EMERGENCY';

export interface DirectionalFlow {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface LocalDecision {
  timestamp: string;
  action: string;
  reason: string;
  extendedSeconds?: number;
}

export interface IntersectionAgent {
  id: string; // e.g. "AGENT-01"
  numId: number; // e.g. 1
  name: string; // e.g. "Downtown Hub & 5th Ave"
  lat: number;
  lng: number;
  canvasX: number; // for interactive canvas mesh
  canvasY: number;
  status: AgentStatus;
  currentSignal: SignalColor;
  signalTimer: number;
  totalVehicles: number;
  queueLength: number;
  avgSpeedKmH: number;
  trafficDensity: TrafficDensityLevel;
  neighbors: string[]; // IDs of neighboring agents
  lastDecision: LocalDecision;
  directionalFlow: DirectionalFlow;
  signalDurations: {
    green: number;
    yellow: number;
    red: number;
  };
  healthPercent: number;
  latencyMs: number;
}

export interface EmergencyVehicle {
  id: string;
  type: 'AMBULANCE' | 'FIRE_TRUCK' | 'POLICE_PATROL';
  callsign: string;
  currentIntersectionId: string;
  targetIntersectionId: string;
  priorityRoute: string[];
  etaSeconds: number;
  active: boolean;
}

export type LogType = 
  | 'STATE_SHARE' 
  | 'TIMING_ADJUST' 
  | 'EMERGENCY_PRIORITY' 
  | 'FAILOVER_RECOVERY' 
  | 'CONGESTION_ALERT';

export interface AIDecisionLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  type: LogType;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

export interface TrafficMetricPoint {
  time: string;
  avgWaitTimeSec: number;
  totalVehicles: number;
  flowEfficiencyPercent: number;
  congestionIndex: number; // 0 to 100
  throughputVehiclesPerMin: number;
}

export interface SimulationConfig {
  vehicleDensity: number; // 10 to 100
  activeIntersections: number; // 4 to 8
  trafficFlowSpeed: number; // 20 to 80
  emergencyFrequency: number; // 1 to 5
  simulationSpeed: number; // 1, 2, or 5
  isRunning: boolean;
}

export type ActiveTab = 
  | 'LANDING'
  | 'DASHBOARD' 
  | 'LIVE_MAP' 
  | 'INTERSECTIONS' 
  | 'AGENTS' 
  | 'CITY_MESH' 
  | 'EMERGENCY' 
  | 'SIGNAL_CONTROL'
  | 'SIMULATION' 
  | 'ANALYTICS' 
  | 'DECISION_LOGS' 
  | 'ARCHITECTURE' 
  | 'ADMIN' 
  | 'SETTINGS';
