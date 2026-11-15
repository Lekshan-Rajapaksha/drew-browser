import { call, on, type CastDialog, type CastRoute } from "@ardia/ardiacore";
import { IS_MACOS } from "./platformInfo";

export {
  CastMode,
  type CastSink,
  type CastDialog,
  type CastRoute,
  type DisplayMediaSource,
  type DisplayMediaAudio,
  type DisplayMediaRequest,
  type MediaCommand,
  type MediaFault,
  type NowPlaying,
  type ControlPress,
  type PictureInPictureState,
} from "@ardia/ardiacore";

export const getDisplayMediaSources = () => call("media.displayMediaSources");
export const screenRecordingAllowed = async (): Promise<boolean> => {
  if (!IS_MACOS) return true;
  try {
    return await call("media.screenRecordingAllowed");
  } catch {
    return false;
  }
};
export const requestScreenRecording = async (): Promise<void> => {
  if (!IS_MACOS) return;
  try {
    await call("media.requestScreenRecording");
  } catch {
  }
};
export const setDisplayMediaPicker = (enabled: boolean) => call("webView.setDisplayMediaPicker", { enabled });
export const setAutoPictureInPicture = (enabled: boolean) => call("webView.setAutoPictureInPicture", { enabled });
export const setVideoUpscaling = (enabled: boolean) => call("webView.setVideoUpscaling", { enabled });

export const onCastDialog = (listener: (e: CastDialog) => void) => on("media.castDialog", listener);
export const onCastRoutes = (listener: (e: { profile: string; routes: CastRoute[] }) => void) => on("media.castRoutes", listener);
export const showCastDialog = (tabId: string) => call("media.showCastDialog", { tabId });
export const startCasting = (dialogId: number, sinkId: string, mode: number) => call("media.startCasting", { id: dialogId, sink: sinkId, mode });
export const stopCasting = (dialogId: number, routeId: string) => call("media.stopCasting", { id: dialogId, route: routeId });
export const closeCastDialog = (dialogId: number) => call("media.closeCastDialog", { id: dialogId });
export const watchCastRoutes = (profile: string) => call("media.watchCastRoutes", { profile });
export const terminateCastRoute = (routeId: string) => call("media.terminateCastRoute", { route: routeId });
export const changeCaptureSource = (capturer: string, target: string) => call("media.changeCaptureSource", { capturer, target });
export const stopCapture = (capturer: string) => call("media.stopCapture", { tabId: capturer });
