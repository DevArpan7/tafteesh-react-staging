// export function firList(state = [], action) {
//     switch (action.type) {
//       case "FIR_LIST":
//         return action.data;
//       default:
//         return state;
//     }
//   }
  
  const initialState = { isLoading: false, data: []};


export function firList(state = initialState, action){
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