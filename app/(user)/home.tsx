import TripClosingForm from "@/components/ui/TripClosingForm";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSubmit = (data: any) => {
    // TODO: send `data` to your API
    console.log("Trip closing submitted by", user?.id, data);
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-bold text-green-500">Welcome {user?.name}</Text>
          <Text className="text-gray-600">
            ID: {user?.id} · Role: {user?.role}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <TripClosingForm onSubmit={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}