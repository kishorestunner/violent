import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../hooks/useAuth";
import { loginApi } from "../../services/api";

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user: any = await loginApi(userId, password);

      setUser(user);

      if (user.role === "admin") {
        router.replace("/(admin)/dashboard");
      } else if (user.role === "vendor") {
        router.replace("/(vendor)/dashboard");
      } else {
        router.replace("/(user)/home");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", String(error));
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-10 text-center">
        Violent Login
      </Text>

      <TextInput
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        autoCapitalize="characters"
        className="border border-gray-300 rounded-xl p-4 mb-4"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border border-gray-300 rounded-xl p-4 mb-6"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-black p-4 rounded-xl"
      >
        <Text className="text-white text-center font-bold text-lg">
          Login
        </Text>
      </TouchableOpacity>

      <View className="mt-10">
        <Text className="font-bold mb-2">Demo Accounts</Text>

        <Text>Admin 1 : ADM001 / 123456</Text>
        <Text>Admin 2 : ADM002 / 123456</Text>

        <Text className="mt-2">Vendor 1 : VEN001 / 123456</Text>
        <Text>Vendor 2 : VEN002 / 123456</Text>

        <Text className="mt-2">User 1 : USR001 / 123456</Text>
        <Text>User 2 : USR002 / 123456</Text>
      </View>
    </View>
  );
}