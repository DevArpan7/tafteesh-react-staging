export function pcEscalationReasonList(state = [], action) {
    switch (action.type) {
      case "PC_ESCALATION_REASON_LIST":
        return action.data;
      default:
        return state;
    }
  }
  