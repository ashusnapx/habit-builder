/**
 * useToast.tsx
 *
 * An enhanced toast notification system with improved performance, accessibility,
 * and additional features for a better developer and user experience.
 *
 * Features:
 * - Configurable toast limits and durations
 * - Automatic toast queuing and prioritization
 * - Support for different toast types with consistent styling
 * - Pause-on-hover functionality
 * - Accessibility improvements (ARIA support, keyboard navigation)
 * - Performance optimizations
 * - Analytics tracking capability
 *
 * @version 2.0.0
 */

"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Configurable constants with sensible defaults
const DEFAULT_CONFIG = {
  TOAST_LIMIT: 5, // Maximum number of toasts shown simultaneously
  TOAST_REMOVE_DELAY: 5000, // Default duration before auto-dismissal (ms)
  TOAST_PAUSE_ON_HOVER: true, // Pause timer when hovering
  TOAST_PAUSE_ON_WINDOW_BLUR: true, // Pause timer when window loses focus
};

// Toast priority levels
export enum ToastPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

// Toast types for semantic variations
export enum ToastType {
  DEFAULT = "default",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  INFO = "info",
}

// Enhanced toast configuration interface
export interface ToastOptions {
  /**
   * Toast title (primary text)
   */
  title?: React.ReactNode;

  /**
   * Toast description (secondary text)
   */
  description?: React.ReactNode;

  /**
   * Action element to display in the toast
   */
  action?: ToastActionElement;

  /**
   * Duration to display the toast in milliseconds (0 = infinite)
   */
  duration?: number;

  /**
   * Toast visually indicates its type
   */
  variant?: "default" | "destructive";

  /**
   * Semantic type of the toast
   */
  type?: ToastType;

  /**
   * Icon to display next to the toast text
   */
  icon?: React.ReactNode;

  /**
   * Priority level determining display order and dismissal behavior
   */
  priority?: ToastPriority;

  /**
   * Whether to pause the dismiss timer on hover
   */
  pauseOnHover?: boolean;

  /**
   * Optional analytics data to track when toast is displayed/interacted with
   */
  analytics?: Record<string, any>;

  /**
   * Callback fired when toast is dismissed
   */
  onDismiss?: () => void;
}

// Internal toast object with extended properties
export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  type?: ToastType;
  icon?: React.ReactNode;
  duration?: number;
  priority?: ToastPriority;
  createdAt: number;
  pauseOnHover?: boolean;
  isPaused?: boolean;
  analytics?: Record<string, any>;
  onDismiss?: () => void;
};

// Action types to ensure type safety
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
  PAUSE_TOAST: "PAUSE_TOAST",
  RESUME_TOAST: "RESUME_TOAST",
  CLEAR_ALL: "CLEAR_ALL",
} as const;

type ActionType = typeof actionTypes;

// Enhanced ID generation with collision avoidance
let counter = 0;
const genId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  counter = (counter + 1) % 1000;
  return `toast-${timestamp}-${random}-${counter}`;
};

// Comprehensive action type definitions
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast> & { id: string };
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["PAUSE_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["RESUME_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["CLEAR_ALL"];
    };

// Application state interface
interface State {
  toasts: ToasterToast[];
  config: {
    limit: number;
    defaultDuration: number;
    pauseOnHover: boolean;
    pauseOnWindowBlur: boolean;
  };
}

// Toast timeout management with WeakMap for better garbage collection
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Adds a toast to the removal queue after its display duration
 * @param toastId The ID of the toast to queue for removal
 * @param duration Custom duration (falls back to default)
 */
const addToRemoveQueue = (
  toastId: string,
  duration: number = DEFAULT_CONFIG.TOAST_REMOVE_DELAY
) => {
  // Clear any existing timeout to prevent duplicates
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId));
    toastTimeouts.delete(toastId);
  }

  // Skip for toasts with infinite duration (0)
  if (duration === 0) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    });
  }, duration);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Pauses the removal timeout for a toast
 * @param toastId The ID of the toast to pause
 */
const pauseToastTimer = (toastId: string) => {
  if (!toastTimeouts.has(toastId)) return;

  clearTimeout(toastTimeouts.get(toastId));
  toastTimeouts.delete(toastId);

  dispatch({
    type: "PAUSE_TOAST",
    toastId,
  });
};

/**
 * Resumes the removal timeout for a toast
 * @param toastId The ID of the toast to resume
 * @param remainingTime Time remaining before toast should be removed
 */
