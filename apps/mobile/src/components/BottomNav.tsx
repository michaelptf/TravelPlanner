import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../theme';

export type TabName = 'infos' | 'schedule' | 'map' | 'goals' | 'expenses';

interface BottomNavProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const tabIcons: Record<TabName, string> = {
  infos: '🧾',
  schedule: '📅',
  map: '🗺️',
  goals: '🎯',
  expenses: '💰',
};

const tabLabels: Record<TabName, string> = {
  infos: 'Infos',
  schedule: 'Schedule',
  map: 'Map',
  goals: 'Goals',
  expenses: 'Expenses',
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress }) => (
  <View style={styles.container}>
    {(Object.keys(tabIcons) as TabName[]).map((tab) => (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, activeTab === tab && styles.activeTab]}
        onPress={() => onTabPress(tab)}
      >
        <Text style={styles.icon}>{tabIcons[tab]}</Text>
        <Text style={[styles.label, activeTab === tab && styles.activeLabel]}>{tabLabels[tab]}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.warmCream,
    borderRadius: 12,
  },
  icon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.mutedText,
  },
  activeLabel: {
    color: colors.coral,
    fontWeight: '600',
  },
});

export default BottomNav;
