export function usersList(state = [], action) {
    switch (action.type) {
      case "USERS_LIST":
        return action.data;
      default:
        return state;
    }
  }
  