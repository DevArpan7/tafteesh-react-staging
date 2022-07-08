
export function authorityTypeList(state = [], action) {
    switch (action.type) {
      case "AUTHORITY_TYPE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  