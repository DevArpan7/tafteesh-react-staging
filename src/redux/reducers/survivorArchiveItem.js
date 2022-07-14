
export function survivorArchiveItem(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_ARCHIVE_ITEM_LIST":
        return action.data;
      default:
        return state;
    }
  }
  