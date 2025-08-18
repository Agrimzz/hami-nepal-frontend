import { DataList } from "@/components";
import { useDelete } from "@/hooks/useDelete";
import { Alert, Text, View } from "react-native";
import { TaskCard } from "./components/TaskCard";
import { TaskSchemaWithId } from "./form/taskSchema";

export function Tasks() {
  const { mutate: deleteTask, isPending } = useDelete("/tasks/v1/tasks/", [
    "tasks",
  ]);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTask(id),
        },
      ]
    );
  };
  return (
    <DataList<TaskSchemaWithId>
      queryKey={["tasks"]}
      endpoint="/tasks/v1/tasks/"
      ListHeaderComponent={
        <View className=" px-4">
          <View className="flex-1 flex flex-row justify-between flex-wrap ">
            <View className="w-[49%] h-[150] justify-between rounded-2xl bg-gray/50 p-4 mt-2">
              <Text className="text-xs font-psemibold text-white">
                Ongoing Tasks
              </Text>
              <Text className="text-4xl font-pbold text-white">10</Text>
            </View>
            <View className="w-[49%] h-[150] justify-between rounded-2xl bg-gray/50 p-4 mt-2">
              <Text className="text-xs font-psemibold text-white">
                Completed Tasks
              </Text>
              <Text className="text-4xl font-pbold text-white">34</Text>
            </View>
            <View className="w-[49%] h-[150] justify-between rounded-2xl bg-gray/50 p-4 mt-2">
              <Text className="text-xs font-psemibold text-white">
                Cancelled Tasks
              </Text>
              <Text className="text-4xl font-pbold text-white">7</Text>
            </View>
            <View className="w-[49%] h-[150] justify-between rounded-2xl bg-gray/50 p-4 mt-2">
              <Text className="text-xs font-psemibold text-white">
                Onhold Tasks
              </Text>
              <Text className="text-4xl font-pbold text-white">13</Text>
            </View>
          </View>

          <View className="mt-4 mb-2">
            <Text className="text-base text-white font-psemibold">
              Recent Tasks
            </Text>
          </View>
        </View>
      }
      renderItem={(item) => <TaskCard task={item} />}
      addButtonPath="/forms/tasks/new"
      disablePadding
    />
  );
}
