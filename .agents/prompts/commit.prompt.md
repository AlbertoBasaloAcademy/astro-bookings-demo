---
name: commit
description: Realiza commit de los cambios pendientes.
agent: agent
model: GPT-5 mini (copilot)
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read', 'edit/editFiles', 'search']
---
# Confirmar cambios

## Rol

Actúa como desarrollador de software.

## Tarea

Confirma todos los cambios pendientes en el repositorio local.

## Reglas de flujo de trabajo

**CRÍTICO**: Trabaja SOLO con comandos git locales. NUNCA uses herramientas de API de GitHub (mcp_github_*) para confirmar cambios. Todos los commits deben ser locales hasta que se haga push explícitamente.

### Proceso paso a paso

1. **Revisar qué se va a confirmar**:
   ```bash
   git status
   git diff
   ```

2. **Preparar todos los cambios**:
   ```bash
   git add .
   ```

3. **Verificar cambios preparados**:
   ```bash
   git status
   ```

4. **Crear commit con mensaje convencional**:
   ```bash
   git commit -m "<type>: <description>"
   ```
   Donde `<type>` es uno de: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`

5. **Verificar que el commit se creó**:
   ```bash
   git log -1 --oneline
   ```

6. **Mostrar estado final**:
   ```bash
   git status
   ```

## Contexto

El formato de mensaje de commit sigue conventional commits:
- `feat:` para nuevas funcionalidades
- `fix:` para correcciones de errores
- `chore:` para mantenimiento
- `docs:` para documentación
- `test:` para pruebas
- `refactor:` para reestructuración de código

Usa la skill `committing-changes` como referencia. Usa la herramienta de terminal para ejecutar comandos git.

## Checklist de salida

- [ ] Se revisó `git status` y `git diff` antes de confirmar
- [ ] Todos los archivos previstos están preparados
- [ ] El mensaje de commit sigue el formato `<type>: <description>`
- [ ] Commit creado correctamente (verificado con `git log -1`)
- [ ] No quedan cambios sin confirmar (verificado con `git status`)
- [ ] Los cambios son SOLO LOCALES (sin push remoto salvo petición explícita)
