/**
 * HOLLYWOOD RISING - Network Service (Phase 4)
 * Comprehensive state persistence, initial mock databases, and weekly auto-simulation engine.
 */

import {
  NetworkFullState,
  JobItem,
  ActiveJob,
  HealthService,
  HealthInsurancePlan,
  PlayerHealthState,
  PropertyItem,
  VehicleItem,
  BankAccount,
  BankLoan,
  GeneratedLoanOffer,
  TransactionRecord,
  VaultItem,
  AuctionLot,
  SecurityPackage,
  SecurityPersonnelItem,
  SecurityReport,
  RoyaltySource,
  BankableStar,
  ForbesCelebrity,
  FinancialAdvisor,
  EstatePlan,
  FinancialReputationRating,
  FinancialSummary,
} from '../types/network';
import { Player, ReleasedMovie } from '../types/game';
import { EmpireService } from './empireService';

const STORAGE_KEY = 'HOLLYWOOD_NETWORK_STATE_V1';

export const HEALTH_INSURANCE_PLANS: HealthInsurancePlan[] = [
  {
    id: 'plan_basic',
    providerName: 'Aetna Silver Standard',
    tier: 'Basic',
    weeklyCost: 100,
    coveragePercent: 30,
    recoverySpeedBonusPercent: 10,
    treatmentQualityBonusPercent: 10,
    description: 'Essential medical coverage for consultations and urgent ER visits.',
  },
  {
    id: 'plan_standard',
    providerName: 'Blue Shield Gold PPO',
    tier: 'Standard',
    weeklyCost: 350,
    coveragePercent: 50,
    recoverySpeedBonusPercent: 20,
    treatmentQualityBonusPercent: 20,
    description: 'Comprehensive healthcare coverage with specialist visits & physical therapy.',
  },
  {
    id: 'plan_premium',
    providerName: 'Kaiser Platinum Executive',
    tier: 'Premium',
    weeklyCost: 850,
    coveragePercent: 70,
    recoverySpeedBonusPercent: 35,
    treatmentQualityBonusPercent: 35,
    description: 'High-end coverage including concierge physicians and top-tier clinics.',
  },
  {
    id: 'plan_elite',
    providerName: 'SAG-AFTRA SAG-Pro Elite',
    tier: 'Elite',
    weeklyCost: 2000,
    coveragePercent: 85,
    recoverySpeedBonusPercent: 50,
    treatmentQualityBonusPercent: 50,
    description: 'Industry union premier coverage with private hospital suites & zero deductibles.',
  },
  {
    id: 'plan_executive',
    providerName: 'Beverly Hills Concierge Ultra',
    tier: 'Executive',
    weeklyCost: 5000,
    coveragePercent: 95,
    recoverySpeedBonusPercent: 75,
    treatmentQualityBonusPercent: 75,
    description: 'Bespoke 24/7 private doctor on retainer, international airlift & instant specialist access.',
  },
];

export const DIET_OPTIONS = [
  { id: 'diet_balanced', name: 'Balanced Mediterranean Diet', cost: 150, physicalBonus: 5, description: 'Fresh vegetables, lean meats, olive oil & whole grains.' },
  { id: 'diet_protein', name: 'High Protein Muscle Plan', cost: 250, physicalBonus: 10, description: 'Optimized for lean muscle building and athletic endurance.' },
  { id: 'diet_weightloss', name: 'Caloric Deficit Cleanse', cost: 200, physicalBonus: 5, description: 'Intermittent fasting & organic smoothies for fast weight cut.' },
  { id: 'diet_muscle', name: 'Hyper-Caloric Mass Gain', cost: 300, physicalBonus: 12, description: 'Heavy protein & complex carbs for stunt transformations.' },
  { id: 'diet_luxury', name: 'Personal Chef Luxury Dining', cost: 1000, physicalBonus: 18, description: 'Gourmet organic dishes prepared daily by private celebrity chef.' },
  { id: 'diet_healthy', name: 'Holistic Plant-Based Lifestyle', cost: 400, physicalBonus: 15, description: '100% organic, non-GMO superfoods for maximum longevity.' },
];

// Initial Health Services Catalog
export const HEALTH_SERVICES: HealthService[] = [
  {
    id: 'gym_basic',
    name: 'Metro Fitness Pass',
    category: 'Gym',
    cost: 50,
    weeklyCost: 50,
    energyBonus: 10,
    description: 'Standard neighborhood gym. Keeps you reasonably fit.',
    isSubscription: true,
  },
  {
    id: 'gym_equinox',
    name: 'Equinox Beverly Hills Club',
    category: 'Gym',
    cost: 500,
    weeklyCost: 350,
    energyBonus: 25,
    actingBonus: 5,
    description: 'Luxury gym filled with A-list celebrity trainers and executives.',
    isSubscription: true,
  },
  {
    id: 'gym_vip',
    name: 'Private Bel-Air Fitness Sanctuary',
    category: 'Gym',
    cost: 2500,
    weeklyCost: 1500,
    energyBonus: 45,
    actingBonus: 12,
    description: 'Bespoke fitness facility with biometric tracking and private trainers.',
    isSubscription: true,
  },
  {
    id: 'spa_day',
    name: 'Rodeo Drive Cryo & Massage Spa',
    category: 'Spa',
    cost: 1200,
    energyBonus: 30,
    description: 'Full-body rejuvenation treatment restoring energy instantly.',
  },
  {
    id: 'therapy',
    name: 'Hollywood Celebrity Psychologist',
    category: 'Therapy',
    cost: 2000,
    weeklyCost: 800,
    energyBonus: 20,
    actingBonus: 10,
    relationshipBonus: 15,
    description: 'Mental clarity sessions boosting emotional acting depth.',
    isSubscription: true,
  },
  {
    id: 'medical_exam',
    name: 'Cedars-Sinai Executive Health Check',
    category: 'Medical',
    cost: 5000,
    energyBonus: 50,
    description: 'Comprehensive preventative health panel and vitamin IV drip.',
  },
  {
    id: 'cosmetic_glow',
    name: 'Beverly Hills Laser Skin & Glow Package',
    category: 'Cosmetic',
    cost: 8500,
    energyBonus: 15,
    actingBonus: 15,
    relationshipBonus: 25,
    description: 'Non-invasive aesthetic enhancement popular among leading stars.',
  },
];

// Initial Available Jobs Pool
export const JOBS_CATALOG: JobItem[] = [
  {
    id: 'job_barista',
    title: 'Starbucks Barista',
    company: 'Starbucks Melrose',
    category: 'Part-Time',
    weeklySalary: 450,
    energyCost: 15,
    maxWeeks: 12,
    currentWeek: 0,
    isEntertainment: false,
    networkingBonus: 0,
    description: 'Pour espresso for screenwriters and actors in West Hollywood.',
  },
  {
    id: 'job_valet',
    title: 'Luxury Valet Attendant',
    company: 'Spago Beverly Hills',
    category: 'Luxury',
    weeklySalary: 850,
    energyCost: 20,
    maxWeeks: 16,
    currentWeek: 0,
    isEntertainment: false,
    networkingBonus: 2,
    description: 'Park Lamborghinis and Ferraris for top studio executives.',
  },
  {
    id: 'job_studio_page',
    title: 'Paramount Studio Page',
    company: 'Paramount Pictures',
    category: 'Entertainment',
    weeklySalary: 950,
    energyCost: 25,
    maxWeeks: 20,
    currentWeek: 0,
    isEntertainment: true,
    networkingBonus: 8,
    description: 'Guide studio tours and deliver mail to A-list soundstages.',
  },
  {
    id: 'job_script_reader',
    title: 'Coverage Script Reader',
    company: 'CAA Talent Agency',
    category: 'Entertainment',
    weeklySalary: 1200,
    energyCost: 20,
    maxWeeks: 20,
    currentWeek: 0,
    isEntertainment: true,
    networkingBonus: 12,
    description: 'Evaluate incoming screenplays and write summaries for talent agents.',
  },
  {
    id: 'job_casting_assistant',
    title: 'Assistant Casting Associate',
    company: 'Burbank Casting Co.',
    category: 'Entertainment',
    weeklySalary: 1600,
    energyCost: 30,
    maxWeeks: 20,
    currentWeek: 0,
    isEntertainment: true,
    networkingBonus: 18,
    description: 'Organize audition tapes and coordinate director call-backs.',
  },
  {
    id: 'job_personal_trainer',
    title: 'VIP Personal Fitness Trainer',
    company: 'Private Client Network',
    category: 'Luxury',
    weeklySalary: 2200,
    energyCost: 25,
    maxWeeks: 20,
    currentWeek: 0,
    isEntertainment: false,
    networkingBonus: 5,
    description: 'Train high-net-worth clients and producers in private gyms.',
  },
];

