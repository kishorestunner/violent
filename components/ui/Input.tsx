import { TextInput } from "react-native";

type InputProps = {
  placeholder: string;
};

export default function Input({
  placeholder,
}: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="gray"
      className="bg-zinc-900 border border-zinc-700 text-white rounded-2xl px-4 py-4"
    />
  );
}