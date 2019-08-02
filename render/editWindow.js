const electron = require('electron');
const {ipcRenderer} = electron;

ipcRenderer.on('blades:update', function(e, blade) {
    console.log(blade);
    let stensField = document.getElementById('stens');
    let quantity = document.getElementById('quantity');
    let manufacturer = document.getElementById('manNum');
    stensField.setAttribute('placeholder', blade.stens);
    quantity.setAttribute('placeholder', blade.quantity);
    manufacturer.setAttribute('placeholder', blade.manufacturer);
});
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    let stens = document.querySelector('#stens').value;
    let quantity = document.querySelector('#quantity').value;
    let manufacturer = document.querySelector('#manNum').value;
    let stensField = document.getElementById('stens');
    let placeholder = stensField.placeholder;
    let newBlades = {'placeholderStens': placeholder, 'stens': stens, 'quantity': quantity, 'manNum': manufacturer};
    
    ipcRenderer.send('blades:update', newBlades);
}