// Initial 50 Properties Catalog
export const INITIAL_PROPERTIES: PropertyItem[] = [
  // SMALL (1-15)
  {
    id: 'prop_01',
    name: 'North Hollywood Studio Loft',
    location: 'North Hollywood, CA',
    tier: 'Small',
    price: 350000,
    downPayment: 70000,
    weeklyMortgage: 450,
    weeklyUpkeep: 120,
    weeklyRentIncome: 650,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    description: 'Cozy modern studio apartment near the Arts District.',
    isOwned: false,
  },
  {
    id: 'prop_02',
    name: 'Silver Lake Urban Apartment',
    location: 'Silver Lake, CA',
    tier: 'Small',
    price: 480000,
    downPayment: 96000,
    weeklyMortgage: 620,
    weeklyUpkeep: 150,
    weeklyRentIncome: 850,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 800,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    description: 'Trendy apartment with reservoir views popular with indie filmmakers.',
    isOwned: false,
  },
  {
    id: 'prop_03',
    name: 'Burbank Media District Flat',
    location: 'Burbank, CA',
    tier: 'Small',
    price: 520000,
    downPayment: 104000,
    weeklyMortgage: 680,
    weeklyUpkeep: 160,
    weeklyRentIncome: 920,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 920,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    description: 'Convenient flat minutes away from Warner Bros and Disney soundstages.',
    isOwned: false,
  },
  {
    id: 'prop_04',
    name: 'Culver City Artist Loft',
    location: 'Culver City, CA',
    tier: 'Small',
    price: 610000,
    downPayment: 122000,
    weeklyMortgage: 790,
    weeklyUpkeep: 180,
    weeklyRentIncome: 1100,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    description: 'High-ceiling loft near Sony Pictures Studios.',
    isOwned: false,
  },
  {
    id: 'prop_05',
    name: 'Venice Beach Canal Cottage',
    location: 'Venice, CA',
    tier: 'Small',
    price: 890000,
    downPayment: 178000,
    weeklyMortgage: 1150,
    weeklyUpkeep: 250,
    weeklyRentIncome: 1550,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1150,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    description: 'Charming historic cottage situated right on the Venice Canals.',
    isOwned: false,
  },
  {
    id: 'prop_06',
    name: 'Westwood Village Condo',
    location: 'Westwood, CA',
    tier: 'Small',
    price: 750000,
    downPayment: 150000,
    weeklyMortgage: 970,
    weeklyUpkeep: 210,
    weeklyRentIncome: 1300,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    description: 'Sleek high-rise condo near movie theaters and UCLA campus.',
    isOwned: false,
  },
  {
    id: 'prop_07',
    name: 'West Hollywood Sunset Flat',
    location: 'West Hollywood, CA',
    tier: 'Small',
    price: 920000,
    downPayment: 184000,
    weeklyMortgage: 1190,
    weeklyUpkeep: 260,
    weeklyRentIncome: 1650,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800',
    description: 'Prime location off the Sunset Strip with private balcony.',
    isOwned: false,
  },
  {
    id: 'prop_08',
    name: 'Santa Monica Coastal Flat',
    location: 'Santa Monica, CA',
    tier: 'Small',
    price: 980000,
    downPayment: 196000,
    weeklyMortgage: 1260,
    weeklyUpkeep: 280,
    weeklyRentIncome: 1750,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1180,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    description: 'Breezy apartment steps from the ocean and promenade.',
    isOwned: false,
  },
  {
    id: 'prop_09',
    name: 'Pasadena Craftsman Home',
    location: 'Pasadena, CA',
    tier: 'Small',
    price: 820000,
    downPayment: 164000,
    weeklyMortgage: 1060,
    weeklyUpkeep: 230,
    weeklyRentIncome: 1400,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1650,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
    description: 'Classic 1920s bungalow with lush green yard and porch.',
    isOwned: false,
  },
  {
    id: 'prop_10',
    name: 'Glendale Modern Townhome',
    location: 'Glendale, CA',
    tier: 'Small',
    price: 680000,
    downPayment: 136000,
    weeklyMortgage: 880,
    weeklyUpkeep: 190,
    weeklyRentIncome: 1200,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    description: 'Spacious three-story townhome in quiet neighborhood.',
    isOwned: false,
  },

  // MEDIUM (11-25)
  {
    id: 'prop_11',
    name: 'Sherman Oaks Hillside Villa',
    location: 'Sherman Oaks, CA',
    tier: 'Medium',
    price: 1850000,
    downPayment: 370000,
    weeklyMortgage: 2380,
    weeklyUpkeep: 520,
    weeklyRentIncome: 3200,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    description: 'Gated hillside residence featuring pool and valley views.',
    isOwned: false,
  },
  {
    id: 'prop_12',
    name: 'Studio City Contemporary House',
    location: 'Studio City, CA',
    tier: 'Medium',
    price: 2400000,
    downPayment: 480000,
    weeklyMortgage: 3090,
    weeklyUpkeep: 680,
    weeklyRentIncome: 4200,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    description: 'Sleek architectural home popular with network actors.',
    isOwned: false,
  },
  {
    id: 'prop_13',
    name: 'Pacific Palisades Beach Residence',
    location: 'Pacific Palisades, CA',
    tier: 'Medium',
    price: 3800000,
    downPayment: 760000,
    weeklyMortgage: 4890,
    weeklyUpkeep: 1050,
    weeklyRentIncome: 6500,
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    description: 'Ocean view home with private garden and outdoor kitchen.',
    isOwned: false,
  },
  {
    id: 'prop_14',
    name: 'Brentwood Park Family Residence',
    location: 'Brentwood, CA',
    tier: 'Medium',
    price: 4500000,
    downPayment: 900000,
    weeklyMortgage: 5790,
    weeklyUpkeep: 1250,
    weeklyRentIncome: 7800,
    bedrooms: 5,
    bathrooms: 5,
    sqft: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
    description: 'Prestigious tree-lined estate with swimming pool and spa.',
    isOwned: false,
  },
  {
    id: 'prop_15',
    name: 'Manhattan Beach Walk-Street House',
    location: 'Manhattan Beach, CA',
    tier: 'Medium',
    price: 5200000,
    downPayment: 1040000,
    weeklyMortgage: 6690,
    weeklyUpkeep: 1450,
    weeklyRentIncome: 9100,
    bedrooms: 4,
    bathrooms: 4.5,
    sqft: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    description: 'Luxury coastal living with sunset ocean vistas.',
    isOwned: false,
  },

  // HIGH (16-35)
  {
    id: 'prop_16',
    name: 'Hollywood Hills Architectural Modern',
    location: 'Hollywood Hills, CA',
    tier: 'High',
    price: 8500000,
    downPayment: 1700000,
    weeklyMortgage: 10940,
    weeklyUpkeep: 2350,
    weeklyRentIncome: 15000,
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    description: 'Iconic cantilevered glass mansion overlooking the entire city.',
    isOwned: false,
  },
  {
    id: 'prop_17',
    name: 'Malibu Colony Oceanfront Villa',
    location: 'Malibu, CA',
    tier: 'High',
    price: 12500000,
    downPayment: 2500000,
    weeklyMortgage: 16080,
    weeklyUpkeep: 3450,
    weeklyRentIncome: 22000,
    bedrooms: 6,
    bathrooms: 7,
    sqft: 7200,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    description: 'Exclusive beach enclave with direct sand access and private deck.',
    isOwned: false,
  },
  {
    id: 'prop_18',
    name: 'Beverly Hills Golden Triangle Compound',
    location: 'Beverly Hills, CA',
    tier: 'High',
    price: 16800000,
    downPayment: 3360000,
    weeklyMortgage: 21620,
    weeklyUpkeep: 4600,
    weeklyRentIncome: 29500,
    bedrooms: 6,
    bathrooms: 8,
    sqft: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    description: 'Gated Mediterranean estate featuring screening room and tennis court.',
    isOwned: false,
  },
  {
    id: 'prop_19',
    name: 'Bel-Air Crest Luxury Estate',
    location: 'Bel-Air, CA',
    tier: 'High',
    price: 22000000,
    downPayment: 4400000,
    weeklyMortgage: 28310,
    weeklyUpkeep: 6000,
    weeklyRentIncome: 38000,
    bedrooms: 7,
    bathrooms: 9,
    sqft: 10500,
    imageUrl: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800',
    description: 'Ultra-private guarded estate with wine cellar and infinity pool.',
    isOwned: false,
  },

  // ELITE (36-50)
  {
    id: 'prop_20',
    name: 'Holmby Hills Mega Mansion',
    location: 'Holmby Hills, CA',
    tier: 'Elite',
    price: 45000000,
    downPayment: 9000000,
    weeklyMortgage: 57920,
    weeklyUpkeep: 12500,
    weeklyRentIncome: 80000,
    bedrooms: 9,
    bathrooms: 14,
    sqft: 18500,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
    description: 'Legendary Hollywood trophy estate once owned by studio founders.',
    isOwned: false,
  },
  {
    id: 'prop_21',
    name: 'French Riviera Cap-Ferrat Chateau',
    location: 'Cap-Ferrat, France',
    tier: 'Elite',
    price: 68000000,
    downPayment: 13600000,
    weeklyMortgage: 87520,
    weeklyUpkeep: 18000,
    weeklyRentIncome: 120000,
    bedrooms: 10,
    bathrooms: 12,
    sqft: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    description: 'Palatial Mediterranean estate overlooking Monaco and Cannes.',
    isOwned: false,
  },
  {
    id: 'prop_22',
    name: 'Private Hawaiian Island Compound',
    location: 'Maui, Hawaii',
    tier: 'Elite',
    price: 110000000,
    downPayment: 22000000,
    weeklyMortgage: 141570,
    weeklyUpkeep: 28000,
    weeklyRentIncome: 190000,
    bedrooms: 12,
    bathrooms: 16,
    sqft: 30000,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    description: 'Secluded 50-acre island sanctuary with helipad and private marina.',
    isOwned: false,
  },
];

