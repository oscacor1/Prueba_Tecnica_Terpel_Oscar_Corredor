import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Terpel Club" }} />
      <Stack.Screen name="home" options={{ title: "Inicio" }} />
    </Stack>
  );
}
