export function districtList(state = [], action) {
    switch (action.type) {
      case "DISTRICT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  