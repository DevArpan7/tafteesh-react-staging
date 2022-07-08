export function blockList(state = [], action) {
    switch (action.type) {
      case "BLOCK_LIST":
        return action.data;
      default:
        return state;
    }
  }
  