export const initialImpactStats = {
  mealsSaved: 142850,
  peopleFed: 98200,
  activeVolunteers: 4520,
  ngosConnected: 628,
  wasteReducedTons: 71.4,
  carbonSavedKg: 185600,
};

export const mockUsers = {
  donor: {
    id: "usr_donor_1",
    name: "Royal Horizon Grand Hotel & Banquets",
    email: "donations@royalhorizon.com",
    role: "donor",
    avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Downtown Sector 4",
    verified: true,
  },
  ngo: {
    id: "usr_ngo_1",
    name: "Hope Community Shelter & Kitchen",
    email: "dispatch@hopeshelter.org",
    role: "ngo",
    avatar: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 987-6543",
    address: "108 Harmony Way, Westside Community District",
    beneficiariesCount: 450,
    verified: true,
  },
  volunteer: {
    id: "usr_vol_1",
    name: "Alex Rivera",
    email: "alex.rivera@volunteer.org",
    role: "volunteer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 456-7890",
    vehicle: "Eco EV Scooter (Plate: FB-992)",
    rating: 4.9,
    completedPickups: 142,
    points: 2840,
    verified: true,
  },
  admin: {
    id: "usr_admin_1",
    name: "National FoodBridge Operations Desk",
    email: "admin@foodbridge.ai",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    verified: true,
  }
};

export const initialDonations = [];

export const topVolunteers = [
  { rank: 1, name: "Alex Rivera", points: 2840, pickups: 142, badge: "Legendary Hero", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { rank: 2, name: "Priya Sharma", points: 2410, pickups: 118, badge: "Master Dispatcher", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
  { rank: 3, name: "David Chen", points: 2190, pickups: 105, badge: "Green Shield", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { rank: 4, name: "Sarah Jenkins", points: 1950, pickups: 92, badge: "Fast Responder", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80" },
  { rank: 5, name: "Marcus Brody", points: 1720, pickups: 84, badge: "Community Star", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
];

export const initialNotifications = [];

export const chatbotPresets = [
  "How does FoodBridge AI match food?",
  "What types of food can I donate?",
  "How do I claim tax savings for donations?",
  "Analyze food safety & freshness standards",
];
