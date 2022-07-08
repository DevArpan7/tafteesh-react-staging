export function chargeSheetList(state = [], action) {
    switch (action.type) {
      case "CHARGE_SHEET_LIST":
        return action.data;
      default:
        return state;
    }
  }
  