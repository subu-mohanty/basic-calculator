const digits = Array.from(document.querySelectorAll(".number"));
const dot = document.querySelector(".dot");
const equals = document.querySelector(".equals");
const primaryDisplay = document.querySelector(".primary-display");
const secondaryDisplay = document.querySelector(".secondary-display");
const deleteButton = document.querySelector(".delete");
const allClearButton = document.querySelector(".all-clear");
const clearPrimaryButton = document.querySelector(".clear-primary");
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

// CLEAR PRIMARY DISPLAY
function clearPrimaryDisplay() {
    const secondaryDisplayContent = secondaryDisplay.innerHTML;
    const secondaryDisplayRight = secondaryDisplayContent.split(' ');

    if(secondaryDisplayRight.length === 2)
        primaryDisplay.innerHTML = '';
}

clearPrimaryButton.addEventListener("click", clearPrimaryDisplay);

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
    if (parseInt(e.key) >= 0 && parseInt(e.key) <= 9) {
        // KEY LIGHT UP WHEN OPERATED WITH KEYBOARD //
        if(e.key >= 0 && e.key <= 9) {
            digits.forEach(digit => {
                if(String(e.key) === digit.innerHTML) {
                    digit.classList.add("light-up");
                    
                    setTimeout(() => {
                        digit.classList.remove("light-up");
                    }, 100);
                }
            });
        }
        // END KEY LIGHT UP //
        
        updatePrimaryDisplayKey(e.key);
    }

    if (e.key === '.') {
        // KEY LIGHT UP WHEN OPERATED WITH KEYBOARD //
        dot.classList.add("light-up");

        setTimeout(() => {
            dot.classList.remove("light-up");
        }, 100);
        // END KEY LIGHT UP //

        if(!primaryDisplay.innerHTML.includes('.'))
            updatePrimaryDisplayKey(e.key);
    }


    switch (e.key) {
        case "Backspace":
            // KEY LIGHT UP WHEN OPERATED WITH KEYBOARD //
            deleteButton.classList.add("light-up");

            setTimeout(() => {
                deleteButton.classList.remove("light-up");
            }, 100);
            // END KEY LIGHT UP //

            deleteDigit();
            break;
        case "Escape":
            // KEY LIGHT UP WHEN OPERATED WITH KEYBOARD //
            allClearButton.classList.add("light-up");

            setTimeout(() => {
                allClearButton.classList.remove("light-up");
            }, 100);
            // END KEY LIGHT UP //

            resetCalculator();
            break;
        case '/':
            operators[0].classList.add("light-up");

            setTimeout(() => {
                operators[0].classList.remove("light-up");
            }, 100);
            updateSecondaryDisplay(e.key);
            break;
        case '*':
            operators[1].classList.add("light-up");

            setTimeout(() => {
                operators[1].classList.remove("light-up");
            }, 100);
            updateSecondaryDisplay(e.key);
            break;
        case '-':
            operators[2].classList.add("light-up");

            setTimeout(() => {
                operators[2].classList.remove("light-up");
            }, 100);
            updateSecondaryDisplay(e.key);
            break;
        case '+':
            operators[3].classList.add("light-up");

            setTimeout(() => {
                operators[3].classList.remove("light-up");
            }, 100);
            updateSecondaryDisplay(e.key);
            break;
        case '=':
        case "Enter":
            // KEY LIGHT UP WHEN OPERATED WITH KEYBOARD //
            equals.classList.add("equals-light-up");

            setTimeout(() => {
                equals.classList.remove("equals-light-up");
            }, 100);
            // END KEY LIGHT UP //

            showResult();
            break;
    }
});