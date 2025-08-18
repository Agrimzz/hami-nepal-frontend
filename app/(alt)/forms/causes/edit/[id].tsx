import { useApiQuery } from "@/hooks/useApiQuery";
import { CauseForm } from "@/modules";
import { CauseSchemaWithId } from "@/modules/Causes/form/causeSchema";
import { useLocalSearchParams } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { View } from "react-native";

export default function CauseEdit() {
  const { id } = useLocalSearchParams();

  const { data: cause, isLoading } = useApiQuery<CauseSchemaWithId>(
    ["cause", id],
    `/causes/v1/causes/${id}/`
  );

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <View className="animate-spin">
          <LoaderCircle size={24} color="#F1F1F1" className="mx-auto " />
        </View>
      </View>
    );

  return <CauseForm initialData={cause} />;
}
