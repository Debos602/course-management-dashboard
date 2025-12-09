
import { baseApi } from "../../api/baseApi";

export const batchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBatches: builder.query({
            query: () => ({
                url: "/admin/all-batches",
                method: "GET",
               
            }),
            providesTags: ["Batch"],
        }),
    }),
});

export const { useGetAllBatchesQuery } = batchApi;
