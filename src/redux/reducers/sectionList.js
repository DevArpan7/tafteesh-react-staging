
export function sectionList(state = [], action) {
    switch (action.type) {
      case "SECTION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  