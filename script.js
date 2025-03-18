// 获取DOM元素
const displayElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const plusMinusButton = document.getElementById('plusMinus');
const percentageButton = document.getElementById('percentage');
const decimalButton = document.getElementById('decimal');

// 计算器状态
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;
let lastResult = null;

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
        if (button.id !== 'equals') { // 排除等号按钮
            button.addEventListener('click', () => {
                chooseOperation(button.textContent);
            });
        }
    });

    // 等号按钮事件
    equalsButton.addEventListener('click', () => {
        console.log('等号按钮被点击');
        calculate();
    });

    // 清除按钮事件
    clearButton.addEventListener('click', () => {
        clear();
        // 更改按钮文本从AC到C
        clearButton.textContent = 'AC';
    });

    // 正负号按钮事件
    plusMinusButton.addEventListener('click', () => {
        toggleSign();
    });

    // 百分比按钮事件
    percentageButton.addEventListener('click', () => {
        convertToPercentage();
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
    if (e.key === '%') {
        convertToPercentage();
    }
}

// 添加数字
function appendNumber(number) {
    // 如果当前显示的是计算结果，开始新的计算
    if (shouldResetScreen) {
        resetScreen();
    }
    
    // 限制数字长度，防止溢出显示区域
    if (currentOperand.replace(/[^0-9]/g, '').length >= 9) return;
    
    // 如果当前是0，则替换它，否则追加
    if (currentOperand === '0') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
    // 当有输入时，清除按钮文本变为C
    clearButton.textContent = 'C';
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

// 切换正负号
function toggleSign() {
    if (currentOperand === '0') return;
    
    if (currentOperand.startsWith('-')) {
        currentOperand = currentOperand.substring(1);
    } else {
        currentOperand = '-' + currentOperand;
    }
    
    updateDisplay();
}

// 转换为百分比
function convertToPercentage() {
    const number = parseFloat(currentOperand);
    if (isNaN(number)) return;
    
    currentOperand = (number / 100).toString();
    updateDisplay();
}

// 重置屏幕
function resetScreen() {
    currentOperand = '0';
    shouldResetScreen = false;
}

// 清除所有
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    lastResult = null;
    updateDisplay();
}

// 删除数字
function deleteNumber() {
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// 选择操作符
function chooseOperation(op) {
    if (currentOperand === '') return;
    
    // 如果已经有一个操作在等待，先计算它
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
}

// 计算结果
function calculate() {
    // 如果没有操作符或前一个操作数，但有上次的结果，可以重复上次的操作
    if (previousOperand === '' && lastResult !== null) {
        return;
    }
    
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
    
    // 保存上次的操作，用于重复计算
    lastResult = {
        operand: current,
        operation: operation,
        result: computation
    };
    
    // 处理小数点后过多的位数
    currentOperand = formatResult(computation);
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    
    updateDisplay();
    console.log('计算完成，结果：', currentOperand);
}

// 格式化结果，处理大数和小数
function formatResult(number) {
    // 检查是否是非常大或非常小的数
    if (Math.abs(number) >= 1e10 || (Math.abs(number) < 1e-10 && number !== 0)) {
        return number.toExponential(5);
    }
    
    // 转换为字符串并限制小数位数
    let stringNumber = number.toString();
    
    // 如果包含小数点
    if (stringNumber.includes('.')) {
        const parts = stringNumber.split('.');
        const integerPart = parts[0];
        let decimalPart = parts[1];
        
        // 限制小数位数最多为10位
        if (decimalPart.length > 10) {
            decimalPart = decimalPart.substring(0, 10);
        }
        
        // 移除尾部的0
        decimalPart = decimalPart.replace(/0+$/, '');
        
        if (decimalPart === '') {
            return integerPart;
        } else {
            return `${integerPart}.${decimalPart}`;
        }
    }
    
    return stringNumber;
}

// 格式化显示数字
function formatDisplayNumber(number) {
    // 检查是否已经是科学计数法
    if (number.includes('e')) {
        return number;
    }
    
    const parts = number.split('.');
    let integerPart = parts[0];
    
    // 为负数特殊处理
    let isNegative = false;
    if (integerPart.startsWith('-')) {
        isNegative = true;
        integerPart = integerPart.substring(1);
    }
    
    // 添加千位分隔符
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // 重新添加负号
    if (isNegative) {
        integerPart = '-' + integerPart;
    }
    
    // 如果有小数部分，添加回去
    if (parts.length > 1) {
        return `${integerPart}.${parts[1]}`;
    }
    
    return integerPart;
}

// 更新显示
function updateDisplay() {
    // 限制显示长度，防止溢出
    let displayText = formatDisplayNumber(currentOperand);
    
    // 如果太长，使用科学计数法
    if (displayText.length > 10 && !displayText.includes('e')) {
        const num = parseFloat(currentOperand);
        displayText = num.toExponential(5);
    }
    
    displayElement.textContent = displayText;
}

// 初始化计算器
initialize();