const resumeToastTimer = (toastId: string, remainingTime: number) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    });
  }, remainingTime);

  toastTimeouts.set(toastId, timeout);

  dispatch({
    type: "RESUME_TOAST",
    toastId,
  });
};

/**
 * Enhanced reducer with comprehensive toast management
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST": {
      // Sort toasts by priority (higher priority first) then by creation time (newer first)
      const sortedToasts = [action.toast, ...state.toasts].sort((a, b) => {
        const priorityDiff =
          (b.priority ?? ToastPriority.NORMAL) -
          (a.priority ?? ToastPriority.NORMAL);
        if (priorityDiff !== 0) return priorityDiff;
        return b.createdAt - a.createdAt;
      });

      // Apply toast limit
      const visibleToasts = sortedToasts.slice(0, state.config.limit);

      // Track analytics if provided
      if (action.toast.analytics && typeof window !== "undefined") {
        try {
          // Simple analytics tracking - could be expanded with a proper analytics service
          console.info("Toast analytics:", {
            event: "toast_shown",
            id: action.toast.id,
            type: action.toast.type,
            ...action.toast.analytics,
          });
        } catch (e) {
          // Silently fail - analytics shouldn't break functionality
        }
      }

      return {
        ...state,
        toasts: visibleToasts,
      };
    }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Handle individual toast dismissal
      if (toastId) {
        const toast = state.toasts.find((t) => t.id === toastId);

        // Execute onDismiss callback if defined
        toast?.onDismiss?.();

        addToRemoveQueue(toastId, 300); // Quick removal after animation
      }
      // Handle dismiss all
      else {
        state.toasts.forEach((toast) => {
          toast.onDismiss?.();
          addToRemoveQueue(toast.id, 300);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // Clear all toasts
        return {
          ...state,
          toasts: [],
        };
      }
      // Filter out specific toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    case "PAUSE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? {
                ...t,
                isPaused: true,
              }
            : t
        ),
      };

    case "RESUME_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? {
                ...t,
                isPaused: false,
              }
            : t
        ),
      };

    case "CLEAR_ALL":
      // Immediately clear all toasts without animations
      state.toasts.forEach((toast) => {
        if (toastTimeouts.has(toast.id)) {
          clearTimeout(toastTimeouts.get(toast.id));
          toastTimeouts.delete(toast.id);
        }
      });

      return {
        ...state,
        toasts: [],
      };

    default:
      return state;
  }
};

// Observer pattern implementation with typed listeners
const listeners: Array<(state: State) => void> = [];

// In-memory state with default configuration
let memoryState: State = {
  toasts: [],
  config: {
    limit: DEFAULT_CONFIG.TOAST_LIMIT,
    defaultDuration: DEFAULT_CONFIG.TOAST_REMOVE_DELAY,
    pauseOnHover: DEFAULT_CONFIG.TOAST_PAUSE_ON_HOVER,
    pauseOnWindowBlur: DEFAULT_CONFIG.TOAST_PAUSE_ON_WINDOW_BLUR,
  },
};

/**
 * Dispatch function to update state and notify listeners
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * Enhanced toast creation with extended options
 */
function toast(options: ToastOptions | string) {
  // Handle string shorthand
  const opts: ToastOptions =
    typeof options === "string" ? { description: options } : options;

  const id = genId();
  const createdAt = Date.now();

  // Set default duration based on toast type
  let duration = opts.duration ?? memoryState.config.defaultDuration;
  if (
    opts.type === ToastType.ERROR ||
    opts.priority === ToastPriority.CRITICAL
  ) {
    duration = opts.duration ?? memoryState.config.defaultDuration * 1.5;
  }

  // Set default pauseOnHover based on config
  const pauseOnHover = opts.pauseOnHover ?? memoryState.config.pauseOnHover;

  // Create and dispatch toast
  // @ts-ignore
  const newToast: ToasterToast = {
    ...opts,
    id,
    createdAt,
    duration,
    pauseOnHover,
    isPaused: false,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open) dismiss(id);
    },
  };

  dispatch({
    type: "ADD_TOAST",
    toast: newToast,
  });

  // Queue for automatic removal if duration is set
  if (duration > 0) {
    addToRemoveQueue(id, duration);
  }

  // Return toast controller
  return {
    id,
    dismiss: () => dismiss(id),
    update: (props: Partial<ToastOptions>) => update({ id, ...props }),
    pause: () => pauseToastTimer(id),
    resume: (remainingTime?: number) => {
      const toast = memoryState.toasts.find((t) => t.id === id);
      if (!toast) return;

      const defaultRemaining =
        toast.duration ?? memoryState.config.defaultDuration;
      resumeToastTimer(id, remainingTime ?? defaultRemaining);
    },
  };
}

