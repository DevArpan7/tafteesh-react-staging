
export function adminDashboardData(state = {}, action) {
    switch (action.type) {
      case "DASHBOARD_DATA":
        return action.data;
      default:
        return state;
    }
  }
  
export function monthDashboardData(state = [], action) {
  switch (action.type) {
    case "MONTH_DASHBOARD_DATA":
      return action.data;
    default:
      return state;
  }
}

export function stateDashboardData(state = [], action) {
  switch (action.type) {
    case "STATE_DASHBOARD_DATA":
      return action.data;
    default:
      return state;
  }
}

export function ageDashboardData(state = [], action) {
  switch (action.type) {
    case "AGE_DASHBOARD_DATA":
      return action.data;
    default:
      return state;
  }
}