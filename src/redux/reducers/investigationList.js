

export function investigationList(state = [], action) {
    switch (action.type) {
      case "INVESTIGATION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  