import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import {
  IMongoAggregation,
  IMongoFilter,
  IMongoInsert,
  IMongoOptions,
  IMongoQuery,
  IMongoUpdate,
  PaginatedResult,
} from '@app/common';

@Injectable()
export class MongoDbService implements OnModuleDestroy {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private configService: ConfigService,
  ) {}

  // ==================== Connection Management ====================

  /**
   * Check MongoDB connection health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const db = this.connection.db;
      if (!db) {
        return false;
      }
      await db.admin().ping();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get connection state (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)
   */
  getConnectionState(): number {
    return this.connection.readyState;
  }

  /**
   * Get detailed connection statistics
   */
  getConnectionStats() {
    return {
      readyState: this.connection.readyState,
      host: this.connection.host,
      port: this.connection.port,
      name: this.connection.name,
      collections: Object.keys(this.connection.collections),
      models: Object.keys(this.connection.models),
    };
  }

  /**
   * Get native MongoDB database instance for low-level operations
   */
  async getDb() {
    const db = this.connection.db;
    if (!db) {
      throw new Error('MongoDB database not initialized');
    }
    return db;
  }

  /**
   * Get a specific Mongoose model
   */
  getModel<T>(modelName: string): Model<T> {
    return this.connection.model<T>(modelName);
  }

  // ==================== Logging ====================

  private logQuery(operation: string, modelName: string, data: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[MongoDB] ${operation} on ${modelName}:`,
        JSON.stringify(data, null, 2),
      );
    }
  }

  // ==================== CRUD Operations ====================

    /**
   * Find multiple documents with filtering, sorting, and pagination
   * Returns plain JavaScript objects via .lean()
   */
  async find<T = any>(modelName: string, query: IMongoQuery): Promise<T[]> {
    this.logQuery('Find', modelName, query);

    const model = this.connection.model<T>(modelName);
    const { filter, options } = query;

    let queryBuilder = model.find(filter);

    if (options?.projection) {
      queryBuilder = queryBuilder.select(options.projection);
    }
    if (options?.sort) {
      queryBuilder = queryBuilder.sort(options.sort);
    }
    if (options?.skip) {
      queryBuilder = queryBuilder.skip(options.skip);
    }
    if (options?.limit) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    return (await queryBuilder.lean().exec()) as T[];
  }


  /**
   * Find one document by filter
   */
  async findOne<T = any>(
    modelName: string,
    filter: IMongoFilter,
    options?: IMongoOptions,
  ): Promise<T | null> {
    this.logQuery('FindOne', modelName, { filter, options });

    const model = this.connection.model<T>(modelName);
    let queryBuilder = model.findOne(filter);

    if (options?.projection) {
      queryBuilder = queryBuilder.select(options.projection);
    }
    if (options?.sort) {
      queryBuilder = queryBuilder.sort(options.sort);
    }

    return queryBuilder.lean<T>().exec();
  }

  /**
   * Find document by ID
   */
  async findById<T = any>(
    modelName: string,
    id: string | ObjectId,
    options?: IMongoOptions,
  ): Promise<T | null> {
    this.logQuery('FindById', modelName, { id, options });

    const model = this.connection.model<T>(modelName);
    let queryBuilder = model.findById(id);

    if (options?.projection) {
      queryBuilder = queryBuilder.select(options.projection);
    }

    return queryBuilder.lean<T>().exec();
  }

  /**
   * Insert one or multiple documents.
   * Converts Mongoose documents to plain objects using .toObject()
   */
  async create<T = any>(
    modelName: string,
    data: IMongoInsert<T>,
  ): Promise<T | T[]> {
    this.logQuery('Create', modelName, data);

    const model = this.connection.model<T>(modelName);

    if (Array.isArray(data.document)) {
      const docs = await model.insertMany(data.document);
      return docs.map((doc) => doc.toObject()) as T[];
    }

    const newDoc = new model(data.document);
    const saved = await newDoc.save();
    return saved.toObject() as T;
  }

  /**
   * Update one document.
   * Uses findOneAndUpdate + lean() so the return type is a plain object (T)
   */
  async updateOne<T = any>(
    modelName: string,
    query: IMongoUpdate,
  ): Promise<T | null> {
    this.logQuery('UpdateOne', modelName, query);

    const model = this.connection.model<T>(modelName);
    const { filter, update, options = {} } = query;

    const updateOptions = {
      upsert: options.upsert || false,
      new: true, // Return updated document
    };

    const result = await model
      .findOneAndUpdate(filter, update, updateOptions)
      .lean<T>()
      .exec();

    return result;
  }

  /**
   * Update multiple documents.
   * 'multi' is not a valid option in Mongoose 6+; updateMany always updates all matches.
   */
  async updateMany(
    modelName: string,
    query: IMongoUpdate,
  ): Promise<{ modifiedCount: number; matchedCount: number }> {
    this.logQuery('UpdateMany', modelName, query);

    const model = this.connection.model(modelName);
    const { filter, update, options = {} } = query;

    const result = await model
      .updateMany(filter, update, { upsert: options.upsert || false })
      .exec();

    return {
      modifiedCount: result.modifiedCount ?? 0,
      matchedCount: result.matchedCount ?? 0,
    };
  }

  /**
   * Delete one document
   */
  async deleteOne(
    modelName: string,
    filter: IMongoFilter,
  ): Promise<{ deletedCount: number }> {
    this.logQuery('DeleteOne', modelName, { filter });

    const model = this.connection.model(modelName);
    const result = await model.deleteOne(filter).exec();
    return { deletedCount: result.deletedCount ?? 0 };
  }

  /**
   * Delete multiple documents
   */
  async deleteMany(
    modelName: string,
    filter: IMongoFilter,
  ): Promise<{ deletedCount: number }> {
    this.logQuery('DeleteMany', modelName, { filter });

    const model = this.connection.model(modelName);
    const result = await model.deleteMany(filter).exec();
    return { deletedCount: result.deletedCount ?? 0 };
  }

  /**
   * Count documents matching filter
   */
  async countDocuments(modelName: string, filter: IMongoFilter): Promise<number> {
    this.logQuery('CountDocuments', modelName, { filter });

    const model = this.connection.model(modelName);
    return model.countDocuments(filter).exec();
  }

  /**
   * Soft delete - sets deletedAt timestamp instead of removing the document
   */
  async softDelete(
    modelName: string,
    filter: IMongoFilter,
  ): Promise<{ modifiedCount: number }> {
    this.logQuery('SoftDelete', modelName, { filter });

    const model = this.connection.model(modelName);
    const result = await model
      .updateMany(filter, { $set: { deletedAt: new Date() } })
      .exec();

    return { modifiedCount: result.modifiedCount ?? 0 };
  }

  // ==================== Aggregation Pipeline ====================

  /**
   * Execute an aggregation pipeline
   */
  async aggregate<T = any>(
    modelName: string,
    pipeline: any[],
    options?: IMongoAggregation['options'],
  ): Promise<T[]> {
    this.logQuery('Aggregate', modelName, { pipeline, options });

    const model = this.connection.model(modelName);

    const aggregationOptions: any = {};
    if (options?.allowDiskUse) {
      aggregationOptions.allowDiskUse = options.allowDiskUse;
    }
    if (options?.cursor) {
      aggregationOptions.cursor = options.cursor;
    }

    return model.aggregate(pipeline, aggregationOptions).exec();
  }

  /**
   * Common aggregation: Group documents by a field and count them
   */
  async groupBy<T = any>(
    modelName: string,
    groupField: string,
    filter: IMongoFilter = {},
  ): Promise<T[]> {
    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: `$${groupField}`,
          count: { $sum: 1 },
        },
      },
    ];

    return this.aggregate<T>(modelName, pipeline);
  }

  // ==================== Bulk Operations ====================

  /**
   * Run bulk write operations (insert/build/update/delete mix)
   */
  async bulkWrite(
    modelName: string,
    operations: any[],
  ): Promise<{ insertedCount: number; modifiedCount: number; deletedCount: number; upsertedCount: number }> {
    this.logQuery('BulkWrite', modelName, { operationCount: operations.length });

    const model = this.connection.model(modelName);
    const result = await model.bulkWrite(operations);

    return {
      insertedCount: result.insertedCount ?? 0,
      modifiedCount: result.modifiedCount ?? 0,
      deletedCount: result.deletedCount ?? 0,
      upsertedCount: result.upsertedCount ?? 0,
    };
  }

  /**
   * Insert many documents at once
   */
  async bulkInsert<T = any>(modelName: string, documents: T[]): Promise<T[]> {
    this.logQuery('BulkInsert', modelName, { count: documents.length });

    const model = this.connection.model<T>(modelName);
    const docs = await model.insertMany(documents);
    return docs.map((doc) => doc.toObject()) as T[];
  }

  // ==================== Distinct Operations ====================

  /**
   * Get distinct values for a given field
   */
  async distinct<T = any>(
    modelName: string,
    field: string,
    filter: IMongoFilter = {},
  ): Promise<T[]> {
    this.logQuery('Distinct', modelName, { field, filter });

    const model = this.connection.model(modelName);
    return model.distinct(field, filter).exec();
  }

  // ==================== Pagination ====================

    /**
   * Offset-based pagination with total count
   */
  async paginate<T = any>(
    modelName: string,
    filter: IMongoFilter,
    page: number = 1,
    limit: number = 10,
    sort: Record<string, 1 | -1> = { _id: -1 },
  ): Promise<PaginatedResult<T>> {
    this.logQuery('Paginate', modelName, { filter, page, limit });

    const model = this.connection.model<T>(modelName);
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      model.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
      model.countDocuments(filter).exec(),
    ]);

    const data = docs as T[];

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }


  // ==================== Transaction Support ====================

  /**
   * Run a set of operations inside a MongoDB transaction.
   * NOTE: Requires a MongoDB replica set (not a standalone server).
   */
  async transaction<T>(
    callback: (session: any) => Promise<T>,
  ): Promise<T> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const result = await callback(session);

      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Alias for transaction with automatic commit/rollback handling
   */
  async withTransaction<T>(
    operations: (session: any) => Promise<T>,
  ): Promise<T> {
    return this.transaction(operations);
  }

  // ==================== Index Management ====================

  /**
   * Create a single index on a model
   */
  async createIndex(
    modelName: string,
    fields: Record<string, 1 | -1>,
    options?: {
      unique?: boolean;
      sparse?: boolean;
      background?: boolean;
      name?: string;
    },
  ): Promise<string> {
    this.logQuery('CreateIndex', modelName, { fields, options });

    const model = this.connection.model(modelName);
    return model.collection.createIndex(fields, options);
  }

  /**
   * Create multiple indexes at once
   */
  async createIndexes(
    modelName: string,
    indexes: Array<{
      fields: Record<string, 1 | -1>;
      options?: any;
    }>,
  ): Promise<string[]> {
    this.logQuery('CreateIndexes', modelName, { count: indexes.length });

    const model = this.connection.model(modelName);
    const results: string[] = [];

    for (const index of indexes) {
      const indexName = await model.collection.createIndex(index.fields, index.options);
      results.push(indexName);
    }

    return results;
  }

  /**
   * Drop (delete) an index by name
   */
  async dropIndex(modelName: string, indexName: string): Promise<void> {
    this.logQuery('DropIndex', modelName, { indexName });

    const model = this.connection.model(modelName);
    await model.collection.dropIndex(indexName);
  }

  // ==================== Utility Methods ====================

  /**
   * Check whether a matching document exists
   */
  async exists(modelName: string, filter: IMongoFilter): Promise<boolean> {
    this.logQuery('Exists', modelName, { filter });

    const model = this.connection.model(modelName);
    const count = await model.countDocuments(filter).exec();
    return count > 0;
  }

  /**
   * Atomically find and update a document; returns the (updated) plain object
   */
  async findOneAndUpdate<T = any>(
    modelName: string,
    filter: IMongoFilter,
    update: Record<string, any>,
    options?: {
      returnNew?: boolean;
      upsert?: boolean;
    },
  ): Promise<T | null> {
    this.logQuery('FindOneAndUpdate', modelName, { filter, update, options });

    const model = this.connection.model<T>(modelName);

    const execOptions: any = {
      new: options?.returnNew !== false, // return updated doc by default
      upsert: options?.upsert || false,
    };

    const result = await model
      .findOneAndUpdate(filter, update, execOptions)
      .lean<T>()
      .exec();

    return result;
  }

  /**
   * Atomically find and delete a document; returns the removed plain object
   */
  async findOneAndDelete<T = any>(
    modelName: string,
    filter: IMongoFilter,
  ): Promise<T | null> {
    this.logQuery('FindOneAndDelete', modelName, { filter });

    const model = this.connection.model<T>(modelName);
    const result = await model.findOneAndDelete(filter).lean<T>().exec();
    return result;
  }

  /**
   * Get database statistics (sizes, counts, etc.)
   */
  async getDbStats() {
    try {
      const db = await this.getDb();
      return await db.stats();
    } catch (error) {
      console.error('[MongoDB] Error getting DB stats:', error);
      return null;
    }
  }

  /**
   * List all collection names in the connected database
   */
  async listCollections(): Promise<string[]> {
    try {
      const db = await this.getDb();
      const collections = await db.listCollections().toArray();
      return collections.map((col) => col.name);
    } catch (error) {
      console.error('[MongoDB] Error listing collections:', error);
      return [];
    }
  }

  // ==================== Lifecycle Hooks ====================

  async onModuleDestroy() {
    // Mongoose cleans up the connection for us; log for monitoring
    console.log('[MongoDB] Module destroying...');

    if (this.connection.readyState === 1) {
      console.log('[MongoDB] Connection is still active');
    }
  }
}
