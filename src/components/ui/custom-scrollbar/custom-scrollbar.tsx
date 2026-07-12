import React, {
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import styles from './custom-scrollbar.module.css';

type TCustomScrollbarProps = {
  as?: 'div' | 'ul';
  className?: string;
  wrapperClassName?: string;
  children: ReactNode;
};

type TScrollbarState = {
  isVisible: boolean;
  thumbHeight: number;
  thumbTop: number;
};

export const CustomScrollbar: FC<TCustomScrollbarProps> = ({
  as = 'div',
  className = '',
  wrapperClassName = '',
  children
}) => {
  const scrollRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{
    startY: number;
    startScrollTop: number;
  } | null>(null);
  const [scrollbar, setScrollbar] = useState<TScrollbarState>({
    isVisible: false,
    thumbHeight: 0,
    thumbTop: 0
  });

  const updateScrollbar = useCallback(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = element;
    const maxScrollTop = scrollHeight - clientHeight;

    if (maxScrollTop <= 0) {
      setScrollbar({
        isVisible: false,
        thumbHeight: 0,
        thumbTop: 0
      });
      return;
    }

    const proportionalThumbHeight =
      (clientHeight / scrollHeight) * clientHeight;
    const mockupThumbHeight = clientHeight * 0.72;
    const thumbHeight = Math.min(
      clientHeight,
      Math.max(proportionalThumbHeight, mockupThumbHeight)
    );
    const maxThumbTop = clientHeight - thumbHeight;
    const thumbTop = (scrollTop / maxScrollTop) * maxThumbTop;

    setScrollbar({
      isVisible: true,
      thumbHeight,
      thumbTop
    });
  }, []);

  const setScrollNode = useCallback(
    (node: HTMLElement | null) => {
      scrollRef.current = node;
      updateScrollbar();
    },
    [updateScrollbar]
  );

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return undefined;
    }

    updateScrollbar();
    const animationFrame = window.requestAnimationFrame(updateScrollbar);

    element.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', updateScrollbar);

    let resizeObserver: ResizeObserver | undefined;

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateScrollbar);
      resizeObserver.observe(element);
      Array.from(element.children).forEach((child) => {
        resizeObserver?.observe(child);
      });
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      element.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
      resizeObserver?.disconnect();
    };
  }, [children, updateScrollbar]);

  const moveScrollByDrag = useCallback(
    (clientY: number) => {
      const element = scrollRef.current;
      const drag = dragRef.current;

      if (!element || !drag) {
        return;
      }

      const maxScrollTop = element.scrollHeight - element.clientHeight;
      const maxThumbTop = element.clientHeight - scrollbar.thumbHeight;

      if (maxThumbTop <= 0) {
        return;
      }

      const deltaY = clientY - drag.startY;
      element.scrollTop =
        drag.startScrollTop + (deltaY / maxThumbTop) * maxScrollTop;
    },
    [scrollbar.thumbHeight]
  );

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      moveScrollByDrag(event.clientY);
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    const element = scrollRef.current;

    if (!element) {
      return undefined;
    }

    const handleMouseDown = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.dataset.scrollbarThumb) {
        return;
      }

      event.preventDefault();
      dragRef.current = {
        startY: event.clientY,
        startScrollTop: element.scrollTop
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [moveScrollByDrag]);

  const handleTrackClick = (event: MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element || event.target !== event.currentTarget) {
      return;
    }

    const trackTop = event.currentTarget.getBoundingClientRect().top;
    const clickTop = event.clientY - trackTop;

    if (clickTop < scrollbar.thumbTop) {
      element.scrollTop -= element.clientHeight;
    } else {
      element.scrollTop += element.clientHeight;
    }
  };

  const contentClassName = `${className} ${styles.content}`.trim();
  const wrapperClassNames = `${styles.wrapper} ${wrapperClassName}`.trim();

  return (
    <div className={wrapperClassNames}>
      {as === 'ul' ? (
        <ul ref={setScrollNode} className={contentClassName}>
          {children}
        </ul>
      ) : (
        <div ref={setScrollNode} className={contentClassName}>
          {children}
        </div>
      )}
      {scrollbar.isVisible && (
        <div className={styles.track} onMouseDown={handleTrackClick}>
          <div
            className={styles.thumb}
            data-scrollbar-thumb='true'
            style={{
              height: `${scrollbar.thumbHeight}px`,
              transform: `translateY(${scrollbar.thumbTop}px)`
            }}
          />
        </div>
      )}
    </div>
  );
};
