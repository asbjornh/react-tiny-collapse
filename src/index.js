import React from "react";
import PropTypes from "prop-types";

class Collapse extends React.Component {
  static propTypes = {
    animateChildren: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    component: PropTypes.string,
    componentProps: PropTypes.object,
    duration: PropTypes.number,
    easing: PropTypes.string,
    forceInitialAnimation: PropTypes.bool,
    isOpen: PropTypes.bool,
    onMeasure: PropTypes.func,
    unmountClosed: PropTypes.bool
  };

  static defaultProps = {
    animateChildren: true,
    component: "div",
    duration: 500,
    easing: "cubic-bezier(0.3,0,0,1)",
    forceInitialAnimation: false,
    isOpen: false,
    onMeasure: () => {},
    unmountClosed: true
  };

  state = {
    height: this.props.forceInitialAnimation || !this.props.isOpen ? 0 : null,
    isAnimating: false,
    isMounted: false,
    isOpen: this.props.isOpen
  };

  previousHeight = 0;
  raf = null;
  timer = null;

  getHeight = () => {
    const child = this.wrapper && this.wrapper.firstElementChild;
    return child ? Math.max(child.offsetHeight - 1, 0) : 0; // - 1px to avoid jump after transition
  };

  transition = () => {
    const newHeight = this.props.isOpen ? this.getHeight() : 0;

    clearTimeout(this.timer);
    cancelAnimationFrame(this.raf);
    this.isAnimating = true;
    this.setState(
      { height: this.previousHeight, isAnimating: true, shouldAnimate: false },
      () => {
        this.previousHeight = newHeight;
        this.raf = requestAnimationFrame(() => {
          this.raf = requestAnimationFrame(() => {
            this.setState({ height: newHeight }, () => {
              this.timer = setTimeout(() => {
                this.setState(
                  {
                    height: this.props.isOpen ? null : 0,
                    isAnimating: false
                  },
                  () => {
                    this.isAnimating = false;
                  }
                );
              }, this.props.duration);
            });
          });
        });
      }
    );
  };

  componentDidMount() {
    this.setState({ isMounted: true }, () => {
      if (this.props.forceInitialAnimation) {
        this.transition();
      } else {
        this.previousHeight = this.props.isOpen ? this.getHeight() : 0;
        this.setState({ isAnimating: false });
      }
    });
  }

  onTransitionEnd = () => {
    this.previousHeight = this.getHeight();
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const openDidChange = nextProps.isOpen !== prevState.isOpen;
    const forceAnimation =
      !prevState.isMounted &&
      nextProps.forceInitialAnimation &&
      nextProps.isOpen;

    return {
      isOpen: nextProps.isOpen,
      shouldAnimate: openDidChange || forceAnimation
    };
  }

  getSnapshotBeforeUpdate() {
    return this.props.isOpen ? this.getHeight() : 0;
  }

  componentDidUpdate(prevProps, prevState, prevHeight) {
    if (this.isAnimating && !this.state.shouldAnimate) {
      return;
    }

    const newHeight = this.getHeight();
    const childrenDidChange = newHeight !== prevHeight;
    this.props.onMeasure(newHeight);

    if (
      this.state.shouldAnimate ||
      (childrenDidChange && this.props.animateChildren)
    ) {
      this.transition();
    } else if (childrenDidChange) {
      this.previousHeight = this.getHeight();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.raf);
  }

  render() {
    const { isAnimating, isMounted } = this.state;
    const { forceInitialAnimation, isOpen, unmountClosed } = this.props;
    const shouldMount = unmountClosed ? isOpen || isAnimating : true;
    const initiallyHidden = !isMounted && forceInitialAnimation && isOpen;

    return React.createElement(
      this.props.component,
      Object.assign({}, this.props.componentProps, {
        className: this.props.className,
        onTransitionEnd: this.onTransitionEnd,
        ref: el => (this.wrapper = el),
        style: {
          ...this.props.componentProps.style,
          height: this.state.height,
          overflow: isAnimating || !isOpen || initiallyHidden ? "hidden" : null,
          visibility:
            (!isAnimating && !isOpen) || initiallyHidden ? "hidden" : null,
          transition:
            isAnimating || initiallyHidden
              ? `height ${this.props.duration}ms ${this.props.easing}`
              : null
        }
      }),
      shouldMount && this.props.children
    );
  }
}

export default Collapse;