// Initial 35 Vehicles Catalog
export const INITIAL_VEHICLES: VehicleItem[] = [
  // SMALL (1-10)
  {
    id: 'veh_01',
    name: 'Honda Civic Sport',
    brand: 'Honda',
    tier: 'Small',
    price: 28000,
    weeklyUpkeep: 40,
    cloutBonus: 2,
    topSpeed: '130 mph',
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    description: 'Reliable, economical daily driver for navigating audition calls.',
    isOwned: false,
  },
  {
    id: 'veh_02',
    name: 'Toyota Prius Prime',
    brand: 'Toyota',
    tier: 'Small',
    price: 34000,
    weeklyUpkeep: 35,
    cloutBonus: 3,
    topSpeed: '112 mph',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
    description: 'Eco-friendly hybrid favored by indie directors.',
    isOwned: false,
  },
  {
    id: 'veh_03',
    name: 'Ford Mustang GT V8',
    brand: 'Ford',
    tier: 'Small',
    price: 52000,
    weeklyUpkeep: 80,
    cloutBonus: 8,
    topSpeed: '155 mph',
    imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800',
    description: 'American muscle car with roaring exhaust tone.',
    isOwned: false,
  },
  {
    id: 'veh_04',
    name: 'Tesla Model 3 Long Range',
    brand: 'Tesla',
    tier: 'Small',
    price: 48000,
    weeklyUpkeep: 45,
    cloutBonus: 10,
    topSpeed: '145 mph',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    description: 'Sleek electric sedan common across studio parking lots.',
    isOwned: false,
  },

  // MEDIUM (11-20)
  {
    id: 'veh_05',
    name: 'BMW M4 Competition',
    brand: 'BMW',
    tier: 'Medium',
    price: 88000,
    weeklyUpkeep: 150,
    cloutBonus: 22,
    topSpeed: '180 mph',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    description: 'High-performance coupe turning heads on Wilshire Boulevard.',
    isOwned: false,
  },
  {
    id: 'veh_06',
    name: 'Porsche 911 Carrera S',
    brand: 'Porsche',
    tier: 'Medium',
    price: 135000,
    weeklyUpkeep: 220,
    cloutBonus: 35,
    topSpeed: '191 mph',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
    description: 'Timeless sports car archetype preferred by Hollywood actors.',
    isOwned: false,
  },
  {
    id: 'veh_07',
    name: 'Mercedes-AMG G 63 (G-Wagon)',
    brand: 'Mercedes-Benz',
    tier: 'Medium',
    price: 185000,
    weeklyUpkeep: 320,
    cloutBonus: 50,
    topSpeed: '149 mph',
    imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800',
    description: 'The ultimate paparazzi-magnet SUV in Beverly Hills.',
    isOwned: false,
  },
  {
    id: 'veh_08',
    name: 'Range Rover Autobiography',
    brand: 'Land Rover',
    tier: 'Medium',
    price: 165000,
    weeklyUpkeep: 280,
    cloutBonus: 42,
    topSpeed: '150 mph',
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    description: 'Plush chauffeur-driven luxury SUV.',
    isOwned: false,
  },

  // HIGH (21-30)
  {
    id: 'veh_09',
    name: 'Lamborghini Huracán EVO',
    brand: 'Lamborghini',
    tier: 'High',
    price: 290000,
    weeklyUpkeep: 550,
    cloutBonus: 85,
    topSpeed: '202 mph',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
    description: 'Exotic V10 supercar for red carpet arrivals.',
    isOwned: false,
  },
  {
    id: 'veh_10',
    name: 'Ferrari F8 Tributo',
    brand: 'Ferrari',
    tier: 'High',
    price: 325000,
    weeklyUpkeep: 620,
    cloutBonus: 95,
    topSpeed: '211 mph',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    description: 'Italian mid-engine masterpiece in Rosso Corsa.',
    isOwned: false,
  },
  {
    id: 'veh_11',
    name: 'Rolls-Royce Phantom VII',
    brand: 'Rolls-Royce',
    tier: 'High',
    price: 490000,
    weeklyUpkeep: 880,
    cloutBonus: 120,
    topSpeed: '155 mph',
    imageUrl: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800',
    description: 'Pinnacle of executive luxury with starlight headliner.',
    isOwned: false,
  },

  // ELITE (31-35)
  {
    id: 'veh_12',
    name: 'Bugatti Chiron Super Sport',
    brand: 'Bugatti',
    tier: 'Elite',
    price: 3800000,
    weeklyUpkeep: 4500,
    cloutBonus: 350,
    topSpeed: '273 mph',
    imageUrl: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800',
    description: 'Hypercar royalty producing 1,578 horsepower.',
    isOwned: false,
  },
  {
    id: 'veh_13',
    name: '1962 Ferrari 250 GTO Vintage',
    brand: 'Ferrari',
    tier: 'Elite',
    price: 18000000,
    weeklyUpkeep: 12000,
    cloutBonus: 800,
    topSpeed: '174 mph',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    description: 'The world\'s most valuable collector automobile.',
    isOwned: false,
  },
];

// Initial Security Personnel Catalog (NO AUTOMATIC HIRING)
export const INITIAL_SECURITY_PERSONNEL: SecurityPersonnelItem[] = [
  { id: 'sec_pers_01', name: 'Marcus Vance', role: 'Bodyguards', weeklySalary: 1800, trainingLevel: 'Tactical', isHired: false, contractWeeksRemaining: 0, equipment: ['Concealed Sidearm', 'Tactical Radio'] },
  { id: 'sec_pers_02', name: 'Elena Rostova', role: 'Bodyguards', weeklySalary: 2200, trainingLevel: 'Elite', isHired: false, contractWeeksRemaining: 0, equipment: ['Kevlar Vest', 'VIP Escort Vehicle'] },
  { id: 'sec_pers_03', name: 'Dmitri Kozlov', role: 'Drivers', weeklySalary: 1200, trainingLevel: 'Tactical', isHired: false, contractWeeksRemaining: 0, equipment: ['Armored Sedan', 'Evasive Pursuit License'] },
  { id: 'sec_pers_04', name: 'Jackson Cole', role: 'Residence Guards', weeklySalary: 950, trainingLevel: 'Standard', isHired: false, contractWeeksRemaining: 0, equipment: ['Gate Surveillance', 'Thermal Optics'] },
  { id: 'sec_pers_05', name: 'Sven Lindqvist', role: 'Travel Guards', weeklySalary: 2500, trainingLevel: 'Special Forces', isHired: false, contractWeeksRemaining: 0, equipment: ['Global Jet Clearance', 'Satellite Comms'] },
  { id: 'sec_pers_06', name: 'Rachel Sterling', role: 'Studio Guards', weeklySalary: 1100, trainingLevel: 'Standard', isHired: false, contractWeeksRemaining: 0, equipment: ['Soundstage Perimeter Sensors'] },
  { id: 'sec_pers_07', name: 'Viktor Thorne', role: 'Vault Guards', weeklySalary: 2800, trainingLevel: 'Elite', isHired: false, contractWeeksRemaining: 0, equipment: ['Biometric Vault Override', 'Laser Defenses'] },
  { id: 'sec_pers_08', name: 'Chen Wei', role: 'Cyber Specialists', weeklySalary: 3200, trainingLevel: 'Special Forces', isHired: false, contractWeeksRemaining: 0, equipment: ['Quantum Encryption Firewall', 'DeepWeb Tracker'] },
  { id: 'sec_pers_09', name: 'Harrison Brody', role: 'Private Investigators', weeklySalary: 2000, trainingLevel: 'Elite', isHired: false, contractWeeksRemaining: 0, equipment: ['Paparazzi Wiretap Sweeper', 'Background Audit'] },
  { id: 'sec_pers_10', name: 'Dr. Sarah Lin', role: 'Medical Response Team', weeklySalary: 3500, trainingLevel: 'Special Forces', isHired: false, contractWeeksRemaining: 0, equipment: ['Trauma Unit Vehicle', 'Mobile ICU'] },
  { id: 'sec_pers_11', name: 'K9 Titan & Handler', role: 'K9 Unit', weeklySalary: 1600, trainingLevel: 'Tactical', isHired: false, contractWeeksRemaining: 0, equipment: ['Explosive Detection Harness'] },
];

// Initial Security Packages (NO AUTOMATIC HIRING)
export const INITIAL_SECURITY_PACKAGES: SecurityPackage[] = [
  {
    id: 'sec_alarm',
    name: 'Smart Home Security & Cameras',
    category: 'Home Defense',
    weeklyCost: 200,
    protectionRatingBonus: 15,
    description: 'Perimeter motion sensors, 24/7 camera monitoring, and smart locks.',
    isHired: false,
  },
  {
    id: 'sec_cyber',
    name: 'Palo Alto Cyber-Defense Shield',
    category: 'Cyber Security',
    weeklyCost: 600,
    protectionRatingBonus: 20,
    description: 'Encrypted communications, leak prevention, and dark web monitoring.',
    isHired: false,
  },
  {
    id: 'sec_bodyguards',
    name: 'Beverly Hills Armed Escort Pair',
    category: 'Bodyguards',
    weeklyCost: 2500,
    protectionRatingBonus: 25,
    description: 'Two tactical personal protection officers for events and travel.',
    isHired: false,
  },
  {
    id: 'sec_armored',
    name: 'Armored SUV & Chauffeur Convoy',
    category: 'Executive Protection',
    weeklyCost: 6000,
    protectionRatingBonus: 20,
    description: 'Bulletproof VR7-rated SUV with evasive driving specialists.',
    isHired: false,
  },
  {
    id: 'sec_elite_firm',
    name: 'Global Executive Defense Force',
    category: 'Executive Protection',
    weeklyCost: 18000,
    protectionRatingBonus: 20,
    description: 'Ex-Special Forces team safeguarding estate, family, and public appearances.',
    isHired: false,
  },
];

// Initial Financial Advisors
export const FINANCIAL_ADVISORS: FinancialAdvisor[] = [
  {
    id: 'adv_tier1',
    name: 'Arthur Pendelton, CPA',
    firm: 'Wilshire Accounting',
    tier: 'Small',
    weeklyRetainer: 500,
    taxReductionPct: 5,
    loanDiscountPct: 0.5,
    description: 'Local tax accountant for basic bookkeeping and expense receipts.',
    avatar: '👨‍💼',
  },
  {
    id: 'adv_tier2',
    name: 'Victoria Vance',
    firm: 'Century City Wealth Partners',
    tier: 'Medium',
    weeklyRetainer: 2500,
    taxReductionPct: 12,
    loanDiscountPct: 1.2,
    description: 'Boutique wealth management specialist for television and film talent.',
    avatar: '👩‍💼',
  },
  {
    id: 'adv_tier3',
    name: 'Harrison Sterling',
    firm: 'Rodeo Drive Private Bank',
    tier: 'High',
    weeklyRetainer: 10000,
    taxReductionPct: 22,
    loanDiscountPct: 2.5,
    description: 'Beverly Hills advisor with deep connections across studio financiers.',
    avatar: '🤵',
  },
  {
    id: 'adv_tier4',
    name: 'Baroness Elena von Steinberg',
    firm: 'Geneva & Bel-Air Family Office',
    tier: 'Elite',
    weeklyRetainer: 25000,
    taxReductionPct: 35,
    loanDiscountPct: 4.0,
    description: 'Premier Multi-Family Office managing offshore wealth, trusts, and tax shelters.',
    avatar: '👑',
  },
];

// Initial Vault Items Catalog (NO AUTOMATIC STARTING ITEMS - PLAYER OBTAINS EVERYTHING MANUALLY)
export const INITIAL_VAULT_ITEMS: VaultItem[] = [];

// Initial Live Auction Lots
export const INITIAL_AUCTION_LOTS: AuctionLot[] = [
  {
    id: 'auc_01',
    title: 'Patek Philippe Grandmaster Chime #6300G',
    category: 'Watches',
    startingBid: 3200000,
    currentBid: 3850000,
    highBidder: 'European Watch Collector',
    item: {
      id: 'auc_item_01',
      name: 'Patek Philippe Grandmaster Chime',
      category: 'Watches',
      estimatedValue: 4500000,
      purchasePrice: 3850000,
      acquiredWeek: 1,
      rarity: 'One-of-a-Kind',
      description: 'The most complicated wrist watch ever crafted by Patek Philippe.',
    },
    bidsCount: 14,
    status: 'LIVE',
  },
  {
    id: 'auc_02',
    title: 'Original Jean-Michel Basquiat Canvas (1982)',
    category: 'Art',
    startingBid: 8500000,
    currentBid: 11200000,
    highBidder: 'Swiss Art Fund',
    item: {
      id: 'auc_item_02',
      name: 'Jean-Michel Basquiat Untitled Skull',
      category: 'Art',
      estimatedValue: 14000000,
      purchasePrice: 11200000,
      acquiredWeek: 1,
      rarity: 'One-of-a-Kind',
      description: 'Museum-grade Neo-expressionist acrylic painting.',
    },
    bidsCount: 22,
    status: 'LIVE',
  },
];

