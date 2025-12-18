import { useEffect, useRef, useCallback } from 'react';

interface UseRealtimePollingOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  onPoll: () => Promise<void> | void;
  onError?: (error: Error) => void;
  immediate?: boolean; // Run immediately on mount
}

/**
 * Hook for real-time polling of data
 * Automatically handles cleanup and can be paused/resumed
 */
export function useRealtimePolling({
  enabled = true,
  interval = 30000, // 30 seconds default
  onPoll,
  onError,
  immediate = true,
}: UseRealtimePollingOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  const onPollRef = useRef(onPoll);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onPollRef.current = onPoll;
    onErrorRef.current = onError;
  }, [onPoll, onError]);

  const poll = useCallback(async () => {
    if (isPollingRef.current) return; // Prevent concurrent polls
    isPollingRef.current = true;

    try {
      await onPollRef.current();
    } catch (error) {
      console.error('Polling error:', error);
      if (onErrorRef.current) {
        onErrorRef.current(error as Error);
      }
    } finally {
      isPollingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Run immediately if requested
    if (immediate) {
      poll();
    }

    // Set up interval
    intervalRef.current = setInterval(poll, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, immediate, poll]);

  // Manual refresh function
  const refresh = useCallback(() => {
    poll();
  }, [poll]);

  return { refresh };
}

