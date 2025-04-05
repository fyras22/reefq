import mongoose, { Connection, ConnectOptions } from 'mongoose';

// Connection state tracking
type ConnectionState = {
  isConnected: number;
  readyState?: mongoose.ConnectionStates;
  lastConnectedAt?: Date;
  uri?: string;
  totalConnections: number;
  errors: Error[];
};

// Cache states
const states: ConnectionState = {
  isConnected: 0,
  totalConnections: 0,
  errors: [],
};

// Set strict query mode globally
mongoose.set('strictQuery', true);

// Connection options
const connectionOptions: ConnectOptions = {
  // Buffer commands until connection is established
  bufferCommands: true,
  
  // Connection timeout in ms
  connectTimeoutMS: 10000,
  
  // Enable automatic index creation
  autoIndex: true,
  
  // Connection pool size
  maxPoolSize: 10,
  
  // Minimum connection pool size
  minPoolSize: 1,
  
  // How long a connection can be idle before being removed (in ms)
  socketTimeoutMS: 45000,
  
  // Time in ms the server will wait for new connections
  // Don't set too low or connections might time out
  serverSelectionTimeoutMS: 30000,
  
  // Time in ms the driver will wait before retrying an operation
  heartbeatFrequencyMS: 10000,
  
  // Enable request compression (using the correct property name)
  compressors: 'zlib',
  
  // Required for MongoDB Server 4.1+
  authSource: 'admin',
};

// Global store for connection state
const globalMongoose = global as unknown as {
  mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
};

// Initialize the global connection store
if (!globalMongoose.mongoose) {
  globalMongoose.mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB with connection pooling and timeouts.
 * Reuses existing connection if one exists.
 */
export async function connectToDatabase(): Promise<Connection> {
  // If we're already connected, return the existing connection
  if (states.isConnected === 1) {
    console.log('Using existing connection');
    return mongoose.connection;
  }

  // Record connection attempts for telemetry
  states.totalConnections++;
  const startTime = Date.now();
  
  // Get the MongoDB URI from environment variables
  const MONGODB_URI = process.env.MONGODB_URI || '';
  
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  try {
    // If we have an existing connection but different state, close it
    if (mongoose.connections.length > 0) {
      const readyState = mongoose.connection.readyState;
      
      if (readyState === 1) {
        console.log('Using existing MongoDB connection');
        states.isConnected = 1;
        states.lastConnectedAt = new Date();
        return mongoose.connection;
      }
      
      if (readyState !== 0) {
        await mongoose.disconnect();
        console.log('Closed previous MongoDB connection');
      }
    }
    
    // Store the URI for reconnect attempts
    states.uri = MONGODB_URI;
    
    // Make the connection
    const connection = await mongoose.connect(MONGODB_URI, connectionOptions);
    
    // Update state
    states.isConnected = 1;
    states.readyState = connection.connection.readyState;
    states.lastConnectedAt = new Date();
    
    // Setup event listeners
    setupConnectionEventHandlers(connection.connection);

    console.log(`MongoDB connected in ${Date.now() - startTime}ms`);
    return connection.connection;
  } catch (error) {
    // Track errors for telemetry
    states.isConnected = 0;
    states.errors.push(error as Error);
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  // Only attempt to disconnect if we have an active connection
  if (states.isConnected === 1) {
    try {
      await mongoose.disconnect();
      states.isConnected = 0;
      states.readyState = 0;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}

/**
 * Setup event handlers for the MongoDB connection
 */
function setupConnectionEventHandlers(connection: Connection): void {
  // Connection successful
  connection.on('connected', () => {
    console.log('MongoDB connection established');
    states.isConnected = 1;
  });
  
  // Connection disconnected
  connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
    states.isConnected = 0;
  });
  
  // Connection error
  connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    states.errors.push(err);
    
    // Try to reconnect on error
    if (states.uri && states.isConnected !== 1) {
      setTimeout(() => {
        console.log('Attempting to reconnect to MongoDB...');
        mongoose.connect(states.uri!, connectionOptions).catch(console.error);
      }, 5000); // Wait 5 seconds before trying to reconnect
    }
  });
  
  // Process termination cleanup
  process.on('SIGINT', async () => {
    await disconnectFromDatabase();
    process.exit(0);
  });
}

/**
 * Get the current connection state
 */
export function getConnectionState(): ConnectionState {
  return {
    ...states,
    // Don't expose the connection URI for security reasons
    uri: states.uri ? '***************' : undefined,
  };
}

/**
 * Pause a connection for a period
 */
