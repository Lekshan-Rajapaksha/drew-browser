import type { GestureResponderEvent } from "react-native";
import { IS_MACOS } from "../platform/platformInfo";

export type ClickModifiers = { metaKey: boolean; altKey: boolean; shiftKey: boolean; ctrlKey?: boolean };

export function modifiersOf(e: GestureResponderEvent | undefined): ClickModifiers {
  const n = (e?.nativeEvent ?? {}) as Partial<ClickModifiers & { ctrlKey?: boolean }>;
  const isPrimary = IS_MACOS ? !!n.metaKey : !!(n.metaKey || n.ctrlKey);
  return {
    metaKey: isPrimary,
    altKey: !!n.altKey,
    shiftKey: !!n.shiftKey,
    ctrlKey: !!n.ctrlKey,
  };
}
