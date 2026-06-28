import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/use-mouse-position';

export const CursorEffect = () => {
    const { x, y } = useMousePosition();

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed w-4 h-4 bg-primary/80 dark:bg-primary/50 rounded-full pointer-events-none z-[999] hidden lg:block mix-blend-multiply dark:mix-blend-screen"
                animate={{ x: x - 8, y: y - 8 }}
                transition={{ type: 'spring', damping: 28, stiffness: 800, mass: 0.5 }}
            />

            {/* Trailing cursor ring */}
            <motion.div
                className="fixed w-8 h-8 border-2 border-primary/60 dark:border-primary/30 rounded-full pointer-events-none z-[999] hidden lg:block"
                animate={{ x: x - 16, y: y - 16 }}
                transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
            />
        </>
    );
};
