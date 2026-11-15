import { nativeModule, type ConfirmOptions, type PromptOptions } from "@ardia/shell";
import { Alert } from "react-native";
import { IS_MACOS } from "./platformInfo";

const Dialogs = nativeModule("ArdiaDialogs");

export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  if (!IS_MACOS) {
    return new Promise<boolean>((resolve) => {
      Alert.alert(
        options.title || "",
        options.message || "",
        [
          { text: options.cancelLabel || "Cancel", onPress: () => resolve(false), style: "cancel" },
          { text: options.confirmLabel || "OK", onPress: () => resolve(true) },
        ]
      );
    });
  }
  return Dialogs.confirm(options);
};

export const prompt = (options: PromptOptions) => Dialogs.prompt(options);
export const pickFiles = () => Dialogs.pickFiles();
export const pickFolder = (current: string | null, prompt: string | null = null) => Dialogs.pickFolder(current, prompt);
