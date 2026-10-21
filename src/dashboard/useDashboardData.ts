import { useQuery } from '@tanstack/react-query';
import { useCan } from '../auth/useCan';
import {
  getAuthCheck,
  getRolesCheck,
  getProcessesOverview,
  getPositionsList,
  getDepartmentsList,
  getKnowledgeCategories,
  getKnowledgeState,
  getExternalSyncs,
  getExternalSyncRuns,
  getSpeechStatus,
} from '../api/dashboard';

export function useDashboardData() {
  const canProcesses = useCan('pm.process-designer.use');
  const canPositions = useCan('pm.organization.positions');
  const canKnowledge = useCan('pm.knowledge.manage');
  const canSync = useCan('pm.external-data.sync');
  const canSpeech = useCan('pm.speech.settings');

  const authQuery = useQuery({
    queryKey: ['dashboard', 'auth'],
    queryFn: ({ signal }) => getAuthCheck(signal),
    staleTime: 30000,
  });

  const rolesQuery = useQuery({
    queryKey: ['dashboard', 'roles'],
    queryFn: ({ signal }) => getRolesCheck(signal),
    staleTime: 30000,
  });

  const processesQuery = useQuery({
    queryKey: ['dashboard', 'processes'],
    queryFn: ({ signal }) => getProcessesOverview(signal),
    staleTime: 30000,
    enabled: canProcesses,
  });

  const positionsQuery = useQuery({
    queryKey: ['dashboard', 'positions'],
    queryFn: ({ signal }) => getPositionsList(signal),
    staleTime: 30000,
    enabled: canPositions,
  });

  const departmentsQuery = useQuery({
    queryKey: ['dashboard', 'departments'],
    queryFn: ({ signal }) => getDepartmentsList(signal),
    staleTime: 30000,
    enabled: canPositions,
  });

  const knowledgeCategoriesQuery = useQuery({
    queryKey: ['dashboard', 'knowledge-categories'],
    queryFn: ({ signal }) => getKnowledgeCategories(signal),
    staleTime: 30000,
    enabled: canKnowledge,
  });

  const knowledgeStateQuery = useQuery({
    queryKey: ['dashboard', 'knowledge-state'],
    queryFn: ({ signal }) => getKnowledgeState(signal),
    staleTime: 30000,
    enabled: canKnowledge,
  });

  const externalSyncsQuery = useQuery({
    queryKey: ['dashboard', 'external-syncs'],
    queryFn: ({ signal }) => getExternalSyncs(signal),
    staleTime: 30000,
    enabled: canSync,
  });

  const externalSyncRunsQuery = useQuery({
    queryKey: ['dashboard', 'external-sync-runs'],
    queryFn: ({ signal }) => getExternalSyncRuns(signal),
    staleTime: 30000,
    enabled: canSync,
  });

  const speechQuery = useQuery({
    queryKey: ['dashboard', 'speech'],
    queryFn: ({ signal }) => getSpeechStatus(signal),
    staleTime: 30000,
    retry: false,
    enabled: canSpeech,
  });

  return {
    canProcesses,
    canPositions,
    canKnowledge,
    canSync,
    canSpeech,
    authQuery,
    rolesQuery,
    processesQuery,
    positionsQuery,
    departmentsQuery,
    knowledgeCategoriesQuery,
    knowledgeStateQuery,
    externalSyncsQuery,
    externalSyncRunsQuery,
    speechQuery,
  };
}
