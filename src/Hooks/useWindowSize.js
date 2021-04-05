
import { useState, useEffect } from 'react';

function getWindowSize() {
    const { innerWidth: width, innerHeight: height} = window;
    return { width, height };
}

function useWindowSize(){
    const [ windowSize, setWindowSize ] = useState(getWindowSize());
    const [ lastResize, setLastResize ] = useState(new Date().getTime());

    useEffect(() => {
        function handleResize(){
            const now = new Date().getTime();
            if((now-lastResize) > 100){
                setWindowSize(getWindowSize());
                setLastResize(now);
            }
            
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [lastResize]);

    return windowSize;
}

export default useWindowSize;