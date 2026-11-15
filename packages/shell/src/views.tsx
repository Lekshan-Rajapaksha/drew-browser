import { requireNativeViewManager } from "expo-modules-core";
import type { ComponentType } from "react";
import { View, type ViewProps } from "react-native";
import { nativeModule } from "./nativeModules";

function safeViewManager<P>(name: string, Fallback: ComponentType<any> = View): ComponentType<P> {
  try {
    return requireNativeViewManager<P>(name);
  } catch {
    return Fallback as ComponentType<P>;
  }
}

export type WindowProfileProps = ViewProps & {
  profile: string;
  selection?: string;
  neighbours: string[];
};
export const WindowProfile = safeViewManager<WindowProfileProps>("ArdiaWindowProfile");

export const WindowDragRegion = safeViewManager<
  ViewProps & { titleBarDoubleClick?: boolean; onRegionDoubleClick?: () => void; clickable?: boolean; onRegionClick?: () => void }
>("ArdiaAppWindows");

export const OutsidePressArea = safeViewManager<ViewProps & { onOutsidePress?: (event: { nativeEvent: { timestamp?: number } }) => void }>("ArdiaOutsidePressArea");

export type SymbolProps = ViewProps & {
  name: string;
  size?: number;
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  color?: string;
};

export const Symbol = safeViewManager<SymbolProps>("ArdiaSymbol");

export type FadeLabelProps = ViewProps & {
  text: string;
  fontSize?: number;
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  color?: string;
  fadeWidth?: number;
};

export const FadeLabel = safeViewManager<FadeLabelProps>("ArdiaFadeLabel");

export const ActivitySpinner = safeViewManager<ViewProps>("ArdiaActivitySpinner");

export type ContextMenuAreaProps = ViewProps & {
  onContextMenu?: () => void;
  captureDescendants?: boolean;
};

const NativeContextMenuArea = safeViewManager<Omit<ContextMenuAreaProps, "onContextMenu"> & { onContextMenu?: () => void }>(
  "ArdiaContextMenuArea",
);

export function ContextMenuArea(props: ContextMenuAreaProps) {
  return <NativeContextMenuArea {...props} />;
}

export type SurfaceProps = ViewProps & {
  fill?: string;
  cornerRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  borderColors?: string[];
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: [number, number];
};

type NativeSurfaceProps = Omit<SurfaceProps, "shadowColor" | "shadowOpacity" | "shadowRadius" | "shadowOffset"> & {
  surfaceShadowColor?: string;
  surfaceShadowOpacity?: number;
  surfaceShadowRadius?: number;
  surfaceShadowOffset?: [number, number];
};

const NativeSurface = safeViewManager<NativeSurfaceProps>("ArdiaSurface");

export function Surface({ shadowColor, shadowOpacity, shadowRadius, shadowOffset, ...props }: SurfaceProps) {
  return (
    <NativeSurface
      {...props}
      surfaceShadowColor={shadowColor}
      surfaceShadowOpacity={shadowOpacity}
      surfaceShadowRadius={shadowRadius}
      surfaceShadowOffset={shadowOffset}
    />
  );
}

export type VisualEffectProps = ViewProps & {
  material?: string;
  blendingMode?: "withinWindow" | "behindWindow";
  cornerRadius?: number;
};

export const VisualEffect = safeViewManager<VisualEffectProps>("ArdiaVisualEffect");

export type GlassEffectProps = ViewProps & {
  cornerRadius?: number;
  tint?: string;
  glassStyle?: "regular" | "clear";
  dark?: boolean;
};

export type GlassEffectNative = { isLiquidGlass(): boolean };

const GlassEffectModule = nativeModule("ArdiaGlassEffect");

export const isLiquidGlass = (): boolean => GlassEffectModule.isLiquidGlass();

export const GlassEffect = safeViewManager<GlassEffectProps>("ArdiaGlassEffect");

export const GlassGroup = safeViewManager<ViewProps & { strength?: number }>("ArdiaGlassGroup");

export type PopoverBubbleProps = ViewProps & {
  material?: "popover" | "menu" | "hudWindow" | "sheet" | "toolTip";
  dark?: boolean;
  cornerRadius?: number;
  arrowEdge?: "top" | "bottom" | "none";
  arrowX?: number;
  arrowWidth?: number;
  arrowHeight?: number;
  tint?: string;
  edgeColor?: string;
  edgeWidth?: number;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffsetY?: number;
  glass?: boolean;
};

type NativePopoverBubbleProps = Omit<PopoverBubbleProps, "shadowOpacity" | "shadowRadius" | "shadowOffsetY"> & {
  bubbleShadowOpacity?: number;
  bubbleShadowRadius?: number;
  bubbleShadowOffsetY?: number;
};

const NativePopoverBubble = safeViewManager<NativePopoverBubbleProps>("ArdiaPopoverBubble");

export function PopoverBubble({ shadowOpacity, shadowRadius, shadowOffsetY, ...props }: PopoverBubbleProps) {
  return <NativePopoverBubble {...props} bubbleShadowOpacity={shadowOpacity} bubbleShadowRadius={shadowRadius} bubbleShadowOffsetY={shadowOffsetY} />;
}

export type IconTheme = { kind: "blur" } | { kind: "template"; fill: string; stroke?: string };

export type DockSelectionNative = {
  iconTheme(uri: string | null, emoji: string | null): Promise<IconTheme | null>;
  iconAccent(uri: string): Promise<string | null>;
};

const DockSelectionModule = nativeModule("ArdiaDockSelection");

export const iconTheme = (source: { uri: string } | { emoji: string }): Promise<IconTheme | null> =>
  DockSelectionModule.iconTheme("uri" in source ? source.uri : null, "emoji" in source ? source.emoji : null);

export const iconAccent = (uri: string): Promise<string | null> => DockSelectionModule.iconAccent(uri);

export type DockSelectionProps = ViewProps & {
  image?: string;
  emoji?: string;
  theme?: IconTheme["kind"];
  fill?: string;
  stroke?: string;
  cornerRadius?: number;
  strokeWidth?: number;
  iconSize?: number;
  dark: boolean;
  glass?: boolean;
  colorRing?: boolean;
};

export const DockSelection = safeViewManager<DockSelectionProps>("ArdiaDockSelection");
