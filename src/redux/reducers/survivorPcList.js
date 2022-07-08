export function survivorPcList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }
  