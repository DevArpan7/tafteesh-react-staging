

export function grantList(state = [], action) {
    switch (action.type) {
      case "GRANT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  