// Initial Top Forbes Celebrities (100)
export const GENERATE_FORBES_100 = (player: Player): ForbesCelebrity[] => {
  const baseStars: { name: string; category: ForbesCelebrity['category']; netWorth: number; topAsset: string }[] = [
    { name: 'George Lucas', category: 'Mogul', netWorth: 5200000000, topAsset: 'Skywalker Ranch & Lucasfilm Royalty' },
    { name: 'Steven Spielberg', category: 'Director', netWorth: 4800000000, topAsset: 'Amblin Entertainment & Universal Royalty' },
    { name: 'Oprah Winfrey', category: 'Mogul', netWorth: 2800000000, topAsset: 'Harpo Studios & Real Estate' },
    { name: 'Jay-Z (Shawn Carter)', category: 'Mogul', netWorth: 2500000000, topAsset: 'Armand de Brignac & Marcy Venture' },
    { name: 'Rihanna (Robyn Fenty)', category: 'Musician', netWorth: 1400000000, topAsset: 'Fenty Beauty & Savage X Fenty' },
    { name: 'Tyler Perry', category: 'Director', netWorth: 1000000000, topAsset: 'Tyler Perry Studios Atlanta' },
    { name: 'Jerry Seinfeld', category: 'Actor', netWorth: 950000000, topAsset: 'Seinfeld Syndication Rights' },
    { name: 'Dwayne "The Rock" Johnson', category: 'Actor', netWorth: 800000000, topAsset: 'Teremana Tequila & Seven Bucks Productions' },
    { name: 'Tom Cruise', category: 'Actor', netWorth: 600000000, topAsset: 'Top Gun & M:I First-Dollar Gross' },
    { name: 'Beyoncé Knowles-Carter', category: 'Musician', netWorth: 540000000, topAsset: 'Parkwood Entertainment' },
    { name: 'Brad Pitt', category: 'Actor', netWorth: 400000000, topAsset: 'Plan B Entertainment' },
    { name: 'Leonardo DiCaprio', category: 'Actor', netWorth: 380000000, topAsset: 'Appian Way Productions' },
    { name: 'Margot Robbie', category: 'Actor', netWorth: 120000000, topAsset: 'LuckyChap Entertainment' },
    { name: 'Zendaya', category: 'Actor', netWorth: 45000000, topAsset: 'Lancôme & Bulgari Endorsements' },
  ];

  // Fill up to 100 with procedural stars
  const list: ForbesCelebrity[] = baseStars.map((s, idx) => ({
    rank: idx + 1,
    name: s.name,
    category: s.category,
    netWorth: s.netWorth,
    topAsset: s.topAsset,
    isPlayer: false,
  }));

  for (let i = list.length + 1; i <= 100; i++) {
    const net = Math.round(500000000 / (i * 0.3));
    list.push({
      rank: i,
      name: `Hollywood Titan #${i}`,
      category: i % 2 === 0 ? 'Actor' : 'Producer',
      netWorth: Math.max(15000000, net),
      topAsset: 'Private Equity & Real Estate',
      isPlayer: false,
    });
  }

  // Insert or adjust player position based on net worth
  const playerName = `${player.firstName} ${player.lastName}`;
  let playerNet = player.money;
  try {
    const netState = NetworkService.loadState(player);
    const finSummary = NetworkService.calculateFinancialSummary(netState, player.money);
    playerNet = Math.max(0, finSummary.netWorth);
  } catch (err) {
    playerNet = Math.max(0, player.money);
  }

  const playerObj: ForbesCelebrity = {
    rank: 100,
    name: playerName,
    category: 'Actor',
    netWorth: playerNet,
    topAsset: 'Personal Portfolio & Studio Contracts',
    isPlayer: true,
  };

  list.push(playerObj);
  list.sort((a, b) => b.netWorth - a.netWorth);
  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  return list.slice(0, 100);
};

// Initial Bankable 100 Stars
export const GENERATE_BANKABLE_100 = (player: Player): BankableStar[] => {
  const topStars = [
    { name: 'Tom Cruise', rating: '5 Stars' as const, boxOffice: '$11.8 Billion', quote: '$25,000,000 + 15%', genre: 'Action / Sci-Fi', score: 99 },
    { name: 'Dwayne Johnson', rating: '5 Stars' as const, boxOffice: '$12.5 Billion', quote: '$22,500,000', genre: 'Action / Comedy', score: 97 },
    { name: 'Margot Robbie', rating: '5 Stars' as const, boxOffice: '$4.2 Billion', quote: '$15,000,000', genre: 'Drama / Comedy', score: 95 },
    { name: 'Leonardo DiCaprio', rating: '5 Stars' as const, boxOffice: '$7.3 Billion', quote: '$20,000,000', genre: 'Drama / Biopic', score: 94 },
    { name: 'Zendaya', rating: '4.5 Stars' as const, boxOffice: '$3.8 Billion', quote: '$10,000,000', genre: 'Sci-Fi / Drama', score: 91 },
    { name: 'Ryan Gosling', rating: '4.5 Stars' as const, boxOffice: '$3.2 Billion', quote: '$12,000,000', genre: 'Drama / Action', score: 89 },
    { name: 'Timothée Chalamet', rating: '4.5 Stars' as const, boxOffice: '$2.9 Billion', quote: '$9,000,000', genre: 'Sci-Fi / Drama', score: 88 },
    { name: 'Scarlett Johansson', rating: '4.5 Stars' as const, boxOffice: '$14.2 Billion', quote: '$18,000,000', genre: 'Action / Thriller', score: 87 },
  ];

  const list: BankableStar[] = topStars.map((s, idx) => ({
    rank: idx + 1,
    name: s.name,
    starRating: s.rating,
    avgBoxOfficeGross: s.boxOffice,
    quotePerFilm: s.quote,
    primaryGenre: s.genre,
    isPlayer: false,
    score: s.score,
  }));

  for (let i = list.length + 1; i <= 100; i++) {
    list.push({
      rank: i,
      name: `Star Talent #${i}`,
      starRating: i < 30 ? '4 Stars' : '3.5 Stars',
      avgBoxOfficeGross: `$${Math.round(800 - i * 5)}M`,
      quotePerFilm: `$${Math.max(1, Math.round(15 - i * 0.12))}M`,
      primaryGenre: 'Drama',
      isPlayer: false,
      score: Math.max(20, 85 - i),
    });
  }

  // Insert player (Starts at 0 Bankable Score for new actors, earned via successful movies/series)
  const playerScore = (player.moviesCompleted || 0) === 0 && (player.leadRolesCount || 0) === 0
    ? 0
    : Math.min(100, Math.round((player.moviesCompleted || 0) * 12 + (player.awardsWon || 0) * 15 + (player.fameXp || 0) * 0.01));

  const playerStarRating =
    playerScore > 90 ? '5 Stars' : playerScore > 75 ? '4.5 Stars' : playerScore > 50 ? '4 Stars' : playerScore > 25 ? '3.5 Stars' : '1 Star';

  const playerObj: BankableStar = {
    rank: playerScore === 0 ? 100 : 100,
    name: `${player.firstName} ${player.lastName}`,
    starRating: playerStarRating,
    avgBoxOfficeGross: player.moviesCompleted ? '$120M' : '$0',
    quotePerFilm: playerScore === 0 ? '$0' : `$${Math.max(50000, (player.fameXp || 10) * 500).toLocaleString()}`,
    primaryGenre: 'Drama / Action',
    isPlayer: true,
    score: playerScore,
  };

  list.push(playerObj);
  list.sort((a, b) => b.score - a.score);
  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  return list.slice(0, 100);
};

// Default Full State Factory
export const createInitialNetworkState = (player: Player): NetworkFullState => {
  return {
    migrationVersion: 2,
    lastProcessedWeek: player.dateWeek || 1,
    lastProcessedYear: player.dateYear || 2026,
    activeJobs: [],
    healthState: {
      healthScore: 92,
      physicalHealth: 90,
      mentalHealth: 88,
      energy: 95,
      stress: 20,
      happiness: 85,
      burnoutRisk: 15,
      fitnessLevel: 80,
      sleepQuality: 88,
      nutritionLevel: 85,
      sleepHours: 8.0,
      fatigueLevel: 10,
      activeInsurancePlanId: 'plan_standard',
      activeDietId: 'diet_balanced',
      weeklyDietCost: 150,
      activeGymId: null,
      weeklyHealthExpense: 0,
      energyMaxBonus: 0,
      cosmeticAppealBonus: 0,
      treatmentHistory: [],
      medicalRecords: [
        {
          id: 'med_init',
          week: player.dateWeek || 1,
          year: player.dateYear || 2026,
          type: 'Checkup',
          title: 'Initial Hollywood Physical Exam',
          doctorNotes: 'Patient in excellent physical condition. Approved for all stunt & acting roles.',
          cost: 300,
          insuranceCoveredAmount: 150,
          outOfPocket: 150,
        },
      ],
      annualReports: [
        {
          year: (player.dateYear || 2026) - 1,
          overallScore: 92,
          physicalScore: 90,
          mentalScore: 88,
          fitnessScore: 82,
          sleepScore: 88,
          stressScore: 20,
          lifestyleRating: 'Optimal Mogul',
          doctorRecommendations: [
            'Maintain regular cardiovascular fitness routine',
            'Continue balanced Mediterranean diet',
            'Ensure adequate rest between film productions',
          ],
        },
      ],
      activeHealthEvents: [],
    },
    properties: INITIAL_PROPERTIES,
    vehicles: INITIAL_VEHICLES,
    bankAccount: {
      checkingBalance: player.money,
      savingsBalance: 0,
      savingsApy: 0.025,
      businessBalance: 0,
      investmentBalance: 0,
      offshoreBalance: 0,
      offshoreApy: 0.04,
      activeLoans: [],
      loanHistory: [],
      preGeneratedOffers: [],
      creditScore: 320, // STARTS AT EXACTLY 320 FOR NEW PLAYERS
      loansRepaidCount: 0,
      onTimePaymentsCount: 0,
      missedPaymentsCount: 0,
      loanDefaultsCount: 0,
      creditAgeWeeks: 0,
      bankReputation: 50,
      reputationRating: 'CCC',
      transactionHistory: [],
      creditCards: [],
      autoSaveEnabled: false,
      savingsGoal: 100000,
      lifetimeInterestEarned: 0,
    },
    vaultItems: [], // VAULT STARTS AT 0 ITEMS
    auctionLots: INITIAL_AUCTION_LOTS,
    securityPackages: INITIAL_SECURITY_PACKAGES,
    securityPersonnel: INITIAL_SECURITY_PERSONNEL,
    securityLogs: [
      {
        week: player.dateWeek || 1,
        incidentName: 'Standard Security Check',
        status: 'THWARTED',
        details: 'Perimeter systems checked. Player must hire security staff manually.',
      },
    ],
    syndicationSources: [],
    hiredAdvisorId: null,
    advisorReports: [],
    estatePlan: {
      willCreated: false,
      status: 'NOT_STARTED',
      spousePct: 50,
      childrenPct: 40,
      charityPct: 10,
      trustFundBalance: 0,
      foundationName: `${player.lastName} Family Foundation`,
      foundationBalance: 0,
      foundationImpactScore: 0,
    },
    watchlist: ['prop_01', 'veh_06'],
  };
};

