

export function citList(state = [], action) {
    switch (action.type) {
      case "CIT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  