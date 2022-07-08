export function userDetails(state = {}, action) {
    switch (action.type) {
      case "USER_DETAILS":
        return action.data;
      default:
        return state;
    }
  }
  