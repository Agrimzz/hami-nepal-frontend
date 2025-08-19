import RNDateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { DatePickerFieldProps } from "./Form.type";

export function DatePickerField({
  title,
  value,
  placeholder = "Select Date",
  onChange,
  error,
  mode = "date",
  otherStyles = "",
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Pressable
      onPress={() => setShowPicker(true)}
      className={`w-full min-h-[50px] space-y-1 bg-white/5 px-4 py-4 rounded-xl border border-white/5 ${otherStyles}`}
    >
      <Text className="text-lightgray text-xs font-pregular">{title}</Text>

      <View className="mt-2">
        <Text
          className={`${
            value ? "text-white" : "text-lightgray"
          } font-pregular text-sm`}
        >
          {value
            ? mode === "date"
              ? new Date(value).toLocaleDateString()
              : new Date(value).toLocaleTimeString()
            : placeholder}
        </Text>
      </View>

      {showPicker && (
        <RNDateTimePicker
          design="material"
          minimumDate={new Date()}
          mode={mode}
          value={value ? new Date(value) : new Date()}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate.toISOString().split("T")[0]);
            }
          }}
          display="default"
          themeVariant="dark"
        />
      )}

      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </Pressable>
  );
}
