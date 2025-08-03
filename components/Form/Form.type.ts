import { TextInputProps } from "react-native";

export type FormFieldProps = TextInputProps & {
  title: string;
  value: string | undefined;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  error?: string;
  type?: "text" | "password" | "number" | "email" | "decimal" | "phone";
};

export type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};
