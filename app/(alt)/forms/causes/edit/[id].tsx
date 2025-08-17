import { useApiQuery } from "@/hooks/useApiQuery";
import { CauseForm } from "@/modules";
import { CauseSchemaWithId } from "@/modules/Causes/form/causeSchema";
import { useLocalSearchParams } from "expo-router";

export default function CauseEdit() {
  const { id } = useLocalSearchParams();

  const { data: cause, isLoading } = useApiQuery<CauseSchemaWithId>(
    ["cause", id],
    `/causes/v1/causes/${id}/`
  );

  return <CauseForm initialData={cause} />;
}
