import { Feature, ComputedFeature, FeatureStatus } from '../types';

/**
 * Pure function to calculate the runtime state of features based on their configuration and dependencies.
 * This isolates the "Business Logic" from the "UI Component", allowing for safer AI modifications.
 */
export const calculateFeatureStates = (features: Feature[]): ComputedFeature[] => {
  // Create a Map for O(1) lookups
  const featureMap = new Map<string, Feature>(features.map(f => [f.id, f]));
  
  // Recursive function to resolve cascading statuses
  const getStatus = (id: string, visited = new Set<string>()): { status: FeatureStatus; blockedBy: string[] } => {
    // Cycle detection: prevent infinite loops in the graph
    if (visited.has(id)) {
        return { status: 'disabled-dependency', blockedBy: ['circular-dependency'] }; 
    }
    visited.add(id);

    const feature = featureMap.get(id);
    
    // Safety: Handle missing dependencies gracefully
    if (!feature) {
        return { status: 'disabled-dependency', blockedBy: ['missing-feature-id'] };
    }
    
    // 1. Check Manual Override
    if (!feature.enabled) {
        return { status: 'disabled-manual', blockedBy: [] };
    }

    // 2. Check Dependencies Recursively
    const blockers: string[] = [];
    let isBlocked = false;

    for (const depId of feature.dependencies.requires) {
      // Pass a new Set to branch correctly without polluting sibling checks
      const depResult = getStatus(depId, new Set(visited));
      
      if (depResult.status !== 'active') {
        isBlocked = true;
        blockers.push(depId);
      }
    }

    if (isBlocked) {
        return { status: 'disabled-dependency', blockedBy: blockers };
    }

    return { status: 'active', blockedBy: [] };
  };

  // Map original features to ComputedFeatures with their resolved status
  return features.map(f => {
    const { status, blockedBy } = getStatus(f.id);
    return { ...f, status, blockedBy };
  });
};