export type UserRole = "writer" | "publisher" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatarUrl?: string;
  isVerifiedWriter?: boolean;
  joinedDate?: string;
}

export type DRMProtectionLevel = "standard" | "high" | "strict_military";

export type AccessStatus = "pending" | "approved" | "rejected" | "expired";

export interface DRMConfig {
  watermarkText: string;
  allowCopy: boolean; // Always false for DRM, but configurable by writer
  allowDownload: boolean; // Always false for preview, true only if fully licensed
  screenBlurProtection: boolean; // Blurs on focus loss
  samplePageLimit: number; // e.g. 3 chapters or 5 pages for preview
  expiryHours: number; // e.g. 24 or 48 hours preview pass
  encryptionKeyHash: string; // Simulated AES-256 hash
  ipTrackingEnabled: boolean;
  ndaRequired: boolean;
}

export interface RatingCategory {
  plotScore: number; // 1-5
  characterScore: number; // 1-5
  pacingScore: number; // 1-5
  commercialViability: number; // 1-5
  overallRating: number; // Average
}

export interface PublisherReview {
  id: string;
  publisherName: string;
  publisherCompany: string;
  rating: RatingCategory;
  comment: string;
  createdAt: string;
  isPrivateNote?: boolean;
}

export interface AccessRequest {
  id: string;
  publisherId: string;
  publisherName: string;
  publisherCompany: string;
  manuscriptId: string;
  manuscriptTitle: string;
  requestReason: string;
  requestedAccessType: "sample_only" | "full_manuscript" | "option_review";
  status: AccessStatus;
  requestedAt: string;
  approvedAt?: string;
  expiresAt?: string;
  accessCode?: string;
}

export interface PublisherOffer {
  id: string;
  manuscriptId: string;
  manuscriptTitle: string;
  publisherName: string;
  publisherCompany: string;
  offerType: "option_rights" | "outright_buyout" | "royalty_publishing" | "adaptation_screenplay";
  amount: number; // in INR / USD
  currency: "INR" | "USD";
  termsSummary: string;
  status: "pending" | "accepted" | "declined" | "countered";
  createdAt: string;
}

export interface DRMAuditLog {
  id: string;
  manuscriptId: string;
  manuscriptTitle: string;
  viewerName: string;
  viewerRole: string;
  viewerIp: string;
  action: "KEY_DECRYPT" | "WATERMARK_RENDER" | "PREVIEW_STARTED" | "BLUR_TRIGGERED" | "COPY_BLOCKED" | "PRINT_BLOCKED" | "ACCESS_REQUESTED";
  timestamp: string;
  securityStatus: "SECURE" | "FLAGGED_FOCUS_LOSS" | "ATTEMPTED_SELECTION";
  deviceInfo: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  wordCount: number;
  content: string; // Plain text that gets encrypted and watermarked in reader
  isSample: boolean; // Allowed in sample preview
}

export interface Manuscript {
  id: string;
  title: string;
  synopsis: string;
  logline: string;
  genre: "Crime Thriller" | "Sci-Fi / Fantasy" | "Bollywood Feature Script" | "Romantic Poetry" | "Startup Drama" | "Historical Drama" | "Horror";
  type: "Screenplay" | "Novel / Manuscript" | "Poetry Collection" | "TV Series Bible" | "Short Story";
  language: "Hindi" | "English" | "Hinglish";
  wordCount: number;
  writerId: string;
  writerName: string;
  writerEmail: string;
  createdAt: string;
  updatedAt: string;
  
  // Encryption & DRM
  encryptedPayload: string; // Simulated ciphertext
  drmConfig: DRMConfig;
  status: "Draft" | "DRM_Protected" | "Under_NDA" | "Optioned" | "Published";

  // Content
  chapters: Chapter[];

  // Stats & Ratings
  totalViews: number;
  uniqueReaders: number;
  averageReadPercentage: number;
  reviews: PublisherReview[];
  accessRequests: AccessRequest[];
  offers: PublisherOffer[];
}

export interface AnalyticsSummary {
  totalManuscripts: number;
  totalViews: number;
  totalAccessRequests: number;
  pendingApprovals: number;
  averageRating: number;
  topPerformingGenre: string;
  viewsOverTime: { date: string; views: number; previewMinutes: number }[];
  genreDistribution: { genre: string; count: number; percentage: number }[];
  ratingDistribution: { stars: number; count: number }[];
}
