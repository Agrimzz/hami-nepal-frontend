import React, { ReactElement } from "react";

export type DataListProps<T> = {
  queryKey: string[];
  endpoint: string;
  renderItem: (item: T) => ReactElement | null;
  ListHeaderComponent?: ReactElement;
  ListEmptyComponent?: React.ComponentType<any>;
  addButtonPath?: string;
  containerStyles?: string;
  disablePadding?: boolean;
};
