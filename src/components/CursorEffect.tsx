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

    const dotX = useSpring(x, { damping: 28, stiffness: 800, mass: 0.5 });
    const dotY = useSpring(y, { damping: 28, stiffness: 800, mass: 0.5 });
    const ringX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.8 });
    const ringY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.8 });

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
                className="custom-cursor fixed top-0 left-0 w-4 h-4 -ml-2 -mt-2 bg-brand/80 dark:bg-brand/50 rounded-full pointer-events-none z-[999] mix-blend-multiply dark:mix-blend-screen"
                style={{ x: dotX, y: dotY }}
            />

            {/* Trailing cursor ring */}
            <motion.div
                aria-hidden
                className="custom-cursor fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border-2 border-brand/60 dark:border-brand/30 rounded-full pointer-events-none z-[999]"
                style={{ x: ringX, y: ringY }}
            />
        </>
    );
};
