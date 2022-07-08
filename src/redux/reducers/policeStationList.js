export function policeStationList(state = [], action) {
  switch (action.type) {
    case "POLICE_STATION_LIST":
      return action.data;
    default:
      return state;
  }
}
