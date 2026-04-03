import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";

type DataItem = {
  id: number;
  nombre: string;
};

type DropdownProps = {
  data: DataItem[];
  placeholder: string;
  value?: string | number;
  onValueChange?: (value: string | number) => void;
};

//data = representa cualquier entidad de la base de datos
export default function Dropdown({ data, placeholder, value, onValueChange }: DropdownProps) {
  const [internalValue, setInternalValue] = useState<string | number>("");

  const selectedValue = value !== undefined ? value : internalValue;

  const handleChange = (itemValue: string | number) => {
    if (onValueChange) {
      onValueChange(itemValue);
    } else {
      setInternalValue(itemValue);
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={handleChange}
        style={styles.picker}
        dropdownIconColor="#4CAF50"
      >
        <Picker.Item label={placeholder} value="" />
        {data.map((item) => (
          <Picker.Item key={item.id} label={item.nombre} value={item.id} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#333",
  },
});
