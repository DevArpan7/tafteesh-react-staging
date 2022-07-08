export function pcResultofProsecutionList(state = [], action) {
    switch (action.type) {
      case "PC_RSULT_OF_PROSECUTION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  