import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

const AddButton = ({ onPress }: { onPress?: () => void }) => {
  return (
    <Pressable
      className="w-16 h-16 bg-primary rounded-full justify-center items-center absolute bottom-4 right-4 z-50"
      onPress={onPress}
    >
      <Plus size={20} color="#F1F1F1" />
    </Pressable>
  );
};

export default AddButton;
