export function lawyersList(state = [], action) {
    switch (action.type) {
      case "LAWYERS_LIST":
        return action.data;
      default:
        return state;
    }
  }
  