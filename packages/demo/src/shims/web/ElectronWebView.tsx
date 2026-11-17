import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import type { NavigationState, WebViewHandle, WebViewProps } from "@ardia-real/ardiacore";

type GuestEvent = Event & {
  url?: string;
  title?: string;
  favicons?: string[];
  errorCode?: number;
  errorDescription?: string;
  validatedURL?: string;
  disposition?: string;
  result?: { activeMatchOrdinal: number; matches: number; finalUpdate?: boolean };
};

type ElectronGuest = HTMLElement & {
  src: string;
  loadURL(url: string): Promise<void>;
  getURL(): string;
  getTitle(): string;
  isLoading(): boolean;
  canGoBack(): boolean;
  canGoForward(): boolean;
  goBack(): void;
  goForward(): void;
  goToOffset?(offset: number): void;
  reload(): void;
  reloadIgnoringCache(): void;
  stop(): void;
  executeJavaScript<T = unknown>(code: string): Promise<T>;
  setAudioMuted(muted: boolean): void;
  getZoomFactor(): number;
  setZoomFactor(factor: number): void;
  findInPage(text: string, options: { forward: boolean; findNext: boolean }): number;
  stopFindInPage(action: "clearSelection" | "keepSelection"): void;
  print(): Promise<void>;
  openDevTools(): void;
};

const blankState = (): NavigationState => ({
  url: "about:blank",
  title: "New Tab",
  canGoBack: false,
  canGoForward: false,
  isLoading: false,
  themeColor: null,
  themeColorSource: null,
});

