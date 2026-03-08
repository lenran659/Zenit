'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Dashboard from '../../../../components/Dashboard';
import { useProjectStore } from '../../../../hooks/useProjectStore';

export default function ProjectIssuesPage() {
  const params = useParams<{ projectId: string }>();
  const { projects, currentProjectId, setCurrentProjectId } = useProjectStore();

  const projectId = typeof params?.projectId === 'string' ? params.projectId : '';

  useEffect(() => {
    if (!projectId) return;

    if (currentProjectId === projectId) return;

    const exists = projects.some(p => p.id === projectId);
    if (!exists) return;

    setCurrentProjectId(projectId);
  }, [currentProjectId, projectId, projects, setCurrentProjectId]);

  return <Dashboard />;
}
