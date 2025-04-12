import { router as expoRouter } from "expo-router";
import type { Route } from "expo-router/build/types";

// Safe navigation functions to use directly without hooks when needed
// This helps prevent circular dependencies and infinite render loops

// Add global navigation tracking to prevent repeated redirects
let lastNavigationTimestamp = 0;
const NAVIGATION_COOLDOWN = 300; // ms

/**
 * Check if navigation should be throttled to prevent rapid redirects
 */
function shouldThrottleNavigation(): boolean {
  const now = Date.now();
  const timeSinceLastNavigation = now - lastNavigationTimestamp;
  return timeSinceLastNavigation < NAVIGATION_COOLDOWN;
}

/**
 * Update the last navigation timestamp
 */
function updateNavigationTimestamp(): void {
  lastNavigationTimestamp = Date.now();
}

/**
 * Safe wrapper around router.push for direct use outside of hook context
 */
export function navigateTo(
  href: string | { pathname: string; params?: Record<string, string> }
): void {
  if (shouldThrottleNavigation()) {
    console.log("Navigation throttled:", href);
    return;
  }

  try {
    console.log("Navigating to:", href);
    updateNavigationTimestamp();

    if (typeof href === "string") {
      expoRouter.push(href as Route);
    } else {
      expoRouter.push({
        pathname: href.pathname as Route,
        params: href.params,
      });
    }
  } catch (error) {
    console.error("Navigation error:", error);
  }
}

/**
 * Safe wrapper around router.replace for direct use outside of hook context
 */
export function replaceTo(
  href: string | { pathname: string; params?: Record<string, string> }
): void {
  if (shouldThrottleNavigation()) {
    console.log("Replace navigation throttled:", href);
    return;
  }

  try {
    console.log("Replacing navigation to:", href);
    updateNavigationTimestamp();

    if (typeof href === "string") {
      expoRouter.replace(href as Route);
    } else {
      expoRouter.replace({
        pathname: href.pathname as Route,
        params: href.params,
      });
    }
  } catch (error) {
    console.error("Replace navigation error:", error);
  }
}

/**
 * Safe wrapper around router.back for direct use outside of hook context
 */
export function goBack(): void {
  if (shouldThrottleNavigation()) {
    console.log("Back navigation throttled");
    return;
  }

  try {
    console.log("Going back");
    updateNavigationTimestamp();
    expoRouter.back();
  } catch (error) {
    console.error("Back navigation error:", error);
  }
}
