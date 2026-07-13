const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || '';

function buildQuery(subject, topic) {
  if (!subject) return '';
  const selectedTopic = !topic || topic === 'All Topics' ? '' : topic;
  return [subject, selectedTopic, 'tutorial'].filter(Boolean).join(' ');
}

function mapYouTubeItems(items) {
  return (items || []).map((item) => {
    const videoId = item?.id?.videoId || '';
    const snippet = item?.snippet || {};
    return {
      id: videoId || `${snippet?.title || 'video'}-${Math.random().toString(36).slice(2, 8)}`,
      videoId,
      title: snippet?.title || 'Untitled video',
      channel: snippet?.channelTitle || 'YouTube Channel',
      thumbnail:
        snippet?.thumbnails?.high?.url ||
        snippet?.thumbnails?.medium?.url ||
        snippet?.thumbnails?.default?.url ||
        '',
      url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#',
      duration: '',
    };
  });
}

export function generateMockVideos(subject, topic, count = 5) {
  const query = buildQuery(subject, topic);
  const encodedQuery = encodeURIComponent(query || 'programming tutorial');

  return Array.from({ length: count }, (_, idx) => ({
    id: `mock-${encodedQuery}-${idx}`,
    videoId: '',
    title: `${query || 'Study Topic'} - Tutorial ${idx + 1}`,
    channel: 'Demo Learning Channel',
    thumbnail: `https://placehold.co/640x360/1f2937/ffffff?text=${encodeURIComponent(
      `${subject || 'Study'} ${topic && topic !== 'All Topics' ? `- ${topic}` : ''}`
    )}`,
    url: `https://www.youtube.com/results?search_query=${encodedQuery}`,
    duration: '10-25 min',
  }));
}

export async function fetchYouTubeVideos(subject, topic, maxResults = 6) {
  const query = buildQuery(subject, topic);
  if (!query) return [];

  if (!YOUTUBE_API_KEY) {
    return generateMockVideos(subject, topic, Math.min(Math.max(maxResults, 3), 6));
  }

  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${Math.min(
    Math.max(maxResults, 3),
    6
  )}&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('YouTube API request failed');
  }

  const data = await response.json();
  return mapYouTubeItems(data?.items || []);
}

