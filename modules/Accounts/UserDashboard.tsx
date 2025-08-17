import { DataList } from "@/components";
import { Text } from "react-native";
import { UserCard } from "./components/UserCard";
import { UserSchemaWithId } from "./form/userSchema";

export function UserDashboard() {
  return (
    <DataList<UserSchemaWithId>
      queryKey={["users"]}
      endpoint="/accounts/v1/users/"
      renderItem={(item) => (
        <UserCard
          id={item.id}
          name={item.full_name}
          role="Admin"
          position="Project Manager"
          img={item.profile_picture?.file}
        />
      )}
      ListEmptyComponent={() => <Text>No data</Text>}
      addButtonPath="/forms/accounts/new"
    />
  );
}
