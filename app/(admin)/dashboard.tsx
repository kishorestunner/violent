import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {

  const handleLogout = () => {
    // logout logic
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      
      <Text className="text-2xl font-bold text-blue-500 mb-6">
        Admin Dashboard
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-bold text-lg">
          Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
}