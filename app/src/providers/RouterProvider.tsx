import {
  router,
  useLocalSearchParams,
  usePathname,
  useRootNavigationState,
  useSegments,
} from "expo-router";
import type { Route } from "expo-router/build/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// RouterContext 타입 정의
interface RouterContextType {
  pathname: string;
  query: Record<string, string | string[]>;
  isReady: boolean;
  segments: string[];
  push: (
    href: string | { pathname: string; params?: Record<string, string> }
  ) => void;
  replace: (
    href: string | { pathname: string; params?: Record<string, string> }
  ) => void;
  back: () => void;
  prefetch: (href: string) => void;
}

// 라우터 컨텍스트 생성
const RouterContext = createContext<RouterContextType | undefined>(undefined);

// RouterProvider 프롭스 타입 정의
interface RouterProviderProps {
  children: React.ReactNode;
}

// 라우터 프로바이더 구현
export function RouterProvider({ children }: RouterProviderProps) {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();
  const navigationState = useRootNavigationState();

  // Use ref to track previous key to prevent redundant updates
  const prevKeyRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Navigation state ready check with optimization
  useEffect(() => {
    // Only update if not ready yet and navigationState exists
    if (
      !isReady &&
      navigationState?.key &&
      navigationState.key !== prevKeyRef.current
    ) {
      prevKeyRef.current = navigationState.key;
      setIsReady(true);
    }
  }, [navigationState?.key, isReady]);

  // Define callbacks to prevent recreation on each render
  const push = useCallback(
    (href: string | { pathname: string; params?: Record<string, string> }) => {
      if (typeof href === "string") {
        router.push(href as Route);
      } else {
        router.push({
          pathname: href.pathname as Route,
          params: href.params,
        });
      }
    },
    []
  );

  const replace = useCallback(
    (href: string | { pathname: string; params?: Record<string, string> }) => {
      if (typeof href === "string") {
        router.replace(href as Route);
      } else {
        router.replace({
          pathname: href.pathname as Route,
          params: href.params,
        });
      }
    },
    []
  );

  const back = useCallback(() => router.back(), []);

  const prefetch = useCallback((href: string) => {
    // Expo Router doesn't have a built-in prefetch method,
    // but in the future this could be implemented
    console.log(`Prefetching ${href} (not supported in expo-router yet)`);
  }, []);

  // Stable reference of params and pathname to prevent unnecessary re-renders
  const queryRef = useRef(params);
  const pathnameRef = useRef(pathname);

  // Only update refs when actual values change (deep comparison for params)
  useEffect(() => {
    if (JSON.stringify(queryRef.current) !== JSON.stringify(params)) {
      queryRef.current = params;
    }
  }, [params]);

  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      pathnameRef.current = pathname;
    }
  }, [pathname]);

  // Memoize the context value to prevent recreation on each render
  const contextValue = useMemo(
    () => ({
      pathname,
      query: params as Record<string, string | string[]>,
      isReady,
      segments,
      push,
      replace,
      back,
      prefetch,
    }),
    [pathname, segments, isReady, push, replace, back, prefetch]
  );

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}

// 라우터 컨텍스트를 사용하기 위한 커스텀 훅
export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter는 RouterProvider 내부에서만 사용할 수 있습니다");
  }
  return context;
}

export default RouterProvider;
