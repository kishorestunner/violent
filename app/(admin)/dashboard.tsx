
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setLoggingOut(true);

              // Clear authentication state
              setUser(null);

              // Navigate to login
              router.replace("/(auth)/login");
            } catch (error) {
              Alert.alert("Error", "Unable to logout.");
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-5 pt-8">

        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-sm text-slate-500">
              Welcome back,
            </Text>

            <Text className="text-2xl font-bold text-slate-900">
              {user?.name || "Administrator"}
            </Text>
          </View>

          <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white font-bold text-lg">
              A
            </Text>
          </View>
        </View>

        {/* Dashboard Title */}
        <View className="bg-blue-600 rounded-2xl p-6 mb-6">
          <Text className="text-blue-100 text-sm font-medium">
            ADMIN PANEL
          </Text>

          <Text className="text-white text-2xl font-bold mt-2">
            Admin Dashboard
          </Text>

          <Text className="text-blue-100 mt-2">
            Manage and monitor your application.
          </Text>
        </View>

        {/* User Information */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-slate-200">
          <Text className="text-lg font-bold text-slate-900 mb-4">
            Account Information
          </Text>

          <View className="mb-3">
            <Text className="text-slate-500 text-sm">
              User ID
            </Text>
            <Text className="text-slate-900 font-semibold mt-1">
              {user?.id || "Not available"}
            </Text>
          </View>

          <View>
            <Text className="text-slate-500 text-sm">
              Account Role
            </Text>
            <Text className="text-blue-600 font-semibold mt-1">
              {user?.role || "Admin"}
            </Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.8}
          className="bg-red-500 rounded-xl py-4 flex-row items-center justify-center"
        >
          {loggingOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Logout
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-center text-slate-400 text-xs mt-8">
          Violent Admin Panel
        </Text>

      </View>
    </SafeAreaView>
  );
}
