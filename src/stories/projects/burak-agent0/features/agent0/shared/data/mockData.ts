export type { Server, Profile, UserGroup, ActivityLogEntry, AgentInstruction, LlmProvider } from '../types';

export const mainTabs = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Servers', value: 'servers' },
  { label: 'Profiles', value: 'profiles' },
  { label: 'Activity Log', value: 'activity' },
];

export const profileDetailTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Servers', value: 'profile-servers' },
  { label: 'User Groups', value: 'profile-user-groups' },
  { label: 'Activity Log', value: 'profile-activity' },
];

export const serversData: Server[] = [
  {
    id: 1,
    name: 'Figma',
    slug: 'figma',
    url: 'https://mcp.figma.com/mcp',
    connectionType: 'OAuth',
    connectionTypeSeverity: 'accent-aster',
    status: 'Connected',
    statusConnected: true,
    createdAt: '2/17/2026',
    authConfig: '{\n  "redirect_uri": "warp://callback"\n}',
  },
  {
    id: 2,
    name: 'Github',
    slug: 'github',
    url: 'https://api.githubcopilot.com/mcp/',
    connectionType: 'API Token',
    connectionTypeSeverity: 'accent-yellow',
    status: 'Connected',
    statusConnected: true,
    createdAt: '2/13/2026',
    authConfig: '{\n  "token_env": "GITHUB_TOKEN"\n}',
  },
  {
    id: 3,
    name: 'JumpCloud Labs Admin',
    slug: 'jclabs',
    url: 'https://labs.jumpcloud.com/mcp/admin',
    connectionType: 'OAuth',
    connectionTypeSeverity: 'accent-aster',
    status: 'Connected',
    statusConnected: true,
    createdAt: '2/11/2026',
    authConfig: '{\n  "redirect_uri": "https://labs.jumpcloud.com/callback"\n}',
  },
  {
    id: 4,
    name: 'Atlassian',
    slug: 'jira',
    url: 'https://mcp.atlassian.com/v1/sse',
    connectionType: 'SSE',
    connectionTypeSeverity: 'accent-moss',
    status: 'Connected',
    statusConnected: true,
    createdAt: '2/10/2026',
    authConfig: '{\n  "oauth_scope": "read:jira-work"\n}',
  },
  {
    id: 5,
    name: 'Salesforce',
    slug: 'salesforce',
    url: 'https://api.salesforce.com/platform/mcp/v1-beta.2',
    connectionType: 'OAuth',
    connectionTypeSeverity: 'accent-aster',
    status: 'Not connected',
    statusConnected: false,
    createdAt: '2/12/2026',
    authConfig: '{\n  "redirect_uri": "https://salesforce.com/oauth/callback"\n}',
  },
  {
    id: 6,
    name: 'Slack',
    slug: 'slack',
    url: 'https://api.slack.com/mcp/v1',
    connectionType: 'API Token',
    connectionTypeSeverity: 'accent-yellow',
    status: 'Not connected',
    statusConnected: false,
    createdAt: '2/15/2026',
    authConfig: '{\n  "token_env": "SLACK_BOT_TOKEN"\n}',
  },
];

export const profilesData: Profile[] = [
  {
    id: 1,
    name: 'Engineering',
    profileId: 'engineering',
    label: 'engineering',
    serverIds: ['jira', 'github'],
    createdAt: '2/10/2026',
  },
  {
    id: 2,
    name: 'Design',
    profileId: 'design',
    label: 'design',
    serverIds: ['figma', 'slack'],
    createdAt: '2/12/2026',
  },
  {
    id: 3,
    name: 'Sales',
    profileId: 'sales',
    label: 'sales',
    serverIds: ['salesforce'],
    createdAt: '2/14/2026',
  },
];

export const userGroupsData: UserGroup[] = [
  { id: 1, name: 'Backend Engineers', slug: 'backend-eng', memberCount: 24, createdAt: '1/15/2026' },
  { id: 2, name: 'Frontend Engineers', slug: 'frontend-eng', memberCount: 18, createdAt: '1/15/2026' },
  { id: 3, name: 'DevOps', slug: 'devops', memberCount: 8, createdAt: '1/20/2026' },
  { id: 4, name: 'Design Team', slug: 'design-team', memberCount: 12, createdAt: '2/01/2026' },
  { id: 5, name: 'Sales Team', slug: 'sales-team', memberCount: 15, createdAt: '2/05/2026' },
  { id: 6, name: 'Marketing', slug: 'marketing', memberCount: 10, createdAt: '2/05/2026' },
  { id: 7, name: 'QA Engineers', slug: 'qa-eng', memberCount: 6, createdAt: '2/10/2026' },
];

