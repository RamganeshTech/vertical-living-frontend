import { useState } from 'react';
import WardrobeCalculator from './WardrobeCalculator';
import SearchSelectNew from '../../components/ui/SearchSelectNew';
import PartitionCalculator from './PartitionCalculator';
// import WardrobeCalculator from './WardrobeCalculator';

const Calculator = () => {
    const [activeTab, setActiveTab] = useState('wardrobe');

    const calculatorOptions = [
        { value: 'wardrobe', label: 'Wardrobe Calculator', icon: '📏' },
        { value: 'partition', label: 'Partition Calculator', icon: '🚧' },
        { value: 'kitchen', label: 'Modular Kitchen', icon: '🍳' },
    ];

    return (
        <div className="h-full max-h-full bg-gray-50">
                {/* Updated Header Style */}
                <header className="px-4 flex justify-between bg-white items-center pb-6 border-b border-gray-100 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <i className="fas fa-calculator mr-3 text-indigo-600"></i>
                            Smart Calculators
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            Precision estimates and dimension tools for your interior projects
                        </p>
                    </div>


                    <div className="w-72">
                        <SearchSelectNew
                            options={calculatorOptions}
                            value={activeTab}
                            onValueChange={(val) => setActiveTab(val || 'wardrobe')}
                            className="w-full shadow-sm"
                            placeholder="Select Calculator"
                            displayFormat="simple"
                        />
                    </div>
                </header>

            <div className="max-w-full px-2 mx-auto">

                {/* Main Content Area - Scroll Disabled */}
                <main className="flex-1   overflow-hidden">
                    {activeTab === 'wardrobe' && <WardrobeCalculator />}
                    {activeTab === 'partition' && <PartitionCalculator />}
                    {activeTab === 'kitchen' && (
                        <div className="h-full flex items-center justify-center text-gray-400 italic">
                            Kitchen Calculator Module Coming Soon...
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Calculator;