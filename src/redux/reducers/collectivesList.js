export function collectivesList(state = [], action) {
  switch (action.type) {
    case "COLLECTIVES_LIST":
      return action.data;
    default:
      return state;
  }
}
