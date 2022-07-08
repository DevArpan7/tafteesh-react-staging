export function shgList(state = [], action) {
  switch (action.type) {
    case "SHG_LIST":
      return action.data;
    default:
      return state;
  }
}
