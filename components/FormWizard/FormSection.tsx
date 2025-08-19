import { ReactNode } from "react";
import { Text, View } from "react-native";

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <View className="gap-2">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-white font-pbold text-lg">{title}</Text>
        {!!description && (
          <Text className="text-xs text-lightgray font-pbold">
            {description}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}
