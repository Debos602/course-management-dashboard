import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const AnimationWrapper = ({ children, animationType, delay = 0 }) => {
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Set initial states with more pronounced starting positions
        switch (animationType) {
            case "slideLeft":
                gsap.set(element, {
                    x: -150, // Increased from -100 for more dramatic entrance
                    opacity: 0,
                    rotation: -2, // Slight rotation for depth
                });
                break;
            case "slideRight":
                gsap.set(element, {
                    x: 150, // Increased from 100
                    opacity: 0,
                    rotation: 2, // Opposite rotation
                });
                break;
            case "fadeUp":
                gsap.set(element, {
                    y: 40, // Increased from 20
                    opacity: 0,
                    scale: 0.98, // Subtle scale
                });
                break;
            default:
                gsap.set(element, {
                    opacity: 0,
                    scale: 0.98,
                });
        }

        // Animation timeline with smoother settings
        const tl = gsap.timeline({
            defaults: { ease: "sine.out" }, // Changed to sine for smoother motion
            delay: delay,
        });

        switch (animationType) {
            case "slideLeft":
                tl.to(element, {
                    x: 0,
                    opacity: 1,
                    rotation: 0,
                    duration: 1.4, // Increased duration
                    ease: "expo.out", // Smoother easing
                }).to(
                    element,
                    {
                        x: 10, // Gentle overshoot
                        duration: 0.4,
                        yoyo: true,
                        repeat: 1,
                    },
                    "-=0.3"
                ); // Overlap with previous animation
                break;

            case "slideRight":
                tl.to(element, {
                    x: 0,
                    opacity: 1,
                    rotation: 0,
                    duration: 1.9, // Increased duration
                    ease: "expo.out",
                }).to(
                    element,
                    {
                        x: -10, // Opposite overshoot
                        duration: 0.4,
                        yoyo: true,
                        repeat: 1,
                    },
                    "-=0.3"
                );
                break;

            case "fadeUp":
                tl.to(element, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "circ.out", // Different easing for vertical motion
                });
                break;

            default:
                tl.to(element, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                });
        }

        return () => {
            tl.kill();
        };
    }, [animationType, delay]);

    return React.cloneElement(children, { ref });
};
