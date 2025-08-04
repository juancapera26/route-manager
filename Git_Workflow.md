# Git Workflow

Este documento define la estrategia de control de versiones y colaboración para el proyecto.

````

---

## 💬 Convención de Commits

Se utiliza la convención [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin afectar lógica)
- `refactor`: Refactorización del código
- `test`: Añadir o modificar pruebas
- `chore`: Tareas de mantenimiento

### Ejemplos:

```bash
git commit -m "feat(auth): agregar autenticación con Firebase"
git commit -m "fix(routes): corregir error en lógica de asignación"
````

---

## 🔁 Frecuencia de Push y Pull

- Hacer `git pull origin develop` al comenzar el día de trabajo.
- Hacer `git push origin feature/nombre-funcionalidad` al menos una vez al día.
- Las ramas `feature/*` deben mantenerse actualizadas con `develop`.

---

## ✅ Política de Pull Requests (PR)

- Toda rama `feature/*` debe crear un PR hacia `develop`.
- El PR debe incluir:
  - Título claro y descriptivo
  - Descripción del cambio
  - Checklist de validación
- No se permite hacer **merge** sin al menos una revisión aprobada.
- Usar la plantilla de PR ubicada en `.github/PULL_REQUEST_TEMPLATE.md`.

---

## 📁 Organización de Ramas

1. Crear nueva funcionalidad:

   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nombre-funcionalidad
   ```

2. Subir cambios:

   ```bash
   git add .
   git commit -m "feat: descripción clara"
   git push -u origin feature/nombre-funcionalidad
   ```

3. Crear Pull Request desde GitHub de `feature/*` hacia `develop`.
