import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Logger } from '../utils/Logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Generate a unique error ID for tracking
    const errorId = Date.now().toString(36);
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error, errorInfo) {
    const { errorId } = this.state;
    
    // Log error details
    Logger.critical('ErrorBoundary caught an error:', {
      errorId,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Store error info for display
    this.setState({ errorInfo });

    // In production, you'd send this to a crash reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRestart = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    // Create error report
    const errorReport = {
      errorId,
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      componentStack: errorInfo?.componentStack || 'No component stack',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    Logger.critical('User requested error report:', errorReport);
    
    // In a real app, you might:
    // 1. Copy to clipboard
    // 2. Send via email
    // 3. Upload to error tracking service
    
    alert('Error details have been logged. Please contact support if this persists.');
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const isDevelopment = __DEV__;

      return (
        <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.card}>
              <Text style={styles.title}>Oops! Something went wrong</Text>
              
              <Text style={styles.message}>
                The app encountered an unexpected error. We apologize for the inconvenience.
              </Text>

              {isDevelopment && (
                <View style={styles.debugInfo}>
                  <Text style={styles.debugTitle}>Debug Information:</Text>
                  <Text style={styles.debugText}>Error ID: {errorId}</Text>
                  <Text style={styles.debugText}>
                    {error?.message || 'Unknown error'}
                  </Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={this.handleRestart}
                >
                  <Text style={styles.primaryButtonText}>Try Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={this.handleReportError}
                >
                  <Text style={styles.secondaryButtonText}>Report Issue</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.supportText}>
                If this problem persists, please restart the app or contact support.
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  debugInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#d4af37',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  supportText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ErrorBoundary;