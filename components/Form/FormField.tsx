import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { FormFieldProps } from "./Form.type";

export function FormField({
  title,
  value,
  placeholder,
  handleChangeText,
  type = "text",
  otherStyles = "",
  error,
  ...props
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const keyboardType: TextInputProps["keyboardType"] = (() => {
    switch (type) {
      case "email":
        return "email-address";
      case "number":
        return "number-pad";
      case "decimal":
        return "decimal-pad";
      case "phone":
        return "phone-pad";
      default:
        return "default";
    }
  })();

  return (
    <View className={`w-full space-y-1 bg-gray p-4 rounded-2xl ${otherStyles}`}>
      <Text className="text-lightgray font-pregular">{title}</Text>

      <View className="flex flex-row items-center justify-between">
        <TextInput
          className="placeholder:text-white/70 text-white p-0 font-pregular flex-1 py-2"
          placeholder={placeholder}
          value={value}
          onChangeText={handleChangeText}
          placeholderTextColor="#ccc"
          secureTextEntry={isPasswordField && !showPassword}
          keyboardType={keyboardType}
          {...props}
        />

        {isPasswordField && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} color="#F1F1F1" />
            ) : (
              <Eye size={20} color="#F1F1F1" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </View>
  );
}
