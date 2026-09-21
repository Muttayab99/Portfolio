import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor. Only mounted for fine-pointer devices (see index.css, which
 * also hides the native cursor under the same media query). Uses motion values
 * so mouse movement never triggers a React re-render.
 */
export const CursorEffect = () => {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);

    // Dot is bound straight to the pointer (zero lag); only the ring trails.
    const ringX = useSpring(x, { damping: 40, stiffness: 900, mass: 0.4 });
    const ringY = useSpring(y, { damping: 40, stiffness: 900, mass: 0.4 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };
        window.addEventListener('mousemove', move, { passive: true });
        return () => window.removeEventListener('mousemove', move);
    }, [x, y]);

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                aria-hidden
                className="custom-cursor fixed top-0 left-0 w-3 h-3 -ml-1.5 -mt-1.5 bg-brand rounded-full pointer-events-none z-[999] will-change-transform"
                style={{ x, y }}
            />

            {/* Trailing cursor ring */}
            <motion.div
                aria-hidden
                className="custom-cursor fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border-2 border-brand/50 rounded-full pointer-events-none z-[999] will-change-transform"
                style={{ x: ringX, y: ringY }}
            />
        </>
    );
};
