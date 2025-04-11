const API = 'http://localhost:3000/actividades';

const form = document.getElementById('form');
const lista = document.getElementById('lista');
const inputNombre = document.getElementById('nombre');

let editando = false;
let idEditando = null;

// Mostrar actividades
async function cargarActividades() {
  const res = await fetch(API);
  const actividades = await res.json();
  lista.innerHTML = '';
  actividades.forEach(act => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${act.nombre}</span>
      <button onclick="editarActividad(${act.id}, '${act.nombre}')">✏️</button>
      <button onclick="eliminarActividad(${act.id})">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

// Crear o actualizar actividad
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = inputNombre.value;

  if (editando) {
    await fetch(`${API}/${idEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    editando = false;
    idEditando = null;
    form.querySelector('button').textContent = 'Agregar';
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
  }

  form.reset();
  cargarActividades();
});

// Eliminar actividad
async function eliminarActividad(id) {
  await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });
  cargarActividades();
}

// Editar actividad (carga en el formulario)
function editarActividad(id, nombre) {
  inputNombre.value = nombre;
  editando = true;
  idEditando = id;
  form.querySelector('button').textContent = 'Actualizar';
}

// Ejecutar al inicio
cargarActividades();
