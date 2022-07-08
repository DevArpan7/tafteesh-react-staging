export function survivorLawyersList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_LAWYERS_LIST":
        return action.data;
      default:
        return state;
    }
  }
  