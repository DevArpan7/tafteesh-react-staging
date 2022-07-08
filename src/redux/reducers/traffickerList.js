export function traffickerList(state = [], action) {
    switch (action.type) {
      case "TRAFFICKER_LIST":
        return action.data;
      default:
        return state;
    }
  }
  