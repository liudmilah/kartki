import { useState, useEffect } from 'react';

export type TTindowSizeResult = {
    isMobile: boolean;
    width: number;
    height: number;
};

export default function useWindowSize(): TTindowSizeResult {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [height, setHeight] = useState<number>(window.innerHeight);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    return {
        isMobile: width <= 768,
        width,
        height,
    };
}
