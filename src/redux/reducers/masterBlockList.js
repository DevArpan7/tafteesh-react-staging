export function masterBlockList(state = [], action) {
    switch (action.type) {
      case "MASTER_BLOCK_LIST":
        return action.data;
      default:
        return state;
    }
  }
  