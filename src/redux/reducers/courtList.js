export function courtList(state = [], action) {
    switch (action.type) {
      case "COURT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  