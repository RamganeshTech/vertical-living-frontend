
import React, { useState, useRef, useEffect } from 'react';

type InfoTooltipProps = {
    content: string;
    type?: 'info' | 'warning';
    position?: 'top' | 'bottom' | 'left' | 'right';
};

const InfoTooltip: React.FC<InfoTooltipProps> = ({
    content,
    type = 'info',
    position = 'top'
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isSticky &&
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target as Node)
            ) {
                setIsSticky(false);
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSticky]);

    const handleMouseEnter = (): void => {
        if (!isSticky) {
            setIsVisible(true);
        }
    };

    const handleMouseLeave = (): void => {
        if (!isSticky) {
            setIsVisible(false);
        }
    };

    const handleClick = (): void => {
        setIsSticky(!isSticky);
        setIsVisible(!isSticky);
    };

    const handleClose = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsSticky(false);
        setIsVisible(false);
    };

    const getSymbol = (): string => {
        return type === 'info' ? '?' : '!';
    };

    const getPositionClasses = (): string => {
        const baseClasses = "absolute z-50 transform";

        switch (position) {
            case 'top':
                return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-1`;
            case 'bottom':
                return `${baseClasses} top-full left-1/2 -translate-x-1/2 translate-y-1 mt-1`;
            case 'left':
                return `${baseClasses} right-full top-1/2 -translate-y-1/2 -translate-x-1 mr-1`;
            case 'right':
                return `${baseClasses} left-full top-1/2 -translate-y-1/2 translate-x-1 ml-1`;
            default:
                return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 -translate-y-1 mb-1`;
        }
    };

    const getTriggerClasses = (): string => {
        const baseClasses = `
      w-4 h-4 rounded-full flex items-center justify-center 
      font-medium cursor-pointer transition-all duration-200 
      border border-blue-500 bg-transparent hover:bg-blue-50
      text-xs
    `;

        return `${baseClasses} ${isSticky
            ? 'bg-blue-50 ring-1 ring-blue-400 text-blue-600'
            : 'text-blue-500 hover:text-blue-600'
            }`;
    };

    return (
        <div className="inline-block relative mx-1" ref={tooltipRef}>
            <button
                className={getTriggerClasses()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                aria-label="More information"
                type="button"
            >
                {getSymbol()}
            </button>

            {(isVisible || isSticky) && (
                <div className={getPositionClasses()}>
                    <div className={`
            bg-white text-gray-700 px-2 py-1 rounded-md shadow-lg border border-gray-200
            text-xs leading-relaxed break-words whitespace-normal
            
!min-w-[100px] sm:!min-w-[150px] md:!min-w-[200px]
!max-w-[400px] sm:!max-w-[500px] md:!max-w-[600px]
            ${isSticky ? 'border-blue-300 ring-1 ring-blue-200' : ''}
          `}>
                        <div className="flex items-start gap-1">
                            <div className="flex-1 break-words">
                                {content}
                            </div>
                            {isSticky && (
                                <button
                                    className="
                                    cursor-pointer
                    flex-shrink-0 w-3 h-3 md:w-3.5 md:h-3.5
                    bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700
                    rounded flex items-center justify-center 
                    text-[10px] font-bold transition-colors border-0
                  "
                                    onClick={handleClose}
                                    aria-label="Close tooltip"
                                    type="button"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Tooltip arrow */}
                        <div className={`
              absolute w-1.5 h-1.5 bg-white border border-gray-200 transform rotate-45
              ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-0.5 border-t-0 border-l-0' : ''}
              ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-0.5 border-b-0 border-r-0' : ''}
              ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-0.5 border-b-0 border-l-0' : ''}
              ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 translate-x-0.5 border-t-0 border-r-0' : ''}
            `} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;