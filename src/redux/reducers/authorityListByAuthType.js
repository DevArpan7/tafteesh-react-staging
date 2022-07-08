export function authorityListByAuthType(state = [], action) {
    switch (action.type) {
      case "AUTHORITY_LIST_BY_AUTHORITY_TYPE":
        return action.data;
      default:
        return state;
    }
  }
  