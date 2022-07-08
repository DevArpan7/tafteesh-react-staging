
export function rescueList(state = [], action) {
    switch (action.type) {
      case "RESCUE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  