
export function citVersionList(state = [], action) {
    switch (action.type) {
      case "CIT_VERSION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  