import { SelectBottomSheet } from "@/components";
import images from "@/constants/images";
import { useApiMutation } from "@/hooks/useApiMutation";
import { router } from "expo-router";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { TaskSchemaWithId } from "../form/taskSchema";

export function TaskCard({ task }: { task: TaskSchemaWithId }) {
  const [status, setStatus] = useState(task.status ?? "ongoing");

  const { mutate: updateTask } = useApiMutation(
    "patch",
    `/tasks/v1/tasks/${task.id}/`
  );

  const handleStatusChange = async (
    val: string | number | (string | number)[]
  ) => {
    const newStatus = val as string;
    setStatus(newStatus);
    await updateTask({ status: newStatus });
  };

  function renderStatus(status?: string) {
    switch (status) {
      case "ongoing":
        return (
          <View className="px-3 py-1 rounded-full bg-blue-500/20">
            <Text className="font-psemibold text-xs capitalize text-blue-400">
              Ongoing
            </Text>
          </View>
        );
      case "completed":
        return (
          <View className="px-3 py-1 rounded-full bg-green/20">
            <Text className="font-psemibold text-xs capitalize text-green">
              Completed
            </Text>
          </View>
        );
      case "cancelled":
        return (
          <View className="px-3 py-1 rounded-full bg-red-500/20">
            <Text className="font-psemibold text-xs capitalize text-red-400">
              Cancelled
            </Text>
          </View>
        );
      case "onhold":
        return (
          <View className="px-3 py-1 rounded-full bg-yellow-500/20">
            <Text className="font-psemibold text-xs capitalize text-yellow-400">
              On Hold
            </Text>
          </View>
        );
      default:
        return (
          <View className="px-3 py-1 rounded-full bg-gray-500/20">
            <Text className="font-psemibold text-xs capitalize text-gray-400">
              Unknown
            </Text>
          </View>
        );
    }
  }

  function renderPriority(priority?: string) {
    switch (priority) {
      case "low":
        return (
          <View className="px-3 py-1 rounded-full bg-lightgray/20">
            <Text className="font-psemibold text-xs capitalize text-lightgray">
              Low
            </Text>
          </View>
        );
      case "medium":
        return (
          <View className="px-3 py-1 rounded-full bg-orange-500/20">
            <Text className="font-psemibold text-xs capitalize text-orange-400">
              Medium
            </Text>
          </View>
        );
      case "high":
        return (
          <View className="px-3 py-1 rounded-full bg-pink-500/20">
            <Text className="font-psemibold text-xs capitalize text-pink-400">
              High
            </Text>
          </View>
        );
      case "urgent":
        return (
          <View className="px-3 py-1 rounded-full bg-red-600/20 animate-pulse">
            <Text className="font-psemibold text-xs capitalize text-red-500">
              Urgent
            </Text>
          </View>
        );
      default:
        return (
          <View className="px-3 py-1 rounded-full bg-gray-500/20">
            <Text className="font-psemibold text-xs capitalize text-gray-400">
              Unknown
            </Text>
          </View>
        );
    }
  }

  return (
    <Pressable
      className="w-full p-4 bg-gray/50 flex flex-row gap-4 items-start border-t border-white/10"
      onPress={() => router.push(`/forms/tasks/edit/${task.id}` as any)}
    >
      <Image source={images.logo1} className="w-8 h-8 rounded-full" />

      <View className="flex-1 gap-2 ">
        <View>
          <Text className="text-xs text-white/60 font-psemibold">
            {task.title}
          </Text>
          <Text className="text-sm text-white font-pbold line-clamp-2">
            {task.description}
          </Text>
        </View>

        <View className="flex-1 flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-2">
            <Calendar size={12} color="gray" />
            <Text className="text-xs text-lightgray font-psemibold">
              {new Date(task.due_date).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex flex-row  gap-2">
            {/* ✅ Status pill with bottom sheet */}
            <SelectBottomSheet
              options={[
                { label: "Ongoing", value: "ongoing" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
                { label: "On Hold", value: "onhold" },
              ]}
              value={status}
              onChange={handleStatusChange}
              title={`Update ${task.title} status`}
              trigger={renderStatus(status)}
            />

            {renderPriority(task.priority)}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
