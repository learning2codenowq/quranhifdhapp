import React from 'react';

export const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.data === nextProps.data
  );
};

export const memoizeComponent = (Component, customComparison = null) => {
  if (customComparison) {
    return React.memo(Component, customComparison);
  }
  return React.memo(Component);
};

export default {
  arePropsEqual,
  memoizeComponent,
};