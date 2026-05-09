# Unity

Aplicación web - Repositorio principal

## Ramas

| Rama | Propósito |
|------|-----------|
| `master` | Producción - código estable y desplegado |
| `dev/<nombre>` | Desarrollo individual por miembro del equipo |

## Flujo de trabajo

1. Crea tu rama desde `master`: `git checkout -b dev/tu-nombre`
2. Trabaja en tu rama y haz commits
3. Abre un Pull Request hacia `master` cuando esté listo
4. El equipo revisa y aprueba antes de hacer merge

## Primeros pasos

```bash
# Clonar el repositorio
git clone https://github.com/pegutierrez/unity.git
cd unity

# Crear tu rama de desarrollo
git checkout -b dev/tu-nombre

# Subir tu rama al repositorio
git push -u origin dev/tu-nombre
```
