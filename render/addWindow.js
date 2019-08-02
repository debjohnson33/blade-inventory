const electron = require('electron');
const {ipcRenderer} = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    let stens = document.querySelector('#stens').value;
    let quantity = document.querySelector('#quantity').value;
    let manufacturer = document.querySelector('#manNum').value;
    let newBlades = {'stens': stens, 'quantity': quantity, 'manufacturer': manufacturer};
    
    ipcRenderer.send('blades:add', newBlades);
}