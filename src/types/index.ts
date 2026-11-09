export type UserRole = 'citizen' | 'operator' | 'admin';

export type MaterialCategory = 'PET' | 'CARTON' | 'ALUMINIO' | 'VIDRIO' | 'PAPEL';

export interface MaterialTariff {
  id: MaterialCategory;
  name: string;
  pointsPerKg: number;
  co2SavedPerKg: number; // in kg of CO2
  waterSavedPerKg: number; // in Liters
  icon: string;
  color: string;
  description: string;
  tips: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountNumber: string; // e.g. "ECO-2026-8841"
  institutionalId?: string; // e.g. "MAT-90421"
  avatar: string;
  role: UserRole;
  pointsBalance: number;
  totalKgRecycled: number;
  qrCode: string; // digital code for scanning
  phone?: string;
  joinedDate: string;
}

export interface CollectionCenter {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
  phone: string;
  schedule: string;
  isOpen: boolean;
  acceptedMaterials: MaterialCategory[];
  capacityPercentage: number;
  operatorName: string;
}

export interface MaterialWeightItem {
  material: MaterialCategory;
  weightKg: number;
  pointsCalculated: number;
}

export interface RecycleTransaction {
  id: string;
  userId: string;
  userName: string;
  centerId: string;
  centerName: string;
  operatorId: string;
  operatorName: string;
  date: string;
  timestamp: number;
  items: MaterialWeightItem[];
  totalWeightKg: number;
  totalPoints: number;
  status: 'completada' | 'en_revision';
}

export interface DropOffEstimate {
  id: string;
  userId: string;
  centerId?: string;
  estimatedMaterials: { material: MaterialCategory; estimatedKg: number }[];
  scheduledDate: string;
  notes?: string;
  status: 'pendiente' | 'entregado' | 'cancelado';
}

export interface RewardItem {
  id: string;
  title: string;
  sponsorName: string;
  category: 'alimentos' | 'descuentos' | 'ecologia' | 'movilidad';
  pointsCost: number;
  originalValue: string;
  stock: number;
  description: string;
  imageUrl: string;
  validUntil: string;
  terms: string;
}

export interface RedeemedCoupon {
  id: string;
  couponCode: string;
  rewardId: string;
  rewardTitle: string;
  sponsorName: string;
  userId: string;
  pointsSpent: number;
  redeemedAt: string;
  expiresAt: string;
  status: 'activo' | 'canjeado' | 'expirado';
  barcode: string;
}

export interface GlobalImpactStats {
  totalKgRecycled: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalTransactions: number;
  activeCitizens: number;
  co2SavedTotalKg: number;
  waterSavedTotalLiters: number;
  treesPreserved: number;
  materialTotals: Record<MaterialCategory, number>;
}
