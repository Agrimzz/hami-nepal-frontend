import { useApiQuery } from "@/hooks/useApiQuery";
import { EventForm } from "@/modules";
import { EventSchemaWithId } from "@/modules/Events/form/eventSchema";
import { useLocalSearchParams } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { View } from "react-native";

export default function EventEdit() {
  {
    const { id } = useLocalSearchParams();

    const { data: event, isLoading } = useApiQuery<EventSchemaWithId>(
      ["events", id],
      `/causes/v1/events/${id}/`
    );

    if (isLoading)
      return (
        <View className="flex-1 justify-center items-center bg-background">
          <View className="animate-spin">
            <LoaderCircle size={24} color="#F1F1F1" className="mx-auto " />
          </View>
        </View>
      );
    return <EventForm initialData={event} />;
  }
}
