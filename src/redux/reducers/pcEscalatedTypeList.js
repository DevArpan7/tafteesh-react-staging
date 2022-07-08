export function pcEscalatedTypeList(state = [], action) {
    switch (action.type) {
      case "PC_ESCALATION_TYPE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  