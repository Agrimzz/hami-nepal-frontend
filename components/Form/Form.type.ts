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

export type Option = {
  label: string;
  value: string | number;
};

export type SelectBottomSheetProps = {
  options: Option[] | undefined;
  onChange: (value: Option | (string | number)[]) => void;
  title?: string;
  placeholder?: string;
  error?: string;
  multiple?: boolean;
};

export type DatePickerFieldProps = {
  title: string;
  value?: string | null;
  placeholder?: string;
  onChange: (val: string) => void;
  error?: string;
  mode?: "date" | "time";
  otherStyles?: string;
};
