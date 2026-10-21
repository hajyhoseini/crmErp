export interface ProbeEndpoint {
  path: string;
  label: string;
}

export const probeEndpoints: readonly ProbeEndpoint[] = [
  { path: '/api/auth:check', label: 'Auth Check' },
  { path: '/api/roles:check', label: 'Roles Check' },
  { path: '/api/ictProcesses:overview', label: 'Processes Overview' },
  { path: '/api/ictPositions:list', label: 'Positions List' },
  { path: '/api/ictExternalSyncs:list', label: 'External Syncs List' },
  { path: '/api/ictExternalSyncRuns:list', label: 'External Sync Runs List' },
  { path: '/api/ictKnowledge:categories', label: 'Knowledge Categories' },
  { path: '/api/ictKnowledge:state', label: 'Knowledge State' },
  { path: '/api/ictSpeech:state', label: 'Speech State' },
  { path: '/api/departments:list', label: 'Departments List' },
];
