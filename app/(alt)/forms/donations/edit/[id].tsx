import { useApiQuery } from "@/hooks/useApiQuery";
import { DonationForm } from "@/modules";
import { DonationSchemaWithId } from "@/modules/Donations/form/donation.schema";
import { useLocalSearchParams } from "expo-router";
import { LoaderCircle } from "lucide-react-native";
import { View } from "react-native";

export default function DonationEdit() {
  const { id } = useLocalSearchParams();

  const { data: dontaion, isLoading } = useApiQuery<DonationSchemaWithId>(
    ["donations", id],
    `/donations/v1/donations/${id}/`
  );

  if (isLoading) {
    return (
      <View className="bg-background h-full flex items-center justify-center">
        <View className="animate-spin">
          <LoaderCircle size={24} color="#F1F1F1" className="mx-auto " />
        </View>
      </View>
    );
  }

  return <DonationForm initialData={dontaion} />;
}
