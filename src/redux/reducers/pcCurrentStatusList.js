export function pcCurrentStatusList(state = [], action) {
    switch (action.type) {
      case "PC_CURRENT_STATUS_LIST":
        return action.data;
      default:
        return state;
    }
  }
  