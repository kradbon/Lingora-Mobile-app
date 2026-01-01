import React, { useCallback, useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import Icon from './Icon';
import type { IconName } from './Icon';
import { getHeartRefillInfo, type HeartRefillInfo } from '../player';
import { useI18n } from '../i18n';

const brandIcon = require('../../assets/images/lingora-icon.png');

type Props = {
  streak: number;
  gems: number;
  hearts: number;
};

const StatPill = ({
  icon,
  value,
  tint,
  onPress,
}: {
  icon: IconName;
  value: number;
  tint: string;
  onPress?: () => void;
}) =>
  onPress ? (
    <Pressable style={s.pill} onPress={onPress}>
      <Icon name={icon} size={16} color={tint} />
      <Text style={s.pillText}>{value}</Text>
    </Pressable>
  ) : (
    <View style={s.pill}>
      <Icon name={icon} size={16} color={tint} />
      <Text style={s.pillText}>{value}</Text>
    </View>
  );

const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
};

export default function TopBar({ streak, gems, hearts }: Props) {
  const { t } = useI18n();
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [refillInfo, setRefillInfo] = useState<HeartRefillInfo | null>(null);
  const [infoAt, setInfoAt] = useState(0);
  const [tick, setTick] = useState(0);

  const refreshHeartsInfo = useCallback(async () => {
    const info = await getHeartRefillInfo();
    setRefillInfo(info);
    setInfoAt(Date.now());
  }, []);

  useEffect(() => {
    if (!showHeartsModal) return undefined;
    refreshHeartsInfo();
    const timer = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [showHeartsModal, refreshHeartsInfo]);

  useEffect(() => {
    if (!showHeartsModal || !refillInfo) return;
    if (refillInfo.hearts >= refillInfo.maxHearts) return;
    const elapsed = Date.now() - infoAt;
    const nextMs = (refillInfo.nextRefillMs ?? 0) - elapsed;
    if (nextMs <= 0) refreshHeartsInfo();
  }, [tick, showHeartsModal, refillInfo, infoAt, refreshHeartsInfo]);

  const elapsed = refillInfo ? Date.now() - infoAt : 0;
  const nextMs =
    refillInfo?.nextRefillMs === null || refillInfo?.nextRefillMs === undefined
      ? null
      : Math.max(0, refillInfo.nextRefillMs - elapsed);
  const fullMs =
    refillInfo?.fullRefillMs === null || refillInfo?.fullRefillMs === undefined
      ? null
      : Math.max(0, refillInfo.fullRefillMs - elapsed);

  return (
    <>
      <SafeAreaView edges={['top']} style={s.safe}>
        <View style={s.row}>
          <View style={s.left}>
            <View style={s.brand}>
              <Image source={brandIcon} style={s.brandImage} resizeMode="contain" />
            </View>
            <Text style={s.brandText}>WebMaster</Text>
          </View>
          <View style={s.right}>
            <StatPill icon="fire" value={streak} tint={colors.warning} />
            <StatPill icon="diamond" value={gems} tint={colors.primary} />
            <StatPill
              icon="heart"
              value={hearts}
              tint={colors.danger}
              onPress={() => setShowHeartsModal(true)}
            />
          </View>
        </View>
      </SafeAreaView>

      <Modal transparent visible={showHeartsModal} animationType="fade" onRequestClose={() => setShowHeartsModal(false)}>
        <View style={s.modalWrap}>
          <Pressable style={s.modalBackdrop} onPress={() => setShowHeartsModal(false)} />
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{t('hearts.title')}</Text>
            {!refillInfo ? (
              <Text style={s.modalText}>{t('common.loading')}</Text>
            ) : refillInfo.hearts >= refillInfo.maxHearts ? (
              <Text style={s.modalText}>{t('hearts.full')}</Text>
            ) : (
              <>
                <Text style={s.modalText}>
                  {t('hearts.next', { time: formatDuration(nextMs ?? 0) })}
                </Text>
                <Text style={s.modalSub}>
                  {t('hearts.fullIn', { time: formatDuration(fullMs ?? 0) })}
                </Text>
              </>
            )}
            <Pressable style={s.modalClose} onPress={() => setShowHeartsModal(false)}>
              <Text style={s.modalCloseText}>{t('profile.menuClose')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  safe: { backgroundColor: colors.bg1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.bg1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brand: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandImage: { width: 26, height: 26 },
  brandText: { color: colors.text, fontWeight: '900', fontSize: 14, letterSpacing: 0.4 },
  pill: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  modalWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  modalTitle: { color: colors.text, fontWeight: '900', fontSize: 16, marginBottom: 8 },
  modalText: { color: colors.text, fontWeight: '700' },
  modalSub: { color: colors.muted, fontWeight: '700', marginTop: 6 },
  modalClose: {
    marginTop: 14,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card2,
  },
  modalCloseText: { color: colors.text, fontWeight: '800', fontSize: 12 },
});
