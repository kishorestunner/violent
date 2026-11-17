import React, { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

/* ---------- helpers ---------- */

const num = (v: string) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};
const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2).replace(/\.00$/, "") : "0");

/* ---------- small UI pieces ---------- */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="mb-4 rounded-xl border border-blue-900/30 bg-white overflow-hidden">
    <View className="bg-blue-900 px-3 py-2">
      <Text className="text-white font-semibold text-center">{title}</Text>
    </View>
    <View className="p-3">{children}</View>
  </View>
);

type FieldProps = {
  label: string;
  value: string;
  onChangeText?: (t: string) => void;
  numeric?: boolean;
  readOnly?: boolean;
  placeholder?: string;
};

const Field = ({ label, value, onChangeText, numeric, readOnly, placeholder }: FieldProps) => (
  <View className="mb-3">
    <Text className="text-xs text-gray-600 mb-1">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      editable={!readOnly}
      keyboardType={numeric ? "decimal-pad" : "default"}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      className={`border rounded-lg px-3 py-2 text-base ${
        readOnly
          ? "bg-gray-100 border-gray-200 text-gray-800 font-semibold"
          : "bg-white border-gray-300 text-gray-900"
      }`}
    />
  </View>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-row gap-3">
    {React.Children.map(children, (c) => (
      <View className="flex-1">{c}</View>
    ))}
  </View>
);

/* ---------- main form ---------- */

const EXPENSE_KEYS = [
  ["rtoFine", "1. RTO Fine"],
  ["parking", "2. Parking"],
  ["policeFine", "3. Police Fine"],
  ["greese", "4. Greese"],
  ["others", "5. Others"],
  ["toll", "6. Toll"],
] as const;

const SETTLEMENT_ROWS = ["1. Driver", "2. Driver", "3. Adjustment", "4. Others"];

