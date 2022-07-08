
export function survivalGrantList(state = [], action) {
    switch (action.type) {
      case "SURVIVAL_GRANT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  