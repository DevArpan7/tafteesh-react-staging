export function notificationList(state = [], action) {
    switch (action.type) {
      case "NOTIFICATION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  