export const profileUserGroups: Record<string, string[]> = {
  engineering: ['backend-eng', 'frontend-eng', 'devops', 'qa-eng'],
  design: ['design-team', 'frontend-eng'],
  sales: ['sales-team', 'marketing'],
};

export const recentActivity = [
  { user: 'John Doe', server: 'Figma', time: '2 min ago', event: 'Connected to Figma MCP server' },
  { user: 'John Doe', server: 'Github', time: '8 min ago', event: 'Tool call: list_pull_requests — 1,240 tokens' },
  { user: 'Sarah Chen', server: 'Figma', time: '12 min ago', event: 'Tool call: get_file — 8,750 tokens' },
  { user: 'Sarah Chen', server: 'Figma', time: '15 min ago', event: 'OAuth token refreshed automatically' },
  { user: 'John Doe', server: 'Atlassian', time: '18 min ago', event: 'Tool call: search_issues — 3,420 tokens' },
  { user: 'Mike Ross', server: 'Salesforce', time: '25 min ago', event: 'Tool call: query_records — failed (connection timeout)' },
  { user: 'Sarah Chen', server: 'Atlassian', time: '32 min ago', event: 'Connected to Atlassian MCP server' },
  { user: 'John Doe', server: 'Github', time: '38 min ago', event: 'Tool call: create_pull_request — 1,890 tokens' },
  { user: 'Lisa Wang', server: 'Figma', time: '45 min ago', event: 'Tool call: get_comments — 560 tokens' },
  { user: 'Mike Ross', server: 'Salesforce', time: '52 min ago', event: 'Connected to Salesforce MCP server' },
];

export const topServerUsage = [
  { name: 'Atlassian', requests: 4521 },
  { name: 'Github', requests: 3892 },
  { name: 'Figma', requests: 2614 },
  { name: 'JumpCloud Labs', requests: 1820 },
  { name: 'Salesforce', requests: 1340 },
];

export const monthlyChartData = {
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'Github',
      data: [820, 1450, 2100, 2680, 3200, 3540, 3892],
      borderColor: 'rgb(45, 180, 175)',
      backgroundColor: 'rgb(45, 180, 175)',
      pointBackgroundColor: 'rgb(45, 180, 175)',
      pointStyle: 'circle',
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 4,
      fill: false,
    },
    {
      label: 'Atlassian',
      data: [600, 1100, 1800, 2900, 3600, 4100, 4521],
      borderColor: 'rgb(76, 172, 246)',
      backgroundColor: 'rgb(76, 172, 246)',
      pointBackgroundColor: 'rgb(76, 172, 246)',
      pointStyle: 'circle',
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 4,
      fill: false,
    },
    {
      label: 'Figma',
      data: [400, 750, 1200, 1600, 1900, 2300, 2614],
      borderColor: 'rgb(242, 138, 13)',
      backgroundColor: 'rgb(242, 138, 13)',
      pointBackgroundColor: 'rgb(242, 138, 13)',
      pointStyle: 'circle',
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 4,
      fill: false,
    },
    {
      label: 'JumpCloud Labs',
      data: [200, 380, 620, 900, 1200, 1540, 1820],
      borderColor: 'rgb(240, 135, 96)',
      backgroundColor: 'rgb(240, 135, 96)',
      pointBackgroundColor: 'rgb(240, 135, 96)',
      pointStyle: 'circle',
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 4,
      fill: false,
    },
    {
      label: 'Salesforce',
      data: [0, 0, 100, 320, 580, 740, 860],
      borderColor: 'rgb(231, 126, 206)',
      backgroundColor: 'rgb(231, 126, 206)',
      pointBackgroundColor: 'rgb(231, 126, 206)',
      pointStyle: 'circle',
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 4,
      fill: false,
    },
    {
      label: 'Slack',
      data: [0, 0, 0, 0, 80, 180, 310],
      borderColor: 'rgb(177, 147, 235)',
      backgroundColor: 'rgb(177, 147, 235)',
      pointBackgroundColor: 'rgb(177, 147, 235)',
      pointStyle: 'circle',
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 4,
      fill: false,
    },
  ],
};

