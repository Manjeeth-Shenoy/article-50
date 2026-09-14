import { createContext, useContext, useState, useRef, Children } from 'react';

const TabsContext = createContext(null);

function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const idBase = useRef(`bs-tabs-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex, idBase }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabList({ children, 'aria-label': ariaLabel }) {
  const { activeIndex, setActiveIndex, idBase } = useContext(TabsContext);
  const count = Children.count(children);
  const buttonRefs = useRef([]);

  const focusTab = (index) => {
    const nextIndex = (index + count) % count;
    setActiveIndex(nextIndex);
    buttonRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTab(count - 1);
    }
  };

  return (
    <div className="bs-tabs" role="tablist" aria-label={ariaLabel}>
      {Children.map(children, (child, index) => (
        <button
          ref={(el) => { buttonRefs.current[index] = el; }}
          type="button"
          role="tab"
          id={`${idBase}-tab-${index}`}
          aria-selected={activeIndex === index}
          aria-controls={`${idBase}-panel-${index}`}
          tabIndex={activeIndex === index ? 0 : -1}
          className={`bs-tab${activeIndex === index ? ' bs-tab--active' : ''}`}
          onClick={() => setActiveIndex(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {child}
        </button>
      ))}
    </div>
  );
}

function Tab({ children }) {
  return children;
}

function TabPanels({ children }) {
  const { activeIndex, idBase } = useContext(TabsContext);
  return Children.map(children, (child, index) => (
    <div
      id={`${idBase}-panel-${index}`}
      role="tabpanel"
      aria-labelledby={`${idBase}-tab-${index}`}
      hidden={activeIndex !== index}
    >
      {child}
    </div>
  ));
}

function TabPanel({ children }) {
  return children;
}

export { Tabs, TabList, Tab, TabPanels, TabPanel };
