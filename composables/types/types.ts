// types.ts o donde definas interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  joinedAt?: string;
}

export type LoginResponse =
  | { user: User; token?: string }
  | User;

// Artist Follow interfaces
export interface ArtistFollow {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: string;
  updated_at: string;
}

export interface FollowStatus {
  is_following: boolean;
  can_follow: boolean;
}

export interface Artist {
  id: number;
  stage_name: string;
  bio?: string;
  genres?: string[];
  profile_picture_url?: string;
  is_public: boolean;
  has_active_subscription: boolean;
  view_count: number;
  search_count: number;
  follow_count: number;
  unfollow_count: number;
  event_association_count: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  following?: Artist[];
  follow_status?: FollowStatus;
}

export interface ArtistMetrics {
  artist_id: number;
  stage_name: string;
  current_metrics: {
    views_today: number;
    views_this_week: number;
    unique_viewers_today: number;
  };
  historical_metrics: DailyMetric[];
  total_views: number;
  total_follows: number;
  total_searches: number;
}

export interface DailyMetric {
  id: number;
  artist_id: number;
  date: string;
  view_count: number;
  search_count: number;
  follow_count: number;
  unfollow_count: number;
  event_association_count: number;
}

export interface ArtistStats {
  total_artists: number;
  total_views: number;
  total_follows: number;
  average_views_per_artist: number;
  most_viewed_artist: {
    id: number;
    stage_name: string;
    view_count: number;
  } | null;
  artists: Array<{
    id: number;
    stage_name: string;
    view_count: number;
    follow_count: number;
    is_public: boolean;
  }>;
}

// Chat/Message interfaces
export interface Message {
  id: number;
  subject: string;
  message: string;
  from_user: {
    id: number;
    name: string;
    email: string;
  };
  to_user: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SendMessageRequest {
  receiver_id: number;
  subject: string;
  content: string;
}

export interface SendMessageResponse {
  message: string;
  data: Message;
}
