// Obtener referencias a los elementos del DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description-input'); 
const amountInput = document.getElementById('amount-input'); 
const categoryInput = document.getElementById('category-input');
const expenseList = document.getElementById('expense-list');
const totalAmountSpan = document.getElementById('total-amount');

// Array para almacenar los gastos
let expenses = [];

// Cargar gastos desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', loadExpenses);

// Manejar el envío del formulario para agregar un gasto
expenseForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir el envío tradicional del formulario


    const description = descriptionInput.value.trim(); // Usar trim() para quitar espacios
    const amount = parseFloat(amountInput.value); // Convertir a número flotante
    const category = categoryInput.value;

    // Validar los datos
    if (description === '' || isNaN(amount) || amount <= 0 || category === '') {
        alert('Por favor, complete todos los campos correctamente. El monto debe ser un número positivo.');
        return; // Detener la función si la validación falla
    }

    const newExpense = {
        description: description,
        amount: amount,
        category: category
       
    };

    // Agregar el nuevo gasto al array
    expenses.push(newExpense);

    // Limpiar el formulario
    expenseForm.reset();

    // Actualizar la visualización y guardar
    renderExpenses();
    saveExpenses();
});

// Delegar eventos en la lista de gastos para eliminar
expenseList.addEventListener('click', handleExpenseClick);

// Función para manejar clics en la lista de gastos (para eliminar)
function handleExpenseClick(e) {
    // Verificar si el clic fue en un botón con la clase 'delete-btn'
    if (e.target.classList.contains('delete-btn')) {
        // Obtener el índice del gasto a eliminar desde el atributo data-index
        const indexToRemove = parseInt(e.target.dataset.index);

        // Validar que el índice es válido
        if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < expenses.length) {
            // Eliminar el gasto del array usando el índice
            expenses.splice(indexToRemove, 1);

            renderExpenses();
            saveExpenses();
        }
    }
}

// Función para renderizar la lista de gastos en la tabla y actualizar el total
function renderExpenses() {
    // Limpiar el contenido actual de la tabla
    expenseList.innerHTML = '';

    let total = 0; // Reiniciar el total para recalcularlo

    // Iterar sobre el array de gastos y crear una fila de tabla para cada uno
    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');

        // Crear el contenido HTML de la fila
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>${expense.amount.toFixed(2)}</td> <td>${expense.category}</td>
            <td><button class="delete-btn" data-index="${index}">Eliminar</button></td>
        `;

        // Añadir la fila a la tabla
        expenseList.appendChild(row);

        // Sumar el monto al total
        total += expense.amount;
    });

    // Actualizar el texto del total acumulado
    totalAmountSpan.textContent = total.toFixed(2); // Formatear total a 2 decimales
}

// Función para guardar los gastos en localStorage
function saveExpenses() {
    // Convertir el array de gastos a una cadena JSON y guardarlo
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Función para cargar los gastos desde localStorage
function loadExpenses() {
    // Obtener la cadena JSON de localStorage
    const storedExpenses = localStorage.getItem('expenses');

    // Si hay datos guardados, parsearlos y asignarlos al array expenses
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
    } else {
        // Si no hay datos, el array expenses se mantiene vacío (inicializado al principio)
        expenses = [];
    }
    renderExpenses();
}
