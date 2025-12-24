# AI / Agentes de validación – Bitácora

> Evidencia **cómo** se validó la arquitectura y el código con agentes automáticos, y qué recomendaciones entregaron y se aplicaron.

## 1) Contexto
- Proyecto: Terpel Club – PoC Arquitectura + Pagos 2026 (AWS)
- Fecha:
- Commit/Tag:
- Alcance revisado: `backend/`, `web-admin/`, `mobile/` (si aplica)

## 2) Agentes / Herramientas usadas
- **CodeQL (GitHub Code Scanning)**: análisis estático de seguridad para JS/TS.
- **Semgrep**: reglas de seguridad y calidad (SAST).
- **npm audit**: vulnerabilidades en dependencias (backend/web).
- (Opcional) **ESLint**: consistencia y reglas de estilo (si se habilita).

## 3) Ejecución (pasos reproducibles)
### 3.1 CodeQL
- Workflow: `.github/workflows/codeql.yml`
- Evidencia:
  - Link/captura del run
  - Resultados en “Security → Code scanning alerts”

### 3.2 Semgrep
- Workflow: `.github/workflows/semgrep.yml`
- Evidencia:
  - Link/captura del run
  - SARIF subido en Code Scanning

### 3.3 Dependencias (npm audit)
- Backend:
  - `cd backend && npm ci && npm audit --audit-level=high`
- Web:
  - `cd web-admin && npm ci && npm audit --audit-level=high`
- Evidencia:
  - `ai-validation/reports/dependency-audit-backend.txt`
  - `ai-validation/reports/dependency-audit-web.txt`

## 4) Hallazgos y recomendaciones (capturar lo REAL)
> Registra solo lo que realmente te reportó el agente.

### 4.1 Seguridad (SAST)
| Agente | Hallazgo | Severidad | Evidencia | Acción/Commit |
|---|---|---:|---|---|
| CodeQL |  |  |  |  |
| Semgrep |  |  |  |  |

### 4.2 Calidad / Buenas prácticas
| Agente | Hallazgo | Evidencia | Acción/Commit |
|---|---|---|---|
| Semgrep/ESLint |  |  |  |

### 4.3 Dependencias
| Paquete | Hallazgo | Severidad | Evidencia | Acción/Commit |
|---|---|---:|---|---|
| backend |  |  |  |  |
| web-admin |  |  |  |  |

## 5) Cambios aplicados (resumen)
- [ ] Cambio 1:
- [ ] Cambio 2:
- [ ] Cambio 3:

## 6) Cambios diferidos (y por qué)
- [ ] Diferido 1:
