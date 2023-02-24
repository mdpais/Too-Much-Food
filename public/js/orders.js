/////////////////////////////////////////////////////////////////////
// Global variables
/////////////////////////////////////////////////////////////////////
let platesSelected = [];
let editedOrder = null;

/////////////////////////////////////////////////////////////////////
// Creates a new order
/////////////////////////////////////////////////////////////////////
const createOrderFormHandler = async (event) => {
  event.preventDefault();

  const table_no = document.getElementById('table_no').value.trim();
  const active = document.getElementById('isComplete').checked;

  if (platesSelected.length <= 0) {
    alert('You need to select at least one plate.');
    return;
  }
  if (table_no) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ table_no, completed: active, menuIds: platesSelected }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('Order created successfully!');
      location.reload();
    } else {
      alert(`Error ${response.status}\n${response.statusText}`);
    }
  } else {
    alert('Please type a table#.');
  }
};

document.getElementById('createOrderBtn').addEventListener('click', createOrderFormHandler);

/////////////////////////////////////////////////////////////////////
// Gets all plates
/////////////////////////////////////////////////////////////////////
const getPlates = async () => {
  const response = await fetch('/api/menu/menuJson', {
    method: 'GET',
  });

  if (response.ok) {
    const plates = await response.json();
    return plates;
  } else {
    alert(`${response.status}\r${response.statusText}`);
  }
};

/////////////////////////////////////////////////////////////////////
// Loads all plate options to the select input
/////////////////////////////////////////////////////////////////////
let loadPlates = async () => {
  const plateInput = document.getElementById('plateInput');
  plateInput.innerHTML = `<option id='option-0' disabled selected>Pick a plate</option>`;
  const plates = await getPlates();

  plates.forEach((plate) => {
    const option = document.createElement('option');
    option.id = `option-${plate.id}`;
    option.text = plate.item;

    plateInput.add(option);
  });
};

loadPlates();

/////////////////////////////////////////////////////////////////////
// Event listener for add plate button
/////////////////////////////////////////////////////////////////////

const addPlate = (event) => {
  event.preventDefault();

  const selectedPlatesTable = document.getElementById('selectedPlatesTable');
  const plateInput = document.getElementById('plateInput');
  const qty = document.getElementById('qty');

  const id = plateInput.options[plateInput.selectedIndex].id.split('-')[1];

  const newPlate = document.createElement('tr');
  newPlate.id = `plate-${id}`;
  newPlate.classList.add('grid', 'grid-cols-6');

  const deleteBtn = `<button class="btn-xs btn-error deletePlateBtn" id="delete-${id}">X</button>`;

  newPlate.innerHTML = `
  <td class="col-span-4">${plateInput.value}</td> 
  <th class="col-span-1">${qty.value}</th> 
  <td class="col-span-1">${deleteBtn}</td> 
`;

  selectedPlatesTable.append(newPlate);

  const plateOption = document.getElementById(`option-${id}`);
  plateOption.style.display = 'none';

  //cleanup
  platesSelected.push({ id, qty: qty.value, item: plateInput.value });
  plateInput.value = 'Pick a plate';
  qty.value = 1;
  refreshELs();
};

document.getElementById('addPlateBtn').addEventListener('click', addPlate);

/////////////////////////////////////////////////////////////////////
// Event listener for Delete plate button
/////////////////////////////////////////////////////////////////////
const deletePlate = (event) => {
  event.preventDefault();

  const id = event.target.id.split('-')[1];

  const plateSelected = document.getElementById(`plate-${id}`);
  const plateOption = document.getElementById(`option-${id}`);

  plateSelected.remove();
  plateOption.style.display = 'block';

  platesSelected = platesSelected.filter((item) => item.id != id);
};

