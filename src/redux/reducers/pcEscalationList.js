export function pcEscalationList(state = [], action) {
    switch (action.type) {
      case "PC_ESCALATION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  