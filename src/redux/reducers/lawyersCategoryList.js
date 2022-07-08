export function lawyersCategoryList(state = [], action) {
    switch (action.type) {
      case "LAWYERS_CATEGORY_LIST":
        return action.data;
      default:
        return state;
    }
  }
  