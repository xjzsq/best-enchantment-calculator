import { Button, Card, Tag, Typography, Space, Divider, Alert } from 'antd';
import type { CalcResult, ForgeStep, EnchantLevel } from '../core/calculator';
import type { AppState } from '../App';
import { ENCHANTMENTS } from '../data/enchantments';
import { WEAPONS, ENCHANTED_BOOK_ICON } from '../data/weapons';
import { toRoman } from '../utils/roman';
import { useLocale } from '../i18n/useLocale';

const { Text, Title } = Typography;

interface Props {
  result: CalcResult;
  appState: AppState;
  onReset: () => void;
  onBack: () => void;
}

function EnchantTag({ el }: { el: EnchantLevel }) {
  const ench = ENCHANTMENTS.find(e => e.id === el.enchantmentId);
  if (!ench) return null;
  return (
    <Tag color="blue" style={{ marginBottom: 4 }}>
      {ench.nameZh} {toRoman(el.level)}
    </Tag>
  );
}

function ItemDisplay({ item, label, weaponIndex }: { item: ForgeStep['target']; label: string; weaponIndex: number }) {
  const { t, locale } = useLocale();
  const weapon = WEAPONS.find(w => w.index === weaponIndex);
  const iconSrc = item.isBook ? ENCHANTED_BOOK_ICON : (weapon?.icon ?? '');
  const weaponName = locale === 'zh' ? (weapon?.nameZh ?? t.itemLabel) : (weapon?.nameEn ?? t.itemLabel);
  const iconAlt = item.isBook ? t.enchantedBook : weaponName;

  return (
    <div style={{ flex: 1, minWidth: 180 }}>
      <Text strong>{label}</Text>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        <img src={iconSrc} alt={iconAlt} style={{ width: 24, height: 24, imageRendering: 'pixelated' }} />
        {item.isBook ? (
          <Tag color="green">{t.enchantedBook}</Tag>
        ) : (
          <Tag color="purple">{weaponName}</Tag>
        )}
        <Tag>{t.penaltyValue} {item.penalty}</Tag>
      </div>
      <div style={{ marginTop: 4 }}>
        {item.enchantments.map(el => (
          <EnchantTag key={el.enchantmentId} el={el} />
        ))}
      </div>
    </div>
  );
}

export default function Step3({ result, appState, onReset, onBack }: Props) {
  const { t } = useLocale();

  if (result.steps.length === 0) {
    return (
      <div>
        <Alert message={t.noSteps} type="info" />
        <div className="step-footer">
          <Button onClick={onBack}>{t.prevStep}</Button>
          <Button onClick={onReset}>{t.resetStep}</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Title level={4}>{t.enchantSteps(result.steps.length)}</Title>
      {result.tooExpensive && (
        <Alert
          message={t.tooExpensive}
          description={t.tooExpensiveDesc}
          type="error"
          showIcon
          style={{ marginBottom: 12 }}
        />
      )}
      {result.steps.map((step, idx) => {
        const stepTooExpensive = step.cost >= 40;
        return (
          <Card
            key={idx}
            size="small"
            style={{ marginBottom: 12, borderColor: stepTooExpensive ? '#ff4d4f' : undefined }}
            title={
              <Space>
                <Tag color={stepTooExpensive ? 'red' : 'orange'}>{t.step(idx + 1)}</Tag>
                <Text>{t.costLabel} <Text strong type="danger">{step.cost} {t.levelUnit}</Text></Text>
                {stepTooExpensive && <Tag color="red">{t.tooExpensiveTag}</Tag>}
              </Space>
            }
          >
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <ItemDisplay item={step.target} label={t.targetLabel} weaponIndex={appState.weaponIndex} />
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0' }}>
                <Text style={{ fontSize: 20 }}>+</Text>
              </div>
              <ItemDisplay item={step.sacrifice} label={t.sacrificeLabel} weaponIndex={appState.weaponIndex} />
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0' }}>
                <Text style={{ fontSize: 20 }}>→</Text>
              </div>
              <ItemDisplay item={step.result} label={t.resultLabel} weaponIndex={appState.weaponIndex} />
            </div>
          </Card>
        );
      })}

      <Divider />
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>{t.totalCost}</Text>
            <Text strong style={{ fontSize: 18, color: '#f5222d' }}>
              {result.totalCost} {t.levelUnit}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>{t.versionLabel}</Text>
            <Text>{appState.edition === 0 ? t.javaEditionShort : t.bedrockEditionShort}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>{t.algorithmLabel}</Text>
            <Text>{appState.algorithm}</Text>
          </div>
          {result.calcTimeMs != null && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>{t.calcTimeLabel}</Text>
              <Text>{result.calcTimeMs.toFixed(1)} ms</Text>
            </div>
          )}
        </Space>
      </Card>

      <div className="step-footer">
        <Button onClick={onBack}>{t.prevStep}</Button>
        <Button type="primary" onClick={onReset}>{t.resetStep}</Button>
      </div>
    </div>
  );
}
