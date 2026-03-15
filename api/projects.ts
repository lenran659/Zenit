import { apiFetch } from './client';

export type ApiProject = {
  id: string;
  key: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
};

export async function listProjects() {
  return apiFetch<ApiProject[]>('/api/projects');
}

export async function createProject(input: { key: string; name: string; description: string }) {
  return apiFetch<ApiProject>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
