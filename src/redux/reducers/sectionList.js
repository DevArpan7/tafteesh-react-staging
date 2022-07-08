
export function sectionList(state = [], action) {
    switch (action.type) {
      case "SECTION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  
export function sectionByActId(state = [], action) {
  switch (action.type) {
    case "SECTION_LIST_BY_ACT":
      return action.data;
    default:
      return state;
  }
}
