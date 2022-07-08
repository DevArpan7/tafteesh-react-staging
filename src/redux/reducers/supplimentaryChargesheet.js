export function SupplimentarychargeSheetList(state = [], action) {
    switch (action.type) {
      case "SUPPLIMENTARY_CHARGE_SHEET_LIST":
        return action.data;
      default:
        return state;
    }
  }
  