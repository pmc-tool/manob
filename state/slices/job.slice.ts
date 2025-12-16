import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFilterCategory, IJobFilter } from "../../interfaces/filter.interface"


const jobfilerInit: IJobFilter = {
    term: '',
    minBudget: 0,
    maxBudget: 0,
    deliveryTime: '',
    level: [],
    category: []
}

const jobSlice = createSlice({
    name: 'JOB',
    initialState: jobfilerInit,
    reducers: {
        SetSearchTerm(state, action: PayloadAction<string>) {
            state.term = action.payload;
        },

        SetJobFilter(state, action: PayloadAction<any>) {
            console.log(action);
            
            if(action.payload.key == 'CATEGORY') {
                state.category = action.payload.selected;
            }

            if(action.payload.key == 'LEVEL') {
                state.level = action.payload.selected;
            }
        }
    },
});


export const { SetSearchTerm, SetJobFilter } = jobSlice.actions;

export default jobSlice.reducer;