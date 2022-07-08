
export function allCitList(state = [], action) {
    switch (action.type) {
      case "ALL_CIT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  