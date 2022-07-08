export function survivalVcList(state = [], action) {
    switch (action.type) {
      case "VC_LIST":
        return action.data;
      default:
        return state;
    }
  }
  