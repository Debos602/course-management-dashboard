import { useEffect, useState, useRef } from "react";
import MaterialCard from "./MaterialCard";
import Loading from "../../component/Loading/Loading";
import { useGetMaterialsQuery } from "../../redux/features/materials/materialsApi";
import { gsap } from "gsap";
import { generateParams } from "../../utils/generateParams";

const MaterialList = () => {
    // State for pagination
    const [skip, setSkip] = useState(0);
    const limit = 20;
    const [allMaterials, setAllMaterials] = useState([]);

    // State for filtering
    const [selectedType, setSelectedType] = useState(null); // null means "All Types"

    // State for sorting
    const [sortOption, setSortOption] = useState("default");

    // State for delayed spinner
    const [showSpinner, setShowSpinner] = useState(false);

    // Refs for animation
    const gridRef = useRef(null);
    const cardRefs = useRef([]);

    // Timer ref for delayed spinner
    const spinnerTimerRef = useRef(null);

    // Query parameters for API
    const queryParams = {
        Skip: skip,
        Limit: limit,
        ...(selectedType !== null && { Types: [selectedType] }), // Only include Types if not null
    };

    // Fetch materials
    const { data, isLoading, error } = useGetMaterialsQuery(
        generateParams(queryParams)
    );

    // Update materials when new data is fetched, preventing duplicates
    useEffect(() => {
        if (data?.Materials) {
            if (skip === 0) {
                const uniqueMaterials = data.Materials.filter(
                    (material, index, self) =>
                        index === self.findIndex((m) => m.Id === material.Id)
                );
                setAllMaterials(uniqueMaterials);
            } else {
                setAllMaterials((prev) => {
                    const newMaterials = data.Materials.filter(
                        (material) => !prev.some((m) => m.Id === material.Id)
                    );
                    return [...prev, ...newMaterials];
                });
            }
        }
    }, [data, skip]);

    // Sort materials
    const sortedMaterials = [...allMaterials].sort((a, b) => {
        if (sortOption === "priceAsc") {
            return a.SalesPrice - b.SalesPrice;
        } else if (sortOption === "priceDesc") {
            return b.SalesPrice - a.SalesPrice;
        } else if (sortOption === "titleAsc") {
            return a.Title.localeCompare(b.Title);
        }
        return 0;
    });

    // Animate cards and grid on mount and updates
    useEffect(() => {
        if (
            sortedMaterials.length > 0 &&
            gridRef.current &&
            cardRefs.current.length > 0
        ) {
            gsap.fromTo(
                gridRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
            gsap.fromTo(
                cardRefs.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: "power2.out",
                    delay: 0.2,
                }
            );
        }
    }, [sortedMaterials]);

    // Handle delayed spinner visibility
    useEffect(() => {
        if (isLoading && skip > 0) {
            spinnerTimerRef.current = setTimeout(() => {
                setShowSpinner(true);
            }, 500);
        } else {
            clearTimeout(spinnerTimerRef.current);
            setShowSpinner(false);
        }

        return () => {
            clearTimeout(spinnerTimerRef.current);
        };
    }, [isLoading, skip]);

    // Handle load more
    const handleLoadMore = () => {
        setSkip((prev) => prev + limit);
    };

    // Handle type filter change
    const handleTypeChange = (e) => {
        const value = e.target.value;
        const typeId = value === "" ? null : Number(value);
        setSkip(0);
        setAllMaterials([]);
        setSelectedType(typeId);
    };

    // Handle sort change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Available types for filtering
    const availableTypes =
        data?.Tags?.map((tag) => ({ id: tag.Id, name: tag.Title })) || [];

    // Check if more materials can be loaded
    const canLoadMore =
        data?.RemainingCount > 0 ||
        (data?.TotalCount > allMaterials.length && allMaterials.length > 0);

    // Reset card refs on each render
    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, sortedMaterials.length);
    }, [sortedMaterials]);

    if (isLoading && skip === 0) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500">Failed to load materials.</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen p-4 md:p-8">
            <div className="container mx-auto text-gray-900">
                <h1 className="text-2xl font-bold mb-6">Materials</h1>

                {/* Filter and Sort Controls */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">
                            Filter by Type:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <select
                                onChange={handleTypeChange}
                                value={
                                    selectedType === null ? "" : selectedType
                                }
                                className="border rounded-md p-2 text-sm"
                            >
                                <option value="">All Types</option>
                                {availableTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Sort By:</h3>
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="border rounded-md p-2 text-sm"
                        >
                            <option value="default">Default</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">
                                Price: High to Low
                            </option>
                            <option value="titleAsc">Title: A to Z</option>
                        </select>
                    </div>
                </div>

                {/* Materials Grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                >
                    {sortedMaterials.length > 0 ? (
                        sortedMaterials.map((material, index) => (
                            <div
                                key={`${material.Id}-${index}`}
                                ref={(el) => (cardRefs.current[index] = el)}
                            >
                                <MaterialCard material={material} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-900 text-center w-full">
                            No materials found.
                        </p>
                    )}
                </div>

                {/* Load More Button */}
                {canLoadMore && (
                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            disabled={isLoading}
                            aria-busy={isLoading}
                            className={`px-6 py-2 rounded-md text-white flex items-center justify-center mx-auto ${
                                isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gray-900 hover:bg-gray-950"
                            }`}
                        >
                            {isLoading ? (
                                showSpinner ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                                            ></path>
                                        </svg>
                                        Loading...
                                    </>
                                ) : (
                                    "Loading..."
                                )
                            ) : (
                                "Load More"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MaterialList;
