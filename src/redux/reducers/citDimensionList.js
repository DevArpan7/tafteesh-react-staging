
export function citDimensionList(state = [], action) {
    switch (action.type) {
      case "CIT_DIMENSION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  