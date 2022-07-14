
export function pendingItemList(state = [], action) {
    switch (action.type) {
      case "PENDING_ITEM_LIST":
        return action.data;
      default:
        return state;
    }
  }
  