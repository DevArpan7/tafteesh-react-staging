export function survivalLoanList(state = {} ,action) {
    switch (action.type) {
      case "SURVIVAL_LOAN_LIST":
        return action.data;
      default:
        return state;
    }
  }
  