import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { Link, usePathname } from 'expo-router';

import colors from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

import House from './ui/home_icon';
import AnimalsIcon from './ui/animals_icon';
import CultivosIcon from './ui/cultivos_icon';
import RecordatoriosIcon from './ui/recordatorios_icon';
import UserIcon from './ui/user';
type NavKey = 'home' | 'animales' | 'cultivos' | 'recordatorios' | 'perfil';

export default function navBar() {
  const pathname = usePathname();
  const { t } = useTheme();

  const items = useMemo(
    () =>
      [
        {
          key:'home' as const,
          label:"Home",
          href:"/home",
          renderIcon:(color:string) => <House color={color} size={24}/>
        },

        {
          key: 'animales' as const,
          label: 'Animales',
          href: '/animals' as any,
          renderIcon: (color: string) => <AnimalsIcon color={color} size={24} />,
        },
        {
          key: 'cultivos' as const,
          label: 'Cultivos',
          href: '/cultivos' as any,
          renderIcon: (color: string) => <CultivosIcon color={color} size={24} />,
        },
        {
          key: 'recordatorios' as const,
          label: 'Recordatorios',
          href: '/recordatorios' as any,
          renderIcon: (color: string) => <RecordatoriosIcon color={color} size={24} />,
        },
        {
          key: 'perfil' as const,
          label: 'Perfil',
          href: '/perfil' as any,
          renderIcon: (color: string) => <UserIcon stroke={color} color={color} width={22} height={22} />,
        },
      ] as const,
    []
  );

  return (
    <View style={[styles.navBar_container, { backgroundColor: t.navBar }]}>
      {items.map((item) => {
        const isSelected =
          item.href === '/'
            ? pathname === '/' || pathname === '/index'
            : pathname === item.href;
        const iconAndTextColor = isSelected ? colors.PRIMARY_GREEN : colors.LINK_GRAY;

        return (
          <Link key={item.key} href={item.href as any} asChild>
            <Pressable style={({ pressed }) => [pressed && styles.pressed]}>
              <View style={styles.item}>
                {item.renderIcon(iconAndTextColor)}
                <Text style={[styles.label, { color: iconAndTextColor }]}>
                  {item.label}
                </Text>
              </View>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
 navBar_container: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});