import React from "react";
import PropTypes from "prop-types";

class Collapse extends React.Component {
  static propTypes = {
    animateChildren: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    component: PropTypes.string,
    forceInitialAnimation: PropTypes.bool,
    duration: PropTypes.number,
    isOpen: PropTypes.bool,
    unmountClosed: PropTypes.bool
  };

  static defaultProps = {
    animateChildren: true,
    component: "div",
    duration: 500,
    forceInitialAnimation: false,
    isOpen: false,
    unmountClosed: true
  };

  state = {
    height: this.props.forceInitialAnimation ? 0 : "",
    isAnimating: false,
    isMounted: false
  };

  previousHeight = 0;
  raf = null;
  timer = null;

  getHeight = () => {
    const child = this.wrapper && this.wrapper.firstElementChild;
    return child ? child.offsetHeight - 1 : 0; // - 1px to avoid jump after transition
  };

  transition = () => {
    const newHeight = this.props.isOpen ? this.getHeight() : 0;

    clearTimeout(this.timer);
    cancelAnimationFrame(this.raf);
    this.setState({ height: this.previousHeight }, () => {
      // this.previousHeight = newHeight;
      this.raf = requestAnimationFrame(() => {
        this.raf = requestAnimationFrame(() => {
          this.setState({ height: newHeight }, () => {
            this.timer = setTimeout(() => {
              this.setState({
                height: this.props.isOpen ? "" : 0,
                isAnimating: false
              });
            }, this.props.duration);
          });
        });
      });
    });
  };

  componentDidMount() {
    this.setState({ isMounted: true }, () => {
      if (this.props.forceInitialAnimation) {
        this.transition(this.props.children);
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
    return {
      children: nextProps.children,
      isAnimating:
        prevState.isMounted &&
        nextProps.children !== prevState.children &&
        (nextProps.animateChildren || nextProps.isOpen !== prevState.isOpen),
      isOpen: nextProps.isOpen
    };
  }

  componentDidUpdate(prevProps) {
    const childrenDidChange = prevProps.children !== this.props.children;

    if (childrenDidChange && this.state.isAnimating) {
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
    const { isAnimating } = this.state;
    const { isOpen, unmountClosed } = this.props;
    const shouldMount = unmountClosed ? isOpen || isAnimating : true;

    return React.createElement(
      this.props.component,
      {
        className: this.props.className,
        onTransitionEnd: this.onTransitionEnd,
        ref: el => (this.wrapper = el),
        style: {
          height: this.state.height,
          overflow: isAnimating || !isOpen ? "hidden" : "",
          visibility: !isAnimating && !isOpen ? "hidden" : ""
        }
      },
      shouldMount && this.props.children
    );
  }
}

export default Collapse;
