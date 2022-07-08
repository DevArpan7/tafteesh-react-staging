export function survivorActionDetails(state = {}, action) {
    switch (action.type) {
      case "SURVIVOR_ACTION_DETAILS":
        return action.data;
      default:
        return state;
    }
  }
  