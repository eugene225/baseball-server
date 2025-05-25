import { DataSource, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

export function ReadOnlyTransactional() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const dataSource: DataSource = this.dataSource;

      if (!dataSource) {
        throw new Error('DataSource must be injected using @InjectDataSource() decorator');
      }

      return await dataSource.transaction(async (manager: EntityManager) => {
        return await originalMethod.apply(this, [...args, manager]);
      });
    };

    return descriptor;
  };
}
