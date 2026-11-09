import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  CollectionCenter,
  RewardItem,
  RecycleTransaction,
  RedeemedCoupon,
  MaterialCategory,
  MaterialWeightItem,
  GlobalImpactStats,
  DropOffEstimate,
} from '../types';
import {
  INITIAL_CENTERS,
  INITIAL_USERS,
  INITIAL_REWARDS,
  INITIAL_TRANSACTIONS,
  MATERIAL_TARIFFS,
} from '../data/initialData';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  currentRole: UserRole;
  centers: CollectionCenter[];
  rewards: RewardItem[];
  transactions: RecycleTransaction[];
  coupons: RedeemedCoupon[];
  estimates: DropOffEstimate[];
  impactStats: GlobalImpactStats;
  switchRole: (role: UserRole) => void;
  loginUser: (identifier: string) => boolean;
  createDropOffTransaction: (
    citizenId: string,
    centerId: string,
    operatorId: string,
    items: { material: MaterialCategory; weightKg: number }[]
  ) => { success: boolean; transaction?: RecycleTransaction; pointsEarned: number };
  redeemReward: (rewardId: string) => { success: boolean; error?: string; coupon?: RedeemedCoupon };
  addCollectionCenter: (center: Omit<CollectionCenter, 'id'>) => void;
  toggleCenterStatus: (centerId: string) => void;
  addReward: (reward: Omit<RewardItem, 'id'>) => void;
  createDropOffEstimate: (estimate: Omit<DropOffEstimate, 'id' | 'userId' | 'status'>) => DropOffEstimate;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'ecorecicla_pwa_';

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage for', key, e);
    return defaultValue;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage for', key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() =>
    loadStorage('users', INITIAL_USERS)
  );

  const [currentUserId, setCurrentUserId] = useState<string>(() =>
    loadStorage('current_user_id', INITIAL_USERS[0].id)
  );

  const [centers, setCenters] = useState<CollectionCenter[]>(() =>
    loadStorage('centers', INITIAL_CENTERS)
  );

  const [rewards, setRewards] = useState<RewardItem[]>(() =>
    loadStorage('rewards', INITIAL_REWARDS)
  );

  const [transactions, setTransactions] = useState<RecycleTransaction[]>(() =>
    loadStorage('transactions', INITIAL_TRANSACTIONS)
  );

  const [coupons, setCoupons] = useState<RedeemedCoupon[]>(() =>
    loadStorage('coupons', [
      {
        id: 'CPN-101',
        couponCode: 'ECO-BIO-7928',
        rewardId: 'REW-01',
        rewardTitle: '15% Descuento en Consumo Total',
        sponsorName: 'BioCafé Tierra Orgánica',
        userId: 'USR-7749',
        pointsSpent: 120,
        redeemedAt: '25 Oct 2026',
        expiresAt: '25 Nov 2026',
        status: 'activo',
        barcode: '984729184018',
      },
    ])
  );

  const [estimates, setEstimates] = useState<DropOffEstimate[]>(() =>
    loadStorage('estimates', [])
  );

  // Sync to localStorage
  useEffect(() => {
    saveStorage('users', allUsers);
  }, [allUsers]);

  useEffect(() => {
    saveStorage('current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    saveStorage('centers', centers);
  }, [centers]);

  useEffect(() => {
    saveStorage('rewards', rewards);
  }, [rewards]);

  useEffect(() => {
    saveStorage('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveStorage('coupons', coupons);
  }, [coupons]);

  useEffect(() => {
    saveStorage('estimates', estimates);
  }, [estimates]);

  const currentUser = allUsers.find((u) => u.id === currentUserId) || allUsers[0];
  const currentRole = currentUser.role;

  // Role switching helper
  const switchRole = (role: UserRole) => {
    const targetUser = allUsers.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
    }
  };

  const loginUser = (identifier: string): boolean => {
    const clean = identifier.trim().toLowerCase();
    const found = allUsers.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.accountNumber.toLowerCase() === clean ||
        (u.institutionalId && u.institutionalId.toLowerCase() === clean)
    );
    if (found) {
      setCurrentUserId(found.id);
      return true;
    }
    // If not found, simulate auto-registering a citizen account
    const newUser: UserProfile = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: identifier.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'Nuevo Ciudadano',
      email: identifier.includes('@') ? identifier : `${identifier}@ecorecicla.org`,
      accountNumber: `ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      institutionalId: identifier.startsWith('MAT-') || identifier.startsWith('UNAM-') ? identifier : undefined,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      role: 'citizen',
      pointsBalance: 50, // Welcome gift points
      totalKgRecycled: 0,
      qrCode: `ECO-PASS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      joinedDate: 'Hoy',
    };
    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return true;
  };

  // Transaction processing by operator
  const createDropOffTransaction = (
    citizenId: string,
    centerId: string,
    operatorId: string,
    rawItems: { material: MaterialCategory; weightKg: number }[]
  ) => {
    const citizen = allUsers.find((u) => u.id === citizenId);
    const center = centers.find((c) => c.id === centerId);
    const operator = allUsers.find((u) => u.id === operatorId);

    if (!citizen || !center) {
      return { success: false, pointsEarned: 0 };
    }

    let totalPoints = 0;
    let totalKg = 0;

    const items: MaterialWeightItem[] = rawItems
      .filter((it) => it.weightKg > 0)
      .map((it) => {
        const tariff = MATERIAL_TARIFFS[it.material];
        const points = Math.round(it.weightKg * (tariff?.pointsPerKg || 10));
        totalPoints += points;
        totalKg += it.weightKg;
        return {
          material: it.material,
          weightKg: Number(it.weightKg.toFixed(2)),
          pointsCalculated: points,
        };
      });

    if (items.length === 0) {
      return { success: false, pointsEarned: 0 };
    }

    const newTx: RecycleTransaction = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: citizen.id,
      userName: citizen.name,
      centerId: center.id,
      centerName: center.name,
      operatorId: operator?.id || 'OP-SYS',
      operatorName: operator?.name || 'Operador en Turno',
      date: new Date().toLocaleString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      items,
      totalWeightKg: Number(totalKg.toFixed(2)),
      totalPoints,
      status: 'completada',
    };

    // Update transactions list
    setTransactions((prev) => [newTx, ...prev]);

    // Update citizen points & total kg
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === citizen.id) {
          return {
            ...u,
            pointsBalance: u.pointsBalance + totalPoints,
            totalKgRecycled: Number((u.totalKgRecycled + totalKg).toFixed(2)),
          };
        }
        return u;
      })
    );

    return { success: true, transaction: newTx, pointsEarned: totalPoints };
  };

  // Redeem Reward
  const redeemReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, error: 'Recompensa no encontrada' };
    if (reward.stock <= 0) return { success: false, error: 'Sin existencias en stock' };
    if (currentUser.pointsBalance < reward.pointsCost) {
      return { success: false, error: `Puntos insuficientes. Necesitas ${reward.pointsCost} eco-puntos.` };
    }

    // Deduct points
    setAllUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, pointsBalance: u.pointsBalance - reward.pointsCost } : u))
    );

    // Decrement reward stock
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, stock: Math.max(0, r.stock - 1) } : r))
    );

    // Generate coupon
    const newCoupon: RedeemedCoupon = {
      id: `CPN-${Math.floor(1000 + Math.random() * 9000)}`,
      couponCode: `ECO-${reward.category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      sponsorName: reward.sponsorName,
      userId: currentUser.id,
      pointsSpent: reward.pointsCost,
      redeemedAt: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiresAt: reward.validUntil,
      status: 'activo',
      barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
    };

    setCoupons((prev) => [newCoupon, ...prev]);

    return { success: true, coupon: newCoupon };
  };

  // Add Center (Admin)
  const addCollectionCenter = (centerData: Omit<CollectionCenter, 'id'>) => {
    const newCenter: CollectionCenter = {
      ...centerData,
      id: `CTR-${String(centers.length + 1).padStart(2, '0')}`,
    };
    setCenters((prev) => [...prev, newCenter]);
  };

  const toggleCenterStatus = (centerId: string) => {
    setCenters((prev) =>
      prev.map((c) => (c.id === centerId ? { ...c, isOpen: !c.isOpen } : c))
    );
  };

  // Add Reward (Admin)
  const addReward = (rewardData: Omit<RewardItem, 'id'>) => {
    const newReward: RewardItem = {
      ...rewardData,
      id: `REW-${String(rewards.length + 1).padStart(2, '0')}`,
    };
    setRewards((prev) => [...prev, newReward]);
  };

  // Create DropOff Estimate (Citizen)
  const createDropOffEstimate = (estimateData: Omit<DropOffEstimate, 'id' | 'userId' | 'status'>) => {
    const newEstimate: DropOffEstimate = {
      ...estimateData,
      id: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      status: 'pendiente',
    };
    setEstimates((prev) => [newEstimate, ...prev]);
    return newEstimate;
  };

  const resetDemoData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setCenters(INITIAL_CENTERS);
    setRewards(INITIAL_REWARDS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCoupons([]);
    setEstimates([]);
  };

  // Compute live global metrics
  const impactStats: GlobalImpactStats = React.useMemo(() => {
    let totalKg = 0;
    let totalPoints = 0;
    const materialTotals: Record<MaterialCategory, number> = {
      PET: 0,
      CARTON: 0,
      ALUMINIO: 0,
      VIDRIO: 0,
      PAPEL: 0,
    };

    transactions.forEach((tx) => {
      totalPoints += tx.totalPoints;
      tx.items.forEach((it) => {
        totalKg += it.weightKg;
        materialTotals[it.material] = (materialTotals[it.material] || 0) + it.weightKg;
      });
    });

    const co2SavedTotalKg =
      materialTotals.PET * MATERIAL_TARIFFS.PET.co2SavedPerKg +
      materialTotals.CARTON * MATERIAL_TARIFFS.CARTON.co2SavedPerKg +
      materialTotals.ALUMINIO * MATERIAL_TARIFFS.ALUMINIO.co2SavedPerKg +
      materialTotals.VIDRIO * MATERIAL_TARIFFS.VIDRIO.co2SavedPerKg +
      materialTotals.PAPEL * MATERIAL_TARIFFS.PAPEL.co2SavedPerKg;

    const waterSavedTotalLiters =
      materialTotals.PET * MATERIAL_TARIFFS.PET.waterSavedPerKg +
      materialTotals.CARTON * MATERIAL_TARIFFS.CARTON.waterSavedPerKg +
      materialTotals.ALUMINIO * MATERIAL_TARIFFS.ALUMINIO.waterSavedPerKg +
      materialTotals.VIDRIO * MATERIAL_TARIFFS.VIDRIO.waterSavedPerKg +
      materialTotals.PAPEL * MATERIAL_TARIFFS.PAPEL.waterSavedPerKg;

    const treesPreserved = (materialTotals.CARTON + materialTotals.PAPEL) / 50;

    const totalRedeemedPoints = coupons.reduce((acc, c) => acc + c.pointsSpent, 0);

    return {
      totalKgRecycled: Number(totalKg.toFixed(1)),
      totalPointsIssued: totalPoints,
      totalPointsRedeemed: totalRedeemedPoints,
      totalTransactions: transactions.length,
      activeCitizens: allUsers.filter((u) => u.role === 'citizen').length,
      co2SavedTotalKg: Number(co2SavedTotalKg.toFixed(1)),
      waterSavedTotalLiters: Math.round(waterSavedTotalLiters),
      treesPreserved: Number(treesPreserved.toFixed(1)),
      materialTotals,
    };
  }, [transactions, coupons, allUsers]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        currentRole,
        centers,
        rewards,
        transactions,
        coupons,
        estimates,
        impactStats,
        switchRole,
        loginUser,
        createDropOffTransaction,
        redeemReward,
        addCollectionCenter,
        toggleCenterStatus,
        addReward,
        createDropOffEstimate,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
