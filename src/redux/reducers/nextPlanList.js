export function nextPlanList(state = [], action) {
    switch (action.type) {
      case "SURVIVAL_NEXT_PLAN_LIST":
        return action.data;
      default:
        return state;
    }
  }
  