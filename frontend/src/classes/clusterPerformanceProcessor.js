
class ClusterPerformanceProcessor {
  constructor() {
    this.lastSnapshot = null;
    this.currentSnapshot = null;
  }

  /**
   * Process a new snapshot of metrics data
   * @param {Object} snapshot - The JSON snapshot data
   */
  processSnapshot(snapshot) {
    // Move current snapshot to last snapshot if it exists
    if (this.currentSnapshot) {
      this.lastSnapshot = this.currentSnapshot;
    }
    
    this.currentSnapshot = snapshot;
    
    // Process the metrics if we have two snapshots
    if (this.lastSnapshot && this.currentSnapshot) {
      this._processMetrics();
    }
  }

  /**
   * Process metrics according to rules
   * @private
   */
  _processMetrics() {
    // Calculate the time difference in seconds
    const lastTimestamp = new Date(this.lastSnapshot.timestamp);
    const currentTimestamp = new Date(this.currentSnapshot.timestamp);
    const deltaSeconds = (currentTimestamp - lastTimestamp) / 1000;
    
    if (deltaSeconds <= 0) {
      console.error('Invalid time difference between snapshots');
      return;
    }
    
    // Process each node in the current snapshot
    this.processedData = this.currentSnapshot.dataset.map(currentNode => {
      // Find corresponding node in the previous snapshot
      const lastNode = this.lastSnapshot.dataset.find(n => n.node === currentNode.node);
      
      if (!lastNode) {
        return this._processNewNode(currentNode);
      }
      
      // Process each counter according to its type
      const processedCounters = {};
      
      currentNode.counters.forEach(counter => {
        const { name, value, type } = counter;
        
        // Type 1: Calculate rate using delta and time difference
        if (type === 1) {
          const lastCounter = lastNode.counters.find(c => c.name === name);
          if (lastCounter) {
            processedCounters[name] = (value - lastCounter.value) / deltaSeconds;
          } else {
            // If counter doesn't exist in previous snapshot, can't calculate rate
            processedCounters[name] = 0;
          }
        }
        // Type 2 & 3: Take value from current snapshot
        else if (type === 2 || type === 3) {
          processedCounters[name] = value;
        }
      });
      
      return {
        node: currentNode.node,
        ...processedCounters
      };
    });
  }
  
  /**
   * Process a new node that wasn't in the previous snapshot
   * @private
   */
  _processNewNode(node) {
    const processedCounters = {};
    
    node.counters.forEach(counter => {
      const { name, value, type } = counter;
      // For new nodes, type 1 values are set to 0 (can't calculate rate)
      if (type === 1) {
        processedCounters[name] = 0;
      } else {
        processedCounters[name] = value;
      }
    });
    
    return {
      node: node.node,
      ...processedCounters
    };
  }

  /**
   * Get metrics at node level
   * @returns {Array} Array of node level metrics
   */
  getNodeLevelMetrics() {
    if (!this.processedData) {
      return [];
    }
    
    return this.processedData;
  }

  /**
   * Get metrics at cluster level (summarized)
   * @returns {Object} Summarized metrics for type 1 and 2
   */
  getClusterLevelMetrics() {
    if (!this.processedData) {
      return {};
    }
    
    // Only summarize numeric values (type 1 and 2)
    const summarizedMetrics = {};
    
    this.processedData.forEach(node => {
      Object.keys(node).forEach(key => {
        // Skip the node name
        if (key === 'node') return;
        
        // Find the original counter to check its type
        const nodeData = this.currentSnapshot.dataset.find(n => n.node === node.node);
        if (!nodeData) return;
        
        const counter = nodeData.counters.find(c => c.name === key);
        if (!counter) return;
        
        // Only summarize type 1 and 2 (numeric values)
        if (counter.type === 1 || counter.type === 2) {
          if (!summarizedMetrics[key]) {
            summarizedMetrics[key] = 0;
          }
          summarizedMetrics[key] += node[key];
        }
      });
    });
    
    return [summarizedMetrics];
  }
}

module.exports = { ClusterPerformanceProcessor };