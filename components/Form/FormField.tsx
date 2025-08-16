import { Eye, EyeOff } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

  // Create a ref for the TextInput
  const inputRef = useRef<TextInput>(null);

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
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View
        className={`w-full min-h-[50px] space-y-1 bg-white/5 px-4 py-4 rounded-xl border border-white/5 ${otherStyles}`}
      >
        <Text className="text-lightgray text-xs font-pregular">{title}</Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <TextInput
            ref={inputRef}
            className="placeholder:text-white/70 text-white p-0 font-pregular text-sm flex-1"
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
                <EyeOff size={20} color="gray" />
              ) : (
                <Eye size={20} color="gray" />
              )}
            </TouchableOpacity>
          )}
        </View>

        {error && <Text className="text-red-500 text-sm">{error}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
}
