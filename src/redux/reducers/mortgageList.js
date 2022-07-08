export function mortgageList(state = [], action) {
    switch (action.type) {
      case "MORTGAGE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  