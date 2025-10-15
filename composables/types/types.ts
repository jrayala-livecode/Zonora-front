// types.ts o donde definas interfaces

// Social Link interface (defined first as it's used by User)
export interface SocialLink {
  platform: 'instagram' | 'twitter' | 'facebook' | 'tiktok' | 'youtube' | 'spotify' | 'soundcloud';
  url: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  joinedAt?: string;
  username?: string;
  location?: string;
  bio?: string;
  profile_public?: boolean;
  social_links?: SocialLink[];
  is_admin?: boolean;
}

export type LoginResponse =
  | { user: User; token?: string }
  | User;

// Proficiency interface
export interface Proficiency {
  id: number;
  proficiency: string;
}

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
  proficiencies?: Proficiency[];
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
  is_html?: boolean;
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

export interface EventProposal {
  id: number;
  organizer_user_id: number;
  organizer_artist_id: number;
  name: string;
  description: string | null;
  status: 'draft' | 'negotiating' | 'ready' | 'completed' | 'cancelled';
  conversation_id: number | null;
  completed_at: string | null;
  event_id: number | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
  organizer?: {
    id: number;
    name: string;
    email: string;
  };
  organizer_artist?: {
    id: number;
    name: string;
    user_id: number;
  };
  collaborators?: EventProposalCollaborator[];
  negotiations?: EventProposalNegotiation[];
  event?: any;
  unread_count?: number;
  last_message?: {
    id: number;
    body: string;
    created_at: string;
    sender: {
      id: number;
      name: string;
    } | null;
  } | null;
}

export interface EventProposalCollaborator {
  id: number;
  event_proposal_id: number;
  user_id: number;
  artist_id: number;
  status: 'pending' | 'accepted' | 'declined' | 'removed';
  message: string | null;
  invited_at: string | null;
  responded_at: string | null;
  removed_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  artist?: {
    id: number;
    name: string;
  };
}

export interface EventProposalNegotiationType {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  is_active: boolean;
  requires_approval: boolean;
  value_type: 'text' | 'number' | 'date' | 'venue_id' | 'json';
  created_at: string;
  updated_at: string;
}

export interface EventProposalNegotiation {
  id: number;
  event_proposal_id: number;
  negotiation_type_id: number;
  proposed_by_user_id: number;
  proposed_by_artist_id: number;
  value_text: string | null;
  value_number: number | null;
  value_date: string | null;
  value_reference_id: number | null;
  value_json: any | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'superseded';
  message: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  type?: EventProposalNegotiationType;
  proposed_by?: {
    id: number;
    name: string;
  };
  venue?: any;
  votes?: EventProposalNegotiationVote[];
  formatted_value?: string;
}

export interface EventProposalNegotiationVote {
  id: number;
  negotiation_id: number;
  user_id: number;
  artist_id: number;
  vote: 'yes' | 'no';
  comment: string | null;
  voted_at: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
  };
  artist?: {
    id: number;
    name: string;
  };
}

export interface ProposalChatMessage {
  id: number;
  body: string;
  user_id: number;
  conversation_id: number;
  participation_id: number | null;
  type: string;
  message_type?: 'text' | 'system' | 'proposal' | 'vote';
  related_negotiation_id?: number | null;
  related_vote_id?: number | null;
  data: any;
  created_at: string;
  updated_at: string;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ProposalInvitation {
  id: number;
  proposal_id: number;
  proposal_name: string;
  proposal_description: string | null;
  organizer: {
    id: number;
    name: string;
  };
  artist: {
    id: number;
    stage_name: string;
    profile_picture_url: string | null;
  };
  status: 'pending' | 'accepted' | 'declined' | 'removed';
  message: string | null;
  invited_at: string | null;
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

// Post/Comment interfaces
export interface Post {
  id: number;
  user_id: number;
  postable_type: string;
  postable_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
  };
}

// User Profile interfaces
export interface UserProfile {
  id: number;
  name: string;
  username?: string;
  email: string;
  description?: string;
  bio?: string;
  location?: string;
  avatar_url: string;
  cover_image_url?: string;
  profile_public: boolean;
  profile_url: string;
  social_links?: SocialLink[];
  stats: UserStats;
  artists?: Artist[];
  followed_artists?: Artist[];
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  artists_count: number;
  events_organized: number;
  events_interested: number;
  artists_following: number;
  posts_count: number;
  member_since: string;
}

export interface UserActivity {
  posts: Post[];
  interested_events: any[];
}

// Ticket interfaces
export interface Ticket {
  id: number;
  ticket_number: string;
  user_id: number;
  event_id: number;
  price_tag_name: string;
  price_paid: number;
  original_price: number;
  formatted_price: string;
  status: 'active' | 'used' | 'cancelled' | 'refunded';
  purchased_at: string;
  used_at: string | null;
  cancelled_at: string | null;
  refunded_at: string | null;
  payment_method: 'free' | 'bank_transfer' | 'in_app';
  payment_reference: string | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  qr_code: string;
  validation_token: string;
  receipt_validation_status: 'pending' | 'validated' | 'rejected' | null;
  rejection_reason: string | null;
  receipt_validated_at: string | null;
  receipt_rejected_at: string | null;
  metadata: {
    receipt_cid?: string;
    receipt_url?: string;
    [key: string]: any;
  } | null;
  notes: string | null;
  purchased_by_ip: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  event?: {
    id: number;
    name: string;
    date: string;
    venue?: {
      id: number;
      name: string;
      address?: string;
    };
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TicketPurchaseRequest {
  event_id: number;
  quantity: number;
  receipt?: File;
}

export interface TicketStats {
  total_tickets: number;
  active: number;
  used: number;
  pending_validation: number;
  validated: number;
  total_revenue: number;
}

export interface EventTicketsResponse {
  tickets: Ticket[];
  stats: TicketStats;
  event: any;
}

export interface BankTransferInfo {
  account_holder: string;
  bank_name: string;
  account_number: string;
  rut?: string;
  additional_info?: Record<string, string>;
}
