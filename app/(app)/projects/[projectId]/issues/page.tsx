'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Dashboard from '../../../../components/Dashboard';
import { useProjectStore } from '../../../../hooks/useProjectStore';

export default function ProjectIssuesPage() {
  const params = useParams<{ projectId: string }>();
  const { projects, setCurrentProjectId } = useProjectStore();

  useEffect(() => {
    const projectId = params?.projectId;
    if (!projectId || typeof projectId !== 'string') return;

    const exists = projects.some(p => p.id === projectId);
    if (!exists) return;

    setCurrentProjectId(projectId);
  }, [params, projects, setCurrentProjectId]);

  return <Dashboard />;
}
