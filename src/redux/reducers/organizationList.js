export function organizationList(state = [], action) {
    switch (action.type) {
      case "ORGANIZATION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  