export const topUsers = [
  { name: 'John Doe', toolCalls: 8240 },
  { name: 'Sarah Chen', toolCalls: 6890 },
  { name: 'Alex Kim', toolCalls: 4120 },
  { name: 'Lisa Wang', toolCalls: 3450 },
  { name: 'Mike Ross', toolCalls: 2180 },
];

export const llmProviders = [
  { id: 'gemini', name: 'Google Gemini', subtitle: 'Google AI Studio or Vertex AI', model: 'gemini-2.0-flash' },
  { id: 'openai', name: 'OpenAI ChatGPT', subtitle: 'OpenAI API platform', model: 'gpt-4o' },
  { id: 'bedrock', name: 'Bedrock Claude', subtitle: 'AWS Bedrock — Claude Sonnet 4', model: 'us.anthropic.claude-sonnet-4-20250514-v1:0' },
];

export const defaultInstructions: AgentInstruction[] = [
  {
    id: 1,
    name: 'Plan Before Execute',
    enabled: true,
    content: 'Always build a plan of targets+tools first and then return the plan and ask for confirmation before executing.',
  },
  {
    id: 2,
    name: 'Multi-Step Reasoning',
    enabled: false,
    content: 'When a task requires multiple tools or targets, break it down into sequential steps. Execute each step and use the output to inform the next step.',
  },
  {
    id: 3,
    name: 'Error Recovery',
    enabled: false,
    content: 'If a tool call fails, analyze the error and try an alternative approach using different tools or targets if available.',
  },
];

export const authStyleOptions = [
  { label: 'OAuth', value: 'OAuth' },
  { label: 'API Token', value: 'API Token' },
  { label: 'SSE', value: 'SSE' },
];

/** Phase 01 server dialog — segmented auth control (no SSE) */
export const phase01AuthStyleOptions = [
  { label: 'OAuth', value: 'OAuth' },
  { label: 'API Token', value: 'API Token' },
];

