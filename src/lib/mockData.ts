import { Device } from '../types/device';

export const mockDevices: Device[] = [
    {
        id: 'hp-deskjet-2700',
        name: 'HP DeskJet 2700 Printer',
        hviScore: 87,
        difficulty: 'medium',
        totalValue: 43,
        category: 'Printer',
        safetyTier: 'YELLOW',
        description: 'Consumer inkjet printer with valuable stepper motors and mechanical components',
        components: [
            {
                id: 'nema-17-motor',
                name: 'NEMA 17 Stepper Motor (x2)',
                value: 18,
                description: 'High-precision stepper motors used for paper feed and print head movement',
                learningOutcome: 'Motor control, mechanical systems, precision positioning'
            },
            {
                id: 'linear-rail',
                name: 'Linear Rail',
                value: 12,
                description: 'Smooth motion rail system for print head',
                learningOutcome: 'Mechanical systems, linear motion, CNC basics'
            },
            {
                id: 'optical-encoder',
                name: 'Optical Encoder',
                value: 8,
                description: 'Position sensing mechanism for precise movement tracking',
                learningOutcome: 'Optical sensing, feedback systems, automation'
            },
            {
                id: 'power-supply',
                name: 'Power Supply',
                value: 5,
                description: 'AC/DC converter providing regulated power',
                learningOutcome: 'Power electronics, voltage regulation, safety'
            }
        ]
    },
    {
        id: 'linksys-wrt54g',
        name: 'Linksys WRT54G Router',
        hviScore: 72,
        difficulty: 'easy',
        totalValue: 28,
        category: 'Networking',
        safetyTier: 'GREEN',
        description: 'Classic wireless router with valuable networking components',
        components: [
            {
                id: 'wifi-module',
                name: 'Wi-Fi Module',
                value: 12,
                description: '2.4GHz wireless transceiver module',
                learningOutcome: 'Networking, RF basics, wireless communication'
            },
            {
                id: 'ethernet-controller',
                name: 'Ethernet Controllers (x2)',
                value: 8,
                description: 'Wired network interface chips',
                learningOutcome: 'Networking protocols, data transmission'
            },
            {
                id: 'power-regulator',
                name: 'Power Regulator',
                value: 5,
                description: 'Voltage regulation circuitry',
                learningOutcome: 'Power management, circuit design'
            },
            {
                id: 'antenna-array',
                name: 'Antenna Array',
                value: 3,
                description: 'External WiFi antennas',
                learningOutcome: 'RF propagation, antenna theory'
            }
        ]
    },
    {
        id: 'xbox-360',
        name: 'Xbox 360 (RROD/broken)',
        hviScore: 95,
        difficulty: 'hard',
        totalValue: 67,
        category: 'Gaming Console',
        safetyTier: 'RED',
        description: 'Gaming console with advanced cooling and mechanical systems',
        components: [
            {
                id: 'dvd-drive-motor',
                name: 'DVD Drive Motor',
                value: 15,
                description: 'Precision brushless motor for optical drive',
                learningOutcome: 'Motor control, optical media, mechanical design'
            },
            {
                id: 'gpu-heatsink',
                name: 'GPU Heatsink',
                value: 18,
                description: 'Large aluminum heatsink with heat pipes',
                learningOutcome: 'Thermal management, heat dissipation, material science'
            },
            {
                id: 'cooling-fans',
                name: 'Cooling Fans (x2)',
                value: 14,
                description: 'High-performance case fans',
                learningOutcome: 'Airflow design, thermal systems'
            },
            {
                id: 'psu-unit',
                name: 'Power Supply Unit',
                value: 20,
                description: 'High-wattage switching power supply',
                learningOutcome: 'Power electronics, efficiency, safety systems'
            }
        ]
    },
    {
        id: 'dell-inspiron',
        name: 'Dell Inspiron Laptop (non-functional)',
        hviScore: 91,
        difficulty: 'hard',
        totalValue: 89,
        category: 'Laptop',
        safetyTier: 'RED',
        description: 'Laptop with modular components ideal for learning computer architecture',
        components: [
            {
                id: 'lcd-panel',
                name: 'LCD Panel',
                value: 35,
                description: '15.6" LED-backlit display',
                learningOutcome: 'Display technology, video signals, backlight systems'
            },
            {
                id: 'webcam-module',
                name: 'Webcam Module',
                value: 12,
                description: 'Integrated USB camera module',
                learningOutcome: 'Image sensors, USB protocol, computer vision'
            },
            {
                id: 'ram-modules',
                name: 'RAM Modules (x2)',
                value: 25,
                description: 'DDR3 memory sticks',
                learningOutcome: 'Memory architecture, computer systems'
            },
            {
                id: 'wifi-card',
                name: 'Wi-Fi Card',
                value: 8,
                description: 'Mini PCIe wireless adapter',
                learningOutcome: 'Wireless networking, modular computing'
            },
            {
                id: 'speakers',
                name: 'Speakers',
                value: 9,
                description: 'Stereo speaker set',
                learningOutcome: 'Audio systems, transducers'
            }
        ]
    }
];
