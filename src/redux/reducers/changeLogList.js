export function changeLogList(state = [], action) {
    switch (action.type) {
      case "CHANGE_LOG_LIST":
        return action.data;
      default:
        return state;
    }
  }
  