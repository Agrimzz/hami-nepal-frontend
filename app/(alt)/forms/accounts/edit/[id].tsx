import { useApiQuery } from "@/hooks/useApiQuery";
import { UserForm } from "@/modules";
import { UserSchemaWithId } from "@/modules/Accounts/form/userSchema";
import { useLocalSearchParams } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { View } from "react-native";

export default function UserFormEdit() {
  const { id } = useLocalSearchParams();

  const { data: user, isLoading } = useApiQuery<UserSchemaWithId>(
    ["user", id],
    `/accounts/v1/users/${id}/`
  );

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <View className="animate-spin">
          <LoaderCircle size={24} color="#F1F1F1" className="mx-auto " />
        </View>
      </View>
    );
  return <UserForm initialData={user} />;
}
