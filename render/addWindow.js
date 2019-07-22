const electron = require('electron');
const {ipcRenderer} = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    let stens = document.querySelector('#stens').value;
    let quantity = document.querySelector('#quantity').value;
    let newBlades = [stens, quantity];
    
    ipcRenderer.send('blades:add', stens, quantity);
}