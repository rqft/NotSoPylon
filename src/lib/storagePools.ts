/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-async-promise-executor */
import * as utils from './utils';
import * as constants from '../constants/constants';

export let InitializedPools: Array<StoragePool> = [];
const ASSUMED_MAX_KEYS = 256;
export class StoragePool {
    kvName: string;
    kv: pylon.KVNamespace;
    duration: number; // duration for each entry
    uniqueId: string; // unique id prop on the objects
    timestampProperty: string | undefined = undefined; // timestamp prop on the objects for calcs
    maxObjects: number | undefined = undefined; // max objects per array instead of byte calcs
    reduceAt: number | undefined = undefined; // what key count to start reducing duration at
    constructor(name: string, itemDuration: number, uniqueIdProperty: string, timestampProperty: string | undefined = undefined, maxObjects: number | undefined = undefined, reduceAt: number | undefined = undefined) {
      this.kvName = name;
      this.kv = new pylon.KVNamespace(name);
      this.duration = itemDuration;
      this.uniqueId = uniqueIdProperty;
      this.timestampProperty = timestampProperty;
      this.maxObjects = maxObjects;
      this.reduceAt = reduceAt;
      const _ex = InitializedPools.find((e)=> e.kvName === this.kvName);
      if(!_ex) InitializedPools.push(this);
      return this;
    }
    private async err(txt: string) {
      throw new TypeError(`[Storage Pool]: ${this.kvName}: ${txt}`);
    }
    async exists(id: string) {
        const ex = (await this.getAll()).find((item) => item[this.uniqueId] === id);
        return ex !== undefined;
    }
    private getTimestamp(obj: any) {
      if (typeof this.timestampProperty === 'string' && typeof obj[this.timestampProperty] === 'number') {
        return obj[this.timestampProperty];
      }
      if (typeof obj[this.uniqueId] !== 'string') {
        this.err('Can\'t parse timestamps on a non-string unique identifier');
      }
      return utils.decomposeSnowflake(obj[this.uniqueId]).timestamp;
    }
    async clean() {
      if(typeof this.duration !== 'number' || this.duration  === 0) return;
      let diff = Date.now() - this.duration;
      const items = await this.kv.items();
      if (typeof this.reduceAt === 'number' && this.reduceAt > 0) {
        const count = items.length;
        if (count > this.reduceAt) {
          const leftToMax = ASSUMED_MAX_KEYS-this.reduceAt;
          const toInc = this.duration/Math.max(1, leftToMax);
          const extra = Math.floor(toInc*(count-this.reduceAt));
          //console.log(`Count: ${count},  reduceAt: ${this.reduceAt}, leftToMax: ${leftToMax} , toInc: ${toInc},,, extra: ${extra}/${this.duration}`);
          diff += extra;
        }
      }
      await Promise.all(items.map(async (item: any) => {
        const vl: Array<any> = item.value;
        const { key } = item;
        const toRemove = vl.filter((e) => e === null || diff > this.getTimestamp(e)).map((e) => (e === null ? null : e[this.uniqueId]));
        if (toRemove.length > 0) {
            console.log(`${this.kvName}: Removing ${toRemove.length} items!`)
          let vlCheckEmpty: undefined | Array<any>;
          await this.kv.transact(key, (prev: any) => {
            const newDt = prev.filter((e: any) => e !== null && !toRemove.includes(e[this.uniqueId]));
            vlCheckEmpty = newDt;
            return newDt;
          });
          if (Array.isArray(vlCheckEmpty) && vlCheckEmpty.length === 0) {
            try {
              await this.kv.delete(key, { prevValue: [] });
            } catch (e) {
            }
          }
        } else {
            if(item.value.length === 0) {
                try {
                    await this.kv.delete(key, { prevValue: [] });
                  } catch (e) {
                  }
            }
        }
      }));
    }
    async saveToPool(newObj: any) {
      const thisLen = new TextEncoder().encode(JSON.stringify(newObj)).byteLength;
      const items = await this.kv.items();
      const ex = (await this.getAll()).find((item) => item[this.uniqueId] === newObj[this.uniqueId]);
      if(typeof ex !== 'undefined') {
          console.log('Already exists! editing instead')
        const _res = await this.editPool(newObj[this.uniqueId], newObj);
        return _res;
      }
      let saveTo;
      const res = items.every((item: any) => {
        if (!Array.isArray(item.value)) {
          return true;
        }
        const _entries: Array<any> = item.value;
        if (typeof this.maxObjects === 'number' && this.maxObjects > 0) {
          if (_entries.length < this.maxObjects) {
            saveTo = item.key;
            return false;
          }
        } else {
          const len = (new TextEncoder().encode(JSON.stringify(_entries)).byteLength) + thisLen;
          if (len < constants.MAX_KV_SIZE) {
            saveTo = item.key;
            return false;
          }
        }
        return true;
      });
      if (res === true) {
        await this.kv.put(utils.composeSnowflake(), [newObj]);
        return true;
      }
      if (res === false && typeof saveTo === 'string') {
        for (let i = 0; i < 2; i += 1) {
          try {
            await this.kv.transact(saveTo, (prev: any) => prev.concat(newObj));
            return true;
          } catch (e) {
          }
        }
        return false;
      }

      return false;
    }
    async editPool(id: string, newObj: any) {
      const items = await this.kv.items();
      const res = items.find((item: any) => item.value.find((e: any) => e !== null && e[this.uniqueId] === id) !== undefined);
      if (res) {
        for (let i = 0; i < 2; i += 1) {
          try {
            await this.kv.transact(res.key, (prev: any) => {
              const newData = JSON.parse(JSON.stringify(prev));
              const _ind = newData.findIndex((e: any) => e !== null && e[this.uniqueId] === id);
              if (_ind !== -1) {
                if (typeof newObj === 'object' && newObj !== null) {
                  newData[_ind] = newObj;
                } else {
                  delete newData[_ind];
                }
              }
              return newData;
            });
            return true;
          } catch (e) {
          }
        }
        return false;
      }

      return false;
    }
    async editPools(ids: Array<string>, callback: Function) {
      const items = await this.kv.items();
      const transactPools = items.filter((item: any) => {
        if (Array.isArray(item.value)) {
          const _val: Array<any> = item.value;
          const hasAny = _val.find((entry) => entry !== null && ids.includes(entry[this.uniqueId]));
          if (!hasAny) {
            return false;
          }
          return true;
        }
        return false;
      });
      if (transactPools.length > 0) {
        await Promise.all(transactPools.map(async (item) => {
          await this.kv.transact(item.key, (prev: any) => {
            let dt: Array<any> = JSON.parse(JSON.stringify(prev));
            dt = dt.filter((val) => val !== null && typeof val === 'object' && typeof val !== 'undefined').map((val) => callback(val)).filter((val) => val !== null && typeof val === 'object' && typeof val !== 'undefined');
            return dt;
          });
        }));
        return true;
      }
      return false;
    }
    async getAll<T>(): Promise<Array<T>> {
      const diff = Date.now() - this.duration;
      const items = await this.kv.items();
      let _ret: Array<T> = [];
      items.map((e: any) => {
        if (Array.isArray(e.value)) {
          _ret.push(...e.value);
        }
      });
      _ret = _ret.filter((item) => typeof item === 'object' && item !== null && typeof item !== 'undefined');
      _ret = _ret.filter((item) => this.duration === 0 || this.getTimestamp(item) >= diff).sort((a, b) => this.getTimestamp(a) - this.getTimestamp(b));
      return _ret as Array<T>;
    }
    async getById<T>(id: string): Promise<T | undefined> {
      const _f: any = (await this.getAll()).find((e) => e !== null && e[this.uniqueId] === id);
      return _f as T;
    }
    async getByQuery<T>(query: any): Promise<Array<T>> {
        let toRet = (await this.getAll()).filter((item) => {
            for(const key in query) {
                if(typeof query[key] === 'undefined') continue;
                if(query[key] === item[key]) return true;
            }
            return false;
        })
        return toRet as Array<T>;
    }
}
