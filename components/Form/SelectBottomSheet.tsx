import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ChevronDown } from "lucide-react-native";
import React, { useCallback, useRef } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Option = { label: string; value: string | number };

type Props = {
  options?: Option[];
  value?: (string | number)[] | string | number;
  multiple?: boolean;
  onChange: (val: string | number | (string | number)[]) => void;
  title: string;
  placeholder?: string;
  trigger?: React.ReactNode;
  error?: string;
};

export function SelectBottomSheet({
  options = [],
  value,
  multiple,
  onChange,
  title,
  placeholder,
  trigger,
}: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const open = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetRef.current?.present();
  }, []);

  const close = useCallback(() => bottomSheetRef.current?.dismiss(), []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close" // tap outside to close
      />
    ),
    []
  );

  return (
    <>
      {/* Trigger */}

      {trigger ? (
        <Pressable onPress={open} pointerEvents="box-none">
          {trigger}
        </Pressable>
      ) : (
        <Pressable
          onPress={open}
          className="w-full min-h-[50px] px-4 py-4 rounded-xl border border-white/5 bg-white/5"
        >
          <Text className="text-lightgray text-xs font-pregular">{title}</Text>
          <View className="flex flex-row items-center justify-between mt-2">
            <Text
              className={`${
                value &&
                (Array.isArray(value) ? value.length > 0 : value !== "")
                  ? "text-white"
                  : "text-white/70"
              }  font-pregular text-sm`}
            >
              {Array.isArray(value) && value.length
                ? options
                    .filter((o) => value.includes(o.value))
                    .map((o) => o.label)
                    .join(", ")
                : typeof value === "string" || typeof value === "number"
                  ? options.find((o) => o.value === value)?.label
                  : placeholder || "Select..."}
            </Text>

            <ChevronDown size={16} color="white" />
          </View>
        </Pressable>
      )}
      {/* Bottom sheet modal */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["40%", "70%"]}
        handleIndicatorStyle={{ backgroundColor: "#fff" }}
        backgroundStyle={{ backgroundColor: "#303135" }}
        backdropComponent={renderBackdrop}
        onDismiss={close}
        index={1}
      >
        <BottomSheetScrollView className="p-4">
          <Text className="w-full text-center text-lg font-psemibold text-white border-b border-white/20 pb-2">
            {title}
          </Text>

          {options.map((opt) => {
            const selected = multiple
              ? Array.isArray(value) && value.includes(opt.value)
              : value === opt.value;

            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  if (multiple) {
                    let newVal = Array.isArray(value) ? [...value] : [];
                    if (newVal.includes(opt.value)) {
                      newVal = newVal.filter((v) => v !== opt.value);
                    } else {
                      newVal.push(opt.value);
                    }
                    onChange(newVal);
                  } else {
                    onChange(opt.value);
                    close();
                  }
                }}
                className="p-2 mt-2 flex flex-row justify-between items-center"
              >
                <Text
                  className={`text-white font-psemibold ${selected ? "font-pbold text-primary" : ""}`}
                >
                  {opt.label}
                </Text>

                <View
                  className={`size-4 rounded-full ${selected ? "bg-primary" : "border border-white/20"} `}
                />
              </TouchableOpacity>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}
