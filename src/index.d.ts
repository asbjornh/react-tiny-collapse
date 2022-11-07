import React from "react";

declare class TinyCollapse<
  T extends React.ElementType = "div"
> extends React.Component<{
  /** Animates height when `children` changes (set to `false` when nesting collapses) */
  animateChildren?: boolean;
  /** Stuff you want to expand / collapse (**one root node only**) */
  children?: React.ReactNode;
  className?: string;
  /** Type of element used for the wrapper node.
   * If a function component is used it _must_ use `React.forwardRef` */
  component?: T;
  /**Additional props passed to the wrapper component.
   * If `componentProps` includes a `style` property, some individual styles may be overridden by the inline styles set by `react-tiny-collapse`. */
  componentProps?: React.ComponentProps<T>;
  /** Transition duration (milliseconds) */
  duration?: number;
  /** CSS easing function */
  easing?: string;
  /** Force animation when TinyCollapse mounts open */
  forceInitialAnimation?: boolean;
  isOpen?: boolean;
  /** Called whenever TinyCollapse measures height */
  onMeasure?: (height: number) => void;
  /** Unmounts children when closed */
  unmountChildren?: boolean;
}> {}
export default TinyCollapse;
