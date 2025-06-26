const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

const SERVICES = [
  { name: 'WhatsApp', url: 'https://web.whatsapp.com' },
  { name: 'Slack', url: 'https://slack.com/signin' },
  { name: 'Teams', url: 'https://teams.microsoft.com' },
  { name: 'Outlook', url: 'https://outlook.office.com' },
  { name: 'Telegram', url: 'https://web.telegram.org/a/' },
];

let mainWindow;
let views = [];
let currentViewIndex = 0;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
  });

  SERVICES.forEach(service => {
    const view = new BrowserView();
    view.webContents.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
    view.webContents.loadURL(service.url);
    views.push(view);
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    switchView(0);
  });

  mainWindow.on('resize', updateViewBounds);
}

function switchView(index) {
  if (views[currentViewIndex]) {
    mainWindow.removeBrowserView(views[currentViewIndex]);
  }
  currentViewIndex = index;
  const view = views[currentViewIndex];
  mainWindow.setBrowserView(view);
  updateViewBounds();
}

function updateViewBounds() {
  const bounds = mainWindow.getContentBounds();
  views[currentViewIndex].setBounds({
    x: 100, 
    y: 0,
    width: bounds.width - 100,
    height: bounds.height,
  });
  views[currentViewIndex].setAutoResize({ width: true, height: true });
}

app.whenReady().then(createWindow);

ipcMain.on('switch-service', (_event, index) => {
  switchView(index);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
