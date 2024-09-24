export class Storage {
  private itemsKey = 'kko-grid-drag-items';

  add<T extends { id: string | number }>(item: T): T[] {
    const items = this.read<T>();
    const newItems = items ? [...items, item] : [item];

    this.write(newItems);
    return newItems;
  }

  set<T extends { id: string | number }>(item: T): T[] {
    const items = this.read<T>();
    const newItems = items ? items.map((i) => (i.id === item.id ? item : i)) : [item];

    this.write(newItems);
    return newItems;
  }

  setAll<T extends { id: string | number }>(items: T[]): T[] {
    this.write(items);
    return items;
  }

  update<T extends { id: string | number }>(id: T['id'], changes: Partial<Omit<T, 'id'>>): T[] {
    const items = this.read<T>();

    if (!items) {
      console.error('Storage: Trying to update item in a non-existent storage.');
      return [];
    }

    const newItems = items.map((i) => (i.id === id ? { ...i, ...changes } : i));

    this.write(newItems);
    return newItems;
  }

  get<T extends { id: string | number }>(id: T['id']): T | null {
    const items = this.read<T>();

    return items?.find((i) => i.id === id) ?? null;
  }

  getAll<T>(): T[] {
    return this.read<T>() ?? [];
  }

  delete<T extends { id: string | number }>(id: T['id'] | T['id'][]): T[] {
    const items = this.read<T>();

    if (!items) {
      console.error('Storage: Trying to delete item from a non-existent storage.');
      return [];
    }

    const newItems = Array.isArray(id) ? items.filter((i) => !id.includes(i.id)) : items.filter((i) => i.id !== id);

    this.write(newItems);
    return newItems;
  }

  reset() {
    localStorage.removeItem(this.itemsKey);
    return [];
  }

  private read<T>(): T[] | null {
    const value: string | null = localStorage.getItem(this.itemsKey);

    if (!value) return null;
    return JSON.parse(value);
  }

  private write<T>(data: T[]) {
    localStorage.setItem(this.itemsKey, JSON.stringify(data));
  }
}
