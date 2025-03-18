// 获取DOM元素
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const decimalButton = document.getElementById('decimal');

// 计算器状态
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

// 初始化函数
function initialize() {
    updateDisplay();
    setupEventListeners();
    console.log('计算器初始化完成');
}

// 设置事件监听器
function setupEventListeners() {
    // 数字按钮事件
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.textContent);
        });
    });

    // 操作符按钮事件
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.textContent);
        });
    });

    // 等号按钮事件
    equalsButton.addEventListener('click', () => {
        console.log('等号按钮被点击');
        calculate();
    });

    // 清除按钮事件
    clearButton.addEventListener('click', () => {
        clear();
    });

    // 删除按钮事件
    deleteButton.addEventListener('click', () => {
        deleteNumber();
    });

    // 小数点按钮事件
    decimalButton.addEventListener('click', () => {
        appendDecimal();
    });

    // 键盘支持
    document.addEventListener('keydown', handleKeyboardInput);
}

// 处理键盘输入
function handleKeyboardInput(e) {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    }
    if (e.key === '.') {
        appendDecimal();
    }
    if (e.key === '=' || e.key === 'Enter') {
        calculate();
    }
    if (e.key === 'Backspace') {
        deleteNumber();
    }
    if (e.key === 'Escape') {
        clear();
    }
    if (e.key === '+' || e.key === '-') {
        chooseOperation(e.key);
    }
    if (e.key === '*') {
        chooseOperation('×');
    }
    if (e.key === '/') {
        chooseOperation('÷');
    }
}

// 添加数字
function appendNumber(number) {
    if (currentOperand === '0' || shouldResetScreen) {
        resetScreen();
    }
    currentOperand += number;
    updateDisplay();
}

// 添加小数点
function appendDecimal() {
    if (shouldResetScreen) {
        resetScreen();
    }
    if (currentOperand.includes('.')) return;
    currentOperand += '.';
    updateDisplay();
}

// 重置屏幕
function resetScreen() {
    currentOperand = '';
    shouldResetScreen = false;
}

// 清除所有
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

// 删除数字
function deleteNumber() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// 选择操作符
function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculate();
    }
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

// 计算结果
function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert('不能除以0');
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    // 处理小数点后过多的位数
    currentOperand = roundResult(computation);
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true; // 添加这一行，确保计算后重置输入状态
    updateDisplay();
    
    // 添加调试信息
    console.log('计算完成，结果：', currentOperand);
}

// 四舍五入结果，避免JavaScript浮点数精度问题
function roundResult(number) {
    // 如果是整数，直接返回
    if (Number.isInteger(number)) {
        return number.toString();
    }
    
    // 处理小数，最多保留10位小数
    return number.toFixed(10).replace(/\.?0+$/, '');
}

// 格式化显示数字
function getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('zh-CN', {
            maximumFractionDigits: 0
        });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

// 更新显示
function updateDisplay() {
    currentOperandElement.textContent = getDisplayNumber(currentOperand);
    if (operation != null) {
        previousOperandElement.textContent = `${getDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandElement.textContent = '';
    }
}

// 初始化计算器
initialize();
