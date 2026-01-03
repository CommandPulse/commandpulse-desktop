# Instrucciones para Construir CommandPulse Desktop

## Requisitos Previos

### Para Windows:
- Windows 10 o superior
- Node.js 18+ instalado
- Git instalado

### Para macOS:
- macOS 12+ 
- Node.js 18+ instalado
- Xcode Command Line Tools (`xcode-select --install`)

## Paso 1: Preparar los Iconos

Antes de construir, necesitas crear los iconos en los formatos correctos:

### Crear icon.ico (Windows):
1. Ve a https://www.icoconverter.com/
2. Sube `assets/icon.png`
3. Selecciona 256x256
4. Descarga y guarda como `assets/icon.ico`

### Crear icon.icns (macOS):
1. Ve a https://cloudconvert.com/png-to-icns
2. Sube `assets/icon.png`
3. Descarga y guarda como `assets/icon.icns`

## Paso 2: Instalar Dependencias

```bash
cd desktop
npm install
```

## Paso 3: Construir los Instaladores

### Solo Windows:
```bash
npm run build:win
```
Genera: `dist/CommandPulse-Setup-1.0.0.exe`

### Solo macOS (requiere Mac):
```bash
npm run build:mac
```
Genera: `dist/CommandPulse-1.0.0.dmg`

### Ambos (desde macOS):
```bash
npm run build:all
```

## Paso 4: Subir a GitHub Releases

### 4.1 Crear repositorio en GitHub:
1. Ve a https://github.com/new
2. Nombre: `commandpulse-releases` (o el que prefieras)
3. Puede ser privado o público
4. Créalo vacío (sin README)

### 4.2 Subir tu código:
```bash
git remote add origin https://github.com/TU_USUARIO/commandpulse-releases.git
git push -u origin main
```

### 4.3 Crear un Release (Opción Manual):
1. Ve a tu repositorio → Releases → "Create a new release"
2. Tag: `v1.0.0`
3. Título: `CommandPulse v1.0.0`
4. Descripción: Lista de características
5. Arrastra los archivos:
   - `CommandPulse-Setup-1.0.0.exe`
   - `CommandPulse-1.0.0.dmg`
6. Publica el release

### 4.4 Crear un Release (Automático con GitHub Actions):
1. Sube los cambios a GitHub
2. Crea un tag: `git tag v1.0.0 && git push origin v1.0.0`
3. GitHub Actions construirá automáticamente los instaladores y creará el release

### 4.5 Obtener URLs de descarga:
Después de publicar, cada archivo tendrá una URL como:
```
https://github.com/TU_USUARIO/commandpulse-releases/releases/download/v1.0.0/CommandPulse-Setup-1.0.0.exe
https://github.com/TU_USUARIO/commandpulse-releases/releases/download/v1.0.0/CommandPulse-1.0.0.dmg
```

## Paso 5: Configurar las URLs de Descarga

Una vez tengas las URLs de GitHub Releases, configura estas **variables de entorno** en tu proyecto de Replit:

| Variable | Valor |
|----------|-------|
| `DOWNLOAD_URL_WINDOWS` | `https://github.com/TU_USUARIO/commandpulse-releases/releases/download/v1.0.0/CommandPulse-Setup-1.0.0.exe` |
| `DOWNLOAD_URL_MACOS` | `https://github.com/TU_USUARIO/commandpulse-releases/releases/download/v1.0.0/CommandPulse-1.0.0.dmg` |
| `DESKTOP_APP_VERSION` | `1.0.0` |

### Cómo agregar las variables:
1. Ve a la pestaña "Secrets" en Replit
2. Agrega cada variable con su valor correspondiente
3. Reinicia el servidor

## Solución de Problemas

### Error: "electron" not found
```bash
npm install electron --save-dev
```

### Error en Windows: "Cannot find module"
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Error en macOS: Code signing
Para distribución sin firma (desarrollo):
```bash
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run build:mac
```

## Actualizaciones Futuras

Para lanzar una nueva versión:
1. Actualiza `version` en `desktop/package.json`
2. Crea un nuevo tag: `git tag v1.1.0 && git push origin v1.1.0`
3. GitHub Actions construirá automáticamente
4. Actualiza las variables de entorno con las nuevas URLs
5. Los usuarios con la app instalada recibirán notificación de actualización

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DOWNLOAD_URL_WINDOWS` | URL del instalador .exe en GitHub | `https://github.com/.../CommandPulse-Setup-1.0.0.exe` |
| `DOWNLOAD_URL_MACOS` | URL del instalador .dmg en GitHub | `https://github.com/.../CommandPulse-1.0.0.dmg` |
| `DESKTOP_APP_VERSION` | Versión actual de la app | `1.0.0` |

## Notas Importantes

- La app de escritorio carga tu web app desde la URL configurada en `main.js`
- Asegúrate de actualizar `APP_URL` en `src/main.js` con tu dominio real antes de construir
- Las actualizaciones automáticas funcionarán cuando configures GitHub Releases correctamente
