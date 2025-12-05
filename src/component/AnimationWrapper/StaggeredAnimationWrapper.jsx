import gsap from "gsap";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export const StaggeredAnimationWrapper = ({
    children,
    selector,
    delay = 0,
}) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        const elements = ref.current.querySelectorAll(selector);
        if (!elements.length) return;

        // Set initial state with more natural starting position
        gsap.set(elements, {
            y: 30, // Increased from 20 for more noticeable movement
            opacity: 0,
            scale: 0.98, // Added subtle scaling for depth
        });

        // Create staggered animation with smoother timing
        const tl = gsap.timeline({
            defaults: {
                ease: "power3.out", // Smoother easing curve
            },
            delay: 0.9 + delay, // Increased delay for better sequencing
        });

        tl.to(elements, {
            y: 0,
            opacity: 1,
            scale: 1, // Added scale animation
            duration: 1, // Increased duration for smoother motion
            stagger: {
                each: 0.2, // Increased stagger time
                from: "start", // Consistent direction
                ease: "power2.inOut", // Stagger easing
            },
        });

        // Add a slight overshoot effect for more organic motion
        tl.to(
            elements,
            {
                y: -5,
                duration: 0.3,
                stagger: 0.15,
                repeat: 1,
                yoyo: true,
            },
            "-=0.5"
        ); // Overlap with previous animation

        return () => {
            tl.kill();
        };
    }, [selector, delay]);

    return <div ref={ref}>{children}</div>;
};

// Prop types validation
StaggeredAnimationWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    selector: PropTypes.string.isRequired,
    delay: PropTypes.number,
};