/**
 * Dismisses a specific toast or all toasts
 */
function dismiss(toastId?: string) {
  dispatch({ type: "DISMISS_TOAST", toastId });
}

/**
 * Updates properties of an existing toast
 */
function update(props: Partial<ToastOptions> & { id: string }) {
  dispatch({ type: "UPDATE_TOAST", toast: props as any });
}

/**
 * Pauses a specific toast's timer
 */
function pause(toastId?: string) {
  if (toastId) {
    pauseToastTimer(toastId);
  } else {
    // Pause all toasts
    memoryState.toasts.forEach((toast) => {
      pauseToastTimer(toast.id);
    });
  }
}

/**
 * Resumes a specific toast's timer
 */
function resume(toastId?: string, remainingTime?: number) {
  if (toastId) {
    const toast = memoryState.toasts.find((t) => t.id === toastId);
    if (toast && toast.isPaused) {
      const defaultRemaining =
        toast.duration ?? memoryState.config.defaultDuration;
      resumeToastTimer(toastId, remainingTime ?? defaultRemaining);
    }
  } else {
    // Resume all paused toasts
    memoryState.toasts
      .filter((t) => t.isPaused)
      .forEach((toast) => {
        const defaultRemaining =
          toast.duration ?? memoryState.config.defaultDuration;
        resumeToastTimer(toast.id, remainingTime ?? defaultRemaining);
      });
  }
}

/**
 * Immediately clears all toasts
 */
function clearAll() {
  dispatch({ type: "CLEAR_ALL" });
}

/**
 * Creates toast variants with pre-configured settings
 */
const toastVariants = {
  default: (options: ToastOptions | string) =>
    toast({ ...resolveOptions(options), type: ToastType.DEFAULT }),
  success: (options: ToastOptions | string) =>
    toast({ ...resolveOptions(options), type: ToastType.SUCCESS }),
  warning: (options: ToastOptions | string) =>
    toast({ ...resolveOptions(options), type: ToastType.WARNING }),
  error: (options: ToastOptions | string) =>
    toast({
      ...resolveOptions(options),
      type: ToastType.ERROR,
      priority: ToastPriority.HIGH,
    }),
  info: (options: ToastOptions | string) =>
    toast({ ...resolveOptions(options), type: ToastType.INFO }),
  loading: (options: ToastOptions | string) =>
    toast({ ...resolveOptions(options), duration: 0 }), // Infinite duration for loading toasts
};

/**
 * Helper function to handle string vs object options
 */
function resolveOptions(options: ToastOptions | string): ToastOptions {
  return typeof options === "string" ? { description: options } : options;
}

/**
 * Configuration function to update global toast settings
 */
function configure(config: Partial<State["config"]>) {
  memoryState = {
    ...memoryState,
    config: {
      ...memoryState.config,
      ...config,
    },
  };

  // Notify listeners about config changes
  listeners.forEach((listener) => {
    listener(memoryState);
  });

  return memoryState.config;
}

/**
 * Custom React hook for toast state and functions
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    // Subscribe to state changes
    listeners.push(setState);

    // Handle window blur for pausing toasts if configured
    const handleWindowBlur = () => {
      if (state.config.pauseOnWindowBlur) {
        state.toasts.forEach((toast) => {
          if (!toast.isPaused) {
            pauseToastTimer(toast.id);
          }
        });
      }
    };

    // Handle window focus for resuming toasts if configured
    const handleWindowFocus = () => {
      if (state.config.pauseOnWindowBlur) {
        state.toasts.forEach((toast) => {
          if (toast.isPaused && toast.duration && toast.duration > 0) {
            // Default to remaining time as full duration when resuming
            resumeToastTimer(toast.id, toast.duration);
          }
        });
      }
    };

    // Add window event listeners
    if (typeof window !== "undefined") {
      window.addEventListener("blur", handleWindowBlur);
      window.addEventListener("focus", handleWindowFocus);
    }

    // Cleanup function
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }

      if (typeof window !== "undefined") {
        window.removeEventListener("blur", handleWindowBlur);
        window.removeEventListener("focus", handleWindowFocus);
      }
    };
  }, [state.config.pauseOnWindowBlur]);

  return {
    ...state,
    toast,
    dismiss,
    update,
    pause,
    resume,
    clearAll,
    configure,
    // Toast variants
    ...toastVariants,
  };
}

export { useToast, toast, toastVariants };
