export function lawyersListByCatId(state = [], action) {
    switch (action.type) {
      case "LAWYERS_LIST_CATEGORY_ID":
        return action.data;
      default:
        return state;
    }
  }
  