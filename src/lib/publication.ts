export interface PublicationStatus {
  site_id: number;
  is_published: boolean;
  has_changes: boolean;
  draft_fingerprint: string;
  published_fingerprint: string | null;
  last_published_at: string | null;
  last_unpublished_at: string | null;
  publish_count: number;
  section_count: number;
  page_count: number;
}
