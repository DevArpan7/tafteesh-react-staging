export function pcWhyList(state = [], action) {
    switch (action.type) {
      case "PC_WHY_LIST":
        return action.data;
      default:
        return state;
    }
  }
  