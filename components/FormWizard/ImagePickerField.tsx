// components/form-kit/ImagePickerField.tsx
import { API_BASE_URL } from "@/api/client";
import { getAccessToken } from "@/utils/storage";
import * as ImagePicker from "expo-image-picker";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  control: Control<any>;
  name: string; // field that stores uploaded file id (e.g., "profile_picture_id")
  title?: string;
  hint?: string;
  initialUri?: string | null; // for edit mode preview
  fileType?: "profile" | "attachment" | string;
};

export function ImagePickerField({
  control,
  name,
  title = "Image",
  hint = "Tap to select an image",
  initialUri = null,
  fileType = "profile",
}: Props) {
  const [previewUri, setPreviewUri] = useState<string | null>(initialUri);

  const handlePick = async (onChange: (id: string | null) => void) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (result.canceled) return;

      const uri = result.assets[0].uri;
      setPreviewUri(uri);

      const token = await getAccessToken();
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: `image_${Date.now()}.jpg`,
      } as any);
      formData.append("file_type", fileType);

      const res = await fetch(`${API_BASE_URL}/filehandler/v1/upload/`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      const id = data?.[0]?.id ?? null;
      onChange(id);
    } catch (e) {
      console.error("Image upload error", e);
      Alert.alert("Error", "Image upload failed");
      setPreviewUri(null);
      onChange(null);
    }
  };

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field: { onChange, value } }) => (
        <View className="gap-2">
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white font-pbold text-lg">{title}</Text>
            <Text className="text-xs text-lightgray font-pbold">{hint}</Text>
          </View>

          <View className="relative">
            <Pressable
              onPress={() => handlePick(onChange)}
              className="items-center justify-center rounded-xl h-56 bg-white/5 border border-white/5"
            >
              {previewUri ? (
                <Image
                  source={{ uri: previewUri }}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-lightgray font-psemibold">{hint}</Text>
              )}
            </Pressable>

            {previewUri && (
              <TouchableOpacity
                onPress={() => {
                  setPreviewUri(null);
                  onChange(null);
                }}
                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full"
              >
                <X size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    />
  );
}
