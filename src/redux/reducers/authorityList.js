const initialState = { isLoading: false, data: []};


export function authorityList(state = initialState, action){
  switch (action.type) {
    case "LOADING_CONCERTS":
      return { ...state, isLoading: true };
    case "GET_CONCERTS":
      return { ...state,
               data: action.data.data,
               isLoading: false };
   
    default:
      return state;
  }
};


// export function authorityList(state = [], action) {
//     switch (action.type) {
//       case "AUTHORITY_LIST":
//         return action.data;
//       default:
//         return state;
//     }
//   }
  