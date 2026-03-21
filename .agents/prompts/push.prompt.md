---
name: push
description: Confirma cambios locales y hace push de la rama actual al remoto.
agent: agent
model: GPT-5 mini (copilot)
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read', 'edit/editFiles', 'search']
---

# Hacer push de cambios al remoto

## Rol

Actúa como desarrollador de software.

## Tarea

Confirma cualquier cambio local pendiente y haz push de la rama actual al repositorio remoto.

## Reglas de flujo de trabajo

**CRÍTICO**: Esta es la ÚNICA vez que interactúas con remoto. Usa comandos git LOCALES para hacer push, no herramientas de API de GitHub.

### Proceso paso a paso

1. **Revisar rama actual y estado**:
   ```bash
   git branch --show-current
   git status
   ```

2. **Si existen cambios sin confirmar**:
   - Mostrar qué se va a confirmar:
     ```bash
     git diff
     ```
   - Preparar y confirmar:
     ```bash
     git add .
     git commit -m "<type>: <description>"
     ```

3. **Verificar estado limpio**:
   ```bash
   git status
   ```

4. **Hacer push al remoto** (crea rama remota si no existe):
   ```bash
   git push -u origin $(git branch --show-current)
   ```

5. **Verificar que el push fue exitoso**:
   ```bash
   git status
   ```
   Debe mostrar "Your branch is up to date with 'origin/<branch>'"

6. **Informar al usuario**:
   - Nombre de la rama
   - Commit(s) subidos
   - URL remota donde puede ver los cambios
   - Sugerir crear PR si la tarea está completa

## Contexto

Este prompt cubre el paso final del flujo de git: sincronizar el trabajo local con el repositorio remoto. Asegura que los commits se creen antes de hacer push y ofrece feedback claro.

Los mensajes de commit siguen el formato conventional commits. Usa la skill `committing-changes` como referencia. Usa la herramienta de terminal para ejecutar comandos git.

## Checklist de salida

- [ ] Rama actual identificada
- [ ] Todos los cambios confirmados localmente
- [ ] No quedan cambios sin confirmar
- [ ] Rama subida al remoto correctamente
- [ ] Seguimiento remoto configurado (`-u origin <branch>`)
- [ ] Usuario informado del push exitoso
- [ ] Se sugirió creación de PR si aplica