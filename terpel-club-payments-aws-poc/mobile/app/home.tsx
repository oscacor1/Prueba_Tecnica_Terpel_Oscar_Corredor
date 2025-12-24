import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

const BASE_URL = "http://localhost:8080";

async function getToken(doc: string) {
  const resp = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ docNumber: doc })
  });
  if (!resp.ok) throw new Error("No se pudo generar token");
  return resp.json();
}

export default function Home() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const [log, setLog] = useState<string>("");

  useEffect(() => {
    setLog(`Bienvenido/a. Documento: ${doc}`);
  }, [doc]);

  async function demoMovements() {
    try {
      const t = await getToken(String(doc));
      const resp = await fetch(`${BASE_URL}/v1/customers/${doc}/movements?page=1&pageSize=4`, {
        headers: { Authorization: `Bearer ${t.accessToken}` }
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error?.message || "Error");
      setLog(JSON.stringify(data, null, 2));
    } catch (e:any) {
      setLog(e.message || "Error");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Inicio</Text>

      <Pressable onPress={demoMovements} style={{ backgroundColor: "#111", padding: 12, borderRadius: 10 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Demo: movimientos (pageSize=4)</Text>
      </Pressable>

      <View style={{ backgroundColor: "#f5f5f5", padding: 12, borderRadius: 10 }}>
        <Text style={{ fontFamily: "Courier", fontSize: 12 }}>{log}</Text>
      </View>

      <Text style={{ color: "#666" }}>
        Nota: esto es un esqueleto. En la prueba técnica puedes reemplazarlo por pantallas dedicadas:
        Catálogo (Basic), Puntos (JWT), Movimientos (JWT single-use), Pago (card/points/mixed).
      </Text>
    </ScrollView>
  );
}
