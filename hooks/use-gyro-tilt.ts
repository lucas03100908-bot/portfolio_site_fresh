"use client";

import { useEffect, useState } from "react";
import type { MotionValue } from "framer-motion";

export type GyroPermissionState = "unavailable" | "pending" | "granted" | "denied";

/**
 * Drives ParallaxTiltCard via device gyroscope (DeviceOrientationEvent).
 *
 * - Android / desktop Chrome: fires automatically, no permission dialog needed.
 * - iOS 13+: requires a user-gesture tap → call `requestPermission()` from a button onClick.
 *
 * @param tiltX   MotionValue that controls left/right tilt (-0.5 … 0.5)
 * @param tiltY   MotionValue that controls front/back tilt (-0.5 … 0.5)
 * @param enabled Pass `isTouchLayout` — keeps the hook dormant on desktop.
 * @param active  Pass `isIntersecting` — pauses listening when section is off-screen.
 */
export function useGyroTilt(
  tiltX: MotionValue<number>,
  tiltY: MotionValue<number>,
  enabled: boolean,
  active: boolean,
): { permissionState: GyroPermissionState; requestPermission: () => void } {
  const [permissionState, setPermissionState] = useState<GyroPermissionState>("pending");

  // On Android / non-iOS: DeviceOrientationEvent.requestPermission doesn't exist → auto-grant.
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (!("DeviceOrientationEvent" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissionState("unavailable");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (DeviceOrientationEvent as any).requestPermission !== "function") {
      setPermissionState("granted");
    }
    // iOS: stays "pending" until user taps the permission button.
  }, [enabled]);

  // Attach / detach orientation listener.
  useEffect(() => {
    if (!enabled || !active || permissionState !== "granted") return;

    const GAMMA_RANGE = 60; // ±60° phone tilt left/right  → ±0.5
    const BETA_RANGE  = 60; // ±60° from upright forward/back → ±0.5
    const BETA_NEUTRAL = 90; // portrait-upright beta is ~90°

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      tiltX.set(Math.max(-0.5, Math.min(0.5, e.gamma / GAMMA_RANGE)));
      tiltY.set(Math.max(-0.5, Math.min(0.5, (e.beta - BETA_NEUTRAL) / BETA_RANGE)));
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
      tiltX.set(0);
      tiltY.set(0);
    };
  }, [enabled, active, permissionState, tiltX, tiltY]);

  // NOTE: This must be called synchronously inside a user-gesture handler (e.g. onClick).
  // Do NOT await anything before calling requestPermission() or iOS will reject it.
  const requestPermission = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctor = DeviceOrientationEvent as any;
      if (typeof ctor.requestPermission === "function") {
        // Call synchronously — iOS requires this to be in the same call stack as the tap.
        (ctor.requestPermission() as Promise<string>).then((result: string) => {
          setPermissionState(result === "granted" ? "granted" : "denied");
        }).catch(() => {
          setPermissionState("denied");
        });
      } else {
        setPermissionState("granted");
      }
    } catch {
      setPermissionState("denied");
    }
  };

  return { permissionState, requestPermission };
}
