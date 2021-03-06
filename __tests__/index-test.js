/* eslint react/prefer-stateless-function: 0 */
/* eslint react/no-multi-comp: 0 */
jest.disableAutomock().useRealTimers();

const React = require("react");
const ReactDOM = require("react-dom");
const TinyCollapse = require("../lib").default;
const TestUtils = require("react-dom/test-utils");

global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

class View extends React.Component {
  render() {
    return <div {...this.props} />;
  }
}

describe("TinyCollapse", () => {
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
  });

  it("should not crash", () => {
    expect(() =>
      TestUtils.renderIntoDocument(
        <TinyCollapse>
          <div />
        </TinyCollapse>
      )
    ).not.toThrow();
  });

  it("should render children initially when open", () => {
    const testComponent = TestUtils.renderIntoDocument(
      <TinyCollapse isOpen={true}>
        <View>{"foo"}</View>
      </TinyCollapse>
    );

    const elements = TestUtils.scryRenderedComponentsWithType(
      testComponent,
      View
    );

    expect(elements.length).toBe(1);
  });

  it("should render children with unmountChildren === false", () => {
    const testComponent = TestUtils.renderIntoDocument(
      <TinyCollapse isOpen={false} unmountChildren={false}>
        <View>{"foo"}</View>
      </TinyCollapse>
    );

    const elements = TestUtils.scryRenderedComponentsWithType(
      testComponent,
      View
    );

    expect(elements.length).toBe(1);
  });

  it("should not render children with unmountChildren === true", () => {
    const testComponent = TestUtils.renderIntoDocument(
      <TinyCollapse isOpen={false} unmountChildren={true}>
        <View>{"foo"}</View>
      </TinyCollapse>
    );

    const elements = TestUtils.scryRenderedComponentsWithType(
      testComponent,
      View
    );

    expect(elements.length).toBe(0);
  });

  it("should apply classname", () => {
    const testComponent = TestUtils.renderIntoDocument(
      <TinyCollapse className="collapse" />
    );
    const node = ReactDOM.findDOMNode(testComponent);

    expect(node.getAttribute("class")).toBe("collapse");
  });

  it("should render with string component", () => {
    const testComponent = TestUtils.renderIntoDocument(
      <TinyCollapse component="h2" />
    );
    const node = ReactDOM.findDOMNode(testComponent);

    expect(node.tagName).toBe("H2");
  });

  it("should render with function component", () => {
    const Comp = React.forwardRef(({ children }, ref) => (
      <em ref={ref}>{children}</em>
    ));

    const testComponent = TestUtils.renderIntoDocument(
      <TinyCollapse component={Comp} />
    );
    const node = ReactDOM.findDOMNode(testComponent);

    expect(node.tagName).toBe("EM");
  });

  it("should apply correct inline styles", () => {
    class TestComponent extends React.Component {
      state = {
        isOpen: false
      };

      render() {
        return (
          <TinyCollapse isOpen={this.state.isOpen} unmountChildren={false}>
            <View>{"foo"}</View>
          </TinyCollapse>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);
    const node = ReactDOM.findDOMNode(testComponent);

    expect(node.getAttribute("style")).toBe(
      "height: 0px; overflow: hidden; visibility: hidden;"
    );

    return new Promise(done => {
      setTimeout(() => {
        testComponent.setState(
          {
            isOpen: true
          },
          () => {
            setTimeout(() => {
              // In reality the height should be greater than 0 but there is no real DOM to measure here.
              expect(node.getAttribute("style")).toBe(
                "height: 0px; overflow: hidden; transition: height 500ms cubic-bezier(0.3,0,0,1);"
              );

              setTimeout(() => {
                expect(node.getAttribute("style")).toBe("");
                done();
              }, 400);
            }, 200);
          }
        );
      }, 100);
    });
  });

  it("should apply user styles but preserve animation styles", () => {
    class TestComponent extends React.Component {
      render() {
        return (
          <TinyCollapse
            isOpen={false}
            componentProps={{
              style: {
                height: 1000,
                marginTop: "100px",
                overflow: "visible",
                visibility: "visible"
              }
            }}
            unmountChildren={false}
          >
            <View>{"foo"}</View>
          </TinyCollapse>
        );
      }
    }

    const testComponent = TestUtils.renderIntoDocument(<TestComponent />);
    const node = ReactDOM.findDOMNode(testComponent);

    expect(node.getAttribute("style")).toBe(
      "height: 0px; margin-top: 100px; overflow: hidden; visibility: hidden;"
    );
  });
});
