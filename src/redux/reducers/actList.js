
export function actList(state = [], action) {
    switch (action.type) {
      case "ACT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  