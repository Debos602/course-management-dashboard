import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const MaterialCard = ({ material }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const imageRef = useRef(null);
    const discountBadgeRef = useRef(null);
    const exclusiveBadgeRef = useRef(null);
    const overlayLeftRef = useRef(null);
    const overlayRightRef = useRef(null);
    const overlayFullRef = useRef(null);
    const addButtonRef = useRef(null);
    const quickViewButtonRef = useRef(null);

    const discountPercentage =
        material.SalesPrice < material.MinSalesPrice
            ? Math.round(
                  ((material.MinSalesPrice - material.SalesPrice) /
                      material.MinSalesPrice) *
                      100
              )
            : null;

    useEffect(() => {
        // Initial animations for badges
        if (discountBadgeRef.current) {
            gsap.fromTo(
                discountBadgeRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
        if (exclusiveBadgeRef.current) {
            gsap.fromTo(
                exclusiveBadgeRef.current,
                { opacity: 0, y: -20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.2,
                }
            );
        }

        // Hover animations
        if (isHovered) {
            gsap.to(cardRef.current, {
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                duration: 0.3,
                ease: "power2.out",
            });
            if (imageRef.current) {
                gsap.to(imageRef.current, {
                    scale: 1.05,
                    duration: 0.5,
                    ease: "power2.out",
                });
            }
            if (overlayLeftRef.current) {
                gsap.to(overlayLeftRef.current, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
            if (overlayRightRef.current) {
                gsap.to(overlayRightRef.current, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
            if (overlayFullRef.current) {
                gsap.to(overlayFullRef.current, {
                    opacity: 0.2,
                    duration: 0.5,
                    ease: "power2.out",
                });
            }
            if (addButtonRef.current) {
                gsap.to(addButtonRef.current, {
                    scale: 1.05,
                    backgroundColor: "#2563eb",
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
            if (quickViewButtonRef.current) {
                gsap.to(quickViewButtonRef.current, {
                    scale: 1.05,
                    borderColor: "#93c5fd",
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
        } else {
            gsap.to(cardRef.current, {
                scale: 1,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                duration: 0.3,
                ease: "power2.out",
            });
            if (imageRef.current) {
                gsap.to(imageRef.current, {
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out",
                });
            }
            if (overlayLeftRef.current) {
                gsap.to(overlayLeftRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
            if (overlayRightRef.current) {
                gsap.to(overlayRightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
            if (overlayFullRef.current) {
                gsap.to(overlayFullRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                });
            }
            if (addButtonRef.current) {
                gsap.to(addButtonRef.current, {
                    scale: 1,
                    backgroundColor: "#1f2937",
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
            if (quickViewButtonRef.current) {
                gsap.to(quickViewButtonRef.current, {
                    scale: 1,
                    borderColor: "#e5e7eb",
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
        }
    }, [isHovered]);

    return (
        <div
            ref={cardRef}
            className="relative flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges - Top Left */}
            <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
                {discountPercentage && (
                    <span
                        ref={discountBadgeRef}
                        className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                    >
                        {discountPercentage}% OFF
                    </span>
                )}
                {material.IsInHouse && (
                    <span
                        ref={exclusiveBadgeRef}
                        className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                    >
                        Exclusive
                    </span>
                )}
            </div>

            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                {material.CoverPhoto && (
                    <>
                        <img
                            ref={imageRef}
                            src={`https://d1wh1xji6f82aw.cloudfront.net/${material.CoverPhoto}`}
                            alt={material.Title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />

                        {/* Hover Overlays */}
                        <div
                            ref={overlayLeftRef}
                            className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-brand-500/20 to-transparent opacity-0"
                        />
                        <div
                            ref={overlayRightRef}
                            className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-brand-500/20 to-transparent opacity-0"
                        />
                        <div
                            ref={overlayFullRef}
                            className="absolute inset-0 bg-brand-500/10 opacity-0"
                        />
                    </>
                )}
            </div>

            {/* Content Area - Flex-grow to push button to bottom */}
            <div className="flex flex-col flex-grow p-4">
                <div className="space-y-2">
                    {/* Brand Name */}
                    {material.BrandName && (
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {material.BrandName}
                        </p>
                    )}

                    {/* Product Title */}
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                        {material.Title}
                    </h3>

                    {/* Variant Info */}
                    {material.VariantTitle && (
                        <p className="text-sm text-gray-600 line-clamp-1">
                            {material.VariantTitle}
                        </p>
                    )}

                    {/* Price Section */}
                    <div className="mt-3 flex items-end justify-between">
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-gray-900">
                                    ₹{material.SalesPrice.toFixed(2)}
                                </span>
                                {discountPercentage && (
                                    <span className="text-sm text-gray-400 line-through">
                                        ₹{material.MinSalesPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            {material.SalesPriceInUsd && (
                                <p className="text-xs text-gray-500">
                                    ≈ ${material.SalesPriceInUsd.toFixed(2)} USD
                                </p>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            ref={addButtonRef}
                            className="px-3 py-2 mb-2 bg-gray-900 text-white text-sm font-medium rounded-lg flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Add
                        </button>
                    </div>
                </div>

                {/* Quick View Button - Always at bottom */}
                <button
                    ref={quickViewButtonRef}
                    className="mt-auto w-full py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                    Quick View
                </button>
            </div>
        </div>
    );
};

MaterialCard.propTypes = {
    material: PropTypes.shape({
        Id: PropTypes.number.isRequired,
        TypeId: PropTypes.number,
        StoreId: PropTypes.number,
        VariantId: PropTypes.number,
        CoverPhoto: PropTypes.string,
        VariantCoverPhoto: PropTypes.string,
        Title: PropTypes.string.isRequired,
        SubTitle: PropTypes.string,
        VariantTitle: PropTypes.string,
        BrandName: PropTypes.string,
        TaxPercentage: PropTypes.number,
        MinSalesPrice: PropTypes.number,
        SalesPrice: PropTypes.number.isRequired,
        SalesPriceInUsd: PropTypes.number,
        DripPrice: PropTypes.number,
        DripPriceInUsd: PropTypes.number,
        MinDripPrice: PropTypes.number,
        MinDripPriceInUsd: PropTypes.number,
        Height: PropTypes.number,
        Width: PropTypes.number,
        Depth: PropTypes.number,
        IsInHouse: PropTypes.bool,
        ECardGradient1: PropTypes.string,
        ECardGradient2: PropTypes.string,
        ECardIconPath: PropTypes.string,
    }).isRequired,
};

export default MaterialCard;
