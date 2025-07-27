export interface Venue {
  id: number;
  name: string;
  address: string;
  description: string | null;
  latitude: string;
  longitude: string;
  interest_links: string[];
  hashtags: string[];
  created_at: string;
  updated_at: string;
  commune_id: number;
  user_id: number;
}