import { Text, View } from "react-native";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black px-5 justify-center gap-5">

      <Text className="text-white text-4xl font-bold">
        Hello Kishore 🚀
      </Text>

      <Input placeholder="Enter Email" />

      <Input placeholder="Enter Password" />

      <Button
        title="Login"
        onPress={() => alert("Login Success")}
      />

    </View>
  );
}