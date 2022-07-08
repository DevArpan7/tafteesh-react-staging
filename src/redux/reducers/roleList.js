export function roleList(state = [], action) {
    switch (action.type) {
      case "ROLE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  