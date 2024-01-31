let budgetController = (function(){

    console.log("Hey");
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
        sum += parseInt(item);
      })
      data.total[type] = sum;
    }

    let data = {
        allItems: {
            expense: [],
            income: []
        },
        total: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    }

return {
  addItem: function(type, description, value){
    let newItem,ID;
    // Create new ID
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
      else{
        ID = 0;
      }
    // Create new ITEM based on "income" or "expense" type
      if(type === 'expense'){
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

    //ids = [1,2,4,6,8]

    if (type === 'income') {
      money_type = 'income';
    }
    if (type === 'expense') {
      money_type = 'expense';
    }

    ids = data.allItems[money_type].map(function (current) {
      return current.id;
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
    //calculate the percentage of income that we spent
      if(data.total.income > 0){
        data.percentage = Math.round((data.total.expense / data.total.income) * 100);
      } else{
        data.percentage = -1;
      }
  },

  getBudget: function(){
    return{
        budget: data.budget,
        totalInc: data.total.income,
        totalExp: data.total.expense,
        percentage: data.percentage
    }
  },

  test_info: function(){
    console.log(data);
  }
}

})();

budgetController.calculateBudget()
budgetController.test_info()
