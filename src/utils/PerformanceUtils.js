import { InteractionManager } from 'react-native';

export class PerformanceUtils {
  static runAfterInteractions(callback) {
    return InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(callback);
    });
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  static optimizeListRendering(data, renderItem, keyExtractor) {
    return {
      data,
      renderItem,
      keyExtractor,
      removeClippedSubviews: true,
      maxToRenderPerBatch: 10,
      updateCellsBatchingPeriod: 50,
      initialNumToRender: 10,
      windowSize: 10,
      getItemLayout: (data, index) => ({
        length: 120, // Estimated item height
        offset: 120 * index,
        index,
      }),
    };
  }

  static memoizeComponent(Component) {
    return React.memo(Component, (prevProps, nextProps) => {
      // Custom comparison logic
      return JSON.stringify(prevProps) === JSON.stringify(nextProps);
    });
  }
}