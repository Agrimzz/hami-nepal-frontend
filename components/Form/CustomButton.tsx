// components/Form/CustomButton.tsx
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { CustomButtonProps } from "./Form.type";

export function CustomButton({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  disabled = false,
  leftSection,
  rightSeciton,
}: CustomButtonProps) {
  const isDisabled = isLoading || disabled;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      className={`bg-primary rounded-xl min-h-[50px] justify-center ${containerStyles} ${
        isDisabled ? "opacity-50" : ""
      }`}
    >
      <View className="flex-row items-center px-4">
        {/* Left */}
        <View className="min-w-[24px] items-start justify-center mr-2">
          {leftSection ?? null}
        </View>

        {/* Center label */}
        <View className="flex-1 items-center justify-center">
          <Text
            className={`text-white font-psemibold text-sm text-center ${textStyles}`}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* Right */}
        <View className="min-w-[24px] items-end justify-center ml-2">
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            (rightSeciton ?? null)
          )}
        </View>
      </View>
    </Pressable>
  );
}
