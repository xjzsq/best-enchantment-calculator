import { useState } from 'react';
import { Steps, Card, Typography, Layout, Button } from 'antd';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import type { EnchantLevel, Item, CalcResult } from './core/calculator';
import { calcDifficultyFirst, calcHamming } from './core/calculator';
import { getEnchantmentsForWeapon } from './data/enchantments';
import { useLocale } from './i18n/useLocale';
import './App.css';

const { Title } = Typography;

export interface AppState {
  edition: 0 | 1; // 0=Java, 1=Bedrock
  weaponIndex: number;
  initialEnchantments: EnchantLevel[];
  initialPenalty: number;
  targetEnchantments: EnchantLevel[];
  algorithm: 'DifficultyFirst' | 'Hamming';
  ignorePenalty: boolean;
}

const defaultState: AppState = {
  edition: 0,
  weaponIndex: 0,
  initialEnchantments: [],
  initialPenalty: 0,
  targetEnchantments: [],
  algorithm: 'DifficultyFirst',
  ignorePenalty: false,
};

export default function App() {
  const [current, setCurrent] = useState(0);
  const [appState, setAppState] = useState<AppState>(defaultState);
  const [result, setResult] = useState<CalcResult | null>(null);
  const { locale, setLocale, t } = useLocale();

  function handleStep1Next(state: Partial<AppState>) {
    const newState = { ...appState, ...state };
    // Filter target enchantments: remove those now at max level on the weapon
    // and those no longer available for this weapon/edition
    const available = getEnchantmentsForWeapon(
      newState.weaponIndex,
      newState.edition === 0 ? 0 : 1
    );
    const filteredTargets = newState.targetEnchantments.filter(te => {
      const enchData = available.find(e => e.id === te.enchantmentId);
      if (!enchData) return false; // enchantment not available for this weapon
      const initial = newState.initialEnchantments.find(ie => ie.enchantmentId === te.enchantmentId);
      if (initial && initial.level >= enchData.maxLevel) return false; // already at max level
      return true;
    });
    setAppState({ ...newState, targetEnchantments: filteredTargets });
    setCurrent(1);
  }

  function handleStep2Calculate(state: Partial<AppState>) {
    const newState = { ...appState, ...state };
    setAppState(newState);

    const isJava = newState.edition === 0;
    const weapon: Item = {
      id: 'weapon',
      label: t.weaponLabel,
      isBook: false,
      enchantments: newState.initialEnchantments,
      penalty: newState.initialPenalty,
    };

    let calcResult: CalcResult;
    const startTime = performance.now();
    if (newState.algorithm === 'DifficultyFirst') {
      calcResult = calcDifficultyFirst(weapon, newState.targetEnchantments, isJava, newState.ignorePenalty);
    } else {
      calcResult = calcHamming(weapon, newState.targetEnchantments, isJava, newState.ignorePenalty);
    }
    const calcTime = performance.now() - startTime;
    setResult({ ...calcResult, calcTimeMs: calcTime });
    setCurrent(2);
  }

  function handleReset() {
    setAppState(defaultState);
    setResult(null);
    setCurrent(0);
  }

  const steps = [
    { title: t.step1Title, description: t.step1Desc },
    { title: t.step2Title, description: t.step2Desc },
    { title: t.step3Title, description: t.step3Desc },
  ];

  return (
    <Layout className="app-container">
      <a
        href="https://github.com/xjzsq/mc-optimal-enchantment-order-calculator"
        className="github-corner"
        target="_blank"
        rel="noreferrer"
        aria-label={t.viewOnGitHub}
      >
        <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true" style={{ fill: '#151513', color: '#fff' }}>
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: '130px 106px' }} className="octo-arm" />
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.7,65.4 C194.3,69.0 197.4,73.1 199.8,77.4 C213.5,80.1 215.9,84.8 215.9,84.8 C212.4,93.0 206.6,95.9 205.0,96.6 C204.8,102.4 202.6,107.8 198.0,112.5 C181.6,128.9 168.0,122.5 157.4,114.1 C157.2,116.4 156.4,120.0 153.9,123.2 L141.9,135.1 C140.8,136.2 142.2,140.0 142.3,139.9 L115.0,115.0 Z" fill="currentColor" className="octo-body" />
        </svg>
      </a>
      <Layout.Content style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <Title level={2} style={{ margin: 0 }}>
            {t.appTitle}
          </Title>
          <Button
            size="small"
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </Button>
        </div>
        <Card style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
          <Steps current={current} items={steps} style={{ marginBottom: 32 }} />
          {current === 0 && (
            <Step1 appState={appState} onNext={handleStep1Next} />
          )}
          {current === 1 && (
            <Step2
              appState={appState}
              onBack={() => setCurrent(0)}
              onCalculate={handleStep2Calculate}
            />
          )}
          {current === 2 && result && (
            <Step3 result={result} appState={appState} onReset={handleReset} onBack={() => setCurrent(1)} />
          )}
        </Card>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
        {t.footerText} &copy;2026 {t.craftedBy}{' '}
        <a href="https://xjzsq.cn" target="_blank" rel="noreferrer">xjzsq</a>
        {t.craftedByPost}{' '}{t.poweredByLabel}{' '}
        <a href="https://reactjs.org/" target="_blank" rel="noreferrer">React</a>
        {t.poweredByPost}
      </Layout.Footer>
    </Layout>
  );
}
