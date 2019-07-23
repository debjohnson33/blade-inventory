const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

const sqlite3 = require('sqlite3');

if(process.env.NODE_ENV !== 'production') {
	var db = new sqlite3.Database('dev.sqlite3', (err) => {
		if (err) {
			console.log(err.message);
		} else {
			db.run('CREATE TABLE IF NOT EXISTS Blades (id INTEGER PRIMARY KEY, stensNumber TEXT, quantity INTEGER, manufacturerNumber TEXT)')
		}
		console.log('Connected to the development database');
	});
} else {
	var db = new sqlite3.Database('database.sqlite3', (err) => {
		if (err) {
			console.log(err.message);
		} else {
			db.run('CREATE TABLE IF NOT EXISTS blades (id INTEGER PRIMARY KEY, stensNumber text, quantity INTEGER, manufacturerNumber TEXT)')
		}
		console.log('Connected to the production database');
	});
}


// SET ENV

let mainWindow;
let addWindow;

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		show: false
	});
	let bladesArray = [];

	db.serialize(function () {
		// Loads each row into the blades array
		db.each("SELECT * FROM Blades", function (err, row) {
			bladesArray.push(row);
			if (err) {
				console.log(err.message);
			}	
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

// Handle create add window
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

// Handle create edit window
function createEditWindow() {
	// Create edit window
	editWindow = new BrowserWindow({
		width: 400,
		height: 300,
		title: 'Edit Blades'
	});
	// Load html into window
	editWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'editWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	// Garbage collection handle
	editWindow.on('close', function () {
		editWindow = null;
	});
}
// Catch blades:add
ipcMain.on('blades:add', function(e, stens, quantity, manNum){
	mainWindow.webContents.send('blades:add', stens, quantity, manNum);
	db.serialize(function () {

	  db.run("INSERT INTO Blades VALUES (NULL, ?, ?, ?)", [ stens, quantity, manNum]);

	  console.log(`A row has been inserted with rowid ${this.lastID}`);
	});
})
// Catch blades:delete
ipcMain.on('blades:delete', function(e, stens) {
	mainWindow.webContents.send('blades:delete', stens);
	db.serialize(function () {
		db.run("DELETE FROM Blades WHERE stensNumber=?", stens);
		console.log(`Those blades have been deleted`);
	});
})

// Catch blades:edit
ipcMain.on('blades:edit', function(e, blade) {
	createEditWindow();
	editWindow.webContents.once('dom-ready', () => {
		editWindow.webContents.send('blades:update', blade);
	})
})

// Catch blades:update
ipcMain.on('blades:update', function(e, blade) {
	let newBlades = {'stens': blade.placeholderStens, 'quantity': blade.quantity};
	mainWindow.webContents.send('blades:updated', newBlades);
	db.serialize(function() {
		db.run("UPDATE Blades SET stensNumber=? WHERE stensNumber=?", [blade.stens, blade.placeholderStens]);
		db.run("UPDATE Blades SET quantity=? WHERE stensNumber=?", [blade.quantity, blade.stens]);
		//newBlade = db.run("SELECT * FROM Blades WHERE stensNumber=?", blade.stens)
	})
	editWindow.close();
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
				label: 'Edit Item',
				click() {
					createEditWindow();
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