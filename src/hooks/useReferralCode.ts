import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const REFERRAL_COOKIE_NAME = "nesa_ref_code";
const REFERRAL_STORAGE_KEY = "nesa_referral_code";
const REFERRAL_EXPIRY_DAYS = 60;

/**
 * Hook for managing referral code attribution
 * - Reads from URL param (?ref=CODE)
 * - Persists to localStorage and cookie
 * - Provides methods to get/clear the stored code
 */
export function useReferralCode() {
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Read referral code from URL, localStorage, or cookie
  useEffect(() => {
    const urlCode = searchParams.get("ref");
    const storedCode = localStorage.getItem(REFERRAL_STORAGE_KEY);
    const cookieCode = getCookie(REFERRAL_COOKIE_NAME);

    // Priority: URL > localStorage > cookie
    const code = urlCode || storedCode || cookieCode || null;

    // If URL has a code, persist it
    if (urlCode) {
      persistReferralCode(urlCode);
    }

    setReferralCode(code);
    setIsLoading(false);
  }, [searchParams]);

  // Persist referral code to localStorage and cookie
  const persistReferralCode = useCallback((code: string) => {
    localStorage.setItem(REFERRAL_STORAGE_KEY, code);
    setCookie(REFERRAL_COOKIE_NAME, code, REFERRAL_EXPIRY_DAYS);
    setReferralCode(code);
  }, []);

  // Clear stored referral code
  const clearReferralCode = useCallback(() => {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
    deleteCookie(REFERRAL_COOKIE_NAME);
    setReferralCode(null);
  }, []);

  // Generate shareable referral link
  const generateReferralLink = useCallback((userCode: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/buy-your-ticket?ref=${encodeURIComponent(userCode)}`;
  }, []);

  return {
    referralCode,
    isLoading,
    persistReferralCode,
    clearReferralCode,
    generateReferralLink,
    hasReferral: !!referralCode,
  };
}

// ============== Cookie Helpers ==============

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
