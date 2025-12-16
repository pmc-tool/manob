import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ViewState {
    service_details_url?:string,
    active_service_id?:string,
    user_type?: string,
    show_login_modal: boolean
}

const initialState: ViewState = {
    service_details_url: "",
    active_service_id: "",
    user_type: typeof window !== "undefined" ? localStorage.getItem("r_ty")! : " ",
    show_login_modal: false
};

const viewState = createSlice({
    name: "ViewState",
    initialState,
    reducers: {
        SetServiceDetailUrl(state, action: PayloadAction<any>) {
           state.service_details_url = action.payload.url;
           state.active_service_id = action.payload.id
        },

        SetLoginModalState(state, action: PayloadAction<boolean>) {
            console.log("Setting login modal state to: ", action.payload);
            state.show_login_modal = action.payload;
        }

    },
});

export const {
    SetServiceDetailUrl,
    SetLoginModalState
} = viewState.actions;

export default viewState.reducer;
