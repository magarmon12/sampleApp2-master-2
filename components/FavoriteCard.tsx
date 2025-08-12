// components/FavoriteCard.tsx
import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export type FavoriteItem = {
  $id: string;
  placeId: string;
  title?: string;
  description?: string;
  imageUrl?: string;
};

type Props = {
  item: FavoriteItem;
  onDelete: (docId: string) => void;
  onPress?: (placeId: string) => void; // optional: open details
};

function FavoriteCardBase({ item, onDelete, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(item.placeId)}
      accessibilityLabel={item.title ?? "Open favourite"}
    >
      <View style={styles.card}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title ?? "Untitled"}
          </Text>
          {!!item.description && (
            <Text numberOfLines={2} style={styles.desc}>
              {item.description}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onDelete(item.$id)}
          style={styles.deleteBtn}
          accessibilityRole="button"
          accessibilityLabel="Delete favourite"
        >
          <Text style={styles.deleteTxt}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const FavoriteCard = memo(FavoriteCardBase);
export default FavoriteCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 12,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontWeight: "600",
    color: "#666",
    fontSize: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700" },
  desc: { marginTop: 4, fontSize: 12, color: "#586270" },
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
  },
  deleteTxt: { color: "#d00", fontWeight: "700" },
});