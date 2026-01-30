import { TeardownStep } from '../types/device';

export const mockTeardownSteps: Record<string, TeardownStep[]> = {
    'hp-deskjet-2700': [
        {
            id: 'hp-step-1',
            deviceId: 'hp-deskjet-2700',
            stepNumber: 1,
            title: 'Preparation & Safety Check',
            description: 'Before beginning, ensure the printer is unplugged and has been off for at least 30 minutes to allow capacitors to discharge.',
            hasSafetyGate: true,
            safetyWarnings: [
                'Unplug device from power outlet',
                'Wear safety glasses to protect from springs',
                'Use gloves to avoid sharp edges on metal parts'
            ]
        },
        {
            id: 'hp-step-2',
            deviceId: 'hp-deskjet-2700',
            stepNumber: 2,
            title: 'Remove Outer Casing',
            description: 'Use a Phillips screwdriver to remove the 4 screws on the bottom panel. Gently pry apart the plastic casing.',
            hasSafetyGate: false
        },
        {
            id: 'hp-step-3',
            deviceId: 'hp-deskjet-2700',
            stepNumber: 3,
            title: 'Extract Stepper Motors',
            description: 'Locate the two NEMA 17 stepper motors - one for paper feed and one for print head movement. Disconnect wiring harnesses and remove mounting screws.',
            hasSafetyGate: false,
            componentId: 'nema-17-motor',
            educationalContext: {
                whatIsIt: 'NEMA 17 Stepper Motor - A precision electric motor that divides a full rotation into discrete steps, allowing for exact positioning control.',
                whyValuable: 'Worth $18 for the pair. These motors are essential for robotics, 3D printers, and CNC machines due to their precise control and reliability.',
                whereUsed: [
                    '3D Printers (bed and extruder movement)',
                    'CNC machines (axis control)',
                    'Camera sliders and pan-tilt systems',
                    'Automated laboratory equipment',
                    'DIY robotics projects'
                ],
                howItWorks: 'Stepper motors work by energizing electromagnetic coils in sequence, causing the rotor to move in precise angular increments. This allows for accurate positioning without feedback sensors.'
            }
        },
        {
            id: 'hp-step-4',
            deviceId: 'hp-deskjet-2700',
            stepNumber: 4,
            title: 'Harvest Linear Rail System',
            description: 'The print head linear rail is a smooth rod with bearing carriage. Remove end caps and slide the carriage off carefully.',
            hasSafetyGate: false,
            componentId: 'linear-rail',
            educationalContext: {
                whatIsIt: 'Linear Rail - A precision guide system that allows smooth linear motion with minimal friction.',
                whyValuable: 'Worth $12. Critical for any project requiring accurate straight-line movement.',
                whereUsed: [
                    '3D printer axes',
                    'CNC router gantries',
                    'Camera sliders',
                    'Automated pick-and-place machines'
                ],
                howItWorks: 'Linear rails use ball bearings rolling on hardened steel rods to provide low-friction, repeatable linear motion. The bearing carriage maintains alignment and prevents wobble.'
            }
        },
        {
            id: 'hp-step-5',
            deviceId: 'hp-deskjet-2700',
            stepNumber: 5,
            title: 'Remove Optical Encoder',
            description: 'The optical encoder strip is attached to the print head carriage. Carefully detach the transparent strip and the optical sensor.',
            hasSafetyGate: false,
            componentId: 'optical-encoder',
            educationalContext: {
                whatIsIt: 'Optical Encoder - A sensor that detects position by reading marks on a transparent strip.',
                whyValuable: 'Worth $8. Encoders provide feedback for precise position control in automation.',
                whereUsed: [
                    'Robotics position feedback',
                    'Automated guided vehicles',
                    'High-precision manufacturing',
                    'Scientific instruments'
                ],
                howItWorks: 'An LED shines through the encoder strip which has alternating transparent and opaque bars. A photodetector on the other side counts the interruptions to determine position and speed.'
            }
        },
        {
            id: 'hp-step-6',
            deviceId: 'hp-deskjet-2700',
            stepNumber: 6,
            title: 'Extract Power Supply',
            description: 'The AC/DC power supply is typically located at the back. Disconnect all wiring and remove mounting screws.',
            hasSafetyGate: true,
            safetyWarnings: [
                'DANGER: Capacitors may still hold charge',
                'Do not touch exposed circuitry',
                'Wear insulated gloves',
                'Use insulated tools only'
            ],
            componentId: 'power-supply',
            educationalContext: {
                whatIsIt: 'Switching Power Supply - Converts AC wall voltage to regulated DC voltage for the printer.',
                whyValuable: 'Worth $5. Useful for powering DIY electronics projects.',
                whereUsed: [
                    'Bench power supplies',
                    'LED lighting projects',
                    'Raspberry Pi and Arduino projects',
                    'Test equipment power source'
                ],
                howItWorks: 'Switching power supplies use high-frequency transistors to convert AC to DC efficiently, then regulate the output voltage using feedback control circuits.'
            }
        },
        {
            id: 'hp-step-7',
            deviceId: 'hp-deskjet-2700',
            stepNumber: 7,
            title: 'Teardown Complete',
            description: 'Congratulations! You have successfully harvested all valuable components from the HP DeskJet 2700 printer.',
            hasSafetyGate: false
        }
    ]
};
