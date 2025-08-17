import { ReactElement } from "react";

export type DataListProps<T> = {
  queryKey: string[];
  endpoint: string;
  renderItem: (item: T) => ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any>;
  addButtonPath?: string;
};