export const activityLogData: ActivityLogEntry[] = [
  {
    id: 1,
    timestamp: '2026-03-02 14:32:05',
    user: 'john.doe@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Github',
    detail: 'list_pull_requests — repo:jumpcloud/admin-portal',
    tokensUsed: 1240,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 2,
    timestamp: '2026-03-02 14:28:41',
    user: 'sarah.chen@company.com',
    action: 'Token Created',
    actionCategory: 'token',
    server: 'Figma',
    detail: 'OAuth token issued — scopes: read, write',
    tokensUsed: 0,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 3,
    timestamp: '2026-03-02 14:25:18',
    user: 'john.doe@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Atlassian',
    detail: 'search_issues — jql:project=ADMIN AND status="In Progress"',
    tokensUsed: 3420,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 4,
    timestamp: '2026-03-02 14:22:09',
    user: 'admin@company.com',
    action: 'Token Revoked',
    actionCategory: 'token',
    server: 'Slack',
    detail: 'API token revoked for user mike.ross@company.com',
    tokensUsed: 0,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 5,
    timestamp: '2026-03-02 14:18:33',
    user: 'sarah.chen@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Figma',
    detail: 'get_file — file_key:xH2k9mZ, node_ids:12:44',
    tokensUsed: 8750,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 6,
    timestamp: '2026-03-02 14:15:02',
    user: 'mike.ross@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Salesforce',
    detail: 'query_records — SOQL:SELECT Id,Name FROM Account LIMIT 10',
    tokensUsed: 2100,
    status: 'Failed',
    statusSeverity: 'danger',
  },
  {
    id: 7,
    timestamp: '2026-03-02 14:10:45',
    user: 'john.doe@company.com',
    action: 'Budget Spent',
    actionCategory: 'spending',
    server: '—',
    detail: 'Daily budget threshold reached — 80% of $50.00 limit',
    tokensUsed: 0,
    status: 'Warning',
    statusSeverity: 'warn',
  },
  {
    id: 8,
    timestamp: '2026-03-02 14:05:21',
    user: 'admin@company.com',
    action: 'Token Created',
    actionCategory: 'token',
    server: 'Github',
    detail: 'API token issued — permissions: repo, read:org',
    tokensUsed: 0,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 9,
    timestamp: '2026-03-02 13:58:14',
    user: 'sarah.chen@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'JumpCloud Labs Admin',
    detail: 'list_users — filter:active, limit:50',
    tokensUsed: 4200,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 10,
    timestamp: '2026-03-02 13:52:07',
    user: 'mike.ross@company.com',
    action: 'Token Refreshed',
    actionCategory: 'token',
    server: 'Atlassian',
    detail: 'OAuth token auto-refreshed — expires in 3600s',
    tokensUsed: 0,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 11,
    timestamp: '2026-03-02 13:45:33',
    user: 'john.doe@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Github',
    detail: 'create_pull_request — repo:jumpcloud/circuit, base:main',
    tokensUsed: 1890,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 12,
    timestamp: '2026-03-02 13:40:18',
    user: 'admin@company.com',
    action: 'Budget Updated',
    actionCategory: 'spending',
    server: '—',
    detail: 'Monthly budget increased from $500 to $750',
    tokensUsed: 0,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 13,
    timestamp: '2026-03-02 13:35:42',
    user: 'sarah.chen@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Figma',
    detail: 'get_comments — file_key:xH2k9mZ',
    tokensUsed: 560,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 14,
    timestamp: '2026-03-02 13:28:55',
    user: 'mike.ross@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Salesforce',
    detail: 'update_record — object:Contact, id:003xx000004Tmnz',
    tokensUsed: 1450,
    status: 'Failed',
    statusSeverity: 'danger',
  },
  {
    id: 15,
    timestamp: '2026-03-02 13:22:10',
    user: 'john.doe@company.com',
    action: 'Token Created',
    actionCategory: 'token',
    server: 'JumpCloud Labs Admin',
    detail: 'OAuth token issued — scopes: admin:read, admin:write',
    tokensUsed: 0,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 16,
    timestamp: '2026-03-02 13:15:30',
    user: 'sarah.chen@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Atlassian',
    detail: 'create_issue — project:DESIGN, type:Task',
    tokensUsed: 2870,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 17,
    timestamp: '2026-03-02 13:08:22',
    user: 'admin@company.com',
    action: 'Budget Spent',
    actionCategory: 'spending',
    server: '—',
    detail: 'Weekly spending report — total: $127.45 across 4 servers',
    tokensUsed: 0,
    status: 'Info',
    statusSeverity: 'info',
  },
  {
    id: 18,
    timestamp: '2026-03-02 12:55:44',
    user: 'mike.ross@company.com',
    action: 'Token Expired',
    actionCategory: 'token',
    server: 'Slack',
    detail: 'API token expired — last used 14 days ago',
    tokensUsed: 0,
    status: 'Warning',
    statusSeverity: 'warn',
  },
  {
    id: 19,
    timestamp: '2026-03-02 12:42:11',
    user: 'john.doe@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'Github',
    detail: 'get_file_contents — repo:jumpcloud/admin-portal, path:src/index.ts',
    tokensUsed: 6320,
    status: 'Success',
    statusSeverity: 'success',
  },
  {
    id: 20,
    timestamp: '2026-03-02 12:30:08',
    user: 'sarah.chen@company.com',
    action: 'MCP Tool Call',
    actionCategory: 'mcp_usage',
    server: 'JumpCloud Labs Admin',
    detail: 'create_user_group — name:design-team-beta',
    tokensUsed: 980,
    status: 'Success',
    statusSeverity: 'success',
  },
];

export const activityLogFilters = [
  { key: 'Action', operator: 'is', value: 'MCP Tool Call', id: 'filter-action' },
  { key: 'Status', operator: 'is', value: 'Success', id: 'filter-status' },
];

export const serverOptions = serversData.map((s) => ({
  label: `${s.name} (${s.slug})`,
  value: s.slug,
}));

export const userGroupOptions = userGroupsData.map((g) => ({
  label: g.name,
  value: g.slug,
}));

const serverSlugToName = Object.fromEntries(
  serversData.map((s) => [s.slug, s.name]),
) as Record<string, string>;

const serverNameToChartLabel: Record<string, string> = {
  'JumpCloud Labs Admin': 'JumpCloud Labs',
};

function getChartLabel(serverName: string): string {
  return serverNameToChartLabel[serverName] ?? serverName;
}

