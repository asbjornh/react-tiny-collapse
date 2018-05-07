import React from "react";
import PropTypes from "prop-types";

class Collapse extends React.Component {
  static propTypes = {
    animateChildren: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    component: PropTypes.string,
    duration: PropTypes.number,
    easing: PropTypes.string,
    forceInitialAnimation: PropTypes.bool,
    isOpen: PropTypes.bool,
    unmountClosed: PropTypes.bool
  };

  static defaultProps = {
    animateChildren: true,
    component: "div",
    duration: 500,
    easing: "cubic-bezier(0.3,0,0,1)",
    forceInitialAnimation: false,
    isOpen: false,
    unmountClosed: true
  };

  state = {
    children: this.props.children,
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
    this.setState(
      { height: this.previousHeight, isAnimating: true, shouldAnimate: false },
      () => {
        this.previousHeight = newHeight;
        this.raf = requestAnimationFrame(() => {
          this.raf = requestAnimationFrame(() => {
            this.setState({ height: newHeight }, () => {
              this.timer = setTimeout(() => {
                this.setState({
                  height: this.props.isOpen ? null : 0,
                  isAnimating: false
                });
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
    const childrenDidChange = nextProps.children !== prevState.children;
    const animateChildren =
      !prevState.isAnimating && nextProps.animateChildren && childrenDidChange;
    const openDidChange = nextProps.isOpen !== prevState.isOpen;
    const { forceInitialAnimation, isOpen } = nextProps;
    const forceAnimation =
      !prevState.isMounted && forceInitialAnimation && isOpen;

    return {
      children: nextProps.children,
      isOpen: nextProps.isOpen,
      shouldAnimate: animateChildren || openDidChange || forceAnimation
    };
  }

  componentDidUpdate(prevProps) {
    const childrenDidChange = prevProps.children !== this.props.children;

    if (this.state.shouldAnimate) {
      this.transition();
    } else if (childrenDidChange && !this.state.isAnimating) {
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
      {
        className: this.props.className,
        onTransitionEnd: this.onTransitionEnd,
        ref: el => (this.wrapper = el),
        style: {
          height: this.state.height,
          overflow: isAnimating || !isOpen || initiallyHidden ? "hidden" : null,
          visibility:
            (!isAnimating && !isOpen) || initiallyHidden ? "hidden" : null,
          transition:
            isAnimating || initiallyHidden
              ? `height ${this.props.duration}ms ${this.props.easing}`
              : null
        }
      },
      shouldMount && this.props.children
    );
  }
}

export default Collapse;
