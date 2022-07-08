

export function incomeList(state ={}, action) {
    switch (action.type) {
      case "SURVIVAL_INCOME_LIST":
        return action.data;
      default:
        return state;
    }
  }
  