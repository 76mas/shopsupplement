const Container = ({ className, children }) => {
  return <div className={`max-w-6xl w-full px-5  ${className}`}>{children}</div>;
};

export default Container;
