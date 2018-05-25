const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// Use knex to set database
var knex = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: './database.sqlite3'
	}
});

// SET ENV

let mainWindow;
let addWindow;

app.on('ready', function(){
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	mainWindow.on('closed', function(){
		app.quit();
	});

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

	Menu.setApplicationMenu(mainMenu);
});

// Hanlde create add window
function createAddWindow() {
	// Create new window
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Blades'
	});
	// Load html into window
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	// Garbage collection handle
	addWindow.on('close', function () {
		addWindow = null;
	});
}

// Create menu Template
const mainMenuTemplate = [
	{
		label:'File',
		submenu:[
			{
				label: 'Add Item',
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' :
				'Ctrl+Q',
				click() {
				app.quit();
				}
			}
		]
	}
];

// If mac, add empty object to menu
if(process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
} 

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' :
				'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}