// ==============================================================================
// MERIDIAN PARALLEL WORKFLOW & CONCURRENT TRACK ENGINE
// ==============================================================================

export const PARALLEL_TRACKS = [
  {
    id: 'track-frontend',
    name: 'Frontend & UI Stream',
    shortName: 'Frontend',
    code: 'TRK-FE',
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    accent: '#8B5CF6',
    description: 'User interface components, responsive interactions, and client-side states'
  },
  {
    id: 'track-backend',
    name: 'Backend & APIs Stream',
    shortName: 'Backend',
    code: 'TRK-BE',
    color: '#0EA5E9',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
    accent: '#0EA5E9',
    description: 'API routing, micro-services, database pooling, and server controllers'
  },
  {
    id: 'track-design',
    name: 'Design & Systems Stream',
    shortName: 'Design',
    code: 'TRK-DS',
    color: '#10B981',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    accent: '#10B981',
    description: 'Design token alignment, typography scales, and Figma plugin sync'
  },
  {
    id: 'track-qa',
    name: 'QA & Security Stream',
    shortName: 'QA & Security',
    code: 'TRK-QA',
    color: '#F59E0B',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    accent: '#F59E0B',
    description: 'Security auditing, input validation, and end-to-end integration tests'
  },
  {
    id: 'track-devops',
    name: 'DevOps & Cloud Stream',
    shortName: 'DevOps',
    code: 'TRK-OPS',
    color: '#F43F5E',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    accent: '#F43F5E',
    description: 'CI/CD deployment pipelines, cluster provisioning, and caching layers'
  }
];

export const DEFAULT_TRACK = PARALLEL_TRACKS[0];

/**
 * Intelligently infers or resolves a task's parallel track
 */
export function getTaskTrack(task) {
  if (!task) return DEFAULT_TRACK;
  
  if (task.track_id) {
    const found = PARALLEL_TRACKS.find(t => t.id === task.track_id || t.code === task.track_id);
    if (found) return found;
  }
  if (task.track) {
    const found = PARALLEL_TRACKS.find(t => t.id === task.track || t.shortName.toLowerCase() === String(task.track).toLowerCase());
    if (found) return found;
  }

  // Infer based on tags or title keywords
  const text = `${task.title || ''} ${(task.tags || []).join(' ')} ${task.description || ''}`.toLowerCase();
  
  if (text.includes('api') || text.includes('gateway') || text.includes('backend') || text.includes('sql') || text.includes('db') || text.includes('redis') || text.includes('endpoint')) {
    return PARALLEL_TRACKS[1]; // Backend
  }
  if (text.includes('design') || text.includes('token') || text.includes('figma') || text.includes('typography') || text.includes('color')) {
    return PARALLEL_TRACKS[2]; // Design
  }
  if (text.includes('qa') || text.includes('test') || text.includes('security') || text.includes('xss') || text.includes('audit')) {
    return PARALLEL_TRACKS[3]; // QA & Security
  }
  if (text.includes('devops') || text.includes('deploy') || text.includes('docker') || text.includes('cloud') || text.includes('ci/cd') || text.includes('cluster')) {
    return PARALLEL_TRACKS[4]; // DevOps
  }

  return DEFAULT_TRACK; // Frontend by default
}

/**
 * Checks if task is marked as parallel execution unblocked
 */
export function isTaskParallel(task) {
  if (!task) return true;
  if (task.is_parallel !== undefined) return Boolean(task.is_parallel);
  if (task.isParallel !== undefined) return Boolean(task.isParallel);
  // By default in modern agile sprint pipelines, independent deliverables are parallel unblocked
  return true;
}

/**
 * Groups tasks into active parallel swimlanes
 */
export function groupTasksByParallelTracks(tasks = []) {
  const map = new Map();
  PARALLEL_TRACKS.forEach(track => {
    map.set(track.id, {
      track,
      tasks: []
    });
  });

  tasks.forEach(task => {
    const track = getTaskTrack(task);
    const group = map.get(track.id) || map.get(DEFAULT_TRACK.id);
    group.tasks.push({
      ...task,
      resolvedTrack: track
    });
  });

  return Array.from(map.values());
}
