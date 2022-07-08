


export function citDimensionQuestionList(state = [], action) {
    switch (action.type) {
      case "CIT_DIMENSION_QUESTION_LIST":
        return action.data;
      default:
        return state;
    }
  }
  