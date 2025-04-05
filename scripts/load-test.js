#!/usr/bin/env node

/**
 * Load testing script for ReefQ
 * Uses autocannon for HTTP load testing
 * 
 * Usage:
 * npm install -g autocannon
 * node scripts/load-test.js
 */

const autocannon = require('autocannon');
const { join } = require('path');
const fs = require('fs');

// Configuration
const BASE_URL = process.env.LOAD_TEST_URL || 'http://localhost:3000';
const DURATION = parseInt(process.env.LOAD_TEST_DURATION || '30', 10); // seconds
const CONNECTIONS = parseInt(process.env.LOAD_TEST_CONNECTIONS || '100', 10);
const PIPELINING = parseInt(process.env.LOAD_TEST_PIPELINING || '10', 10);
const REPORT_DIR = join(process.cwd(), 'load-test-reports');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Generate timestamp for report file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportFile = join(REPORT_DIR, `load-test-report-${timestamp}.json`);

// Endpoints to test
const endpoints = [
  '/',                     // Homepage
  '/api/healthcheck',      // API healthcheck
  '/jewelry',              // Jewelry page
  '/try-and-fit',          // Try-on page
  '/customize'             // Customization page
];

// Sequential test runner
async function runTests() {
  console.log(`🚀 Starting load tests against ${BASE_URL}`);
  console.log(`⚙️  Duration: ${DURATION}s, Connections: ${CONNECTIONS}, Pipelining: ${PIPELINING}`);
  
  const results = {};
  
  for (const endpoint of endpoints) {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`\n📊 Testing endpoint: ${endpoint}`);
    
    try {
      const result = await runTest(url);
      results[endpoint] = result;
      
      console.log(`✅ Completed test for ${endpoint}`);
      console.log(`   Requests/sec: ${Math.floor(result.requests.average)}`);
      console.log(`   Latency: ${result.latency.average.toFixed(2)}ms (avg), ${result.latency.p99.toFixed(2)}ms (p99)`);
      console.log(`   Status codes: ${JSON.stringify(result.statusCodeStats)}`);
    } catch (error) {
      console.error(`❌ Error testing ${endpoint}:`, error.message);
      results[endpoint] = { error: error.message };
    }
  }
  
  // Save results to file
  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
  console.log(`\n📝 Report saved to ${reportFile}`);
  
  // Analyze results
  analyzeResults(results);
}

// Run a single test
function runTest(url) {
  return new Promise((resolve, reject) => {
    const instance = autocannon({
      url,
      connections: CONNECTIONS,
      duration: DURATION,
      pipelining: PIPELINING,
      headers: {
        'User-Agent': 'ReefQ Load Tester/1.0',
      },
    });
    
    instance.on('done', (result) => resolve(result));
    instance.on('error', (error) => reject(error));
    
    // Display realtime metrics
    autocannon.track(instance);
  });
}

// Analyze test results to provide recommendations
function analyzeResults(results) {
  console.log('\n🔍 Performance Analysis');
  
  // Identify slowest endpoint
  let slowestEndpoint = '';
  let maxLatency = 0;
  
  for (const [endpoint, result] of Object.entries(results)) {
    if (result.error) continue;
    
    if (result.latency.average > maxLatency) {
      maxLatency = result.latency.average;
      slowestEndpoint = endpoint;
    }
  }
  
  if (slowestEndpoint) {
    console.log(`⚠️  Slowest endpoint: ${slowestEndpoint} (${maxLatency.toFixed(2)}ms avg)`);
    
    // Provide recommendations
    if (maxLatency > 500) {
      console.log('   Recommendation: Consider server-side caching or optimizing database queries');
    } else if (maxLatency > 200) {
      console.log('   Recommendation: Review data fetching approach, consider streaming or incremental loading');
    } else {
      console.log('   Performance looks good! Continue monitoring over time.');
    }
  }
  
  // Check for error status codes
  for (const [endpoint, result] of Object.entries(results)) {
    if (result.error) {
      console.log(`❌ ${endpoint} failed completely`);
      continue;
    }
    
    const errorCodes = Object.keys(result.statusCodeStats).filter(code => parseInt(code, 10) >= 400);
    if (errorCodes.length > 0) {
      console.log(`⚠️  ${endpoint} returned error status codes: ${errorCodes.join(', ')}`);
    }
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error running load tests:', error);
  process.exit(1);
}); 