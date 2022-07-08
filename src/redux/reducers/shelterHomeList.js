export function shelterHomeList(state = [], action) {
    switch (action.type) {
      case "SHELTER_HOME_LIST":
        return action.data;
      default:
        return state;
    }
  }
  