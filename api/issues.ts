import { apiFetch } from './client';

export type ApiIssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done';
export type ApiPriority = 'urgent' | 'high' | 'medium' | 'low';
export type ApiIssueType = 'issue' | 'bug';

export type ApiIssue = {
  id: string;
  projectId: string;
  title: string;
  descriptionMarkdown: string;
  type: ApiIssueType;
  status: ApiIssueStatus;
  priority: ApiPriority;
  assigneeId?: string;
  watcherIds: string[];
  createdAt: string;
  updatedAt: string;
};

export async function listIssues(projectId: string) {
  return apiFetch<ApiIssue[]>(`/api/projects/${encodeURIComponent(projectId)}/issues`);
}

export async function createIssue(
  projectId: string,
  input: {
    title: string;
    descriptionMarkdown: string;
    priority: ApiPriority;
    status: ApiIssueStatus;
    type: ApiIssueType;
    assigneeId?: string;
    watcherIds?: string[];
  }
) {
  return apiFetch<ApiIssue>(`/api/projects/${encodeURIComponent(projectId)}/issues`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateIssueStatus(issueId: string, status: ApiIssueStatus) {
  return apiFetch<ApiIssue>(`/api/issues/${encodeURIComponent(issueId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
