const digits = Array.from(document.querySelectorAll(".number"));
const dot = document.querySelector(".dot");
const equals = document.querySelector(".equals");
const primaryDisplay = document.querySelector(".primary-display");
const secondaryDisplay = document.querySelector(".secondary-display");
const deleteButton = document.querySelector(".delete");
const allClearButton = document.querySelector(".all-clear");
const operators = Array.from(document.querySelectorAll(".operator"));
const operatorStack = [];

// UPDATE PRIMARY DISPLAY
function updatePrimaryDisplay(e) {
    const primaryTextLength = primaryDisplay.innerHTML.length;

    if (primaryTextLength < 12) {
        const digit = document.createTextNode(e.target.innerHTML);
        primaryDisplay.appendChild(digit);
    }
}

function updatePrimaryDisplayKey(keyDigit) {
    const primaryTextLength = primaryDisplay.innerHTML.length;

    if (primaryTextLength < 12) {
        const digit = document.createTextNode(keyDigit);
        primaryDisplay.appendChild(digit);
    }
}

digits.forEach(digit => {
    digit.addEventListener("click", updatePrimaryDisplay);
});

dot.addEventListener("click", e => {
    if (!primaryDisplay.innerHTML.includes('.'))
        updatePrimaryDisplay(e);
});

// UPDATE SECONDARY DISPLAY
function updateSecondaryDisplay(operator) {
    if (primaryDisplay.innerHTML === '')
        return;

    if (secondaryDisplay.innerHTML === '' || secondaryDisplay.innerHTML.includes('=')) {
        secondaryDisplay.innerHTML = `${primaryDisplay.innerHTML} ${operator}`;
    } else {
        let secondaryValue = Number(secondaryDisplay.innerHTML.split(' ')[0]);
        operatorStack.push(secondaryDisplay.innerHTML.split(' ')[1]);

        switch (operatorStack[0]) {
            case '+':
                secondaryValue += Number(primaryDisplay.innerHTML);
                break;
            case '-':
                secondaryValue -= Number(primaryDisplay.innerHTML);
                break;
            case '*':
                secondaryValue *= Number(primaryDisplay.innerHTML);
                break;
            case '/':
                secondaryValue /= Number(primaryDisplay.innerHTML);
                break;
        }

        operatorStack.pop();
        secondaryDisplay.innerHTML = `${secondaryValue} ${operator}`;
    }

    primaryDisplay.innerHTML = '';
}

operators.forEach(operator => {
    operator.addEventListener("click", e => {
        switch (e.target.innerHTML) {
            case '÷':
                updateSecondaryDisplay('/');
                break;
            case '×':
                updateSecondaryDisplay('*');
                break;
            default:
                updateSecondaryDisplay(e.target.innerHTML);
                break;
        }
    });
});

// IMPLEMENT BACKSPACE FUNCTIONALITY
function deleteDigit() {
    const primaryTextArr = primaryDisplay.innerHTML.split('');

    primaryTextArr.pop();
    primaryDisplay.innerHTML = primaryTextArr.join('');
}

deleteButton.addEventListener("click", deleteDigit);

// ALL CLEAR FUNCTIONALITY
function resetCalculator() {
    primaryDisplay.innerHTML = '';
    secondaryDisplay.innerHTML = '';
    operatorStack.splice(0);
}

allClearButton.addEventListener("click", resetCalculator);

// SHOW RESULT
function showResult() {
    if (primaryDisplay.innerHTML === '' || secondaryDisplay.innerHTML === '')
        return;
    else if (secondaryDisplay.innerHTML.includes('='))
        return;

    const leftOperand = Number(secondaryDisplay.innerHTML.split(' ')[0]);
    const operator = secondaryDisplay.innerHTML.split(' ')[1];
    const rightOperand = Number(primaryDisplay.innerHTML);
    let result;

    secondaryDisplay.innerHTML += ` ${primaryDisplay.innerHTML} =`;

    switch (operator) {
        case '+':
            result = leftOperand + rightOperand;
            break;
        case '-':
            result = leftOperand - rightOperand;
            break;
        case '*':
            result = leftOperand * rightOperand;
            break;
        case '/':
            result = leftOperand / rightOperand;
            break;
    }

    if (String(result).length > 15) {
        result = result.toPrecision(4);
    }

    primaryDisplay.innerHTML = `${result}`;
}

equals.addEventListener("click", showResult);

// KEYDOWN EVENTS
document.addEventListener("keydown", e => {
    if (parseInt(e.key) >= 0 && parseInt(e.key) <= 9)
        updatePrimaryDisplayKey(e.key);

    if (e.key === '.' && !primaryDisplay.innerHTML.includes('.'))
        updatePrimaryDisplayKey(e.key);


    switch (e.key) {
        case "Backspace":
            deleteDigit();
            break;
        case "Escape":
            resetCalculator();
            break;
        case '/':
        case '*':
        case '-':
        case '+':
            updateSecondaryDisplay(e.key);
            break;
        case '=':
        case "Enter":
            showResult();
            break;
    }
});