const safeOrigin = (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

const GESTURE_NAVIGATION = `(() => {
  if (globalThis.__drewGestureNavigation) return;
  const state = { distance: 0, last: 0, locked: false };
  globalThis.__drewGestureNavigation = state;
  addEventListener("wheel", (event) => {
    if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.35) return;
    const now = performance.now();
    if (now - state.last > 180) {
      state.distance = 0;
      state.locked = false;
    }
    state.last = now;
    if (state.locked) return;
    state.distance -= event.deltaX;
    if (Math.abs(state.distance) < 110) return;
    state.locked = true;
    if (state.distance > 0) history.back();
    else history.forward();
  }, { passive: true });
  addEventListener("mouseup", (event) => {
    if (event.button === 3) history.back();
    else if (event.button === 4) history.forward();
  }, true);
})()`;

const inspectGuest = (view: ElectronGuest | null, fallback: NavigationState) => {
  try {
    return { url: view?.getURL() || fallback.url, title: view?.getTitle() || fallback.title, canGoBack: view?.canGoBack() ?? false, canGoForward: view?.canGoForward() ?? false, isLoading: view?.isLoading() ?? false };
  } catch {
    return { url: fallback.url, title: fallback.title, canGoBack: false, canGoForward: false, isLoading: fallback.isLoading };
  }
};

export const ElectronWebView = forwardRef<WebViewHandle, WebViewProps>(function ElectronWebView(props, ref) {
  const latest = useRef(props);
  latest.current = props;
  const host = useRef<HTMLDivElement | null>(null);
  const guest = useRef<ElectronGuest | null>(null);
  const state = useRef<NavigationState>(blankState());
  const ready = useRef(false);

  const report = (patch: Partial<NavigationState> = {}) => {
    const snapshot = inspectGuest(guest.current, state.current);
    const url = patch.url ?? snapshot.url;
    const title = patch.title ?? snapshot.title;
    state.current = {
      ...state.current,
      ...patch,
      url: url || "about:blank",
      title: title || "New Tab",
      canGoBack: snapshot.canGoBack,
      canGoForward: snapshot.canGoForward,
      isLoading: patch.isLoading ?? snapshot.isLoading,
    };
    latest.current.onNavigationChange?.(state.current);
  };

  useEffect(() => {
    const parent = host.current;
    if (!parent) return;
    const view = document.createElement("webview") as ElectronGuest;
    const profile = (props.profile || "default").replace(/[^a-zA-Z0-9_-]/g, "-");
    view.setAttribute("partition", `persist:drew-${profile}`);
    view.setAttribute("allowpopups", "true");
    view.setAttribute("webpreferences", "contextIsolation=yes,nodeIntegration=no,sandbox=yes");
    view.src = props.url || "about:blank";
    Object.assign(view.style, { width: "100%", height: "100%", display: "flex", border: "0", background: props.contentsBackgroundColor || "#FFFFFF" });
    const listeners: [string, EventListener][] = [];
    const on = (name: string, listener: (event: GuestEvent) => void) => {
      const handler = listener as EventListener;
      view.addEventListener(name, handler);
      listeners.push([name, handler]);
    };
    on("dom-ready", () => {
      if (!ready.current) {
        ready.current = true;
        latest.current.onReady?.();
      }
      void view.executeJavaScript(GESTURE_NAVIGATION).catch(() => undefined);
      void view
        .executeJavaScript<string | null>('document.querySelector(\'meta[name="theme-color"]\')?.getAttribute("content") ?? null')
        .then((themeColor) => report({ themeColor, themeColorSource: themeColor ? "meta" : null }))
        .catch(() => report());
    });
    on("did-start-loading", () => {
      report({ isLoading: true });
      latest.current.onProgress?.(0.12);
    });
    on("did-stop-loading", () => {
      report({ isLoading: false });
      latest.current.onProgress?.(1);
    });
    const navigated = (event: GuestEvent) => {
      const url = event.url || view.getURL();
      report({ url, committedUrl: url, committedAt: Date.now(), committedInitial: true });
    };
    on("did-navigate", navigated);
    on("did-navigate-in-page", navigated);
    on("page-title-updated", (event) => report({ title: event.title || view.getTitle() }));
    on("page-favicon-updated", (event) => {
      const favicons = event.favicons ?? [];
      if (favicons[0]) latest.current.onFavicon?.(favicons[0], favicons);
    });
    on("did-fail-load", (event) => {
      if (event.errorCode === -3) return;
      latest.current.onLoadError?.({ url: event.validatedURL || inspectGuest(view, state.current).url, code: event.errorCode ?? -1, text: event.errorDescription || "Page failed to load" });
    });
    on("found-in-page", (event) => {
      const result = event.result;
      if (result) latest.current.onFindResult?.({ active: result.activeMatchOrdinal, count: result.matches, final: result.finalUpdate ?? true });
    });
    on("new-window", (event) => {
      if (event.url) latest.current.onOpenWindow?.({ url: event.url, disposition: event.disposition === "background-tab" ? "background" : "foreground", userGesture: true, fromClick: true });
    });
    on("enter-html-full-screen", () => latest.current.onFullscreen?.(true));
    on("leave-html-full-screen", () => latest.current.onFullscreen?.(false));
    on("focus", () => latest.current.onPageFocus?.());
    on("mousedown", () => latest.current.onPagePress?.());
    on("close", () => latest.current.onWindowClose?.());
    parent.append(view);
    guest.current = view;
    return () => {
      for (const [name, handler] of listeners) view.removeEventListener(name, handler);
      guest.current = null;
      view.remove();
    };
  }, []);

  useEffect(() => {
    const view = guest.current;
    if (!view || !props.url) return;
    if (!ready.current) {
      if (view.src !== props.url) view.src = props.url;
      return;
    }
    if (props.url !== inspectGuest(view, state.current).url) void view.loadURL(props.url);
  }, [props.url]);

  useImperativeHandle(ref, () => {
    const done = Promise.resolve();
    const current = () => guest.current;
    const handle: Partial<WebViewHandle> = {
      nativeTag: () => null,
      loadUrl: async (url) => {
        const view = current();
        if (!view) return;
        if (!ready.current) {
          view.src = url;
          return;
        }
        await view.loadURL(url);
      },
      goBack: async () => void (current()?.canGoBack() && current()?.goBack()),
      goForward: async () => void (current()?.canGoForward() && current()?.goForward()),
      goToOffset: async (offset) => void current()?.goToOffset?.(offset),
      reload: async () => void current()?.reload(),
      forceReload: async () => void current()?.reloadIgnoringCache(),
      stopLoading: async () => void current()?.stop(),
      focus: async () => void current()?.focus(),
      setMuted: async (muted) => void current()?.setAudioMuted(muted),
      zoomStep: async (direction) => {
        const view = current();
        if (!view) return;
        const levels = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
        const currentLevel = view.getZoomFactor();
        const index = levels.reduce((best, value, i) => (Math.abs(value - currentLevel) < Math.abs(levels[best]! - currentLevel) ? i : best), 0);
        const next = direction === 0 ? 1 : levels[Math.max(0, Math.min(levels.length - 1, index + direction))]!;
        view.setZoomFactor(next);
        latest.current.onZoom?.({ zoom: next, host: safeOrigin(view.getURL()) ?? "", isDefault: next === 1, pinchScale: 1, user: true });
      },
      find: async (text, forward, findNext) => void current()?.findInPage(text, { forward, findNext }),
      stopFinding: async (clearSelection) => void current()?.stopFindInPage(clearSelection ? "clearSelection" : "keepSelection"),
      print: async () => void (await current()?.print()),
      runPageCommand: async (name) => {
        if (name === "systemPrint") await current()?.print();
      },
      showDevTools: async () => void current()?.openDevTools(),
      executeJavaScript: async (code) => void (await current()?.executeJavaScript(code)),
      evaluate: async (code) => (await current()?.executeJavaScript(code)) ?? null,
      navigationEntries: async () => [{ url: state.current.url, title: state.current.title, current: true }],
      discard: async () => "unsupported",
      capturePicture: async () => null,
      getSecurityInfo: async () => {
        const url = inspectGuest(current(), state.current).url;
        return { level: url.startsWith("https://") ? "secure" : url.startsWith("http://") ? "insecure" : "local", url, origin: safeOrigin(url) };
      },
    };
    return new Proxy(handle, { get: (target, key) => (key in target ? target[key as keyof WebViewHandle] : () => done) }) as WebViewHandle;
  }, []);

  const visible = props.visible !== false;
  return (
    <View style={[props.style, { overflow: "hidden", backgroundColor: props.contentsBackgroundColor || "#FFFFFF" }, !visible && { opacity: 0, pointerEvents: "none" }]}>
      <div ref={host} inert={!visible} style={{ position: "absolute", inset: 0 }} />
    </View>
  );
});
