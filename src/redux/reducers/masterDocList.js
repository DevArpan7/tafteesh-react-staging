export function masterDocList(state = [], action) {
    switch (action.type) {
      case "MASTER_DOCUMENT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  