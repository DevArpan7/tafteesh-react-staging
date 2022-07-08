export function participationList(state = [], action) {
    switch (action.type) {
      case "PARTICIPATION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  