export const NetworkService = {
  getState: (player?: Player): NetworkFullState => {
    return NetworkService.loadState(player || ({} as Player));
  },

  loadState: (player: Player): NetworkFullState => {
    try {
      // Build a clean default state based on the current player (or a dummy)
      const dummyPlayer = player || {
        id: 'p_1',
        firstName: 'Mogul',
        lastName: 'Founder',
        money: 100000,
        dateWeek: 1,
        dateYear: 2026,
      } as Player;
      const defaultState = createInitialNetworkState(dummyPlayer);

      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        let parsed = JSON.parse(data);

        // Deep merge: overwrite only the keys that exist in parsed,
        // but keep default structure for any missing section.
        const merged: NetworkFullState = {
          ...defaultState,
          ...parsed,
          // Arrays and objects that need special handling to prevent missing sub-properties:
          activeJobs: Array.isArray(parsed.activeJobs) ? parsed.activeJobs : defaultState.activeJobs,
          healthState: parsed.healthState
            ? { ...defaultState.healthState, ...parsed.healthState }
            : defaultState.healthState,
          properties: Array.isArray(parsed.properties) ? parsed.properties : defaultState.properties,
          vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : defaultState.vehicles,
          bankAccount: parsed.bankAccount
            ? {
                ...defaultState.bankAccount,
                ...parsed.bankAccount,
                activeLoans: Array.isArray(parsed.bankAccount.activeLoans) ? parsed.bankAccount.activeLoans : defaultState.bankAccount.activeLoans,
                loanHistory: Array.isArray(parsed.bankAccount.loanHistory) ? parsed.bankAccount.loanHistory : defaultState.bankAccount.loanHistory,
                transactionHistory: Array.isArray(parsed.bankAccount.transactionHistory) ? parsed.bankAccount.transactionHistory : defaultState.bankAccount.transactionHistory,
                creditCards: Array.isArray(parsed.bankAccount.creditCards) ? parsed.bankAccount.creditCards : defaultState.bankAccount.creditCards,
              }
            : defaultState.bankAccount,
          vaultItems: Array.isArray(parsed.vaultItems) ? parsed.vaultItems : defaultState.vaultItems,
          auctionLots: Array.isArray(parsed.auctionLots) ? parsed.auctionLots : defaultState.auctionLots,
          securityPackages: Array.isArray(parsed.securityPackages) ? parsed.securityPackages : defaultState.securityPackages,
          securityPersonnel: Array.isArray(parsed.securityPersonnel) ? parsed.securityPersonnel : defaultState.securityPersonnel,
          securityLogs: Array.isArray(parsed.securityLogs) ? parsed.securityLogs : defaultState.securityLogs,
          syndicationSources: Array.isArray(parsed.syndicationSources) ? parsed.syndicationSources : defaultState.syndicationSources,
          advisorReports: Array.isArray(parsed.advisorReports) ? parsed.advisorReports : defaultState.advisorReports,
          estatePlan: parsed.estatePlan
            ? { ...defaultState.estatePlan, ...parsed.estatePlan }
            : defaultState.estatePlan,
          watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : defaultState.watchlist,
        };

        // ONE-TIME HOTFIX MIGRATION: Purge demo data & override default values
        if (!merged.migrationVersion || merged.migrationVersion < 2) {
          // 1. VAULT PURGE: Delete automatically generated placeholder/demo collectibles
          if (merged.vaultItems && merged.vaultItems.length > 0) {
            merged.vaultItems = merged.vaultItems.filter((item) => {
              const id = item.id || '';
              if (
                id.startsWith('vault_') ||
                id.startsWith('default_') ||
                id.startsWith('demo_') ||
                id.startsWith('mock_') ||
                item.acquiredWeek === 0 ||
                !item.acquiredWeek
              ) {
                return false;
              }
              return true;
            });
          }

          // 2. BANK INITIALIZATION OVERRIDE:
          if (merged.bankAccount) {
            if (
              merged.bankAccount.creditScore === 720 &&
              (!merged.bankAccount.transactionHistory || merged.bankAccount.transactionHistory.length === 0)
            ) {
              merged.bankAccount.creditScore = 320;
              merged.bankAccount.reputationRating = 'CCC';
            }

            if (merged.bankAccount.savingsBalance > 0) {
              const hasSavingsTx = (merged.bankAccount.transactionHistory || []).some(
                (tx) => tx.category === 'Savings' || tx.description.toLowerCase().includes('savings')
              );
              if (!hasSavingsTx) {
                merged.bankAccount.savingsBalance = 0;
              }
            }

            merged.bankAccount.checkingBalance = player.money || merged.bankAccount.checkingBalance || 0;
          }

          merged.migrationVersion = 2;
        }

        // ALWAYS sanitize and ensure loan arrays & credit history stats exist and persist
        if (merged.bankAccount) {
          merged.bankAccount.activeLoans = merged.bankAccount.activeLoans || [];
          merged.bankAccount.loanHistory = merged.bankAccount.loanHistory || [];
          merged.bankAccount.loansRepaidCount = merged.bankAccount.loansRepaidCount || 0;
          merged.bankAccount.onTimePaymentsCount = merged.bankAccount.onTimePaymentsCount || 0;
          merged.bankAccount.missedPaymentsCount = merged.bankAccount.missedPaymentsCount || 0;
          merged.bankAccount.loanDefaultsCount = merged.bankAccount.loanDefaultsCount || 0;
          merged.bankAccount.creditAgeWeeks = merged.bankAccount.creditAgeWeeks || 0;
          merged.bankAccount.creditScore = Math.min(850, Math.max(300, merged.bankAccount.creditScore || 320));
        }

        NetworkService.saveState(merged);
        return merged;
      }
      // No saved data, return fresh state and save it
      NetworkService.saveState(defaultState);
      return defaultState;
    } catch (e) {
      console.warn('Failed to parse Network state from storage, resetting to default.', e);
      const dummyPlayer = player || {
        id: 'p_1',
        firstName: 'Mogul',
        lastName: 'Founder',
        money: 100000,
        dateWeek: 1,
        dateYear: 2026,
      } as Player;
      const fresh = createInitialNetworkState(dummyPlayer);
      NetworkService.saveState(fresh);
      return fresh;
    }
  },

  saveState: (state: NetworkFullState): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  },

  calculateFinancialSummary: (state: NetworkFullState, playerMoney: number): FinancialSummary => {
    const cash = Math.max(0, playerMoney || 0);

    const propertyValue = (state.properties || [])
      .filter((p) => p.isOwned)
      .reduce((sum, p) => sum + (p.price || 0), 0);

    const propertyDebt = (state.properties || [])
      .filter((p) => p.isOwned && p.isMortgaged)
      .reduce((sum, p) => sum + (p.mortgageRemaining ?? (p.price || 0) * 0.8), 0);

    const vehicleValue = (state.vehicles || [])
      .filter((v) => v.isOwned)
      .reduce((sum, v) => sum + (v.price || 0), 0);

    const vaultValue = (state.vaultItems || []).reduce((sum, item) => sum + (item.estimatedValue || 0), 0);

    const savingsBalance = (state.bankAccount?.savingsBalance || 0) + (state.bankAccount?.offshoreBalance || 0);
    const investmentBalance = state.bankAccount?.investmentBalance || 0;
    const businessBalance = state.bankAccount?.businessBalance || 0;

    // Empire holdings & business valuations from EmpireService
    let empireValuation = 0;
    try {
      const empireState = EmpireService.getState();
      if (empireState) {
        if (empireState.holdingCompany?.isFormed) {
          empireValuation += empireState.holdingCompany.totalValuation || 0;
          if ((empireState.holdingCompany as any).cashPool) {
            empireValuation += (empireState.holdingCompany as any).cashPool;
          }
        } else if (empireState.businesses && empireState.businesses.length > 0) {
          empireValuation += empireState.businesses.reduce((acc, b) => acc + (b.status !== 'Bankrupt' ? (b.totalValuation || 0) : 0), 0);
        }
        if (empireState.investments?.portfolio && empireState.investments.portfolio.length > 0) {
          empireValuation += empireState.investments.portfolio.reduce((acc, i) => acc + (i.currentValue || 0), 0);
        }
      }
    } catch (e) {
      // safe fallback
    }

    const bankLoans = (state.bankAccount?.activeLoans || []).reduce((sum, l) => sum + (l.balanceRemaining || 0), 0);

    const totalAssets = cash + propertyValue + vehicleValue + vaultValue + savingsBalance + investmentBalance + businessBalance + empireValuation;
    const totalLiabilities = propertyDebt + bankLoans;
    const netWorth = totalAssets - totalLiabilities;

    // Weekly income & expenses calculation
    let weeklyIncome = 0;
    let weeklyExpenses = 0;

    // Jobs salary
    (state.activeJobs || []).forEach((job) => {
      weeklyIncome += job.weeklySalary || 0;
    });

    // Property rental income & upkeep/mortgage
    (state.properties || []).forEach((p) => {
      if (p.isOwned) {
        weeklyExpenses += p.weeklyUpkeep || 0;
        if (p.isMortgaged) {
          weeklyExpenses += p.weeklyMortgage || 0;
        }
        if (p.isRentedOut) {
          weeklyIncome += p.weeklyRentIncome || 0;
        }
      }
    });

    // Vehicles upkeep
    (state.vehicles || []).forEach((v) => {
      if (v.isOwned) {
        weeklyExpenses += v.weeklyUpkeep || 0;
      }
    });

    // Security costs
    (state.securityPackages || []).forEach((sec) => {
      if (sec.isHired) {
        weeklyExpenses += sec.weeklyCost || 0;
      }
    });

    // Syndication royalties
    (state.syndicationSources || []).forEach((syn) => {
      weeklyIncome += syn.weeklyRoyaltyAmount || 0;
    });

    // Financial Advisor
    if (state.hiredAdvisorId) {
      const adv = FINANCIAL_ADVISORS.find((a) => a.id === state.hiredAdvisorId);
      if (adv) {
        weeklyExpenses += adv.weeklyRetainer || 0;
      }
    }

    // Health subscription
    if (state.healthState?.activeGymId) {
      const gym = HEALTH_SERVICES.find((h) => h.id === state.healthState.activeGymId);
      if (gym && gym.weeklyCost) {
        weeklyExpenses += gym.weeklyCost;
      }
    }

    // Health Insurance weekly premium
    if (state.healthState?.activeInsurancePlanId) {
      const plan = HEALTH_INSURANCE_PLANS.find((p) => p.id === state.healthState.activeInsurancePlanId);
      if (plan) {
        weeklyExpenses += plan.weeklyCost;
      }
    }

    // Nutrition diet weekly cost
    if (state.healthState?.weeklyDietCost) {
      weeklyExpenses += state.healthState.weeklyDietCost;
    }

    const weeklyNetChange = weeklyIncome - weeklyExpenses;

    return {
      cash,
      checkingBalance: cash,
      savingsBalance,
      businessBalance,
      investmentBalance: investmentBalance + empireValuation,
      propertyValue,
      propertyDebt,
      vehicleValue,
      vaultValue,
      bankLoans,
      totalAssets,
      totalLiabilities,
      netWorth,
      weeklyIncome,
      weeklyExpenses,
      weeklyNetChange,
      careerHighNetWorth: Math.max(netWorth, 0),
      history: [
        { week: Math.max(1, playerMoney > 0 ? 1 : 1), netWorth: netWorth - weeklyNetChange },
        { week: 2, netWorth: netWorth },
      ],
    };
  },

  // Helper to calculate realistic credit score increase upon fully repaying a loan (+5 to +15)
  calculateLoanPayoffCreditBoost: (
    bankAccount: BankAccount,
    loan: BankLoan
  ): { boost: number; reasonText: string } => {
    let boost = 5; // Base +5 for full payoff
    const reasons: string[] = ['+5 Loan Repayment Completion'];

    // 1. Multiple successfully repaid loans
    const repaidCount = (bankAccount.loansRepaidCount || 0) + 1; // includes current completion
    if (repaidCount >= 3) {
      boost += 4;
      reasons.push('+4 Multiple Completed Loans Record');
    } else if (repaidCount >= 2) {
      boost += 2;
      reasons.push('+2 Repeat Successful Borrower');
    }

    // 2. On-Time repayments history
    const onTime = bankAccount.onTimePaymentsCount || 0;
    if (onTime >= 12) {
      boost += 3;
      reasons.push('+3 Exceptional On-Time Repayment History');
    } else if (onTime >= 4) {
      boost += 2;
      reasons.push('+2 Consistent On-Time Repayments');
    }

    // 3. Long repayment history maturity
    const totalAge = (bankAccount.creditAgeWeeks || 0) + Math.max(1, (loan.weeksLength || 26) - (loan.weeksRemaining || 0));
    if (totalAge >= 26) {
      boost += 3;
      reasons.push('+3 Long Credit Maturity (26+ Wks)');
    } else if (totalAge >= 12) {
      boost += 2;
      reasons.push('+2 Sustained Credit Age (12+ Wks)');
    }

    // 4. No defaults / missed payment penalties
    const missed = bankAccount.missedPaymentsCount || 0;
    const defaults = bankAccount.loanDefaultsCount || 0;
    if (defaults > 0) {
      boost -= 6;
      reasons.push('-6 Prior Loan Default Penalty');
    } else if (missed > 0) {
      const penalty = Math.min(4, missed * 2);
      boost -= penalty;
      reasons.push(`-${penalty} Missed Repayments Penalty`);
    } else {
      boost += 2;
      reasons.push('+2 Zero Defaults & Zero Missed Payments');
    }

    // Strictly clamp between +5 and +15
    const finalBoost = Math.max(5, Math.min(15, boost));

    return {
      boost: finalBoost,
      reasonText: reasons.join(' • '),
    };
  },

  // Process weekly loan repayments & gradual credit score adjustments
  processWeeklyLoansAndCredit: (
    currentState: NetworkFullState,
    playerMoney: number
  ): {
    nextState: NetworkFullState;
    cashDeducted: number;
    creditScoreDelta: number;
    logMessages: string[];
  } => {
    const nextState: NetworkFullState = JSON.parse(JSON.stringify(currentState));
    const logs: string[] = [];
    let cashDeducted = 0;
    let creditScoreDelta = 0;

    if (!nextState.bankAccount) {
      return { nextState: currentState, cashDeducted: 0, creditScoreDelta: 0, logMessages: [] };
    }

    const startScore = nextState.bankAccount.creditScore || 320;
    const activeLoans = nextState.bankAccount.activeLoans || [];
    const remainingLoans: BankLoan[] = [];

    activeLoans.forEach((loan) => {
      if (loan.weeklyPayment && loan.balanceRemaining > 0) {
        nextState.bankAccount.creditAgeWeeks = (nextState.bankAccount.creditAgeWeeks || 0) + 1;

        if (playerMoney - cashDeducted >= loan.weeklyPayment) {
          // On-time payment
          cashDeducted += loan.weeklyPayment;
          loan.balanceRemaining = Math.max(0, loan.balanceRemaining - loan.weeklyPayment);
          loan.weeksRemaining = Math.max(0, (loan.weeksRemaining || 1) - 1);
          nextState.bankAccount.onTimePaymentsCount = (nextState.bankAccount.onTimePaymentsCount || 0) + 1;

          // On-time loan payments boost credit faster: +1 every 4 on-time repayments (was 8)
          if (nextState.bankAccount.onTimePaymentsCount % 4 === 0) {
            nextState.bankAccount.creditScore = Math.min(850, nextState.bankAccount.creditScore + 1);
          }

          if (loan.balanceRemaining === 0 || loan.weeksRemaining === 0) {
            // Loan fully repaid via weekly payments
            loan.status = 'PAID_OFF';
            if (!nextState.bankAccount.loanHistory) nextState.bankAccount.loanHistory = [];
            nextState.bankAccount.loanHistory.unshift(loan);

            const boostResult = NetworkService.calculateLoanPayoffCreditBoost(nextState.bankAccount, loan);
            nextState.bankAccount.loansRepaidCount = (nextState.bankAccount.loansRepaidCount || 0) + 1;
            nextState.bankAccount.creditScore = Math.min(850, nextState.bankAccount.creditScore + boostResult.boost);

            logs.push(`🎉 Loan "${loan.title || loan.type}" fully repaid! Credit score increased by +${boostResult.boost} to ${nextState.bankAccount.creditScore} (${boostResult.reasonText}).`);
          } else {
            remainingLoans.push(loan);
            logs.push(`Loan Repayment: -$${loan.weeklyPayment.toLocaleString()} (${loan.title || loan.type})`);
          }
        } else {
          // MISSED REPAYMENT — penalty applied immediately
          nextState.bankAccount.missedPaymentsCount = (nextState.bankAccount.missedPaymentsCount || 0) + 1;
          const dropAmount = 20;
          nextState.bankAccount.creditScore = Math.max(300, (nextState.bankAccount.creditScore || 320) - dropAmount);
          remainingLoans.push(loan);

          logs.push(`⚠️ MISSED LOAN REPAYMENT on "${loan.title || loan.type}" due to insufficient liquid funds! Credit score dropped by ${dropAmount} points.`);
        }
      } else {
        remainingLoans.push(loan);
      }
    });

    nextState.bankAccount.activeLoans = remainingLoans;

    // ============================================================
    // MULTI-FACTOR CREDIT ENGINE — credit rises from more than loans
    // ============================================================
    const breakdown: { factor: string; points: number }[] = [];
    let gained = 0;

    // 1) INCOME STABILITY: record weekly income (first 8 weeks of history), slow climb weekly
    const incomeHistory = nextState.bankAccount.weeklyIncomeHistory || [];
    const weeklyIncome = playerMoney > 0 ? Math.floor(playerMoney / 4) : 0; // proxy of weekly flow
    incomeHistory.push(weeklyIncome);
    if (incomeHistory.length > 8) incomeHistory.shift();
    nextState.bankAccount.weeklyIncomeHistory = incomeHistory;
    if (incomeHistory.length >= 4) {
      const avgIncome = incomeHistory.reduce((a, b) => a + b, 0) / incomeHistory.length;
      if (avgIncome > 5000) { gained += 1; breakdown.push({ factor: 'Income stability', points: 1 }); }
      if (avgIncome > 50000) { gained += 1; breakdown.push({ factor: 'High income', points: 1 }); }
    }

    // 2) PASSIVE SLOW CLIMB: +1 every 4 weeks of responsible banking (not loan-dependent)
    const creditAge = nextState.bankAccount.creditAgeWeeks || 0;
    if (creditAge > 0 && creditAge % 4 === 0 && nextState.bankAccount.missedPaymentsCount === 0) {
      gained += 1;
      breakdown.push({ factor: 'Account age (4 wks clean)', points: 1 });
    }

    // 3) WEALTH MULTIPLIER: big savings/net worth unlock bigger boosts (one-time milestones)
    const savingsBal = nextState.bankAccount?.savingsBalance || 0;
    const checkingBal = nextState.bankAccount?.checkingBalance || 0;
    const totalWealth = savingsBal + checkingBal;
    if (totalWealth >= 100000000 && !nextState.bankAccount.wealthFactorEarned) {
      gained += 40; breakdown.push({ factor: '$100M+ wealth', points: 40 });
    } else if (totalWealth >= 10000000 && !nextState.bankAccount.wealthFactorEarned) {
      gained += 25; breakdown.push({ factor: '$10M+ wealth', points: 25 });
    } else if (totalWealth >= 1000000 && !nextState.bankAccount.wealthFactorEarned) {
      gained += 10; breakdown.push({ factor: '$1M+ wealth', points: 10 });
    }
    if (gained > 0 && !nextState.bankAccount.wealthFactorEarned && totalWealth >= 1000000) {
      nextState.bankAccount.wealthFactorEarned = true;
    }

    // 4) CREDIT CARD USAGE: using cards builds credit (usage tracked), maxing penalizes
    const cardUsage = nextState.bankAccount.cardUsageCount || 0;
    if (cardUsage > 0) {
      const onTime = nextState.bankAccount.cardOnTimeCount || 0;
      if (onTime >= 4) { gained += 1; breakdown.push({ factor: 'Card on-time usage', points: 1 }); }
    }

    // 5) TAX COMPLIANCE: filing taxes cleanly boosts score
    if ((nextState.bankAccount.taxComplianceScore || 0) >= 80) {
      gained += 2; breakdown.push({ factor: 'Tax compliance', points: 2 });
    }

    // Apply gains (slow: never more than +6 in one week)
    const finalGain = Math.min(6, gained);
    if (finalGain > 0) {
      nextState.bankAccount.creditScore = Math.min(850, (nextState.bankAccount.creditScore || 320) + finalGain);
      breakdown.push({ factor: 'Weekly total', points: finalGain });
    }
    nextState.bankAccount.creditBreakdown = breakdown;

    // Update FICO reputation rating
    const finalScore = nextState.bankAccount.creditScore;
    if (finalScore >= 800) nextState.bankAccount.reputationRating = 'AAA';
    else if (finalScore >= 760) nextState.bankAccount.reputationRating = 'AA';
    else if (finalScore >= 700) nextState.bankAccount.reputationRating = 'A';
    else if (finalScore >= 650) nextState.bankAccount.reputationRating = 'BBB';
    else if (finalScore >= 600) nextState.bankAccount.reputationRating = 'BB';
    else if (finalScore >= 550) nextState.bankAccount.reputationRating = 'B';
    else nextState.bankAccount.reputationRating = 'CCC';

    creditScoreDelta = finalScore - startScore;

    return {
      nextState,
      cashDeducted,
      creditScoreDelta,
      logMessages: logs,
    };
  },

  // Helper to generate dynamic loan offers based on player financial standing
  generateLoanOffers: (state: NetworkFullState, player: Player): GeneratedLoanOffer[] => {
    const credit = state.bankAccount?.creditScore || 320;
    const summary = NetworkService.calculateFinancialSummary(state, player.money);
    const netWorth = Math.max(0, summary.netWorth);
    const weeklyIncome = Math.max(0, summary.weeklyIncome);

    // Interest rate tier based on credit score
    const baseRatePct = credit >= 800 ? 3.5 : credit >= 720 ? 5.0 : credit >= 650 ? 7.5 : credit >= 550 ? 10.5 : 14.0;

    return [
      {
        id: 'offer_starter',
        title: 'Starter Credit Line',
        type: 'Personal Loan',
        principal: 50000,
        interestRatePct: Number(baseRatePct.toFixed(1)),
        weeklyPayment: Math.round((50000 * (1 + baseRatePct / 100)) / 26),
        weeksLength: 26,
        totalRepayment: Math.round(50000 * (1 + baseRatePct / 100)),
        riskRating: 'Low',
        requirements: { minCreditScore: 300, minNetWorth: 0, minWeeklyIncome: 0 },
        description: 'Quick unsecured cash buffer for emerging Hollywood talent and rising creators.',
      },
      {
        id: 'offer_expansion',
        title: 'Business Expansion Loan',
        type: 'Business Line',
        principal: 250000,
        interestRatePct: Number((baseRatePct * 0.9).toFixed(1)),
        weeklyPayment: Math.round((250000 * (1 + (baseRatePct * 0.9) / 100)) / 52),
        weeksLength: 52,
        totalRepayment: Math.round(250000 * (1 + (baseRatePct * 0.9) / 100)),
        riskRating: 'Low',
        requirements: { minCreditScore: 500, minNetWorth: 50000, minWeeklyIncome: 1000 },
        description: 'Capital for hiring staff, launching production ventures, and expanding business operations.',
      },
      {
        id: 'offer_studio_growth',
        title: 'Studio Growth Credit Facility',
        type: 'Studio Growth',
        principal: 2000000,
        interestRatePct: Number((baseRatePct * 0.8).toFixed(1)),
        weeklyPayment: Math.round((2000000 * (1 + (baseRatePct * 0.8) / 100)) / 104),
        weeksLength: 104,
        totalRepayment: Math.round(2000000 * (1 + (baseRatePct * 0.8) / 100)),
        riskRating: 'Moderate',
        requirements: { minCreditScore: 640, minNetWorth: 300000, minWeeklyIncome: 5000 },
        description: 'Institutional backing designed to fund major independent feature films and slate developments.',
      },
      {
        id: 'offer_luxury_invest',
        title: 'Luxury Portfolio & Estate Loan',
        type: 'Mortgage',
        principal: 15000000,
        interestRatePct: Number((baseRatePct * 0.75).toFixed(1)),
        weeklyPayment: Math.round((15000000 * (1 + (baseRatePct * 0.75) / 100)) / 156),
        weeksLength: 156,
        totalRepayment: Math.round(15000000 * (1 + (baseRatePct * 0.75) / 100)),
        riskRating: 'High',
        requirements: { minCreditScore: 710, minNetWorth: 2000000, minWeeklyIncome: 20000 },
        description: 'High-value financing for Bel-Air estates, luxury mega-yachts, and private art vaults.',
      },
      {
        id: 'offer_corp_acq',
        title: 'Mega Corporate Acquisition Loan',
        type: 'Acquisition',
        principal: 100000000,
        interestRatePct: Number((baseRatePct * 0.7).toFixed(1)),
        weeklyPayment: Math.round((100000000 * (1 + (baseRatePct * 0.7) / 100)) / 208),
        weeksLength: 208,
        totalRepayment: Math.round(100000000 * (1 + (baseRatePct * 0.7) / 100)),
        riskRating: 'Extreme',
        requirements: { minCreditScore: 760, minNetWorth: 15000000, minWeeklyIncome: 75000 },
        description: 'Syndicated Wall Street loan for taking major Hollywood production studios public or executing hostile takeovers.',
      },
    ];
  },

  // Claim/Accept Loan Offer and IMMEDIATELY deposit cash to player balance
  acceptLoanOffer: (
    currentState: NetworkFullState,
    offerId: string,
    player: Player
  ): { nextState: NetworkFullState; cashAdded: number; message: string; success: boolean } => {
    const nextState: NetworkFullState = JSON.parse(JSON.stringify(currentState));
    if (!nextState.bankAccount) {
      nextState.bankAccount = {
        checkingBalance: player.money,
        savingsBalance: 0,
        savingsApy: 0.025,
        businessBalance: 0,
        investmentBalance: 0,
        offshoreBalance: 0,
        offshoreApy: 0.04,
        creditScore: 320,
        bankReputation: 50,
        reputationRating: 'CCC',
        activeLoans: [],
        loanHistory: [],
        preGeneratedOffers: [],
        transactionHistory: [],
      };
    }

    const offers = NetworkService.generateLoanOffers(nextState, player);
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) {
      return { nextState: currentState, cashAdded: 0, message: 'Loan offer not found.', success: false };
    }

    const currentActiveLoans = nextState.bankAccount.activeLoans || [];
    if (currentActiveLoans.length > 0) {
      return {
        nextState: currentState,
        cashAdded: 0,
        message: 'You must fully repay your current loan before applying for another.',
        success: false,
      };
    }

    const credit = nextState.bankAccount.creditScore || 320;
    const summary = NetworkService.calculateFinancialSummary(nextState, player.money);

    if (credit < offer.requirements.minCreditScore) {
      return {
        nextState: currentState,
        cashAdded: 0,
        message: `Declined: Required Credit Score is ${offer.requirements.minCreditScore} (Your score: ${credit}).`,
        success: false,
      };
    }

    if (summary.netWorth < offer.requirements.minNetWorth) {
      return {
        nextState: currentState,
        cashAdded: 0,
        message: `Declined: Required Net Worth is $${offer.requirements.minNetWorth.toLocaleString()} (Your Net Worth: $${summary.netWorth.toLocaleString()}).`,
        success: false,
      };
    }

    const newLoan: BankLoan = {
      id: `loan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: offer.type,
      title: offer.title,
      principal: offer.principal,
      balanceRemaining: offer.totalRepayment,
      weeklyPayment: offer.weeklyPayment,
      interestRatePct: offer.interestRatePct,
      weeksRemaining: offer.weeksLength,
      weeksLength: offer.weeksLength,
      approvalWeek: player.dateWeek || 1,
      status: 'ACTIVE',
    };

    // Add active loan
    if (!nextState.bankAccount.activeLoans) nextState.bankAccount.activeLoans = [];
    nextState.bankAccount.activeLoans.push(newLoan);

    // CRITICAL BUG FIX: Add loan principal directly to checking balance
    nextState.bankAccount.checkingBalance += offer.principal;

    // Record transaction
    if (!nextState.bankAccount.transactionHistory) nextState.bankAccount.transactionHistory = [];
    nextState.bankAccount.transactionHistory.unshift({
      id: `tx_${Date.now()}`,
      description: `Loan Disbursement: ${offer.title}`,
      amount: offer.principal,
      type: 'INCOME',
      category: 'Loan',
      week: player.dateWeek || 1,
    });

    NetworkService.saveState(nextState);

    return {
      nextState,
      cashAdded: offer.principal,
      message: `LOAN APPROVED & DISBURSED! $${offer.principal.toLocaleString()} deposited into checking account immediately.`,
      success: true,
    };
  },

  // Repay loan early
  repayLoanEarly: (
    currentState: NetworkFullState,
    loanId: string,
    playerMoney: number
  ): { nextState: NetworkFullState; cashDeducted: number; message: string; success: boolean } => {
    const nextState: NetworkFullState = JSON.parse(JSON.stringify(currentState));
    if (!nextState.bankAccount?.activeLoans) {
      return { nextState: currentState, cashDeducted: 0, message: 'No active loans found.', success: false };
    }

    const targetLoanIndex = nextState.bankAccount.activeLoans.findIndex((l) => l.id === loanId);
    if (targetLoanIndex === -1) {
      return { nextState: currentState, cashDeducted: 0, message: 'Loan not found.', success: false };
    }

    const loan = nextState.bankAccount.activeLoans[targetLoanIndex];
    if (playerMoney < loan.balanceRemaining) {
      return {
        nextState: currentState,
        cashDeducted: 0,
        message: `Insufficient cash! Paying off this loan requires $${loan.balanceRemaining.toLocaleString()}.`,
        success: false,
      };
    }

    const payAmount = loan.balanceRemaining;
    nextState.bankAccount.checkingBalance = Math.max(0, nextState.bankAccount.checkingBalance - payAmount);

    // Realistic credit score increase (+5 to +15 depending on repayment performance)
    const boostResult = NetworkService.calculateLoanPayoffCreditBoost(nextState.bankAccount, loan);
    nextState.bankAccount.creditScore = Math.min(850, Math.max(300, (nextState.bankAccount.creditScore || 320) + boostResult.boost));
    nextState.bankAccount.loansRepaidCount = (nextState.bankAccount.loansRepaidCount || 0) + 1;

    // Update reputation rating
    const finalScore = nextState.bankAccount.creditScore;
    if (finalScore >= 800) nextState.bankAccount.reputationRating = 'AAA';
    else if (finalScore >= 760) nextState.bankAccount.reputationRating = 'AA';
    else if (finalScore >= 700) nextState.bankAccount.reputationRating = 'A';
    else if (finalScore >= 650) nextState.bankAccount.reputationRating = 'BBB';
    else if (finalScore >= 600) nextState.bankAccount.reputationRating = 'BB';
    else if (finalScore >= 550) nextState.bankAccount.reputationRating = 'B';
    else nextState.bankAccount.reputationRating = 'CCC';

    // Archive loan
    loan.status = 'PAID_OFF';
    if (!nextState.bankAccount.loanHistory) nextState.bankAccount.loanHistory = [];
    nextState.bankAccount.loanHistory.unshift(loan);
    nextState.bankAccount.activeLoans.splice(targetLoanIndex, 1);

    // Transaction record
    nextState.bankAccount.transactionHistory.unshift({
      id: `tx_${Date.now()}`,
      description: `Early Loan Payoff: ${loan.title || loan.type}`,
      amount: payAmount,
      type: 'EXPENSE',
      category: 'Loan',
      week: 1,
    });

    NetworkService.saveState(nextState);

    return {
      nextState,
      cashDeducted: payAmount,
      message: `LOAN FULLY REPAID! Paid off $${payAmount.toLocaleString()}. Credit score increased by +${boostResult.boost} to ${nextState.bankAccount.creditScore} (${boostResult.reasonText}).`,
      success: true,
    };
  },
  processWeeklyNetworkTick: (
    currentState: NetworkFullState,
    player: Player,
    releasedMovies: ReleasedMovie[]
  ): { nextState: NetworkFullState; cashDelta: number; energyDelta: number; messageLog: string[] } => {
    const nextState: NetworkFullState = JSON.parse(JSON.stringify(currentState));
    const logs: string[] = [];
    let cashDelta = 0;
    let energyDelta = 0;

    // 1. Process Jobs
    nextState.activeJobs = nextState.activeJobs.filter((job) => {
      cashDelta += job.weeklySalary;
      energyDelta -= job.energyCost;
      job.weeksRemaining -= 1;
      job.totalEarned += job.weeklySalary;
      logs.push(`💼 Earned $${job.weeklySalary.toLocaleString()} salary from ${job.title}.`);

      if (job.weeksRemaining <= 0) {
        logs.push(`💼 Job contract ended for ${job.title}.`);
        return false;
      }
      return true;
    });

    // 2. Process Properties (Rent income & Mortgages/Upkeep)
    nextState.properties.forEach((p) => {
      if (p.isOwned) {
        // Upkeep
        cashDelta -= p.weeklyUpkeep;
        // Mortgage
        if (p.isMortgaged) {
          cashDelta -= p.weeklyMortgage;
          p.mortgageRemaining = Math.max(0, (p.mortgageRemaining || p.price * 0.8) - p.weeklyMortgage * 0.7);
        }
        // Rent
        if (p.isRentedOut) {
          cashDelta += p.weeklyRentIncome;
          logs.push(`🏡 Collected $${p.weeklyRentIncome.toLocaleString()} rental income from ${p.name}.`);
        }
        // Appreciation
        p.price = Math.round(p.price * 1.001);
      }
    });

    // 3. Process Vehicles (Maintenance & Depreciation/Appreciation)
    nextState.vehicles.forEach((v) => {
      if (v.isOwned) {
        cashDelta -= v.weeklyUpkeep;
        if (v.tier === 'Elite') {
          v.price = Math.round(v.price * 1.002); // Vintage/Elite appreciates
        }
      }
    });

    // 4. Process Bank Loans and Credit Score Standings
    const loanProcessResult = NetworkService.processWeeklyLoansAndCredit(nextState, player.money + cashDelta);
    Object.assign(nextState.bankAccount, loanProcessResult.nextState.bankAccount);
    cashDelta -= loanProcessResult.cashDeducted;
    logs.push(...loanProcessResult.logMessages);

    // 5. Process Security Packages
    let totalProtectionRating = 20;
    nextState.securityPackages.forEach((sec) => {
      if (sec.isHired) {
        cashDelta -= sec.weeklyCost;
        totalProtectionRating += sec.protectionRatingBonus;
      }
    });

    // Random Security Check
    if (Math.random() < 0.25) {
      if (totalProtectionRating >= 50) {
        nextState.securityLogs.unshift({
          week: (player.dateWeek || 1) + 1,
          incidentName: 'Paparazzi / Intruder Infiltration',
          status: 'THWARTED',
          details: `Security team thwarted trespasser at primary residence. Protection score: ${totalProtectionRating}%.`,
        });
        logs.push('🛡️ Security team successfully intercepted a paparazzi trespasser.');
      } else {
        nextState.securityLogs.unshift({
          week: (player.dateWeek || 1) + 1,
          incidentName: 'Minor Security Incident',
          status: 'WARNING',
          details: 'Privacy breach reported. Consider upgrading personal security team.',
        });
      }
    }

    // 5. Process Syndication Royalties from Released Movies
    releasedMovies.forEach((movie) => {
      const existing = nextState.syndicationSources.find((s) => s.title === movie.movieTitle);
      let weeklyAmt = Math.round((movie.worldwideGross || 5000000) * 0.0005);
      if (movie.worldwideGross > 100000000) {
        weeklyAmt = Math.round(movie.worldwideGross * 0.002);
      }

      if (!existing) {
        nextState.syndicationSources.push({
          id: `syn_${movie.id}`,
          title: movie.movieTitle,
          type: 'Movie',
          releaseYear: player.dateYear || 2026,
          weeklyRoyaltyAmount: weeklyAmt,
          totalRoyaltiesEarned: weeklyAmt,
          syndicationTier: movie.worldwideGross > 100000000 ? 'Worldwide Broadcast' : 'Cable Network',
          isHit: movie.worldwideGross > 50000000,
        });
      } else {
        existing.totalRoyaltiesEarned += existing.weeklyRoyaltyAmount;
        cashDelta += existing.weeklyRoyaltyAmount;
        logs.push(`📺 Collected $${existing.weeklyRoyaltyAmount.toLocaleString()} royalties for ${movie.movieTitle}.`);
      }
    });

    // 6. Savings Interest
    const savingsInterest = Math.round(nextState.bankAccount.savingsBalance * (nextState.bankAccount.savingsApy / 52));
    if (savingsInterest > 0) {
      nextState.bankAccount.savingsBalance += savingsInterest;
      logs.push(`🏦 Earned $${savingsInterest.toLocaleString()} interest on savings account.`);
    }

    // 7. Financial Advisor Retainer & Tax Savings
    if (nextState.hiredAdvisorId) {
      const adv = FINANCIAL_ADVISORS.find((a) => a.id === nextState.hiredAdvisorId);
      if (adv) {
        cashDelta -= adv.weeklyRetainer;
        const taxSaved = 0;
        nextState.advisorReports.unshift({
          week: (player.dateWeek || 1) + 1,
          summary: `Weekly Wealth Analysis by ${adv.name} (${adv.firm})`,
          recommendations: [
            `Wealth strategy review complete (tax handled by your Empire Tax system).`,
            'Recommend allocating excess liquidity into high-yield real estate or blue-chip entertainment equities.',
          ],
          taxSaved: 0,
        });
        logs.push(`📈 Financial Advisor ${adv.name} completed weekly wealth strategy review.`);
      }
    }

    // 8. Financial Reputation Rating Update
    const currentCredit = nextState.bankAccount.creditScore;
    if (currentCredit >= 800) nextState.bankAccount.reputationRating = 'AAA';
    else if (currentCredit >= 760) nextState.bankAccount.reputationRating = 'AA';
    else if (currentCredit >= 700) nextState.bankAccount.reputationRating = 'A';
    else if (currentCredit >= 650) nextState.bankAccount.reputationRating = 'BBB';
    else if (currentCredit >= 600) nextState.bankAccount.reputationRating = 'BB';
    else if (currentCredit >= 550) nextState.bankAccount.reputationRating = 'B';
    else nextState.bankAccount.reputationRating = 'CCC';

    nextState.lastProcessedWeek = (player.dateWeek || 1) + 1;
    nextState.lastProcessedYear = player.dateYear || 2026;

    NetworkService.saveState(nextState);

    return { nextState, cashDelta, energyDelta, messageLog: logs };
  },

  updateForbesAndBankableRankings: (player: Player): void => {
    try {
      const state = NetworkService.loadState(player);
      state.forbesList = GENERATE_FORBES_100(player);
      state.bankableStarsList = GENERATE_BANKABLE_100(player);
      NetworkService.saveState(state);
    } catch {
      // ignore
    }
  },
};
