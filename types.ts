
export interface Route {
  method: string;
  path: string;
  handler: string;
}

export interface Backend {
  routes: Route[];
}

export interface Health {
  endpoint: string;
  timeout?: number;
  autoDisable?: number;
  circuitBreaker?: {
    enabled: boolean;
    failureThreshold: number;
    timeout?: string;
  };
}

export interface Dependencies {
  requires: string[];
}

export interface Security {
    rateLimit?: Record<string, string>;
}

export interface Monitoring {
    metrics?: string[];
}

export interface Feature {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  backend: Backend;
  config: Record<string, any>;
  health: Health;
  dependencies: Dependencies;
  fallback?: string | null;
  security?: Security;
  monitoring?: Monitoring;
}

// Vibe Coding Addition: Runtime status tracking
export type FeatureStatus = 'active' | 'disabled-manual' | 'disabled-dependency';

export interface ComputedFeature extends Feature {
  status: FeatureStatus;
  blockedBy?: string[]; // List of dependency IDs causing the block
}
