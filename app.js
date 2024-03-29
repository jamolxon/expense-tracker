let budgetController = (function(){

    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Income = function(id, description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(item){
            sum += parseInt(item.value);
        })
        data.total[type] = sum;
    }

    const data = {
        allItems: {
            expense: [],
            income: []
        },
        total: {
            expense: 0,
            income: 0
        },
        budget: 0,
        incomePercentage: -1,
        expensePercentage: -1
    }

    return {
        addItem: function(type, description, value){
            let newItem, ID;

            // Create new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            // Create new ITEM based on "income" or "expense" type
            if(type === 'expense') {
                newItem = new Expense(ID, description, value)
            }
            else {
                newItem = new Income(ID, description, value);
            }
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function (type, id) {
            let ids, index, money_type;

            if (type === 'income') {
                money_type = 'income';
            }
            if (type === 'expense') {
                money_type = 'expense';
            }

            ids = data.allItems[money_type].map(function (item) {
                return item.id;
            })

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[money_type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            // calculate total income and expense
            
            calculateTotal("expense");
            calculateTotal("income");

            // calculate the budget income and expense
            data.budget = data.total.income - data.total.expense;

            // calculate the percentage of income that we spent
            if(data.total.income > 0) {
                data.expensePercentage = Math.round((data.total.expense / data.total.income) * 100);
                data.incomePercentage = 100;
            } 
            else {
                data.expensePercentage = -1;
                data.incomePercentage = -1;
            }
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.total.income,
                totalExpense: data.total.expense,
                incomePercentage: data.incomePercentage,
                expensePercentage: data.expensePercentage
            }
        },

        test_info: function(){
            console.log(data);
        }
    }

})();


let UIController = (function(){
    let elements = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        deleteBtn: '.ion-ios-close-outline',
        inputContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        expensePercentageLabel: '.budget__expenses--percentage',
        incomePercentageLabel: '.budget__income--percentage',
        container: '.container',
        incomeItem: '#income-',
        expenseItem: '#expense-'
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(elements.inputType).value,
                description: document.querySelector(elements.inputDescription).value,
                value: document.querySelector(elements.inputValue).value
            };
        },
        addListItem: function (obj, type) {
            let item, element;

            if(type === 'income'){
                element = elements.inputContainer;
                item = `<div class="item clearfix" id="income-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">$ ${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
                // income percentage for later version: <div class="item__percentage">20%</div>
            }

            if(type === 'expense'){
                element = elements.expenseContainer;
                item = `<div class="item clearfix" id="expense-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">$ ${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
                // expense percentage for later version: <div class="item__percentage">20%</div>
            }

            document.querySelector(element).insertAdjacentHTML('afterend', item);
        },
        clearFields: function(){
            let fields, fieldsArr;
            fields = document.querySelectorAll(`${elements.inputDescription}, ${elements.inputValue}`);

            // the code with list
            // fields.forEach(function(current, index, array){
            //   current.value = "";
            //    });
            
            // the code with array
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current){
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(elements.incomeLabel).textContent = `+ $${obj.totalIncome}`;
            document.querySelector(elements.expenseLabel).textContent = `- $${obj.totalExpense}`;
            document.querySelector(elements.budgetLabel).textContent = `$${obj.budget}`;

            if(obj.incomePercentage > 0){
                document.querySelector(elements.expensePercentageLabel).textContent = `${obj.expensePercentage}%`;
                document.querySelector(elements.incomePercentageLabel).textContent = `${obj.incomePercentage}%`;
            } else{
                document.querySelector(elements.expensePercentageLabel).textContent = `0%`;
            }
        },
        getElements: function(){
            return elements;
        }
    };
})();

let controller = (function(budgetCtrl, UICtrl){

    let setupEventListener = function(){
        let elements = UICtrl.getElements();
        document.querySelector(elements.inputBtn).addEventListener('click', ctrlAddItem)


        document.addEventListener('keypress', function(){
            if(event.keyCode === 13){
                let input;
                input = UICtrl.getInput();
                if(input.keyCode != 13){
                    ctrlAddItem();
                }
            }
        });
        document.querySelector(elements.container).addEventListener('click', ctrlDeleteItem);

    }

    let updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on UI
        UICtrl.displayBudget(budget);
    }


    let ctrlAddItem  = function(){
        let input, newItem;
        input = UICtrl.getInput();

        // Add the item to the budget controller
        
        newItem = budgetCtrl.addItem(input.type, input.description, parseInt(input.value));

        // Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // Clear the fields
        UICtrl.clearFields();

        // Calculate and updateBudget
        updateBudget();
    }

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, ID, type;

        let elements = UICtrl.getElements();

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete item from the UI
            if (type === "income") {
                document.querySelector(elements.incomeItem + ID).remove();
            }
            else if (type === "expense") {
                document.querySelector(elements.expenseItem + ID).remove();
            }

            // 3. Update and show the new budget
            updateBudget();
        }
    }

    return {
        init: function(){
            console.log('Application has started.');
            setupEventListener();
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                expensePercentage: -1,
                incomePercentage: -1,

            });
        }
    }

})(budgetController,UIController);

controller.init();