export function getProfileServerNames(profileId: string): string[] {
  const profile = profilesData.find((p) => p.profileId === profileId);
  if (!profile) return [];
  return profile.serverIds.map((slug) => serverSlugToName[slug]).filter(Boolean);
}

export function getProfileActivityLogData(profileId: string): ActivityLogEntry[] {
  const serverNames = getProfileServerNames(profileId);
  return activityLogData.filter((entry) => serverNames.includes(entry.server));
}

export function getProfileRecentActivity(profileId: string) {
  const serverNames = getProfileServerNames(profileId);
  return recentActivity.filter((entry) => serverNames.includes(entry.server));
}

export function getProfileMonthlyChartData(profileId: string) {
  const serverNames = getProfileServerNames(profileId);
  const chartLabels = serverNames.map(getChartLabel);
  return {
    ...monthlyChartData,
    datasets: monthlyChartData.datasets.filter((ds) => chartLabels.includes(ds.label)),
  };
}

export function getProfileTopServerUsage(profileId: string) {
  const serverNames = getProfileServerNames(profileId);
  const chartLabels = serverNames.map(getChartLabel);
  return topServerUsage.filter((s) => chartLabels.includes(s.name));
}

export interface ProfileDashboardStats {
  activeUsers: string;
  activeUsersChange: string;
  activeServers: string;
  activeServersPercent: string;
  totalRequests: string;
  totalRequestsChange: string;
  avgResponseTime: string;
  avgResponseTimeChange: string;
  errorRate: string;
  errorRateChange: string;
  topUsers: { name: string; toolCalls: number }[];
}

export const serverDetailTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'User Groups', value: 'server-user-groups' },
  { label: 'Activity Log', value: 'server-activity' },
];

export const alt02MainTabs = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Servers', value: 'servers' },
  { label: 'Activity Log', value: 'activity' },
];

export const phase01MainTabs = [
  { label: 'Servers', value: 'servers' },
  { label: 'Activity Log', value: 'activity' },
];

export function getServerActivityLogData(serverSlug: string): ActivityLogEntry[] {
  const server = serversData.find((s) => s.slug === serverSlug);
  if (!server) return [];
  return activityLogData.filter((entry) => entry.server === server.name);
}

export function getServerRecentActivity(serverSlug: string) {
  const server = serversData.find((s) => s.slug === serverSlug);
  if (!server) return [];
  return recentActivity.filter((entry) => entry.server === server.name);
}

export function getServerMonthlyChartData(serverSlug: string) {
  const server = serversData.find((s) => s.slug === serverSlug);
  if (!server) return { ...monthlyChartData, datasets: [] };
  const serverNameToChartLabel: Record<string, string> = {
    'JumpCloud Labs Admin': 'JumpCloud Labs',
  };
  const chartLabel = serverNameToChartLabel[server.name] ?? server.name;
  return {
    ...monthlyChartData,
    datasets: monthlyChartData.datasets.filter((ds) => ds.label === chartLabel),
  };
}

export function getServerUserGroups(serverSlug: string): UserGroup[] {
  const profilesWithServer = profilesData.filter((p) => p.serverIds.includes(serverSlug));
  const groupSlugsSet = new Set<string>();
  for (const profile of profilesWithServer) {
    const slugs = profileUserGroups[profile.profileId] ?? [];
    for (const slug of slugs) groupSlugsSet.add(slug);
  }
  return userGroupsData.filter((g) => groupSlugsSet.has(g.slug));
}

export interface ServerDashboardStats {
  activeUsers: string;
  activeUsersChange: string;
  boundUserGroups: string;
  totalRequests: string;
  totalRequestsChange: string;
  avgResponseTime: string;
  avgResponseTimeChange: string;
  errorRate: string;
  errorRateChange: string;
  topUsers: { name: string; toolCalls: number }[];
}

