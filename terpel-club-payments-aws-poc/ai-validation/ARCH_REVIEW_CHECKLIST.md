# Checklist de revisión de arquitectura 

## A) Funcionales
- [ ] Catálogo (Basic) desde BFF (no credenciales en móvil).
- [ ] Puntos y movimientos (JWT).
- [ ] Movimientos con paginación **4 por página**.
- [ ] Pagos: tarjeta, puntos, mixto.
- [ ] Confirmación en tiempo real al comercio (WebSocket/callback) documentada.

## B) Seguridad
- [ ] OAuth2/JWT (Cognito) y scopes/roles.
- [ ] Tokenización (no PAN) para minimizar PCI.
- [ ] Secrets Manager (no secretos en repo/app).
- [ ] Cifrado KMS + TLS.
- [ ] WAF + rate limiting (Apigee).

## C) Resiliencia / Consistencia
- [ ] Idempotencia (Idempotency-Key).
- [ ] Reintentos + circuit breaker (diseño).
- [ ] Saga (Step Functions) con compensación.
- [ ] DLQ para fallos no recuperables.

## D) Observabilidad
- [ ] CorrelationId/intentId en logs.
- [ ] Métricas p95, error rate, declines.
- [ ] Alarmas DLQ/fallos pasarela.
- [ ] Trazas (X-Ray/OTel) documentadas.

## E) Entregables
- [ ] Documento 6–8 páginas.
- [ ] Repo esqueleto + README.
- [ ] `ai-validation/` con bitácora + evidencia.
