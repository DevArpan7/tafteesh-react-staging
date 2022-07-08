export function stateList(state = [], action) {
    switch (action.type) {
      case "STATE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  