export const serverDashboardStats: Record<string, ServerDashboardStats> = {
  figma: {
    activeUsers: '28',
    activeUsersChange: '8%',
    boundUserGroups: '3',
    totalRequests: '2,614',
    totalRequestsChange: '5.4%',
    avgResponseTime: '312ms',
    avgResponseTimeChange: '-8ms',
    errorRate: '0.5%',
    errorRateChange: '-0.1%',
    topUsers: [
      { name: 'Sarah Chen', toolCalls: 9310 },
      { name: 'Lisa Wang', toolCalls: 3450 },
      { name: 'Alex Kim', toolCalls: 1280 },
    ],
  },
  github: {
    activeUsers: '42',
    activeUsersChange: '15%',
    boundUserGroups: '4',
    totalRequests: '3,892',
    totalRequestsChange: '12.1%',
    avgResponseTime: '198ms',
    avgResponseTimeChange: '-18ms',
    errorRate: '0.3%',
    errorRateChange: '-0.5%',
    topUsers: [
      { name: 'John Doe', toolCalls: 4820 },
      { name: 'Sarah Chen', toolCalls: 2870 },
      { name: 'Alex Kim', toolCalls: 1940 },
    ],
  },
  jclabs: {
    activeUsers: '18',
    activeUsersChange: '6%',
    boundUserGroups: '4',
    totalRequests: '1,820',
    totalRequestsChange: '9.2%',
    avgResponseTime: '265ms',
    avgResponseTimeChange: '-15ms',
    errorRate: '0.7%',
    errorRateChange: '-0.3%',
    topUsers: [
      { name: 'Sarah Chen', toolCalls: 5180 },
      { name: 'Alex Kim', toolCalls: 3200 },
      { name: 'Lisa Wang', toolCalls: 2400 },
    ],
  },
  jira: {
    activeUsers: '35',
    activeUsersChange: '10%',
    boundUserGroups: '4',
    totalRequests: '4,521',
    totalRequestsChange: '14.5%',
    avgResponseTime: '220ms',
    avgResponseTimeChange: '-10ms',
    errorRate: '0.4%',
    errorRateChange: '-0.2%',
    topUsers: [
      { name: 'John Doe', toolCalls: 6840 },
      { name: 'Sarah Chen', toolCalls: 4490 },
      { name: 'Alex Kim', toolCalls: 3100 },
    ],
  },
  salesforce: {
    activeUsers: '15',
    activeUsersChange: '3%',
    boundUserGroups: '2',
    totalRequests: '1,340',
    totalRequestsChange: '2.8%',
    avgResponseTime: '420ms',
    avgResponseTimeChange: '+25ms',
    errorRate: '4.2%',
    errorRateChange: '+1.8%',
    topUsers: [
      { name: 'Mike Ross', toolCalls: 2180 },
    ],
  },
  slack: {
    activeUsers: '8',
    activeUsersChange: '2%',
    boundUserGroups: '2',
    totalRequests: '310',
    totalRequestsChange: '72%',
    avgResponseTime: '380ms',
    avgResponseTimeChange: '-5ms',
    errorRate: '1.5%',
    errorRateChange: '-0.5%',
    topUsers: [],
  },
};

export const profileDashboardStats: Record<string, ProfileDashboardStats> = {
  engineering: {
    activeUsers: '48',
    activeUsersChange: '15%',
    activeServers: '2 / 2',
    activeServersPercent: '100%',
    totalRequests: '8,413',
    totalRequestsChange: '12.1%',
    avgResponseTime: '198ms',
    avgResponseTimeChange: '-18ms',
    errorRate: '0.3%',
    errorRateChange: '-0.5%',
    topUsers: [
      { name: 'John Doe', toolCalls: 4820 },
      { name: 'Sarah Chen', toolCalls: 2870 },
      { name: 'Alex Kim', toolCalls: 1940 },
    ],
  },
  design: {
    activeUsers: '28',
    activeUsersChange: '8%',
    activeServers: '1 / 2',
    activeServersPercent: '50%',
    totalRequests: '2,924',
    totalRequestsChange: '5.4%',
    avgResponseTime: '312ms',
    avgResponseTimeChange: '-8ms',
    errorRate: '1.2%',
    errorRateChange: '+0.1%',
    topUsers: [
      { name: 'Sarah Chen', toolCalls: 9310 },
      { name: 'Lisa Wang', toolCalls: 3450 },
      { name: 'Alex Kim', toolCalls: 1280 },
    ],
  },
  sales: {
    activeUsers: '15',
    activeUsersChange: '3%',
    activeServers: '0 / 1',
    activeServersPercent: '0%',
    totalRequests: '1,340',
    totalRequestsChange: '2.8%',
    avgResponseTime: '420ms',
    avgResponseTimeChange: '+25ms',
    errorRate: '4.2%',
    errorRateChange: '+1.8%',
    topUsers: [
      { name: 'Mike Ross', toolCalls: 2180 },
    ],
  },
};
