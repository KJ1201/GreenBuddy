export interface Component {
    id: string;
    name: string;
    value: number;
    description: string;
    learningOutcome: string;
}

export interface Device {
    id: string;
    name: string;
    image?: string;
    hviScore: number;
    difficulty: 'easy' | 'medium' | 'hard';
    totalValue: number;
    category: string;
    components: Component[];
    description: string;
    safetyTier: 'GREEN' | 'YELLOW' | 'RED';
}

export interface TeardownStep {
    id: string;
    deviceId: string;
    stepNumber: number;
    title: string;
    description: string;
    imageUrl?: string;
    hasSafetyGate: boolean;
    safetyWarnings?: string[];
    componentId?: string;
    educationalContext?: {
        whatIsIt: string;
        whyValuable: string;
        whereUsed: string[];
        howItWorks: string;
    };
}
