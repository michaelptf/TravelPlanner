import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, shadows } from '../theme';

interface HeaderProps {
  tripName?: string;
  onMorePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ tripName = 'My Trip', onMorePress }) => (
  <View style={styles.header}>
    <Text style={styles.tripName}>{tripName}</Text>
    <TouchableOpacity onPress={onMorePress}>
      <Text style={styles.moreIcon}>⋮</Text>
    </TouchableOpacity>
  </View>
);

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
    fontSize: 24,
    fontWeight: '700',
    color: colors.darkText,
  },
  moreIcon: {
    fontSize: 24,
    color: colors.peach,
  },
});

export default Header;
