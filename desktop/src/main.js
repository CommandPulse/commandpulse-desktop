const { app, BrowserWindow, Menu, Tray, shell, nativeImage } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let tray;

const APP_URL = 'https://commandpulse.app';

const isDev = process.argv.includes('--dev');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'CommandPulse',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    show: false,
    backgroundColor: '#0f172a',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });

  mainWindow.loadURL(isDev ? 'http://localhost:5000' : APP_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  createMenu();
}

function createTray() {
  const iconPath = path.join(__dirname, '../assets/tray-icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Abrir CommandPulse', 
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { type: 'separator' },
    { 
      label: 'Dashboard', 
      click: () => {
        mainWindow.show();
        mainWindow.loadURL(`${APP_URL}/dashboard`);
      }
    },
    { 
      label: 'Comandos', 
      click: () => {
        mainWindow.show();
        mainWindow.loadURL(`${APP_URL}/dashboard/commands`);
      }
    },
    { 
      label: 'Alertas', 
      click: () => {
        mainWindow.show();
        mainWindow.loadURL(`${APP_URL}/dashboard/alerts`);
      }
    },
    { type: 'separator' },
    { 
      label: 'Buscar actualizaciones', 
      click: () => {
        autoUpdater.checkForUpdatesAndNotify();
      }
    },
    { type: 'separator' },
    { 
      label: 'Salir', 
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('CommandPulse');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function createMenu() {
  const template = [
    {
      label: 'CommandPulse',
      submenu: [
        { label: 'Acerca de CommandPulse', role: 'about' },
        { type: 'separator' },
        { 
          label: 'Buscar actualizaciones...', 
          click: () => autoUpdater.checkForUpdatesAndNotify() 
        },
        { type: 'separator' },
        { label: 'Ocultar', role: 'hide' },
        { label: 'Ocultar otros', role: 'hideOthers' },
        { label: 'Mostrar todo', role: 'unhide' },
        { type: 'separator' },
        { 
          label: 'Salir', 
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
          click: () => {
            app.isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Deshacer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Rehacer', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Pegar', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Seleccionar todo', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { label: 'Recargar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Forzar recarga', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { type: 'separator' },
        { label: 'Zoom +', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom -', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { label: 'Restablecer zoom', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Pantalla completa', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Navegación',
      submenu: [
        { 
          label: 'Dashboard', 
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow.loadURL(`${APP_URL}/dashboard`)
        },
        { 
          label: 'Comandos', 
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow.loadURL(`${APP_URL}/dashboard/commands`)
        },
        { 
          label: 'Alertas', 
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow.loadURL(`${APP_URL}/dashboard/alerts`)
        },
        { 
          label: 'Analytics', 
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow.loadURL(`${APP_URL}/dashboard/analytics`)
        },
        { type: 'separator' },
        { 
          label: 'Atrás', 
          accelerator: 'Alt+Left',
          click: () => mainWindow.webContents.goBack()
        },
        { 
          label: 'Adelante', 
          accelerator: 'Alt+Right',
          click: () => mainWindow.webContents.goForward()
        }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        { 
          label: 'Documentación', 
          click: () => shell.openExternal('https://commandpulse.app/documentation')
        },
        { 
          label: 'Soporte', 
          click: () => shell.openExternal('https://commandpulse.app/contact')
        },
        { type: 'separator' },
        { 
          label: 'Reportar problema', 
          click: () => shell.openExternal('mailto:soporte@commandpulse.app')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info.version);
  });

  autoUpdater.on('error', (error) => {
    console.error('Auto-updater error:', error);
  });

  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  setupAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

if (process.platform === 'win32') {
  app.setAppUserModelId('com.commandpulse.desktop');
}
