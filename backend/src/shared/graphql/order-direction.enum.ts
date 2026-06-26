import { registerEnumType } from 'type-graphql';

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});
