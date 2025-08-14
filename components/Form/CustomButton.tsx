import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { CustomButtonProps } from "./Form.type";

export function CustomButton({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary rounded-xl min-h-[50px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-white font-psemibold text-sm ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
