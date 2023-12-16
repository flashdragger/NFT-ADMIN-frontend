export * from './types/form';
export * from './types/formItem';

import SchemaForm from './schema-form';

export type SchemaFormRef = InstanceType<typeof SchemaForm>;

export { SchemaForm };