export async function pauseConnection(durationMs: number = 5000): Promise<void> {
  if (states.isConnected === 1 && mongoose.connection.db) {
    try {
      await mongoose.connection.db.command({ fsync: 1 });
      await mongoose.connection.close(false);
      states.isConnected = 0;
      
      // Reopen after duration
      setTimeout(async () => {
        if (states.uri) {
          await mongoose.connect(states.uri, connectionOptions);
          states.isConnected = 1;
          console.log('MongoDB connection resumed');
        }
      }, durationMs);
      
      console.log(`MongoDB connection paused for ${durationMs}ms`);
    } catch (error) {
      console.error('Error pausing MongoDB connection:', error);
    }
  }
}

/**
 * Get MongoDB connection statistics
 */
export async function getMongoStats(): Promise<any> {
  if (states.isConnected !== 1 || !mongoose.connection.db) {
    throw new Error('Cannot get stats: MongoDB not connected');
  }
  
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      ...stats,
      connectionState: states,
      version: mongoose.version,
    };
  } catch (error) {
    console.error('Error getting MongoDB stats:', error);
    throw error;
  }
}

/**
 * Enable profiling for performance monitoring
 */
export async function enableProfiling(level: 0 | 1 | 2 = 1): Promise<any> {
  // 0 = off, 1 = slow queries, 2 = all queries
  if (states.isConnected !== 1 || !mongoose.connection.db) {
    throw new Error('Cannot enable profiling: MongoDB not connected');
  }
  
  try {
    return await mongoose.connection.db.command({ profile: level });
  } catch (error) {
    console.error('Error enabling MongoDB profiling:', error);
    throw error;
  }
}

/**
 * Get profiling information
 */
export async function getProfilingData(): Promise<any[]> {
  if (states.isConnected !== 1 || !mongoose.connection.db) {
    throw new Error('Cannot get profiling data: MongoDB not connected');
  }
  
  try {
    return await mongoose.connection.db
      .collection('system.profile')
      .find({})
      .sort({ ts: -1 })
      .limit(100)
      .toArray();
  } catch (error) {
    console.error('Error getting MongoDB profiling data:', error);
    throw error;
  }
}

/**
 * Run a health check on the MongoDB connection
 */
export async function runHealthCheck(): Promise<{
  status: 'connected' | 'disconnected' | 'error';
  ping?: number;
  error?: string;
  version?: string;
}> {
  try {
    if (states.isConnected !== 1 || !mongoose.connection.db) {
      return { status: 'disconnected' };
    }
    
    // Start timing the ping
    const startTime = Date.now();
    
    // Run a simple command to test the connection
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    
    // Calculate the ping time
    const pingTime = Date.now() - startTime;
    
    // Get MongoDB version
    const serverStatus = await admin.serverStatus();
    const version = serverStatus.version;
    
    if (result.ok === 1) {
      return {
        status: 'connected',
        ping: pingTime,
        version,
      };
    } else {
      return {
        status: 'error',
        error: 'Ping failed but did not throw an error',
      };
    }
  } catch (error) {
    console.error('MongoDB health check failed:', error);
    return {
      status: 'error',
      error: (error as Error).message,
    };
  }
}

// Export Mongoose for schema definitions
export { mongoose };

/**
 * Usage:
 * 
 * // In your schema file (e.g., src/models/User.ts)
 * import { mongoose } from '@/lib/mongoose';
 * 
 * const UserSchema = new mongoose.Schema({
 *   name: { type: String, required: true, trim: true },
 *   email: { 
 *     type: String, 
 *     required: true, 
 *     unique: true,
 *     lowercase: true,
 *     validate: {
 *       validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
 *       message: 'Invalid email format'
 *     }
 *   },
 *   password: { type: String, required: true, minlength: 8 },
 *   role: { type: String, enum: ['user', 'admin'], default: 'user' },
 *   createdAt: { type: Date, default: Date.now },
 *   updatedAt: { type: Date, default: Date.now },
 * }, {
 *   timestamps: true,
 *   strict: true,
 *   strictQuery: true,
 * });
 * 
 * // Create indexes for frequently queried fields
 * UserSchema.index({ email: 1 }, { unique: true });
 * UserSchema.index({ createdAt: -1 });
 * 
 * // Add methods to the schema
 * UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
 *   // Password comparison logic here
 *   return someComparisonResult;
 * };
 * 
 * // Define a model
 * export const User = mongoose.models.User || mongoose.model('User', UserSchema);
 * 
 * // In your API route
 * import { connectToDatabase } from '@/lib/mongoose';
 * import { User } from '@/models/User';
 * 
 * export async function GET(req: Request) {
 *   await connectToDatabase();
 *   
 *   // Now you can use the User model to query the database
 *   const users = await User.find().limit(10).sort({ createdAt: -1 });
 *   
 *   return Response.json({ users });
 * }
 */ 