/**
 * Centralized Validation Utilities
 * Runtime validation for data integrity
 */

import type { Award } from "@/data/awards";
import type { ImpactItem } from "@/data/impact";
import type { Video } from "@/data/videos";

/**
 * Validate a single award entry
 */
export function validateAward(award: Award): boolean {
  return Boolean(
    award.title &&
    award.organization &&
    award.year &&
    award.description &&
    award.sourceUrl &&
    award.sourceUrl.startsWith('http')
  );
}

/**
 * Validate all awards
 */
export function validateAwards(awards: Award[]): boolean {
  return awards.every(validateAward);
}

/**
 * Validate a single impact item
 */
export function validateImpactItem(item: ImpactItem): boolean {
  return Boolean(
    item.title &&
    item.date &&
    item.description &&
    item.sourceUrl &&
    item.sourceUrl.startsWith('http')
  );
}

/**
 * Validate all impact items
 */
export function validateImpactItems(items: ImpactItem[]): boolean {
  return items.every(validateImpactItem);
}

/**
 * Validate a single video entry
 */
export function validateVideo(video: Video): boolean {
  return Boolean(
    video.id &&
    video.videoId &&
    video.videoId.length === 11 && // YouTube video IDs are 11 characters
    video.title &&
    video.date
  );
}

/**
 * Validate all videos
 */
export function validateVideos(videos: Video[]): boolean {
  return videos.every(validateVideo);
}

/**
 * Log validation warnings in development
 */
export function logValidationWarning(dataType: string, isValid: boolean): void {
  if (!isValid && process.env.NODE_ENV === 'development') {
    console.warn(`${dataType} data validation failed - some items may have missing required fields`);
  }
}
