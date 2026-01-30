import { Book, Lightbulb, Wrench, Info } from 'lucide-react';
import { Card } from './ui';

interface EducationalContextProps {
    whatIsIt: string;
    whyValuable: string;
    whereUsed: string[];
    howItWorks: string;
}

export default function EducationalContext({ whatIsIt, whyValuable, whereUsed, howItWorks }: EducationalContextProps) {
    return (
        <div className="space-y-4">
            {/* What is it */}
            <Card variant="pastel-blue" padding="md">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold mb-1">What is this?</h4>
                        <p className="text-sm">{whatIsIt}</p>
                    </div>
                </div>
            </Card>

            {/* Why valuable */}
            <Card variant="pastel-coral" padding="md">
                <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold mb-1">Why is it valuable?</h4>
                        <p className="text-sm">{whyValuable}</p>
                    </div>
                </div>
            </Card>

            {/* Where used */}
            <Card variant="pastel-yellow" padding="md">
                <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold mb-1">Where can it be used?</h4>
                        <ul className="text-sm space-y-1">
                            {whereUsed.map((use, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span>•</span>
                                    <span>{use}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>

            {/* How it works */}
            <Card variant="pastel-pink" padding="md">
                <div className="flex items-start gap-3">
                    <Book className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold mb-1">How does it work?</h4>
                        <p className="text-sm">{howItWorks}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
