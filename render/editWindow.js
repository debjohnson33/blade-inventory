const electron = require('electron');
const {ipcRenderer} = electron;

ipcRenderer.on('blades:update', function(e, blade) {
    let stensField = document.getElementById('stens');
    let quantity = document.getElementById('quantity');
    stensField.setAttribute('placeholder', blade.stens);
    quantity.setAttribute('placeholder', blade.quantity);
});
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    let stens = document.querySelector('#stens').value;
    let quantity = document.querySelector('#quantity').value;
    let stensField = document.getElementById('stens');
    let placeholder = stensField.placeholder;
    let newBlades = {'placeholderStens': placeholder, 'stens': stens, 'quantity': quantity};
    
    ipcRenderer.send('blades:update', newBlades);
}