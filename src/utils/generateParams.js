export const generateParams = (params) => {
    if (!params || Object.keys(params).length === 0) {
        return {};
    }

    // Build the filter object dynamically
    const filterParams = {
        Skip: params.Skip || 0,
        Limit: params.Limit || 20,
    };

    // Only include Types if explicitly provided
    if (
        params.Types &&
        Array.isArray(params.Types) &&
        params.Types.length > 0
    ) {
        filterParams.Types = params.Types;
    }

    const filterString = JSON.stringify(filterParams);
    const base64Filter = btoa(filterString);

    return { filter: base64Filter };
};
