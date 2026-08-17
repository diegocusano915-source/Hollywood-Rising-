/**
 * HOLLYWOOD RISING - Hollywood Insider Data Models
 * Types and interfaces for the Variety / Deadline / Hollywood Reporter trade news system.
 */

export type NewsCategory =
  | 'Movies'
  | 'Box Office'
  | 'Awards'
  | 'Casting'
  | 'Legal News'
  | 'Studios'
  | 'Television & Streaming'
  | 'Social Media'
  | 'Scandals'
  | 'Industry News';

export type NPCAuthorType =
  | 'VERIFIED_PRO'
  | 'VERIFIED_CELEBRITY'
  | 'FAN'
  | 'CRITIC'
  | 'EXECUTIVE'
  | 'STUDIO_HEAD';

export interface NPCComment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorType: NPCAuthorType;
  isVerified?: boolean;
  roleBadge?: string;
  text: string;
  likesCount: number;
  isTopComment?: boolean;
  timeAgo: string;
  userLiked?: boolean;
  replies?: NPCComment[];
}

export interface RelatedEntities {
  movieTitle?: string;
  actorName?: string;
  studioName?: string;
  directorName?: string;
  awardName?: string;
  agencyName?: string;
  lawFirmName?: string;
  grossAmount?: number;
}

export interface HollywoodInsiderArticle {
  id: string;
  headline: string;
  subHeadline?: string;
  category: NewsCategory;
  publisher: 'Hollywood Insider';
  publishDate: string;
  weekNumber: number;
  yearNumber: number;
  readTimeMinutes: number;
  heroImageUrl: string;
  imageCaption?: string;
  contentParagraphs: string[];
  excerpt: string;
  authorName: string;
  authorRole: string;

  relatedEntities?: RelatedEntities;

  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  commentCount: number;

  isTrending?: boolean;
  isBreaking?: boolean;
  isHeadlineBanner?: boolean;

  userLiked?: boolean;
  userBookmarked?: boolean;

  comments: NPCComment[];
}

export interface HollywoodInsiderState {
  articles: HollywoodInsiderArticle[];
  bookmarkedIds: string[];
}
