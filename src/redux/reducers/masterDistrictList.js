
export function masterDistrictList(state = [], action) {
    switch (action.type) {
      case "MASTER_DISTRICT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  