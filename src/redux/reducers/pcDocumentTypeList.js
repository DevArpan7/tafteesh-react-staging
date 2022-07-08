export function pcDocumentTypeList(state = [], action) {
    switch (action.type) {
      case "PC_DOCUMENT_TYPE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  