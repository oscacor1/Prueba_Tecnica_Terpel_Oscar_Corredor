[README.md](https://github.com/user-attachments/files/24332759/README.md)
# Terpel Club – PoC Arquitectura + Pagos 2026 (AWS)
# Oscar Corredor 21/12/2025

Este repositorio es un **esqueleto** para la prueba técnica:
- Mantiene las capacidades actuales: **catálogo** (Basic), **puntos** (JWT) y **movimientos** (JWT, **paginación fija de 4**).
- Agrega endpoints y estructura para **pagos** (tarjeta / puntos total-parcial) y confirma decisiones de arquitectura.

## Entregables
- **Documento**: `Prueba tecnica terpel Oscar Corredor.pptx`
- **Repo**:
  - `backend/` (Express dummy + manejo de excepciones + idempotencia + token single-use)
  - `mobile/` (Expo + expo-router, pantallas base)
  - `web-admin/` (React/Vite, panel mínimo transacciones)
  - `postman/` (colección suministrada)

## Cómo ejecutar (demo local)
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
# http://localhost:8080/health
```

### 2) Web admin
```bash
cd web-admin
npm install
npm run dev
# http://localhost:5173
```

### 3) Mobile (estructura base)
> Requiere Expo.
```bash
cd mobile
npm install
npm start
```

## Endpoints principales (backend dummy)

### Token (JWT corto)
```http
POST /auth/token
{ "docNumber": "123" }
```

### Catálogo (Basic)
```http
GET /v1/catalog
Authorization: Basic base64(terpel:club)
```

### Puntos (JWT **single-use**)
```http
GET /v1/customers/123/points
Authorization: Bearer <token>
```

### Movimientos (JWT single-use, **pageSize=4**)
```http
GET /v1/customers/123/movements?page=1&pageSize=4
Authorization: Bearer <token>
```

### Pagos (JWT single-use + idempotencia)
```http
POST /v1/payments/intents
Idempotency-Key: <uuid>
Authorization: Bearer <token>

{ "merchantId":"st-123","amount":55000,"paymentMode":"MIXED","pointsToUse":20000,"cardToken":"tok_abc" }
```

Confirmación (simulación):
```http
POST /v1/payments/{intentId}/confirm?simulate=decline|timeout
Authorization: Bearer <token>
```

## Manejo de excepciones 
- 401/403: token faltante/expirado/consumido o doc no coincide.
- 429: rate limit (simulable en gateway real).
- 5xx/504: timeouts pasarela (simulado con `simulate=timeout`).
- 402: declined (simulado con `simulate=decline`).
- Validaciones: `pageSize` forzado a 4, `Idempotency-Key` requerido, etc.

## Arquitectura (resumen)
- **BFF + microservicios por dominio** (Pagos/Fidelización/Catálogo-Cliente).
- **Clean/Hexagonal** internamente.
- **Saga** con Step Functions + **event-driven** (EventBridge/SQS).
- **Seguridad**: Cognito (OAuth2/JWT), WAF, KMS, Secrets Manager, tokenización (no PAN).

# Prueba tecnica – Terpel Club + Pagos 2026

##  La app actual consume servicios vía Apigee: **Basic** (catálogo) y **JWT** (puntos/movimientos), con **token corto** y **paginación 4 movimientos/página**.
- 2026: habilitar pagos móviles con **tarjeta** y **puntos** (total/parcial) con confirmación **en tiempo real** al comercio.

## - Patrón: **BFF + microservicios por dominio**, aplicando **Clean/Hexagonal** internamente.
- AWS (alto nivel): Apigee -> API Gateway/WAF -> BFF (Lambda) -> Payments API + Step Functions (Saga) + EventBridge/SQS/DLQ + Aurora/Dynamo.
- Por qué:
  - No exponer Basic en el móvil.
  - Contratos por canal (móvil/admin).
  - Resiliencia y trazabilidad transaccional.

## Flujos ### Tarjeta
1) App inicia pago -> BFF.
2) BFF crea intent en Payments con **Idempotency-Key**.
3) Payments autoriza/captura con pasarela (tokenización).
4) Confirmación realtime (WebSocket/callback) + evento.

### Puntos (total/parcial)
- Saga: reservar/descontar puntos; si MIXED autoriza saldo restante; compensación si falla tarjeta.

## Excepciones 
- 401/403: token faltante/expirado/consumido, o doc no coincide.
- 402: declined (no retry automático).
- 504/5xx: retry con backoff + circuit breaker.
- Doble confirmación: idempotencia.
- Compensación: reversa de puntos (Saga).

## APIs 
- Movimientos: `pageSize=4` (forzado en el dummy).
- Pagos: `POST /v1/payments/intents`, `POST /v1/payments/{id}/confirm`, `GET /v1/payments/{id}`.

## No funcionales
- Seguridad: OAuth2/JWT (Cognito), KMS, Secrets Manager, tokenización (PCI).
- Escalabilidad: Lambda/ECS + colas.
- Observabilidad: logs/métricas/trazas + alarmas.
- Despliegue: IaC + CI/CD (blue/green).

## Demo sugerida
- Backend: `cd backend && npm i && npm run dev`
- Web admin: `cd web-admin && npm i && npm run dev`
- Postman:
  1) `POST /auth/token`
  2) `GET /v1/catalog` (Basic)
  3) `GET /v1/customers/{doc}/points` (Bearer)
  4) `GET /v1/customers/{doc}/movements?page=1&pageSize=4` (Bearer)
  5) `POST /v1/payments/intents` + `confirm (simulate=decline|timeout)`

## Agentes de IA utilizados 
- Usé agentes automáticos de validación: **CodeQL** y **Semgrep** para SAST, y npm audit para dependencias. Dejé evidencia en ai-validation/ con bitácora, y respaldé la ejecución con los runs de GitHub Actions y Code Scanning. Apliqué las recomendaciones prioritarias y documenté lo diferido por alcance

