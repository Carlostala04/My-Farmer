import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import React from "react";
import BackIcon from "./ui/back";
import { useTheme } from "@/contexts/ThemeContext";

type Action = {
  icon: React.ReactNode;
  onPress: () => void;
};

type ScreenHeaderProps = {
  title: string;
  actions?: Action[];
};

const ScreenHeader = ({ title, actions = [] }: ScreenHeaderProps) => {
  const { t } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: t.card, borderBottomColor: t.border }]}>
      <BackIcon/>
      <Text style={[styles.title, { color: t.title }]}>{title}</Text>
      {actions.length > 0 && (
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={styles.actionButton}
            >
              {action.icon}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 8,
    flexShrink: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
    marginLeft: "auto",
  },
  actionButton: {
    padding: 4,
  },
});

export default ScreenHeader;