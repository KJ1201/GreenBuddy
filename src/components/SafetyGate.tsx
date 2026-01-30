import { AlertTriangle, X } from 'lucide-react';
import { Button, Card } from './ui';

interface SafetyGateProps {
    warnings: string[];
    onAcknowledge: () => void;
    onCancel: () => void;
}

export default function SafetyGate({ warnings, onAcknowledge, onCancel }: SafetyGateProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card variant="white" padding="lg" className="max-w-2xl w-full relative animate-fade-in">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-pastel-coral)' }}>
                        <AlertTriangle className="w-8 h-8 text-black" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2">⚠️ Safety Check Required</h2>
                        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                            This step involves potential hazards. Please read and acknowledge the safety requirements below.
                        </p>
                    </div>
                </div>

                <div className="mb-6 p-4 rounded-xl border-2 border-black" style={{ backgroundColor: 'var(--color-pastel-yellow)' }}>
                    <h3 className="font-bold mb-3 text-lg">Safety Requirements:</h3>
                    <ul className="space-y-2">
                        {warnings.map((warning, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="font-bold text-lg">•</span>
                                <span className="flex-1">{warning}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'var(--color-pastel-blue)' }}>
                    <p className="text-sm">
                        <strong>Important:</strong> By proceeding, you confirm that you have read and understood the safety requirements,
                        have the necessary safety equipment, and are in a suitable environment for this teardown step.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button variant="secondary" size="lg" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                    <Button variant="primary" size="lg" onClick={onAcknowledge} className="flex-1">
                        I Acknowledge - Proceed Safely →
                    </Button>
                </div>
            </Card>
        </div>
    );
}
