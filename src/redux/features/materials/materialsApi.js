import { generateParams } from "../../../utils/generateParams";
import { baseApi } from "../../api/baseApi";

export const materialsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMaterials: builder.query({
            query: (params = {}) => ({
                url: "/Materials/GetAll/",
                method: "GET",
                params: generateParams(params),
            }),
            providesTags: ["Materials"],
        }),
    }),
});

export const { useGetMaterialsQuery } = materialsApi;
