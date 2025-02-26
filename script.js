const calorieBudget = document.getElementById('calorie-budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryBtn = document.getElementById('add-entry');
const clearBtn = document.getElementById('clear');
const output = document.getElementById('output');
const calorieCounter = document.getElementById('calorie-counter');
let isError = false;

// Functions to add:
// Clean Input

const cleanInput = str => {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
};

const isInvalidInput = str => {
    const regex = /\d+e\d+/i;
    return str.match(regex);
};

// Add Entry

const addEntry = () => {
    const inputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const number = inputContainer.querySelectorAll('input[type="text"]').length + 1;
    console.log(number);
    const stringHTML = `
        <label for="entry-${number}-name">Entry ${number} Name</label>
        <input type="text" id="entry-${number}-name" placeholder="Name">
        <label for="entry-${number}-calories">Entry ${number} Calories</label>
        <input type="number" min="0" id="entry-${number}-calories" placeholder="Calories">`;
    inputContainer.insertAdjacentHTML('beforeend', stringHTML);
    return;
};

// Clear Entries

const clearEntries = () => {
    const allEntries = Array.from(document.querySelectorAll('.input-container'));
    for (const item of allEntries) {
        item.innerHTML = '';
    }
    calorieBudget.value = '';
    output.innerText = '';
    output.classList.add('hide');
    return;
}

// Calculate Total Calories

const calculateTotalCalories = (e) => {
    e.preventDefault();
    isError = false;

    const budget = cleanInput(calorieBudget.value);

    if (isInvalidInput(budget)) {
        isError = true;
        alert("Invalid Input" + isInvalidInput(budget)[0]);
        return null;
    }

    const breakfastCalories = getCalories("breakfast");
    const lunchCalories = getCalories("lunch");
    const dinnerCalories = getCalories("dinner");
    const snacksCalories = getCalories("snacks");
    const exerciseCalories = getCalories("exercise");

    if (isError) {
        return null;
    }

    const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budget - totalCalories + exerciseCalories;
    
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budget} Calories Budgeted</p>
    <p>${totalCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;

    output.classList.remove('hide');

};

const getCalories = (meal) => {
    const allEntries = document.querySelectorAll(`#${meal} .input-container input[type="number"]`);
    let totalCalories = 0;

    for (const item of allEntries) {
        const calories = cleanInput(item.value);

        if (isInvalidInput(calories)) {
            isError = true;
            alert("Invalid Input" + isInvalidInput(calories)[0]);
            return null;
        }

        totalCalories += parseInt(calories);
    }
    return totalCalories;
};

// Event Listeners
addEntryBtn.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculateTotalCalories);
clearBtn.addEventListener('click', clearEntries);
