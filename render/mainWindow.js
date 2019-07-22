const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');

// Load existing blades
document.addEventListener("DOMContentLoaded", function() {
    ipcRenderer.send("mainWindowLoaded")
    ipcRenderer.on("resultSent", function(e, result){
        for (var i = 0; i < result.length; i++) {
            const li = document.createElement('li');
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Delete Blade";
            deleteButton.className = "delete";
            deleteButton.setAttribute("id", result[i].stensNumber);
            deleteButton.onclick = deleteBlade;
            editButton.innerHTML = "Edit Blade";
            editButton.className = "edit";
            editButton.setAttribute("id", result[i].stensNumber);
            editButton.setAttribute("value", result[i].quantity);
            editButton.onclick = editBlade;
            li.setAttribute('id', result[i].stensNumber);
            const bladesText = document.createTextNode('Stens: ' + result[i].stensNumber + ' ' + 'Quantity: ' + result[i].quantity);
            li.appendChild(bladesText);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            ul.appendChild(li);
        }
    })
})
// Add blades
ipcRenderer.on('blades:add', function(e, stens, quantity){
    const li = document.createElement('li');
    const button = document.createElement('button');
    const editButton = document.createElement('button');
    editButton.innerHTML = "Edit Blade"
    editButton.className = "edit"
    const bladesText = document.createTextNode('Stens: ' + stens + ' ' + 'Quantity: ' + quantity);
    li.appendChild(bladesText);
    li.appendChild(editButton);
    ul.appendChild(li);
});
// Delete blades
//document.getElementById('delete').addEventListener('click', deleteBlade);

function deleteBlade(e) {
    e.preventDefault();
    let stens = e.target.id;
    console.log(stens)
    ipcRenderer.send('blades:delete', stens);
}
// Send call back to main to open edit window
function editBlade(e) {
    e.preventDefault();
    let blade = {stens: e.target.id, quantity: e.target.value}
    
    ipcRenderer.send('blades:edit', blade);
}

// Update blades
ipcRenderer.on('blades:updated', function(e, newBlades){
    console.log(newBlades);
    let newStens = newBlades.stens;
    let newQuantity = newBlades.quantity;
    let li = document.getElementById(newStens);
    let ul = document.querySelector('ul');	
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Delete Blade";
    deleteButton.className = "delete";
    deleteButton.setAttribute("id", newStens);
    deleteButton.onclick = deleteBlade;
    editButton.innerHTML = "Edit Blade";
    editButton.className = "edit";
    editButton.setAttribute("id", newStens);
    editButton.setAttribute("value", newQuantity);
    editButton.onclick = editBlade;
    newLI = document.createElement('li');
    newLI.setAttribute('id', newStens);
    const bladesText = document.createTextNode('Stens: ' + newStens + ' ' + 'Quantity: ' + newQuantity);
    newLI.appendChild(bladesText);
    newLI.appendChild(editButton);
    newLI.appendChild(deleteButton);		
    ul.replaceChild(newLI, li);
});

// Search for blades
let list = document.querySelector('ul');
const searchBar = document.forms['search-blades'].querySelector('input');
searchBar.addEventListener('keyup', (e) => {
    const term = e.target.value;
    const blades = list.getElementsByTagName('li');
    Array.from(blades).forEach((blade) => {
        const stensNumber = blade.textContent;
        if (stensNumber.indexOf(e.target.value) != -1) {
            blade.style.display = 'block';
        } else {
            blade.style.display = 'none';
        }
    })
})