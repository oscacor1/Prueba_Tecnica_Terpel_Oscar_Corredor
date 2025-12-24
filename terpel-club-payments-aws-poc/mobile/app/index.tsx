import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { router } from "expo-router";

export default function Login() {
  const [doc, setDoc] = useState("");

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Terpel Club</Text>
      <Text>Ingresa tu número de documento para continuar.</Text>

      <TextInput
        value={doc}
        onChangeText={setDoc}
        placeholder="Documento"
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12 }}
      />

      <Pressable
        onPress={() => router.push({ pathname: "/home", params: { doc } })}
        style={{ backgroundColor: "black", padding: 12, borderRadius: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Continuar</Text>
      </Pressable>
    </View>
  );
}
