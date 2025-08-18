import { useApiQuery } from "@/hooks/useApiQuery";
import { TaskForm } from "@/modules";
import { TaskSchemaWithId } from "@/modules/Tasks/form/taskSchema";
import { useLocalSearchParams } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { View } from "react-native";

export default function TaskEdit() {
  const { id } = useLocalSearchParams();

  const { data: task, isLoading } = useApiQuery<TaskSchemaWithId>(
    ["tasks", id],
    `/tasks/v1/tasks/${id}/`
  );

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <View className="animate-spin">
          <LoaderCircle size={24} color="#F1F1F1" className="mx-auto " />
        </View>
      </View>
    );
  return <TaskForm initialData={task} />;
}
