# Decisiones técnicas (ADR-lite)

## 1) Patrón BFF
- **Decisión**: BFF para móvil/web.
- **Motivo**: adaptar contratos por canal, ocultar Basic, controlar token corto.

## 2) Pagos con Saga
- **Decisión**: Step Functions (Saga) para orquestar tarjeta+puntos y compensar.
- **Motivo**: consistencia eventual + reversas.

## 3) Idempotencia
- **Decisión**: `Idempotency-Key` obligatorio.
- **Motivo**: evitar doble cobro en reintentos/red móvil.

## 4) PCI / Tokenización
- **Decisión**: no almacenar PAN; usar token de pasarela/SDK.
- **Motivo**: reducir alcance PCI y riesgo.

## 5) Event-driven
- **Decisión**: EventBridge/SQS para integrar ERP/fidelización/notificaciones.
- **Motivo**: desacoplar y absorber picos.
