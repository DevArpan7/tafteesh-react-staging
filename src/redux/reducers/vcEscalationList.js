export function vcEscalationList(state = [], action) {
    switch (action.type) {
      case "VC_ESCALATION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  