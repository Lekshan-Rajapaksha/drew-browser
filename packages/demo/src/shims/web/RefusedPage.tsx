import { Symbol } from "@ardia/shell";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../../../../apps/browser/src/components/ui/Button";
import { useTheme } from "../../../../../apps/browser/src/components/ui/theme";
import type { PageTheme } from "../../pages";

export const REFUSED_PAGE_THEME: { light: PageTheme; dark: PageTheme } = {
  light: { color: "#F6F5F6", source: "background" },
  dark: { color: "#1C1A1B", source: "background" },
};

const DOWNLOAD_URL = "https://github.com/Lekshan-Rajapaksha/72-browser";

export function RefusedPage({ host }: { host: string }) {
  const theme = useTheme();
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: REFUSED_PAGE_THEME[theme.dark ? "dark" : "light"].color, alignItems: "center", justifyContent: "center", padding: 24 }]}>
      <Symbol name="macwindow" size={30} weight="light" color={theme.textSecondary} style={{ width: 44, height: 40, marginBottom: 14 }} />
      <Text style={{ fontSize: 17, fontWeight: "600", color: theme.textPrimary, marginBottom: 6 }}>This site needs the Drew desktop app</Text>
      <Text style={{ fontSize: 13, color: theme.textSecondary, textAlign: "center", maxWidth: 340, marginBottom: 18 }}>
        {host} blocks embedded web previews. In Drew it opens as a normal browser tab.
      </Text>
      <Button variant="pill" title="Get Drew" primary onPress={() => void window.open(DOWNLOAD_URL, "_blank", "noopener")} />
    </View>
  );
}
