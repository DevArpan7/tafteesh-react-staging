export function survivorDetails(state = {}, action) {
    switch (action.type) {
      case "SURVIVOR_DETAILS":
        return action.data;
      default:
        return state;
    }
  }
  