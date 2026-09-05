import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { ConfigService } from '@nestjs/config';
import {IPgQuery} from '@app/common'; 

@Injectable()
export class PostgreSqlService implements OnModuleDestroy {

    private pool: Pool;

    constructor(private configService: ConfigService) {
        const databaseUrl = this.configService.get<string>('DATABASE_URL');
        this.pool = new Pool({
            connectionString: databaseUrl,
            ssl: false,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
    }

    //DB health check
    async healthCheck(): Promise<boolean> {
        try {
            await this.query({query: 'SELECT 1'});
            return true;
        } catch {
            return false;
        }
    }


    //DB connection info
    getPoolStats() {
        return {
            total: this.pool.totalCount,
            idle: this.pool.idleCount,
            waiting: this.pool.waitingCount,
        };
    }

    // get client
    async getClient(): Promise<PoolClient> {
        return this.pool.connect();
    }

    // return array
    async query<T extends QueryResultRow = any>(
        pgQuery: IPgQuery
    ): Promise<T[]> {
        const res = await this.pool.query<T>(pgQuery.query, pgQuery.params);
        return res.rows;
    }

    // return single row
    async queryOne<T extends QueryResultRow = any>(
        pgQuery: IPgQuery
    ): Promise<T | null> {
        console.log(`--------Start: Execute Query--------\nnquery: ${JSON.stringify(pgQuery.query, null, 2)}\n parameters: ${JSON.stringify(pgQuery.params)}--------End: Execute Query--------`);
        const res = await this.pool.query<T>(pgQuery.query, pgQuery.params);
        return res.rows[0] || null;
    }

    // execute (no return)
    async execute(
        pgQuery: IPgQuery
    ): Promise<number> {
        const res = await this.pool.query(pgQuery.query, pgQuery.params);
        return res.rowCount ?? 0;
    }


    //transaction
    async transaction<T>(
        callback: (client: PoolClient) => Promise<T>,
    ): Promise<T> {

        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const result = await callback(client);

            await client.query('COMMIT');
            return result;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;

        } finally {
            client.release();
        }
    }

    //pagonation
    async paginate<T extends QueryResultRow>(
        pgQuery: IPgQuery,
        page = 1,
        limit = 10,
    ): Promise<{
        data: T[];
        page: number;
        limit: number;
    }> {

        const offset = (page - 1) * limit;

        const params = pgQuery.params || [];
        const finalQuery = `
      ${pgQuery.query}
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;

        const rows = await this.query<T>({
            query: finalQuery,
            params: [...params, limit, offset],
        });

        return { data: rows, page, limit };
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
