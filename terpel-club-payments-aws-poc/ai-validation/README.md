# AI / Agentes de validación (evidencia)

Esta carpeta cumple el requisito de la prueba: **usar IA/agentes para validar** arquitectura y código, y subir evidencia y recomendaciones.

## Contenido
- `AI_VALIDATION_LOG.md`: bitácora (llenar con resultados reales).
- `ARCH_REVIEW_CHECKLIST.md`: checklist.
- `DECISIONS.md`: decisiones técnicas.
- `reports/`: outputs (audit/semgrep/etc.).

## Ejecución local (para generar evidencia)
### npm audit
```bash
cd backend && npm ci && npm audit --audit-level=high | tee ../ai-validation/reports/dependency-audit-backend.txt
cd ../web-admin && npm ci && npm audit --audit-level=high | tee ../ai-validation/reports/dependency-audit-web.txt
```

### Semgrep (local opcional)
```bash
semgrep --config p/owasp-top-ten --json --output ai-validation/reports/semgrep.json .
```

## Ejecución en GitHub Actions (recomendado)
- CodeQL: `.github/workflows/codeql.yml`
- Semgrep: `.github/workflows/semgrep.yml`
- Audit deps: `.github/workflows/dependency-audit.yml`
