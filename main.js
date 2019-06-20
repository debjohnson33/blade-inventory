const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

const sqlite3 = require('sqlite3');

var db = new sqlite3.Database('dev.sqlite3');

// SET ENV

let mainWindow;
let addWindow;

app.on('ready', function(){
	mainWindow = new BrowserWindow({show: false});
	let bladesArray = [];

	db.serialize(function () {
		// Loads each row into the blades array
		db.each("SELECT * FROM Blades", function (err, row) {
			bladesArray.push(row);	
		});
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true,
	}));
	mainWindow.once("ready-to-show", () => { mainWindow.show() })
	// Sends blades array to mainWindow
	ipcMain.on("mainWindowLoaded", function () {
		mainWindow.webContents.send("resultSent", bladesArray)
	});

	mainWindow.on('closed', function(){
		db.close();
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
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	// Garbage collection handle
	addWindow.on('close', function () {
		addWindow = null;
	});
}
// Catch blades:add
ipcMain.on('blades:add', function(e, stens, quantity){
	mainWindow.webContents.send('blades:add', stens, quantity);
	db.serialize(function () {

	  db.run("INSERT INTO Blades (?, ?)", [stens, quantity]);

	  console.log(`A row has been inserted with rowid ${this.lastID}`);
	});
	addWindow.close();
})

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