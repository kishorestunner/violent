import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-green-500">
        Welcome {user?.name}
      </Text>

      <Text className="mt-2 text-gray-600">
        User ID: {user?.id}
      </Text>

      <Text className="mt-2 text-gray-600">
        Role: {user?.role}
      </Text>
    </View>
  );
}