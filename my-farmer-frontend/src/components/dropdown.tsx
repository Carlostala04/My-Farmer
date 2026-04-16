import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import Colors from "@/constants/colors";

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

export default function Dropdown({
  data,
  placeholder,
  value,
  onValueChange,
}: DropdownProps) {
  const { t } = useTheme();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number>("");

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedItem = data.find((item) => item.id === selectedValue);

  const handleSelect = (itemId: number) => {
    if (onValueChange) {
      onValueChange(itemId);
    } else {
      setInternalValue(itemId);
    }
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          { backgroundColor: t.input, borderColor: t.border },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text
          style={
            selectedItem
              ? [styles.selectedText, { color: t.title }]
              : styles.placeholder
          }
        >
          {selectedItem ? selectedItem.nombre : placeholder}
        </Text>
        <Text style={[styles.arrow, { color: Colors.PRIMARY_GREEN }]}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.sheet, { backgroundColor: t.card }]}>
                <Text style={[styles.sheetTitle, { color: t.title }]}>
                  {placeholder}
                </Text>
                <FlatList
                  data={data}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.item,
                        { borderBottomColor: t.border },
                        selectedValue === item.id && styles.itemActive,
                      ]}
                      onPress={() => handleSelect(item.id)}
                    >
                      <Text
                        style={[
                          styles.itemText,
                          { color: t.title },
                          selectedValue === item.id && styles.itemTextActive,
                        ]}
                      >
                        {item.nombre}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  selectedText: {
    fontSize: 15,
    flex: 1,
  },
  placeholder: {
    fontSize: 15,
    color: Colors.PLACEHOLDER_GRAY,
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  itemActive: {
    backgroundColor: Colors.PRIMARY_GREEN + "20",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 15,
  },
  itemTextActive: {
    color: Colors.PRIMARY_GREEN,
    fontWeight: "600",
  },
});
