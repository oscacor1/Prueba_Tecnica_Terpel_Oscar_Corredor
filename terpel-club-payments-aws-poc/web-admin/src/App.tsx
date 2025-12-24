import React, { useEffect, useState } from "react";

type PaymentIntent = {
  intentId: string;
  userDoc: string;
  merchantId: string;
  amount: number;
  currency: string;
  paymentMode: "CARD"|"POINTS"|"MIXED";
  status: string;
  createdAt: string;
};

export default function App() {
  const [items, setItems] = useState<PaymentIntent[]>([]);
  const [error, setError] = useState<string>("");

  async function load() {
    setError("");
    try {
      const resp = await fetch("http://localhost:8080/v1/payments");
      if (!resp.ok) throw new Error("No se pudo cargar la lista");
      const data = await resp.json();
      setItems(data.items || []);
    } catch (e:any) {
      setError(e.message || "Error");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Terpel Admin (PoC) - Transacciones</h1>
      <p style={{ color: "#555" }}>
        Panel mínimo para operación/soporte. En producción, este canal debería estar protegido con OAuth2 (Cognito) y roles.
      </p>

      <button onClick={load} style={{ padding: "8px 12px", borderRadius: 8 }}>Refrescar</button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th align="left">Intent</th>
            <th align="left">Usuario</th>
            <th align="left">Comercio</th>
            <th align="right">Monto</th>
            <th align="left">Modo</th>
            <th align="left">Estado</th>
            <th align="left">Creado</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.intentId} style={{ borderTop: "1px solid #ddd" }}>
              <td>{it.intentId}</td>
              <td>{it.userDoc}</td>
              <td>{it.merchantId}</td>
              <td align="right">{it.amount.toLocaleString("es-CO")} {it.currency}</td>
              <td>{it.paymentMode}</td>
              <td><b>{it.status}</b></td>
              <td>{new Date(it.createdAt).toLocaleString("es-CO")}</td>
            </tr>
          ))}
          {!items.length && (
            <tr><td colSpan={7} style={{ color: "#777" }}>Sin transacciones aún.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
