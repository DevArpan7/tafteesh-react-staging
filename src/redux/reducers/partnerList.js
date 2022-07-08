export function partnerList(state = [], action) {
    switch (action.type) {
      case "PARTNERS_LIST":
        return action.data;
      default:
        return state;
    }
  }
  