/////////////////////////////////////////////////////////////////////
// Event listener for Edit order button
/////////////////////////////////////////////////////////////////////
const editOrder = (event) => {
  event.preventDefault();

  const id = event.target.id.split('-')[1];
  const order = JSON.parse(event.target.dataset.order);

  const table_no = document.getElementById('table_no');
  const active = document.getElementById('isComplete');

  editedOrder = id;

  table_no.value = order.table_no;
  active.checked = order.completed;

  const tableBody = document.getElementById('selectedPlatesTable');
  tableBody.innerHTML = '';

  platesSelected = [];
  order.orderedItems.forEach((item) => {
    const orderedItem = document.createElement('tr');
    orderedItem.id = `plate-${item.menu_id}`;
    const deleteBtn = `<button class="btn-xs btn-error deletePlateBtn" id="delete-${item.menu_id}">X</button>`;

    orderedItem.classList.add('grid', 'grid-cols-6');
    orderedItem.innerHTML = `
    <td class="col-span-4">${item.menu.item}</td> 
    <th class="col-span-1">${item.quantity}</th> 
    <td class="col-span-1">${deleteBtn}</td> 
 `;

    tableBody.appendChild(orderedItem);

    const plateOption = document.getElementById(`option-${item.menu.id}`);
    plateOption.style.display = 'none';

    platesSelected.push({ id: item.menu_id, qty: item.quantity, item: item.menu.item });
  });

  editOrderOn();
  refreshELs();
};

/////////////////////////////////////////////////////////////////////
// Swap Edit Mode and Create Mode
/////////////////////////////////////////////////////////////////////
const editOrderOn = () => {
  const title = document.getElementById('title');
  const createBtn = document.getElementById('createOrderBtn');
  const editBtn = document.getElementById('editOrderBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  if (editedOrder) {
    title.textContent = 'Edit Order';
    createBtn.style.display = 'none';
    editBtn.style.display = 'block';
    cancelBtn.style.display = 'block';
  }
};

/////////////////////////////////////////////////////////////////////
// CANCEL EDIT AND SWITCH BACK TO CREATE FORM
/////////////////////////////////////////////////////////////////////
document.getElementById('cancelBtn').addEventListener('click', () => location.reload());

/////////////////////////////////////////////////////////////////////
// Event Listener for Save Order Button
/////////////////////////////////////////////////////////////////////

const saveEditedItem = async (event) => {
  event.preventDefault();

  const table_no = document.getElementById('table_no').value.trim();
  const active = document.getElementById('isComplete').checked;

  if (platesSelected.length <= 0) {
    alert('You need to select at least one plate.');
    return;
  }
  if (table_no) {
    const response = await fetch(`/api/orders/${editedOrder}`, {
      method: 'PUT',
      body: JSON.stringify({ table_no, completed: active, menuIds: platesSelected }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('Order created successfully!');
      location.reload();
    } else {
      alert(`Error ${response.status}\n${response.statusText}`);
    }
  } else {
    alert('Please type a table#.');
  }
};

document.getElementById('editOrderBtn').addEventListener('click', saveEditedItem);

/////////////////////////////////////////////////////////////////////
// Swap Options and Selected Plates
/////////////////////////////////////////////////////////////////////
const swapPlateOption = (id) => {
  const plateSelected = document.getElementById(`plate-${id}`);
  const plateOption = document.getElementById(`option-${id}`);

  if (plateSelected) {
    plateSelected.remove();
    plateOption.style.display = 'block';
  } else {
    const selectedPlatesTable = document.getElementById('selectedPlatesTable');
    const plateInput = document.getElementById('plateInput');
    const qty = document.getElementById('qty');

    const newPlate = document.createElement('tr');
    newPlate.id = `plate-${id}`;
    newPlate.classList.add('grid', 'grid-cols-6');

    const deleteBtn = `<button class="btn-xs btn-error deletePlateBtn" id="delete-${id}">X</button>`;

    newPlate.innerHTML = `
    <th class="col-span-4">${plateInput.value}</th> 
    <th class="col-span-1">${qty.value}</th> 
    <th class="col-span-1">${deleteBtn}</th> 
  `;

    selectedPlatesTable.append(newPlate);

    const plateOption = document.getElementById(`option-${id}`);
    plateOption.style.display = 'none';
  }
};

/////////////////////////////////////////////////////////////////////
// Event listener refresher
/////////////////////////////////////////////////////////////////////
const refreshELs = () => {
  const editBtns = document.querySelectorAll('.editBtn');
  editBtns.forEach((btn) => btn.addEventListener('click', editOrder));

  const deleteBtns = document.querySelectorAll('.deletePlateBtn');
  deleteBtns.forEach((btn) => btn.addEventListener('click', deletePlate));
};

refreshELs();
