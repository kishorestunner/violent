import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export default function Button({
  title,
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-blue-500 px-5 py-4 rounded-2xl"
    >
      <Text className="text-white text-center font-bold text-lg">
        {title}
      </Text>
    </TouchableOpacity>
  );
}