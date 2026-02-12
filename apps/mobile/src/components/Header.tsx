import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing, typography } from '../theme';

interface HeaderProps {
  tripName?: string;
  onMorePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ tripName = 'My Trip', onMorePress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.tripName}>{tripName}</Text>
      <TouchableOpacity onPress={onMorePress}>
        <Text style={styles.moreIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.lightBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tripName: {
    ...typography.h1,
    fontWeight: '600',
    marginHorizontal: spacing.xs,
  },
  moreIcon: {
    fontSize: 24,
    color: colors.peach,
  },
});

export default Header;