export default function TripClosingForm({
  serialNo = "",
  onSubmit,
}: {
  serialNo?: string;
  onSubmit?: (data: any) => void;
}) {
  // header
  const [head, setHead] = useState({
    slNo: serialNo,
    vehNumber: "",
    tripAdv: "",
    tripDate: "",
    driver1: "",
    tripTo: "",
    closingDate: "",
    driver2: "",
    attenderName: "",
  });

  // other expenses
  const [exp, setExp] = useState<Record<string, string>>({
    rtoFine: "", parking: "", policeFine: "", greese: "", others: "", toll: "",
  });

  // km / fuel
  const [fuel, setFuel] = useState({
    previousKm: "", currentKm: "", totalLitre: "", bunkName: "",
  });

  // money
  const [money, setMoney] = useState({
    pnrCollection: "", agentCollection: "", wayTicket: "",
    tripExpenses: "", advance: "",
  });

  // settlement
  const [settle, setSettle] = useState(
    SETTLEMENT_ROWS.map(() => ({ name: "", id: "", amount: "", paid: "" }))
  );

  // signatures
  const [sign, setSign] = useState({ driver: "", cashier: "", checkedBy: "" });

  /* ----- calculations (edit these if your accounts work differently) ----- */
  const calc = useMemo(() => {
    const totalKm = Math.max(0, num(fuel.currentKm) - num(fuel.previousKm));
    const average = num(fuel.totalLitre) > 0 ? totalKm / num(fuel.totalLitre) : 0;

    const otherExpenses = Object.values(exp).reduce((s, v) => s + num(v), 0);
    const totalExpenses = otherExpenses + num(money.tripExpenses);

    const collectionAmount =
      num(money.pnrCollection) + num(money.agentCollection) + num(money.wayTicket);

    // Balance = what was spent beyond the advance given
    const balance = totalExpenses - num(money.advance);
    // Total / Refund = collection after settling expenses against advance
    const totalRefund = collectionAmount - balance;

    return { totalKm, average, otherExpenses, totalExpenses, collectionAmount, balance, totalRefund };
  }, [exp, fuel, money]);

  const setH = (k: keyof typeof head) => (t: string) => setHead((p) => ({ ...p, [k]: t }));
  const setF = (k: keyof typeof fuel) => (t: string) => setFuel((p) => ({ ...p, [k]: t }));
  const setM = (k: keyof typeof money) => (t: string) => setMoney((p) => ({ ...p, [k]: t }));
  const setS = (i: number, k: "name" | "id" | "amount" | "paid") => (t: string) =>
    setSettle((p) => p.map((r, idx) => (idx === i ? { ...r, [k]: t } : r)));

  const handleSubmit = () => {
    if (!head.vehNumber.trim() || !head.driver1.trim()) {
      Alert.alert("Missing details", "Enter the vehicle number and Driver 1 before saving.");
      return;
    }
    const payload = {
      ...head,
      otherExpensesDetail: exp,
      ...fuel,
      ...money,
      ...calc,
      settlement: SETTLEMENT_ROWS.map((label, i) => ({ label, ...settle[i] })),
      signatures: sign,
    };
    onSubmit ? onSubmit(payload) : console.log("TRIP CLOSING:", payload);
    Alert.alert("Saved", "Trip closing recorded.");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 bg-blue-50"
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View className="items-center mb-4">
          <Text className="text-xs bg-blue-900 text-white px-3 py-1 rounded">TRIP CLOSING</Text>
          <Text className="text-lg font-bold text-blue-900 mt-2">YBM Travels Private Limited</Text>
          <Text className="text-xs text-gray-500 text-center">
            Lakshmipuram, Kolathur, Chennai - 600 099
          </Text>
        </View>

        {/* Header details */}
        <Section title="Trip details">
          <Row>
            <Field label="Sl. No" value={head.slNo} onChangeText={setH("slNo")} />
            <Field label="Veh Number" value={head.vehNumber} onChangeText={setH("vehNumber")} />
          </Row>
          <Row>
            <Field label="Driver 1" value={head.driver1} onChangeText={setH("driver1")} />
            <Field label="Driver 2" value={head.driver2} onChangeText={setH("driver2")} />
          </Row>
          <Row>
            <Field label="Trip Adv" value={head.tripAdv} onChangeText={setH("tripAdv")} numeric />
            <Field label="Trip To" value={head.tripTo} onChangeText={setH("tripTo")} />
          </Row>
          <Row>
            <Field label="Trip Date" value={head.tripDate} onChangeText={setH("tripDate")} placeholder="DD/MM/YYYY" />
            <Field label="Closing Date" value={head.closingDate} onChangeText={setH("closingDate")} placeholder="DD/MM/YYYY" />
          </Row>
          <Field label="Attender Name" value={head.attenderName} onChangeText={setH("attenderName")} />
        </Section>

        {/* Other expenses */}
        <Section title="Other expenses">
          {EXPENSE_KEYS.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={exp[key]}
              onChangeText={(t) => setExp((p) => ({ ...p, [key]: t }))}
              numeric
              placeholder="0"
            />
          ))}
        </Section>

        {/* KM & fuel */}
        <Section title="Kilometres and fuel">
          <Row>
            <Field label="Previous KM" value={fuel.previousKm} onChangeText={setF("previousKm")} numeric />
            <Field label="Current KM" value={fuel.currentKm} onChangeText={setF("currentKm")} numeric />
          </Row>
          <Row>
            <Field label="Total KM" value={fmt(calc.totalKm)} readOnly />
            <Field label="Total Litre" value={fuel.totalLitre} onChangeText={setF("totalLitre")} numeric />
          </Row>
          <Row>
            <Field label="Average (KM/L)" value={fmt(calc.average)} readOnly />
            <Field label="Bunk Name" value={fuel.bunkName} onChangeText={setF("bunkName")} />
          </Row>
        </Section>

        {/* Collection */}
        <Section title="Collection">
          <Field label="PNR Collection" value={money.pnrCollection} onChangeText={setM("pnrCollection")} numeric />
          <Field label="Agent Collection" value={money.agentCollection} onChangeText={setM("agentCollection")} numeric />
          <Field label="Way Ticket" value={money.wayTicket} onChangeText={setM("wayTicket")} numeric />
          <Field label="Collection Amount" value={fmt(calc.collectionAmount)} readOnly />
        </Section>

        {/* Accounts */}
        <Section title="Accounts">
          <Field label="Trip Expenses" value={money.tripExpenses} onChangeText={setM("tripExpenses")} numeric />
          <Field label="Other Expenses" value={fmt(calc.otherExpenses)} readOnly />
          <Field label="Total Expenses" value={fmt(calc.totalExpenses)} readOnly />
          <Field label="Advance" value={money.advance} onChangeText={setM("advance")} numeric />
          <Field label="Balance" value={fmt(calc.balance)} readOnly />
          <View className="rounded-lg bg-blue-900 p-3 flex-row justify-between items-center">
            <Text className="text-white font-semibold">Total / Refund</Text>
            <Text className="text-white text-xl font-bold">₹ {fmt(calc.totalRefund)}</Text>
          </View>
        </Section>

        {/* Driver & cleaner settlement */}
        <Section title="Driver & cleaner settlement">
          {SETTLEMENT_ROWS.map((label, i) => (
            <View key={label} className="mb-3 pb-3 border-b border-gray-100">
              <Text className="font-semibold text-blue-900 mb-2">{label}</Text>
              <Row>
                <Field label="Name" value={settle[i].name} onChangeText={setS(i, "name")} />
                <Field label="ID" value={settle[i].id} onChangeText={setS(i, "id")} />
              </Row>
              <Row>
                <Field label="Amount" value={settle[i].amount} onChangeText={setS(i, "amount")} numeric />
                <Field label="Paid" value={settle[i].paid} onChangeText={setS(i, "paid")} numeric />
              </Row>
            </View>
          ))}
        </Section>

        {/* Signatures */}
        <Section title="Sign-off">
          <Field label="Driver Sign" value={sign.driver} onChangeText={(t) => setSign((p) => ({ ...p, driver: t }))} />
          <Field label="Cashier Sign" value={sign.cashier} onChangeText={(t) => setSign((p) => ({ ...p, cashier: t }))} />
          <Field label="Checked By" value={sign.checkedBy} onChangeText={(t) => setSign((p) => ({ ...p, checkedBy: t }))} />
        </Section>

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          className="bg-green-600 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-bold text-base">Save trip closing</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}