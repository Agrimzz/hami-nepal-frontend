import { useApiQuery } from "@/hooks/useApiQuery";
import { RolesForm } from "@/modules";
import { RoleSchemaWithId } from "@/modules/Roles/form/roleSchema";
import { useLocalSearchParams } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { View } from "react-native";

export default function RolesFormEdit() {
  const { id } = useLocalSearchParams();

  const { data: role, isLoading } = useApiQuery<RoleSchemaWithId>(
    ["roles", id],
    `/accounts/v1/groups/${id}/`
  );

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <View className="animate-spin">
          <LoaderCircle size={24} color="#F1F1F1" className="mx-auto " />
        </View>
      </View>
    );
  return <RolesForm initialData={role} />;
}
