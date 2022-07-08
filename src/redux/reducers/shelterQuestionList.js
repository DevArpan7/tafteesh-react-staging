
export function shelterQuestionList(state = [], action) {
    switch (action.type) {
      case "SHELTER_QUESTION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  