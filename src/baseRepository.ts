import path from 'node:path';
import { env } from './constants/env';
import { readFile, writeFile } from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { Mutex } from 'async-mutex';
import { existsSync } from 'node:fs';

export interface IBaseRepository {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export abstract class BaseRepository<T extends IBaseRepository> {
    protected filePath: string;

    private cache: T[] | null = null;
    private cacheTimestamp: number = 0;
    private cacheTTL: number = 10_000;

    private indexById: Map<string, T> = new Map();

    private writeLock = new Mutex();

    constructor(collectionName: string) {
        this.filePath = path.join(env.collectionsPath, `${collectionName}.json`);
    }

    private async ensureCollectionExists() {
        await this.writeLock.runExclusive(async () => {
            const file = existsSync(this.filePath);
            if (!file) {
                await writeFile(this.filePath, JSON.stringify({ count: 0, data: [] }, null, 2));
            }
        });
    }

    private buildIndexes(items: T[]) {
        this.indexById.clear();

        for (const item of items) {
            this.indexById.set(item.id, item);
        }
    }

    protected getSecondaryIndexKeys() {
        return [];
    }

    protected async read() {
        await this.ensureCollectionExists();
        const now = Date.now();
        if (this.cache && now - this.cacheTimestamp < this.cacheTTL) return this.cache;

        const content = await readFile(this.filePath, 'utf-8');
        const json = JSON.parse(content);

        this.buildIndexes(json.data as T[]);

        this.cache = json.data as T[];
        this.cacheTimestamp = Date.now();

        return this.cache;
    }

    protected async write(data: T[]) {
        await this.writeLock.runExclusive(async () => {
            await writeFile(this.filePath, JSON.stringify({ count: data.length, data }, null, 2));
            this.buildIndexes(data);
            this.cache = data;
            this.cacheTimestamp = Date.now();
        });
    }

    protected async find(filter?: Partial<Omit<T, 'createdAt' | 'updatedAt'>> | null) {
        const data = await this.read();

        if (!filter || !Object.keys(filter).length) return [...data];

        const { id, ...filterCopy } = filter;

        if (id) {
            const found = this.indexById.get(id);
            if (!found) return [];

            return [found];
        }

        const keys = Object.keys(filterCopy) as (keyof typeof filterCopy)[];
        if (!keys.length) return data;

        return data.filter((item) => keys.every((key) => item[key] === filterCopy[key]));
    }

    protected async findById(id: string) {
        await this.read();
        const data = this.indexById.get(id);
        return data || null;
    }

    protected async create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
        const items = await this.read();
        const id = uuidv4();
        const now = new Date().toISOString();

        const record = {
            id,
            ...item,
            createdAt: now,
            updatedAt: now,
        } as T;

        items.push(record);
        await this.write(items);

        return record;
    }

    protected async update(id: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
        const items = await this.read();
        const index = items.findIndex((i) => i.id === id);

        if (index === -1) return null;

        items[index] = {
            ...items[index],
            ...item,
            updatedAt: new Date().toISOString(),
        };

        await this.write(items);
        return items[index];
    }

    protected async delete(id: string) {
        const items = await this.read();
        await this.write(items.filter((i) => i.id !== id));
    }
}
